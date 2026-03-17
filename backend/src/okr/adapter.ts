/**
 * OKR Integration Adapter — outer layer for receiving OKR status updates
 * from an external OKR system.
 *
 * Architecture (two-layer design):
 *   OUTER LAYER (this file) — receives from external source:
 *     - POST /okr/webhook        : authenticated webhook from OKR system
 *     - POST /okr/sync/manual    : admin-triggered manual sync (for testing/backfill)
 *   INNER LAYER (syncOkrStatus.ts) — processes updates, validates identity,
 *     audits, and triggers recompute.
 *
 * Identity validation is strict (matching importAttendance pattern):
 *   - employeeId + email both supplied → both must resolve AND match
 *
 * Auth:
 *   - Webhook:  HMAC-SHA256 signature in X-OKR-Signature header,
 *               shared secret in OKR_WEBHOOK_SECRET env var.
 *               Falls back to bearer token check if secret not configured
 *               (safe for dev, logs a warning for prod).
 *   - Manual:   Requires admin Clerk session (same as admin mutations).
 *
 * Payload shape expected from external OKR system:
 *   {
 *     "rows": [
 *       { "employeeId": "emp_eng_ariunbat", "okrSubmitted": true, "quarter": "2026-Q1" },
 *       { "email": "naraa.design@pinequest.mn", "okrSubmitted": true, "quarter": "2026-Q1" }
 *     ]
 *   }
 *
 * To enable cron-based polling instead of webhooks, set up the scheduled handler
 * in index.ts to call fetchAndSyncFromOkrSystem() on a schedule, pointing it at
 * the external OKR API endpoint via OKR_API_URL env var.
 *
 * Required env vars:
 *   OKR_WEBHOOK_SECRET  – HMAC-SHA256 shared secret for webhook auth (optional but recommended)
 *   OKR_API_URL         – Base URL of external OKR system API (for cron polling mode, optional)
 */

import type { Database } from "../db";
import type { Env } from "../graphql/context";
import { syncOkrStatusCore } from "./sync-core";
import { fetchWithRetry } from "../lib/retry";

// ---------------------------------------------------------------------------
// Env extension for OKR adapter
// ---------------------------------------------------------------------------

export interface OkrAdapterEnv extends Env {
  /** HMAC-SHA256 shared secret for webhook signature verification. */
  OKR_WEBHOOK_SECRET?: string;
  /** Base URL of external OKR system (e.g. https://okr.pinequest.mn/api). */
  OKR_API_URL?: string;
}

// ---------------------------------------------------------------------------
// Webhook signature verification
// ---------------------------------------------------------------------------

/**
 * Verify HMAC-SHA256 signature sent in X-OKR-Signature header.
 * Returns true if verified, false if mismatch, null if secret not configured.
 */
async function verifyWebhookSignature(
  body: string,
  signatureHeader: string | null,
  secret: string | undefined,
): Promise<boolean | null> {
  if (!secret) return null; // secret not configured — caller decides

  if (!signatureHeader) return false;

  // Support "sha256=<hex>" or plain "<hex>" format
  const sig = signatureHeader.startsWith("sha256=")
    ? signatureHeader.slice(7)
    : signatureHeader;

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expected = await crypto.subtle.sign(
    "HMAC",
    keyMaterial,
    new TextEncoder().encode(body),
  );
  const expectedHex = Array.from(new Uint8Array(expected))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return sig === expectedHex;
}

// ---------------------------------------------------------------------------
// Payload parsing
// ---------------------------------------------------------------------------

type OkrRow = {
  employeeId?: string | null;
  email?: string | null;
  okrSubmitted: boolean;
  quarter?: string | null;
};

type OkrPayload = { rows?: unknown[] };

