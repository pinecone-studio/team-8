/**
 * Short-lived token for viewing contract PDF (TDD §11 — signed URL alternative).
 * Token stored in KV; GET /contracts/view?token=xxx streams PDF from R2.
 */

const TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const CONTRACT_VIEW_TOKEN_CACHE_PREFIX =
  "contract-view-token-cache:"; // KV key prefix for token reuse

export interface ContractViewEnv {
  CONTRACT_VIEW_TOKENS: KVNamespace;
}

function randomToken(): string {
  const bytes = new Uint8Array(32);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export interface ContractTokenMeta {
  /** Employee the token was issued for — stored so views can be audit-logged. */
  employeeId?: string;
  /** D1 contract row ID — stored so views can be audit-logged. */
  contractId?: string;
}

/**
 * Create a view token for an R2 object key; store in KV with TTL.
 * Pass optional meta (employeeId, contractId) so the view endpoint can write
 * a CONTRACT_VIEWED audit log entry without an extra DB lookup.
 * Returns the token string, or null if KV is unavailable (e.g. daily put limit).
 * Callers must treat null as "no shareable view URL" — core mutations must still succeed.
 */
export async function createContractViewToken(
  kv: KVNamespace,
  r2Key: string,
  ttlSeconds: number = TTL_SECONDS,
  meta?: ContractTokenMeta,
): Promise<string | null> {
  const token = randomToken();
  const expiresAt = Date.now() + ttlSeconds * 1000;
  try {
    await kv.put(token, JSON.stringify({ r2Key, expiresAt, ...meta }), {
      expirationTtl: ttlSeconds,
    });
  } catch (err) {
    console.error(
      "[createContractViewToken] KV put failed (quota, network, etc.):",
      err,
    );
    return null;
  }
  return token;
}

function contractViewTokenCacheKey(
  r2Key: string,
  meta?: ContractTokenMeta,
): string {
  // Ensure the cache key is unique per (employee scope + contract row) and
  // per contract R2 object. This prevents token reuse across different
  // contracts when callers pass no meta (admin / view-all cases).
  const employeeId = meta?.employeeId ?? "any";
  const contractId = meta?.contractId ?? "any";
  return `${CONTRACT_VIEW_TOKEN_CACHE_PREFIX}${employeeId}:${contractId}:${r2Key}`;
}

/**
 * Get (or create) a contract view token for the given R2 object and meta.
 *
 * This avoids generating a new random KV token every time a UI lists "awaiting
 * contract acceptance" requests (which would quickly hit KV daily put limits).
 */
export async function getOrCreateContractViewToken(
  kv: KVNamespace,
  r2Key: string,
  ttlSeconds: number = TTL_SECONDS,
  meta?: ContractTokenMeta,
): Promise<string | null> {
  const cacheKey = contractViewTokenCacheKey(r2Key, meta);

  // 1) Try cache: if a token exists and still resolves in KV, reuse it.
  try {
    const cachedToken = await kv.get(cacheKey);
    if (cachedToken) {
      const resolved = await resolveContractViewToken(kv, cachedToken);
      if (resolved) return cachedToken;
    }
  } catch (err) {
    // Non-fatal: fallback to creating a fresh token.
    console.error("[getOrCreateContractViewToken] KV get failed:", err);
  }

  // 2) Cache miss: create a fresh token (may still fail if KV put quota is hit).
  const token = await createContractViewToken(kv, r2Key, ttlSeconds, meta);
  if (!token) return null;

  // 3) Best-effort cache write (non-fatal).
  try {
    await kv.put(cacheKey, token, { expirationTtl: ttlSeconds });
  } catch (err) {
    console.error("[getOrCreateContractViewToken] KV put cache failed:", err);
  }

  return token;
}

/**
 * Build full URL for contract view (worker base URL + path + token).
 */
export function getContractViewUrl(baseUrl: string, token: string): string {
  const url = new URL(baseUrl);
  url.pathname = "/contracts/view";
  url.searchParams.set("token", token);
  return url.toString();
}

/**
 * Build a session-authenticated URL for viewing an employee-uploaded signed
 * contract copy. Unlike vendor contracts this route does not use a signed KV
 * token because access is restricted to the owner employee or HR admins.
 */
export function getEmployeeSignedContractViewUrl(
  baseUrl: string,
  employeeSignedContractId: string,
): string {
  const url = new URL(baseUrl);
  url.pathname = "/contracts/employee-view";
  url.searchParams.set("id", employeeSignedContractId);
  return url.toString();
}

/**
 * Resolve token from KV.
 * Returns r2Key plus any optional meta (employeeId, contractId) stored at
 * token-creation time — callers use these to write audit log entries.
 */
export async function resolveContractViewToken(
  kv: KVNamespace,
  token: string,
): Promise<{ r2Key: string; employeeId?: string; contractId?: string } | null> {
  const raw = await kv.get(token);
  if (!raw) return null;
  try {
    const { r2Key, expiresAt, employeeId, contractId } = JSON.parse(raw) as {
      r2Key: string;
      expiresAt: number;
      employeeId?: string;
      contractId?: string;
    };
    if (Date.now() > expiresAt) return null;
    return { r2Key, employeeId, contractId };
  } catch {
    return null;
  }
}
