const CONTRACT_PROXY_PATH = "/api/contracts/view";
const EMPLOYEE_SIGNED_CONTRACT_PROXY_PATH = "/api/contracts/employee-view";
const SCREEN_TIME_SUBMISSION_PROXY_PATH = "/api/screen-time/view";

export function getContractProxyUrl(
  rawUrl: string | null | undefined,
): string | null {
  if (!rawUrl) return null;
  if (rawUrl.startsWith(CONTRACT_PROXY_PATH)) return rawUrl;
  if (rawUrl.startsWith(EMPLOYEE_SIGNED_CONTRACT_PROXY_PATH)) return rawUrl;
  if (rawUrl.startsWith(SCREEN_TIME_SUBMISSION_PROXY_PATH)) return rawUrl;

  try {
    const url = rawUrl.startsWith("http")
      ? new URL(rawUrl)
      : new URL(rawUrl, "http://localhost");
    if (url.pathname === "/contracts/employee-view") {
      const id = url.searchParams.get("id");
      if (!id) return rawUrl;
      return `${EMPLOYEE_SIGNED_CONTRACT_PROXY_PATH}?id=${encodeURIComponent(id)}`;
    }
    if (url.pathname === "/screen-time/submission-view") {
      const id = url.searchParams.get("id");
      if (!id) return rawUrl;
      return `${SCREEN_TIME_SUBMISSION_PROXY_PATH}?id=${encodeURIComponent(id)}`;
    }
    const token = url.searchParams.get("token");
    if (!token) return rawUrl;
    return `${CONTRACT_PROXY_PATH}?token=${encodeURIComponent(token)}`;
  } catch {
    return rawUrl;
  }
}