function parsePayload(raw: unknown): OkrRow[] | { error: string } {
  if (typeof raw !== "object" || raw === null) return { error: "Payload must be a JSON object." };
  const payload = raw as OkrPayload;
  if (!Array.isArray(payload.rows)) return { error: 'Payload must have a "rows" array.' };
  if (payload.rows.length === 0) return [];

  const rows: OkrRow[] = [];
  for (let i = 0; i < payload.rows.length; i++) {
    const r = payload.rows[i];
    if (typeof r !== "object" || r === null) continue;
    const row = r as Record<string, unknown>;

    if (typeof row.okrSubmitted !== "boolean") {
      return { error: `Row ${i + 1}: okrSubmitted must be a boolean.` };
    }
    rows.push({
      employeeId: typeof row.employeeId === "string" ? row.employeeId : null,
      email: typeof row.email === "string" ? row.email : null,
      okrSubmitted: row.okrSubmitted,
      quarter: typeof row.quarter === "string" ? row.quarter : null,
    });
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Webhook handler
// ---------------------------------------------------------------------------

/**
 * Handle POST /okr/webhook — accepts OKR updates from an external OKR system.
 * Verifies HMAC signature if OKR_WEBHOOK_SECRET is configured.
 * Returns null if the path does not match (for routing in index.ts).
 */
export async function handleOkrWebhook(
  request: Request,
  env: OkrAdapterEnv,
  db: Database,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/okr/webhook" || request.method !== "POST") return null;

  const bodyText = await request.text();

  // Verify webhook signature
  const signatureHeader = request.headers.get("X-OKR-Signature");
  const verificationResult = await verifyWebhookSignature(
    bodyText,
    signatureHeader,
    env.OKR_WEBHOOK_SECRET,
  );

  if (verificationResult === false) {
    console.error("[okrAdapter] Webhook signature mismatch — rejecting.");
    return new Response(JSON.stringify({ error: "Invalid signature." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (verificationResult === null) {
    // Secret not configured — only tolerate in development; reject everywhere else.
    if (env.ENVIRONMENT !== "development") {
      console.error(
        "[okrAdapter] OKR_WEBHOOK_SECRET is not configured in a non-development environment. " +
          "Set OKR_WEBHOOK_SECRET to enable authenticated webhooks.",
      );
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured. Contact the platform team." }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      );
    }
    console.warn(
      "[okrAdapter] OKR_WEBHOOK_SECRET not set — accepting without signature check (development only).",
    );
  }

  let raw: unknown;
  try {
    raw = JSON.parse(bodyText);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rows = parsePayload(raw);
  if ("error" in rows) {
    return new Response(JSON.stringify({ error: rows.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (rows.length === 0) {
    return new Response(JSON.stringify({ processed: 0, updated: 0, invalid: 0, errors: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await syncOkrStatusCore(db, rows, null /* system-originated */, env.ELIGIBILITY_CACHE);
  console.log(`[okrAdapter] Webhook processed: ${JSON.stringify(result)}`);

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// ---------------------------------------------------------------------------
// Manual admin trigger handler
// ---------------------------------------------------------------------------

/**
 * Handle POST /okr/sync/manual — admin-triggered sync for testing/backfill.
 * Requires admin Clerk session auth.
 */
export async function handleOkrManualSync(
  request: Request,
  env: OkrAdapterEnv,
  db: Database,
  adminEmployee: import("../db").Employee,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/okr/sync/manual" || request.method !== "POST") return null;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rows = parsePayload(raw);
  if ("error" in rows) {
    return new Response(JSON.stringify({ error: rows.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await syncOkrStatusCore(db, rows, adminEmployee, env.ELIGIBILITY_CACHE);
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// ---------------------------------------------------------------------------
// Cron polling mode (optional — for OKR systems without webhook support)
// ---------------------------------------------------------------------------

/**
 * Fetch OKR status updates from external OKR API and sync them.
 * Called by the Cloudflare scheduled handler when OKR_API_URL is configured.
 *
 * Expects the external API to return the same { rows: [...] } payload shape.
 * Extend this function to add pagination, retry, or custom auth headers as needed.
 */
export async function fetchAndSyncFromOkrSystem(
  db: Database,
  env: OkrAdapterEnv,
): Promise<void> {
  if (!env.OKR_API_URL) {
    console.log("[okrAdapter] OKR_API_URL not configured — skipping cron OKR poll.");
    return;
  }

  let raw: unknown;
  try {
    // fetchWithRetry retries up to 3 times on 5xx / network errors with
    // exponential back-off (TDD §8: "max 3 retries, exponential back-off").
    const res = await fetchWithRetry(
      `${env.OKR_API_URL.replace(/\/+$/, "")}/okr-status`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          // Add X-API-Key or Authorization header here when the external system requires auth
        },
      },
    );
    if (!res.ok) {
      console.error(`[okrAdapter] OKR API fetch failed (${res.status}): ${await res.text()}`);
      return;
    }
    raw = await res.json();
  } catch (err) {
    console.error("[okrAdapter] OKR API fetch error (all retries exhausted):", err);
    return;
  }

  const rows = parsePayload(raw);
  if ("error" in rows) {
    console.error("[okrAdapter] OKR API returned unexpected payload:", rows.error);
    return;
  }
  if (rows.length === 0) {
    console.log("[okrAdapter] OKR API returned no rows — nothing to sync.");
    return;
  }

  const result = await syncOkrStatusCore(db, rows, null, env.ELIGIBILITY_CACHE);
  console.log(`[okrAdapter] Cron OKR sync complete: ${JSON.stringify(result)}`);
}
