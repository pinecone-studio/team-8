import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { startServerAndCreateCloudflareWorkersHandler } from "@as-integrations/cloudflare-workers";
import { createDb } from "./db";
import { typeDefs, resolvers, GraphQLContext } from "./graphql";
import { getCurrentUserFromRequest, canUploadContracts, requireHrAdmin } from "./auth";
import {
  resolveContractViewToken,
  getContract,
  getContractObjectKey,
  putContract,
  getEmployeeSignedContractViewUrl,
} from "./contracts";
import { and, eq, isNull, ne, sql } from "drizzle-orm";
import { schema } from "./db";
import { writeAuditLog } from "./graphql/resolvers/helpers/audit";
import { checkAndSendContractExpiryAlerts } from "./email/contractExpiryAlerts";
import {
  handleOkrWebhook,
  handleOkrManualSync,
  fetchAndSyncFromOkrSystem,
} from "./okr/adapter";
import {
  importAttendanceCore,
  type AttendanceRowInput,
} from "./graphql/resolvers/helpers/attendanceCore";
import { archiveOldAuditLogs } from "./graphql/resolvers/helpers/auditArchive";
import { invalidateAllEmployeeEligibilityCaches } from "./graphql/resolvers/helpers/benefitCatalogRefresh";
import { extractScreenTimeWithGemini } from "./screen-time/gemini";
import {
  buildMyScreenTimeMonth,
  ensureScreenTimeBenefit,
  getScreenTimeSubmissionById,
  recomputeScreenTimeMonthlyResult,
} from "./screen-time/service";
import {
  processBonumWebhook,
  reconcileBonumReturnedPayment,
  startBonumBenefitPayment,
} from "./payments/benefit-request-payments";
import { resolveBonumReturnUrl } from "./payments/bonum";
import { requiresEmployeePaymentForBenefit } from "./payments/amounts";

const MAX_EMPLOYEE_CONTRACT_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EMPLOYEE_CONTRACT_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
]);
const MAX_SCREEN_TIME_SCREENSHOT_BYTES = 10 * 1024 * 1024;
const ALLOWED_SCREEN_TIME_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
]);
const MAX_BENEFIT_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_BENEFIT_IMAGE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

function sanitizeUploadedFileName(fileName: string): string {
  const trimmed = fileName.trim() || "signed-contract";
  return trimmed.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function isAllowedEmployeeContractFile(file: File): boolean {
  return ALLOWED_EMPLOYEE_CONTRACT_MIME_TYPES.has(file.type);
}

function isAllowedScreenTimeScreenshot(file: File): boolean {
  return ALLOWED_SCREEN_TIME_MIME_TYPES.has(file.type);
}

export interface Env {
  DB: D1Database;
  CONTRACTS_BUCKET?: R2Bucket;
  CONTRACT_VIEW_TOKENS: KVNamespace;
  /** KV namespace for caching per-employee eligibility snapshots (TTL 1 h). */
  ELIGIBILITY_CACHE: KVNamespace;
  /** R2 bucket for archiving audit_logs rows older than 12 months (TDD §14). */
  AUDIT_ARCHIVE_BUCKET?: R2Bucket;
  ENVIRONMENT: string;
  CLERK_SECRET_KEY?: string;
  CLERK_JWT_KEY?: string;
  GMAIL_CLIENT_ID?: string;
  GMAIL_CLIENT_SECRET?: string;
  GMAIL_REFRESH_TOKEN?: string;
  GMAIL_SENDER_EMAIL?: string;
  OKR_WEBHOOK_SECRET?: string;
  OKR_API_URL?: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  SCREEN_TIME_DEBUG_TODAY_LOCAL_DATE?: string;
  BONUM_API_BASE_URL?: string;
  BONUM_APP_SECRET?: string;
  BONUM_TERMINAL_ID?: string;
  BONUM_ACCEPT_LANGUAGE?: string;
  BONUM_CALLBACK_URL?: string;
  BONUM_RETURN_URL?: string;
  BONUM_MERCHANT_CHECKSUM_KEY?: string;
  BONUM_INVOICE_EXPIRES_SECONDS?: string;
}

function getCorsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("Origin");

  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Apollo-Require-Preflight, x-dev-employee-email, x-dev-employee-id",
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
    // CF-Connecting-IP is the authoritative client IP on Cloudflare Workers.
    // Fall back to X-Forwarded-For for local dev / non-Cloudflare proxies.
    const ipAddress =
      request.headers.get("CF-Connecting-IP") ??
      request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
      null;
    return { db, env, baseUrl, currentUser, currentEmployee: currentUser.employee, ipAddress };
  },
});

/**
 * GET /health — lightweight liveness + readiness probe.
 *
 * Probes:
 *   db  — executes a trivial D1 query (SELECT 1) to verify database connectivity
 *   kv  — performs a KV get on a sentinel key to verify KV namespace connectivity
 *
 * Response shape:
 *   { status: "ok" | "degraded", checks: { db: boolean, kv: boolean }, ts: string }
 *
 * HTTP status: 200 when all checks pass, 503 when any check fails.
 * Auth: public — no credentials required (intentional; returns no sensitive data).
 */
