import { ApolloServer } from "@apollo/server";
import { startServerAndCreateCloudflareWorkersHandler } from "@as-integrations/cloudflare-workers";
import { createDb } from "./db";
import { typeDefs, resolvers, GraphQLContext } from "./graphql";
import {
  resolveContractViewToken,
  getContract,
  getContractObjectKey,
  putContract,
} from "./contracts";
import { eq } from "drizzle-orm";
import { schema } from "./db";

export interface Env {
  DB: D1Database;
  CONTRACTS_BUCKET: R2Bucket;
  CONTRACT_VIEW_TOKENS: KVNamespace;
  ENVIRONMENT: string;
}

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateCloudflareWorkersHandler<Env, GraphQLContext>(server, {
  context: async ({ request, env }) => {
    const db = createDb(env.DB);
    const baseUrl = new URL(request.url).origin;
    return { db, env, baseUrl };
  },
});

/** Serve contract PDF by token (TTL 7 days). */
async function handleContractView(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/contracts/view" || request.method !== "GET") return null;
  const token = url.searchParams.get("token");
  if (!token) return new Response("Missing token", { status: 400 });

  const resolved = await resolveContractViewToken(env.CONTRACT_VIEW_TOKENS, token);
  if (!resolved) return new Response("Invalid or expired token", { status: 404 });

  const object = await getContract(env.CONTRACTS_BUCKET, resolved.r2Key);
  if (!object) return new Response("Contract not found", { status: 404 });

  const body = object.body;
  const contentType = object.httpMetadata?.contentType ?? "application/pdf";
  return new Response(body, {
    headers: { "Content-Type": contentType },
  });
}

/** HR upload: multipart form (benefitId, version, effectiveDate, expiryDate, vendorName, file). */
async function handleContractUpload(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/contracts/upload" || request.method !== "POST") return null;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return new Response("Invalid form", { status: 400 });
  }

  const benefitId = formData.get("benefitId")?.toString();
  const version = formData.get("version")?.toString();
  const effectiveDate = formData.get("effectiveDate")?.toString();
  const expiryDate = formData.get("expiryDate")?.toString();
  const vendorName = formData.get("vendorName")?.toString() ?? "Vendor";
  const file = formData.get("file") as File | null;

  if (!benefitId || !version || !effectiveDate || !expiryDate || !file?.size) {
    return new Response(
      JSON.stringify({
        error: "Missing required fields: benefitId, version, effectiveDate, expiryDate, file",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const filename = file.name || "contract.pdf";
  const r2Key = getContractObjectKey(benefitId, version, filename);
  await putContract(env.CONTRACTS_BUCKET, r2Key, await file.arrayBuffer(), {
    contentType: file.type || "application/pdf",
  });

  const sha256Hash = "sha256-placeholder"; // Optional: compute from file.arrayBuffer() with crypto.subtle
  const db = createDb(env.DB);

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

  return new Response(JSON.stringify({ id: inserted?.id, r2Key }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const contractView = await handleContractView(request, env);
    if (contractView !== null) return contractView;
    const upload = await handleContractUpload(request, env);
    if (upload !== null) return upload;
    return handler(request, env, ctx);
  },
};
