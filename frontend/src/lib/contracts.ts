const CONTRACT_PROXY_PATH = "/api/contracts/view";

export function getContractProxyUrl(
  rawUrl: string | null | undefined,
): string | null {
  if (!rawUrl) return null;
  if (rawUrl.startsWith(CONTRACT_PROXY_PATH)) return rawUrl;

  try {
    const url = rawUrl.startsWith("http")
      ? new URL(rawUrl)
      : new URL(rawUrl, "http://localhost");
    const token = url.searchParams.get("token");
    if (!token) return rawUrl;
    return `${CONTRACT_PROXY_PATH}?token=${encodeURIComponent(token)}`;
  } catch {
    return rawUrl;
  }
}