async function handleHealthCheck(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/health" || request.method !== "GET") return null;

  const db = createDb(env.DB);

  const [dbOk, kvOk] = await Promise.all([
    db
      .run(sql`SELECT 1`)
      .then(() => true)
      .catch(() => false),
    env.CONTRACT_VIEW_TOKENS.get("__health__")
      .then(() => true)
      .catch(() => false),
  ]);

  const allOk = dbOk && kvOk;
  const body = JSON.stringify({
    status: allOk ? "ok" : "degraded",
    checks: { db: dbOk, kv: kvOk },
    ts: new Date().toISOString(),
  });

  return withCors(
    request,
    new Response(body, {
      status: allOk ? 200 : 503,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

/**
 * Serve contract PDF by session-scoped token (TTL 7 days).
 *
 * Security model:
 *  1. The caller must be authenticated (valid session).
 *  2. When the token was created with an `employeeId` binding, the authenticated
 *     employee's ID must match — forwarded URLs cannot be used by other sessions.
 *  3. A CONTRACT_VIEWED audit log entry is written on every successful serve.
 */
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

  // Session check: require an authenticated employee.
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

  // Session-scope check: if the token was issued for a specific employee, only
  // that employee may use it. HR admins can view any contract for oversight.
  const isHrAdmin = currentUser.isAdmin;
  if (resolved.employeeId && !isHrAdmin && currentUser.employee.id !== resolved.employeeId) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "This contract link was issued for a different session." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
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

  // Audit log: record who viewed the contract and from which IP.
  // Fire-and-forget — never let audit failure block the PDF response.
  const ipAddress =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
    null;
  writeAuditLog({
    db,
    actor: currentUser.employee,
    actionType: "CONTRACT_VIEWED",
    entityType: "contract",
    entityId: resolved.contractId ?? resolved.r2Key,
    targetEmployeeId: resolved.employeeId ?? currentUser.employee.id,
    contractId: resolved.contractId,
    ipAddress,
    metadata: { r2Key: resolved.r2Key, viewerIsAdmin: isHrAdmin },
  }).catch((err) => console.error("[contractView] audit log failed:", err));

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

  try {
    await invalidateAllEmployeeEligibilityCaches(
      db,
      env.ELIGIBILITY_CACHE,
      "handleContractUpload",
    );
  } catch (err) {
    console.error(
      `[handleContractUpload] Failed to invalidate employee eligibility caches for benefit ${benefitId}:`,
      err,
    );
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

/**
 * Manual trigger for contract expiry alerts.
 * Allows HR admins (or a cron-like external caller) to trigger the daily alert
 * check without waiting for the Cloudflare scheduled event.
 * Auth: requires admin credentials (same as admin mutations).
 */
async function handleContractExpiryCheck(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/admin/scheduled/contract-expiry" || request.method !== "POST")
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
  if (!currentUser.isAdmin) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Admin access required." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  const result = await checkAndSendContractExpiryAlerts(db, env);
  return withCors(
    request,
    new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

/**
 * Employee signed contract upload: POST /api/contracts/employee-upload
 *
 * Accepts multipart/form-data with `benefitId` and `file` fields.
 * Stores the employee's signed contract in R2 under
 * employee-contracts/{benefitId}/{employeeId}/ and persists a separate D1 row
 * so HR can review/download the signed copy independently from the vendor
 * contract uploaded by HR.
 * Auth: any authenticated employee.
 */
async function handleEmployeeContractUpload(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/contracts/employee-upload" || request.method !== "POST")
    return null;

  const db = createDb(env.DB);
  const currentUser = await getCurrentUserFromRequest(request, env, db);

  if (!currentUser.employee) {
    return withCors(request, new Response(JSON.stringify({ error: "Authentication required." }), {
      status: 401, headers: { "Content-Type": "application/json" },
    }));
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return withCors(request, new Response("Invalid form", { status: 400 }));
  }

  const benefitId = formData.get("benefitId")?.toString();
  const file = formData.get("file") as File | null;

  if (!benefitId || !file?.size) {
    return withCors(request, new Response(
      JSON.stringify({ error: "Missing required fields: benefitId, file" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    ));
  }

  if (!env.CONTRACTS_BUCKET) {
    return withCors(request, new Response(
      JSON.stringify({ error: "R2 not configured." }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    ));
  }

  if (file.size > MAX_EMPLOYEE_CONTRACT_FILE_BYTES) {
    return withCors(request, new Response(
      JSON.stringify({ error: "File is too large. Maximum size is 10 MB." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    ));
  }

  if (!isAllowedEmployeeContractFile(file)) {
    return withCors(request, new Response(
      JSON.stringify({
        error: "Unsupported file type. Please upload a PDF, PNG, or JPG/JPEG file.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    ));
  }

  const benefitRows = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, benefitId));
  const benefit = benefitRows[0];
  if (!benefit || !benefit.isActive) {
    return withCors(request, new Response(
      JSON.stringify({ error: "Benefit not found or inactive." }),
      { status: 404, headers: { "Content-Type": "application/json" } },
    ));
  }
  if (!benefit.requiresContract) {
    return withCors(request, new Response(
      JSON.stringify({ error: "This benefit does not require a signed contract upload." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    ));
  }

  const contractRows = await db
    .select()
    .from(schema.contracts)
    .where(eq(schema.contracts.benefitId, benefitId));
  const activeHrContract = contractRows.find((row) => row.isActive);
  if (!activeHrContract) {
    return withCors(request, new Response(
      JSON.stringify({
        error: "No active HR contract is available for this benefit yet. Please contact HR.",
      }),
      { status: 409, headers: { "Content-Type": "application/json" } },
    ));
  }

  const ext = file.name.split(".").pop() ?? "pdf";
  const safeName = sanitizeUploadedFileName(file.name);
  const r2Key = `employee-contracts/${benefitId}/${currentUser.employee.id}/${Date.now()}-${safeName || `signed-contract.${ext}`}`;
  const buffer = await file.arrayBuffer();
  await env.CONTRACTS_BUCKET.put(r2Key, buffer, {
    httpMetadata: { contentType: file.type || "application/pdf" },
  });

  let inserted: (typeof schema.employeeSignedContracts.$inferSelect) | undefined;
  try {
    const insertedRows = await db
      .insert(schema.employeeSignedContracts)
      .values({
        employeeId: currentUser.employee.id,
        benefitId,
        hrContractId: activeHrContract.id,
        hrContractVersion: activeHrContract.version,
        hrContractHash: activeHrContract.sha256Hash,
        r2ObjectKey: r2Key,
        fileName: file.name,
        mimeType: file.type || "application/pdf",
        status: "uploaded",
      })
      .returning();
    inserted = insertedRows[0];
  } catch (error) {
    await env.CONTRACTS_BUCKET.delete(r2Key).catch((cleanupErr) =>
      console.error(
        "[employeeContractUpload] Failed to clean up orphaned R2 object after DB error:",
        cleanupErr,
      ),
    );
    console.error("[employeeContractUpload] Failed to insert D1 row:", error);
  }

  if (!inserted) {
    return withCors(request, new Response(
      JSON.stringify({ error: "Failed to store employee contract upload." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    ));
  }

  await db
    .update(schema.employeeSignedContracts)
    .set({
      status: "superseded",
      updatedAt: new Date().toISOString(),
    })
    .where(
      and(
        eq(schema.employeeSignedContracts.employeeId, currentUser.employee.id),
        eq(schema.employeeSignedContracts.benefitId, benefitId),
        eq(schema.employeeSignedContracts.status, "uploaded"),
        ne(schema.employeeSignedContracts.id, inserted.id),
        isNull(schema.employeeSignedContracts.requestId),
      ),
    );

  await writeAuditLog({
    db,
    actor: currentUser.employee,
    actionType: "EMPLOYEE_CONTRACT_UPLOADED",
    entityType: "employee_contract",
    entityId: inserted.id,
    targetEmployeeId: currentUser.employee.id,
    benefitId,
    metadata: {
      r2Key,
      fileName: file.name,
      hrContractId: activeHrContract.id,
      hrContractVersion: activeHrContract.version,
    },
  });

  const baseUrl = new URL(request.url).origin;
  return withCors(request, new Response(JSON.stringify({
    id: inserted.id,
    key: r2Key,
    fileName: inserted.fileName,
    uploadedAt: inserted.uploadedAt,
    viewUrl: getEmployeeSignedContractViewUrl(baseUrl, inserted.id),
  }), {
    status: 201, headers: { "Content-Type": "application/json" },
  }));
}

/**
 * Employee payment submission for contract-based benefits.
 *
 * Moves a request from awaiting_payment -> awaiting_payment_review so HR can
 * verify the transfer and activate the benefit.
 */
async function handleBenefitPaymentSubmit(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/benefit-requests/payment-submit" || request.method !== "POST") {
    return null;
  }

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

  let body: { requestId?: string } = {};
  try {
    body = (await request.json()) as { requestId?: string };
  } catch {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Invalid JSON body." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  if (!body.requestId) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "requestId is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  const requestRows = await db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.id, body.requestId))
    .limit(1);
  const benefitRequest = requestRows[0];
  if (!benefitRequest) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Benefit request not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  if (benefitRequest.employeeId !== currentUser.employee.id) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "You can only submit payment for your own request." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  if (benefitRequest.status !== "awaiting_payment") {
    return withCors(
      request,
      new Response(JSON.stringify({ error: `Payment cannot be submitted from status: ${benefitRequest.status}.` }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  const benefitRows = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, benefitRequest.benefitId))
    .limit(1);
  const benefit = benefitRows[0];
  if (!benefit || !requiresEmployeePaymentForBenefit(benefit)) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "This request does not require employee payment." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  const now = new Date().toISOString();
  const [updated] = await db
    .update(schema.benefitRequests)
    .set({
      status: "awaiting_payment_review",
      employeeApprovedAt: now,
      updatedAt: now,
    })
    .where(eq(schema.benefitRequests.id, body.requestId))
    .returning();

  await writeAuditLog({
    db,
    actor: currentUser.employee,
    actionType: "PAYMENT_SUBMITTED",
    entityType: "benefit_request",
    entityId: body.requestId,
    targetEmployeeId: currentUser.employee.id,
    benefitId: benefitRequest.benefitId,
    requestId: body.requestId,
    before: { status: benefitRequest.status },
    after: { status: "awaiting_payment_review" },
  });

  return withCors(
    request,
    new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

/**
 * Start or resume a Bonum checkout session for a payment-required benefit.
 *
 * The latest non-expired invoice is reused when possible. Otherwise a fresh
 * Bonum invoice is created and the employee is redirected to followUpLink.
 */
async function handleBenefitPaymentStart(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/benefit-requests/payment-start" || request.method !== "POST") {
    return null;
  }

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

  let body: { requestId?: string } = {};
  try {
    body = (await request.json()) as { requestId?: string };
  } catch {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Invalid JSON body." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  if (!body.requestId) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "requestId is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  const requestRows = await db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.id, body.requestId))
    .limit(1);
  const benefitRequest = requestRows[0];
  if (!benefitRequest) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Benefit request not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  if (benefitRequest.employeeId !== currentUser.employee.id) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "You can only pay for your own request." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  const benefitRows = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, benefitRequest.benefitId))
    .limit(1);
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

  try {
    const payment = await startBonumBenefitPayment({
      db,
      env,
      request,
      benefitRequest,
      benefit,
      employee: currentUser.employee,
    });

    return withCors(
      request,
      new Response(JSON.stringify(payment), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start payment.";
    const status =
      message.includes("Authentication required") ? 401 :
      message.includes("not found") ? 404 :
      message.includes("cannot be started from status") ? 409 :
      message.includes("does not require employee payment") ? 400 :
      message.startsWith("BONUM_") ? 503 :
      502;

    return withCors(
      request,
      new Response(JSON.stringify({ error: message }), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }
}

async function handleBenefitPaymentReconcile(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/benefit-requests/payment-reconcile" || request.method !== "POST") {
    return null;
  }

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

  let body: { requestId?: string; transactionId?: string } = {};
  try {
    body = (await request.json()) as { requestId?: string; transactionId?: string };
  } catch {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Invalid JSON body." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  if (!body.requestId || !body.transactionId) {
    return withCors(
      request,
      new Response(
        JSON.stringify({ error: "requestId and transactionId are required." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
  }

  try {
    const payment = await reconcileBonumReturnedPayment({
      db,
      env,
      employee: currentUser.employee,
      requestId: body.requestId,
      transactionId: body.transactionId,
    });

    return withCors(
      request,
      new Response(JSON.stringify(payment), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to reconcile Bonum payment.";
    const status =
      message.includes("Authentication required") ? 401 :
      message.includes("not found") ? 404 :
      message.includes("only reconcile your own payment") ? 403 :
      message.includes("cannot be reconciled from status") ? 409 :
      502;

    return withCors(
      request,
      new Response(JSON.stringify({ error: message }), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }
}

/**
 * Bonum payment callback/webhook.
 *
 * GET  -> browser return target; redirect back to the employee requests page
 * POST -> webhook delivery; verifies checksum when configured and updates the
 *         local payment + request activation state idempotently.
 */
async function handleBonumWebhook(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/payments/bonum/webhook") {
    return null;
  }

  if (request.method === "GET") {
    return withCors(request, Response.redirect(resolveBonumReturnUrl(request, env), 302));
  }

  if (request.method !== "POST") {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Method not allowed." }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  const rawBody = await request.text();
  const db = createDb(env.DB);
  const result = await processBonumWebhook(db, env, rawBody, request.headers);

  if (result.kind === "duplicate") {
    return withCors(
      request,
      new Response(JSON.stringify({ received: true, duplicate: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  if (result.kind === "invalid_signature") {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Invalid checksum." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  if (result.kind === "unmatched") {
    return withCors(
      request,
      new Response(JSON.stringify({ received: true, unmatched: true }), {
        status: 202,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  return withCors(
    request,
    new Response(
      JSON.stringify({
        received: true,
        paymentId: result.payment.id,
        status: result.payment.status,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    ),
  );
}

/**
 * Serve an employee-uploaded signed contract copy.
 *
 * Access rules:
 *  - the owner employee may view their own uploaded copy
 *  - HR/Finance admins may view any uploaded copy for review/audit
 */
async function handleEmployeeSignedContractView(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/contracts/employee-view" || request.method !== "GET") {
    return null;
  }

  const signedContractId = url.searchParams.get("id");
  if (!signedContractId) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Missing id." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

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

  const rows = await db
    .select()
    .from(schema.employeeSignedContracts)
    .where(eq(schema.employeeSignedContracts.id, signedContractId))
    .limit(1);
  const signedContract = rows[0];
  if (!signedContract) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Employee signed contract not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  if (!currentUser.isAdmin && currentUser.employee.id !== signedContract.employeeId) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Not authorized to view this employee contract." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  if (!env.CONTRACTS_BUCKET) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "R2 not configured." }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  const object = await env.CONTRACTS_BUCKET.get(signedContract.r2ObjectKey);
  if (!object) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Employee signed contract file not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  await writeAuditLog({
    db,
    actor: currentUser.employee,
    actionType: "CONTRACT_VIEWED",
    entityType: "employee_contract",
    entityId: signedContract.id,
    targetEmployeeId: signedContract.employeeId,
    benefitId: signedContract.benefitId,
    requestId: signedContract.requestId ?? null,
    metadata: {
      r2Key: signedContract.r2ObjectKey,
      fileName: signedContract.fileName,
      viewerIsAdmin: currentUser.isAdmin,
    },
    ipAddress:
      request.headers.get("CF-Connecting-IP") ??
      request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
      null,
  }).catch((err) => console.error("[employeeSignedContractView] audit log failed:", err));

  const headers = new Headers();
  headers.set(
    "Content-Type",
    signedContract.mimeType ||
      object.httpMetadata?.contentType ||
      "application/octet-stream",
  );
  if (signedContract.fileName) {
    headers.set(
      "Content-Disposition",
      `inline; filename="${signedContract.fileName.replace(/"/g, "")}"`,
    );
  }

  return withCors(request, new Response(object.body, { headers }));
}

/**
 * Employee weekly screen-time screenshot upload.
 *
 * Rules:
 *  - benefit must be configured with flow_type=screen_time
 *  - upload is accepted only on the current month's active Monday slot
 *  - Gemini extracts the 7-day average daily usage before persistence
 *  - invalid screenshots are rejected and never stored
 */
async function handleScreenTimeUpload(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/screen-time/upload" || request.method !== "POST") {
    return null;
  }

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

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return withCors(request, new Response("Invalid form", { status: 400 }));
  }

  const benefitId = formData.get("benefitId")?.toString();
  const file = formData.get("file") as File | null;

  if (!benefitId || !file?.size) {
    return withCors(
      request,
      new Response(
        JSON.stringify({ error: "Missing required fields: benefitId, file" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      ),
    );
  }

  if (!env.CONTRACTS_BUCKET) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "R2 not configured." }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  if (file.size > MAX_SCREEN_TIME_SCREENSHOT_BYTES) {
    return withCors(
      request,
      new Response(
        JSON.stringify({ error: "Screenshot is too large. Maximum size is 10 MB." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      ),
    );
  }

  if (!isAllowedScreenTimeScreenshot(file)) {
    return withCors(
      request,
      new Response(
        JSON.stringify({
          error: "Unsupported screenshot type. Please upload PNG, JPG, JPEG, WEBP, HEIC, or HEIF.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      ),
    );
  }

  await ensureScreenTimeBenefit(db, benefitId);
  const todayOverride =
    env.ENVIRONMENT === "development"
      ? env.SCREEN_TIME_DEBUG_TODAY_LOCAL_DATE ?? null
      : null;
  const monthState = await buildMyScreenTimeMonth(
    db,
    currentUser.employee,
    benefitId,
    undefined,
    todayOverride,
  );
  if (!monthState.program?.isActive) {
    return withCors(
      request,
      new Response(
        JSON.stringify({ error: "This screen time program is not active yet." }),
        { status: 409, headers: { "Content-Type": "application/json" } },
      ),
    );
  }

  if (!["ELIGIBLE", "ACTIVE"].includes(monthState.benefitStatus)) {
    return withCors(
      request,
      new Response(
        JSON.stringify({
          error:
            monthState.failedRuleMessage ??
            "You are not currently eligible to upload screen time evidence for this program.",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      ),
    );
  }

  if (!monthState.activeSlotDate || !monthState.isUploadOpenToday) {
    return withCors(
      request,
      new Response(
        JSON.stringify({
          error:
            "Screen time screenshots can only be uploaded on the required Monday slots of the current month.",
        }),
        { status: 409, headers: { "Content-Type": "application/json" } },
      ),
    );
  }

  const existingSubmission = await db
    .select()
    .from(schema.screenTimeSubmissions)
    .where(
      and(
        eq(schema.screenTimeSubmissions.benefitId, benefitId),
        eq(schema.screenTimeSubmissions.employeeId, currentUser.employee.id),
        eq(schema.screenTimeSubmissions.slotDate, monthState.activeSlotDate),
      ),
    )
    .limit(1);

  if (existingSubmission[0]) {
    return withCors(
      request,
      new Response(
        JSON.stringify({
          error: "You have already uploaded this week's screenshot.",
        }),
        { status: 409, headers: { "Content-Type": "application/json" } },
      ),
    );
  }

  const buffer = await file.arrayBuffer();
  const extraction = await extractScreenTimeWithGemini({
    env,
    fileName: file.name,
    mimeType: file.type,
    bytes: buffer,
  });

  if (
    !extraction.isValidScreenTimeScreenshot ||
    extraction.periodType !== "last_7_days" ||
    extraction.avgDailyMinutes <= 0
  ) {
    return withCors(
      request,
      new Response(
        JSON.stringify({
          error:
            extraction.reason ||
            "We could not verify a valid 7-day average screen-time screenshot from this upload.",
        }),
        { status: 422, headers: { "Content-Type": "application/json" } },
      ),
    );
  }

  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const screenshotSha256 = Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  const safeName = sanitizeUploadedFileName(file.name || "screen-time.png");
  const screenshotKey =
    `screen-time/${benefitId}/${currentUser.employee.id}/${monthState.month.monthKey}/${monthState.activeSlotDate}-${Date.now()}-${safeName}`;
  await env.CONTRACTS_BUCKET.put(screenshotKey, buffer, {
    httpMetadata: {
      contentType: file.type || "application/octet-stream",
    },
  });

  const reviewStatus = "auto_approved";
  const extractionStatus = "accepted";

  const [inserted] = await db
    .insert(schema.screenTimeSubmissions)
    .values({
      benefitId,
      employeeId: currentUser.employee.id,
      monthKey: monthState.month.monthKey,
      slotDate: monthState.activeSlotDate,
      screenshotR2Key: screenshotKey,
      fileName: file.name,
      mimeType: file.type,
      screenshotSha256,
      avgDailyMinutes: extraction.avgDailyMinutes,
      confidenceScore: extraction.confidenceScore,
      platform: extraction.platform,
      periodType: extraction.periodType,
      extractionStatus,
      reviewStatus,
      reviewNote: "Accepted automatically from Gemini extraction.",
      reviewedAt: new Date().toISOString(),
      rawExtractionJson: JSON.stringify(extraction),
    })
    .returning()
    .catch(async (error) => {
      await env.CONTRACTS_BUCKET?.delete(screenshotKey).catch((cleanupError) =>
        console.error(
          "[screenTimeUpload] Failed to clean up screenshot after D1 error:",
          cleanupError,
        ),
      );
      throw error;
    });

  if (!inserted) {
    return withCors(
      request,
      new Response(
        JSON.stringify({ error: "Failed to store the screen time submission." }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      ),
    );
  }

  const month = await recomputeScreenTimeMonthlyResult(db, {
    benefitId,
    employeeId: currentUser.employee.id,
    monthKey: monthState.month.monthKey,
    todayLocalDate: monthState.todayLocalDate,
  });

  await writeAuditLog({
    db,
    actor: currentUser.employee,
    actionType: "SCREEN_TIME_SUBMITTED",
    entityType: "screen_time_submission",
    entityId: inserted.id,
    targetEmployeeId: currentUser.employee.id,
    benefitId,
    metadata: {
      monthKey: inserted.monthKey,
      slotDate: inserted.slotDate,
      avgDailyMinutes: inserted.avgDailyMinutes,
      confidenceScore: inserted.confidenceScore,
      extractionStatus: inserted.extractionStatus,
      reviewStatus: inserted.reviewStatus,
    },
  });

  return withCors(
    request,
    new Response(
      JSON.stringify({
        submission: {
          id: inserted.id,
          slotDate: inserted.slotDate,
          monthKey: inserted.monthKey,
          avgDailyMinutes: inserted.avgDailyMinutes,
          confidenceScore: inserted.confidenceScore,
          reviewStatus: inserted.reviewStatus,
          viewUrl: `${new URL(request.url).origin}/screen-time/submission-view?id=${encodeURIComponent(inserted.id)}`,
        },
        month,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    ),
  );
}

/**
 * Serve an uploaded screen-time screenshot to its owner employee or any admin.
 */
async function handleScreenTimeSubmissionView(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/screen-time/submission-view" || request.method !== "GET") {
    return null;
  }

  const submissionId = url.searchParams.get("id");
  if (!submissionId) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Missing id." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

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

  const submission = await getScreenTimeSubmissionById(db, submissionId);
  if (!submission) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Screen time submission not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  if (!currentUser.isAdmin && currentUser.employee.id !== submission.employeeId) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Not authorized to view this screenshot." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  if (!env.CONTRACTS_BUCKET) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "R2 not configured." }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  const object = submission.screenshotR2Key
    ? await env.CONTRACTS_BUCKET.get(submission.screenshotR2Key)
    : null;
  if (!object) {
    return withCors(
      request,
      new Response(JSON.stringify({ error: "Screenshot file not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    submission.mimeType || object.httpMetadata?.contentType || "application/octet-stream",
  );
  if (submission.fileName) {
    headers.set(
      "Content-Disposition",
      `inline; filename="${submission.fileName.replace(/"/g, "")}"`,
    );
  }

  return withCors(request, new Response(object.body, { headers }));
}

/**
 * HR benefit image upload: POST /api/benefits/upload-image
 *
 * Accepts multipart/form-data with `benefitId` and `file` fields.
 * Stores image in the CONTRACTS_BUCKET R2 under benefits/{benefitId}/images/.
 * Updates the benefit's image_url field with the R2 key and returns it.
 * Auth: HR admin only.
 */
async function handleBenefitImageUpload(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/benefits/upload-image" || request.method !== "POST")
    return null;

  const db = createDb(env.DB);
  const currentUser = await getCurrentUserFromRequest(request, env, db);

  if (!currentUser.employee) {
    return withCors(request, new Response(JSON.stringify({ error: "Authentication required." }), {
      status: 401, headers: { "Content-Type": "application/json" },
    }));
  }
  if (!canUploadContracts(currentUser.employee)) {
    return withCors(request, new Response(JSON.stringify({ error: "HR admin access required." }), {
      status: 403, headers: { "Content-Type": "application/json" },
    }));
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return withCors(request, new Response("Invalid form", { status: 400 }));
  }

  const benefitId = formData.get("benefitId")?.toString();
  const file = formData.get("file") as File | null;

  if (!benefitId || !file?.size) {
    return withCors(request, new Response(
      JSON.stringify({ error: "Missing required fields: benefitId, file" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    ));
  }

  if (!ALLOWED_BENEFIT_IMAGE_MIME_TYPES.has(file.type)) {
    return withCors(request, new Response(
      JSON.stringify({ error: "Unsupported image type. Allowed: PNG, JPEG, WebP, GIF, SVG." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    ));
  }

  if (file.size > MAX_BENEFIT_IMAGE_BYTES) {
    return withCors(request, new Response(
      JSON.stringify({ error: `Image too large. Maximum size: ${MAX_BENEFIT_IMAGE_BYTES / 1024 / 1024} MB.` }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    ));
  }

  if (!env.CONTRACTS_BUCKET) {
    return withCors(request, new Response(
      JSON.stringify({ error: "R2 not configured." }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    ));
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const r2Key = `benefits/${benefitId}/images/${Date.now()}.${ext}`;
  const buffer = await file.arrayBuffer();
  await env.CONTRACTS_BUCKET.put(r2Key, buffer, {
    httpMetadata: { contentType: file.type || "image/jpeg" },
  });

  await db
    .update(schema.benefits)
    .set({ imageUrl: r2Key })
    .where(eq(schema.benefits.id, benefitId));

  try {
    await invalidateAllEmployeeEligibilityCaches(
      db,
      env.ELIGIBILITY_CACHE,
      "handleBenefitImageUpload",
    );
  } catch (err) {
    console.error(
      `[handleBenefitImageUpload] Failed to invalidate employee eligibility caches for benefit ${benefitId}:`,
      err,
    );
  }

  return withCors(request, new Response(JSON.stringify({ imageUrl: r2Key }), {
    status: 201, headers: { "Content-Type": "application/json" },
  }));
}

/**
 * Serve benefit image by R2 key.
 * GET /api/benefits/image?key=benefits/{benefitId}/images/{file}
 * Auth: any authenticated employee.
 */
async function handleBenefitImageView(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/benefits/image" || request.method !== "GET") return null;

  const key = url.searchParams.get("key");
  if (!key) return withCors(request, new Response("Missing key", { status: 400 }));

  const db = createDb(env.DB);
  const currentUser = await getCurrentUserFromRequest(request, env, db);
  if (!currentUser.employee) {
    return withCors(request, new Response(JSON.stringify({ error: "Authentication required." }), {
      status: 401, headers: { "Content-Type": "application/json" },
    }));
  }

  if (!env.CONTRACTS_BUCKET) {
    return withCors(request, new Response("R2 not configured", { status: 503 }));
  }

  const object = await env.CONTRACTS_BUCKET.get(key);
  if (!object) return withCors(request, new Response("Not found", { status: 404 }));

  return withCors(request, new Response(object.body, {
    headers: { "Content-Type": object.httpMetadata?.contentType ?? "image/jpeg" },
  }));
}

/**
 * HR CSV attendance import: POST /api/attendance/import-csv
 *
 * Accepts multipart/form-data with a `file` field containing a UTF-8 CSV.
 * Expected format — first line is a header (skipped), subsequent lines:
 *   employeeId,email,date,checkInTime
 * Any column can be empty string when not available (at least one of
 * employeeId/email must be present per row).
 *
 * Auth: HR admin only (same as importAttendance GraphQL mutation).
 */
async function handleAttendanceCsvImport(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/attendance/import-csv" || request.method !== "POST")
    return null;

  const db = createDb(env.DB);
  const currentUser = await getCurrentUserFromRequest(request, env, db);

  let actor: ReturnType<typeof requireHrAdmin>;
  try {
    actor = requireHrAdmin(currentUser.employee);
  } catch {
    const isUnauthenticated = !currentUser.employee;
    return withCors(
      request,
      new Response(
        JSON.stringify({ error: isUnauthenticated ? "Authentication required." : "HR admin access required." }),
        { status: isUnauthenticated ? 401 : 403, headers: { "Content-Type": "application/json" } },
      ),
    );
  }

  let csvText: string;
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file?.size) {
      return withCors(
        request,
        new Response(JSON.stringify({ error: "Missing required field: file (CSV)." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }
    csvText = await file.text();
  } catch {
    return withCors(request, new Response(JSON.stringify({ error: "Invalid form data." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    }));
  }

  // Parse CSV: skip blank lines and the header row (first non-blank line)
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const dataLines = lines.slice(1); // drop header

  const rows: AttendanceRowInput[] = dataLines.map((line) => {
    // Handle quoted fields minimally — split on comma, strip outer quotes
    const cols = line.split(",").map((c) => c.trim().replace(/^"(.*)"$/, "$1").trim());
    const [employeeId, email, date, checkInTime] = cols;
    return {
      employeeId: employeeId || null,
      email: email || null,
      date: date ?? "",
      checkInTime: checkInTime ?? "",
    };
  });

  // Quick up-front check — reject if every row has both columns empty
  const hasAnyIdentifier = rows.some((r) => r.employeeId || r.email);
  if (rows.length === 0 || !hasAnyIdentifier) {
    return withCors(
      request,
      new Response(
        JSON.stringify({
          error: "CSV appears empty or missing employee identifiers. Expected header: employeeId,email,date,checkInTime",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      ),
    );
  }

  const result = await importAttendanceCore(db, rows, actor, env.ELIGIBILITY_CACHE);
  return withCors(
    request,
    new Response(JSON.stringify(result), {
      status: result.invalid === rows.length ? 422 : 200,
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

    const health = await handleHealthCheck(request, env);
    if (health !== null) return health;
    const contractView = await handleContractView(request, env);
    if (contractView !== null) return contractView;
    const employeeSignedContractView = await handleEmployeeSignedContractView(request, env);
    if (employeeSignedContractView !== null) return employeeSignedContractView;
    const screenTimeSubmissionView = await handleScreenTimeSubmissionView(request, env);
    if (screenTimeSubmissionView !== null) return screenTimeSubmissionView;
    const upload = await handleContractUpload(request, env);
    if (upload !== null) return upload;
    const employeeUpload = await handleEmployeeContractUpload(request, env);
    if (employeeUpload !== null) return employeeUpload;
    const paymentStart = await handleBenefitPaymentStart(request, env);
    if (paymentStart !== null) return paymentStart;
    const paymentReconcile = await handleBenefitPaymentReconcile(request, env);
    if (paymentReconcile !== null) return paymentReconcile;
    const paymentSubmit = await handleBenefitPaymentSubmit(request, env);
    if (paymentSubmit !== null) return paymentSubmit;
    const bonumWebhook = await handleBonumWebhook(request, env);
    if (bonumWebhook !== null) return bonumWebhook;
    const screenTimeUpload = await handleScreenTimeUpload(request, env);
    if (screenTimeUpload !== null) return screenTimeUpload;
    const imageUpload = await handleBenefitImageUpload(request, env);
    if (imageUpload !== null) return imageUpload;
    const imageView = await handleBenefitImageView(request, env);
    if (imageView !== null) return imageView;
    const expiryCheck = await handleContractExpiryCheck(request, env);
    if (expiryCheck !== null) return expiryCheck;
    const attendanceCsv = await handleAttendanceCsvImport(request, env);
    if (attendanceCsv !== null) return attendanceCsv;

    // OKR webhook (no session required — uses HMAC signature auth)
    const okrWebhook = await handleOkrWebhook(request, env, createDb(env.DB));
    if (okrWebhook !== null) return withCors(request, okrWebhook);

    // OKR manual sync (requires authenticated admin employee)
    const url = new URL(request.url);
    if (url.pathname === "/okr/sync/manual" && request.method === "POST") {
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
      if (!currentUser.isAdmin) {
        return withCors(
          request,
          new Response(JSON.stringify({ error: "Admin access required." }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }
      const okrManual = await handleOkrManualSync(request, env, db, currentUser.employee);
      if (okrManual !== null) return withCors(request, okrManual);
    }

    return withCors(request, await handler(request, env, ctx));
  },

  /**
   * Cloudflare scheduled handler — runs daily maintenance tasks.
   *
   * To activate, add to wrangler.toml:
   *   [triggers]
   *   crons = ["0 9 * * *"]   # Daily at 09:00 UTC
   *
   * Tasks:
   *   1. Contract expiry alerts (daily)
   *   2. OKR sync poll from external API (daily, if OKR_API_URL configured)
   *   3. Audit log archive to R2 (monthly — 1st of each month only)
   */
  async scheduled(
    _event: ScheduledEvent,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<void> {
    const db = createDb(env.DB);

    // -- 1. Contract expiry alerts (daily) -----------------------------------
    const expiryResult = await checkAndSendContractExpiryAlerts(db, env);
    console.log(
      `[scheduled] Contract expiry check complete: ${expiryResult.expiring} expiring, ${expiryResult.emailsSent} emails sent.`,
    );

    // -- 2. OKR sync poll (daily, if OKR_API_URL configured) -----------------
    await fetchAndSyncFromOkrSystem(db, env);

    // -- 3. Audit log archive (monthly — 1st of each month) ------------------
    // Running archive every day would produce redundant R2 objects and is not
    // necessary for a 12-month window.  Guard with a day-of-month check.
    const dayOfMonth = new Date().getUTCDate();
    if (dayOfMonth === 1) {
      const archiveResult = await archiveOldAuditLogs(db, env);
      console.log(
        `[scheduled] Audit archive complete: fetched=${archiveResult.fetched}, archived=${archiveResult.archived}, deleted=${archiveResult.deleted}`,
      );
    }
  },
};
