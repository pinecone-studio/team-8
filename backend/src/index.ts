import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { startServerAndCreateCloudflareWorkersHandler } from "@as-integrations/cloudflare-workers";
import { createDb } from "./db";
import { typeDefs, resolvers, GraphQLContext } from "./graphql";
import { getCurrentUserFromRequest, canUploadContracts } from "./auth";
import {
  resolveContractViewToken,
  getContract,
  getContractObjectKey,
  putContract,
} from "./contracts";
import { eq } from "drizzle-orm";
import { schema } from "./db";
import { writeAuditLog } from "./graphql/resolvers/helpers/audit";

export interface Env {
  DB: D1Database;
  CONTRACTS_BUCKET?: R2Bucket;
  CONTRACT_VIEW_TOKENS: KVNamespace;
  ENVIRONMENT: string;
  CLERK_SECRET_KEY?: string;
  CLERK_JWT_KEY?: string;
}

function getCorsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("Origin");

  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Apollo-Require-Preflight",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function withCors(request: Request, response: Response): Response {
  const headers = new Headers(response.headers);

  for (const [key, value] of Object.entries(getCorsHeaders(request))) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({
      embed: true,
      footer: false,
    }),
  ],
});

const handler = startServerAndCreateCloudflareWorkersHandler<
  Env,
  GraphQLContext
>(server, {
  context: async ({ request, env }) => {
    const db = createDb(env.DB);
    const baseUrl = new URL(request.url).origin;
    const currentUser = await getCurrentUserFromRequest(request, env, db);
    return { db, env, baseUrl, currentUser, currentEmployee: currentUser.employee };
  },
});

/** Serve contract PDF by token (TTL 7 days). */
async function handleContractView(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/contracts/view" || request.method !== "GET")
    return null;
  const token = url.searchParams.get("token");
  if (!token) {
    return withCors(request, new Response("Missing token", { status: 400 }));
  }

  const resolved = await resolveContractViewToken(
    env.CONTRACT_VIEW_TOKENS,
    token,
  );
  if (!resolved) {
    return withCors(
      request,
      new Response("Invalid or expired token", { status: 404 }),
    );
  }

  if (!env.CONTRACTS_BUCKET) {
    return withCors(
      request,
      new Response("R2 not configured", { status: 503 }),
    );
  }

  const object = await getContract(env.CONTRACTS_BUCKET, resolved.r2Key);
  if (!object) {
    return withCors(
      request,
      new Response("Contract not found", { status: 404 }),
    );
  }

  const body = object.body;
  const contentType = object.httpMetadata?.contentType ?? "application/pdf";
  return withCors(
    request,
    new Response(body, {
      headers: { "Content-Type": contentType },
    }),
  );
}

/** HR upload: multipart form (benefitId, version, effectiveDate, expiryDate, vendorName, file). */
async function handleContractUpload(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/contracts/upload" || request.method !== "POST")
    return null;

  const db = createDb(env.DB);
  const currentUser = await getCurrentUserFromRequest(request, env, db);

  if (!currentUser.employee) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Authentication required." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  if (!canUploadContracts(currentUser.employee)) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "HR admin access required to upload contracts." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return withCors(request, new Response("Invalid form", { status: 400 }));
  }

  const benefitId = formData.get("benefitId")?.toString();
  const version = formData.get("version")?.toString();
  const effectiveDate = formData.get("effectiveDate")?.toString();
  const expiryDate = formData.get("expiryDate")?.toString();
  const vendorName = formData.get("vendorName")?.toString() ?? "Vendor";
  const file = formData.get("file") as File | null;

  if (!benefitId || !version || !effectiveDate || !expiryDate || !file?.size) {
    return withCors(
      request,
      new Response(
        JSON.stringify({
          error:
            "Missing required fields: benefitId, version, effectiveDate, expiryDate, file",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      ),
    );
  }

  if (!env.CONTRACTS_BUCKET) {
    return withCors(
      request,
      new Response(
        JSON.stringify({
          error:
            "R2 not configured. Enable R2 and add CONTRACTS_BUCKET in wrangler.toml.",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      ),
    );
  }

  const benefitRows = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, benefitId));
  const benefit = benefitRows[0];
  if (!benefit) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Benefit not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  const filename = file.name || "contract.pdf";
  const r2Key = getContractObjectKey(benefitId, version, filename);
  const fileBuffer = await file.arrayBuffer();
  await putContract(env.CONTRACTS_BUCKET, r2Key, fileBuffer, {
    contentType: file.type || "application/pdf",
  });

  // Compute real SHA-256 using Cloudflare Workers Web Crypto API
  const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);
  const sha256Hash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Phase 5: Deactivate previous active contract versions cleanly
  await db
    .update(schema.contracts)
    .set({ isActive: false })
    .where(eq(schema.contracts.benefitId, benefitId));

  const [inserted] = await db
    .insert(schema.contracts)
    .values({
      benefitId,
      vendorName,
      version,
      r2ObjectKey: r2Key,
      sha256Hash,
      effectiveDate,
      expiryDate,
      isActive: true,
    })
    .returning();

  if (inserted) {
    await db
      .update(schema.benefits)
      .set({
        requiresContract: true,
        activeContractId: inserted.id,
        vendorName: benefit.vendorName ?? vendorName,
      })
      .where(eq(schema.benefits.id, benefitId));
  }

  // Phase 4: Audit log on contract upload
  if (inserted) {
    await writeAuditLog({
      db,
      actor: currentUser.employee,
      actionType: "CONTRACT_UPLOADED",
      entityType: "contract",
      entityId: inserted.id,
      benefitId,
      contractId: inserted.id,
      metadata: { version, effectiveDate, expiryDate, vendorName },
    });
  }

  return withCors(
    request,
    new Response(JSON.stringify({ id: inserted?.id, r2Key }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request),
      });
    }

    const contractView = await handleContractView(request, env);
    if (contractView !== null) return contractView;
    const upload = await handleContractUpload(request, env);
    if (upload !== null) return upload;
    return withCors(request, await handler(request, env, ctx));
  },
};
