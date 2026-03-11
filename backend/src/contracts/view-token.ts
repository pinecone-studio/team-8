/**
 * Short-lived token for viewing contract PDF (TDD §11 — signed URL alternative).
 * Token stored in KV; GET /contracts/view?token=xxx streams PDF from R2.
 */

const TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

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

/**
 * Create a view token for an R2 object key; store in KV with TTL.
 * Returns the token string.
 */
export async function createContractViewToken(
  kv: KVNamespace,
  r2Key: string,
  ttlSeconds: number = TTL_SECONDS
): Promise<string> {
  const token = randomToken();
  const expiresAt = Date.now() + ttlSeconds * 1000;
  await kv.put(token, JSON.stringify({ r2Key, expiresAt }), {
    expirationTtl: ttlSeconds,
  });
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
 * Resolve token from KV; returns r2Key if valid.
 */
export async function resolveContractViewToken(
  kv: KVNamespace,
  token: string
): Promise<{ r2Key: string } | null> {
  const raw = await kv.get(token);
  if (!raw) return null;
  try {
    const { r2Key, expiresAt } = JSON.parse(raw) as { r2Key: string; expiresAt: number };
    if (Date.now() > expiresAt) return null;
    return { r2Key };
  } catch {
    return null;
  }
}
