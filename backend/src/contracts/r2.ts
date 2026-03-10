/**
 * R2 contract storage — TDD §11.
 * Path: contracts/{benefitId}/{version}/{filename}
 * Signed URL (TTL 7 days) → next phase.
 */

export const CONTRACTS_PREFIX = "contracts/";

/**
 * Build R2 object key for a contract PDF.
 * Example: contracts/gym_pinefit/2025.1/pinefit_contract_2025v1.pdf
 */
export function getContractObjectKey(
  benefitId: string,
  version: string,
  filename: string
): string {
  const safe = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${CONTRACTS_PREFIX}${safe(benefitId)}/${safe(version)}/${safe(filename)}`;
}

/**
 * Parse key into parts (for listing or display).
 */
export function parseContractObjectKey(
  key: string
): { benefitId: string; version: string; filename: string } | null {
  if (!key.startsWith(CONTRACTS_PREFIX)) return null;
  const rest = key.slice(CONTRACTS_PREFIX.length);
  const parts = rest.split("/");
  if (parts.length < 3) return null;
  return {
    benefitId: parts[0],
    version: parts[1],
    filename: parts.slice(2).join("/"),
  };
}

/**
 * Upload contract PDF to R2.
 * Call from HR admin upload flow (or next phase).
 */
export async function putContract(
  bucket: R2Bucket,
  key: string,
  body: ReadableStream | ArrayBuffer | string,
  options?: { contentType?: string }
): Promise<void> {
  await bucket.put(key, body, {
    httpMetadata: options?.contentType ? { contentType: options.contentType } : undefined,
  });
}

/**
 * Get contract PDF from R2 (direct read; for server-side use).
 * For employee-facing access use signed URL (next phase).
 */
export async function getContract(
  bucket: R2Bucket,
  key: string
): Promise<R2ObjectBody | null> {
  const object = await bucket.get(key);
  return object;
}

/**
 * Signed URL (TTL 7 days) — NEXT PHASE.
 * R2 presigned URLs require S3-compatible API + credentials.
 * Placeholder: implement when adding employee contract viewer.
 */
export async function getContractSignedUrl(
  _bucket: R2Bucket,
  _key: string,
  _ttlSeconds: number = 7 * 24 * 60 * 60
): Promise<string> {
  // TODO (Phase 4): Use @aws-sdk/client-s3 with R2 endpoint + getSignedUrl
  throw new Error("Signed URL not implemented yet (next phase). Use getContract for server-side read.");
}
