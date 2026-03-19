const DEFAULT_FRONTEND_ORIGIN = "https://team-8-frontend.team8pinequest.workers.dev";

function normalizeOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function resolveFrontendOrigin(baseUrl?: string | null): string {
  const normalized = baseUrl ? normalizeOrigin(baseUrl) : null;
  if (!normalized) {
    return DEFAULT_FRONTEND_ORIGIN;
  }

  const url = new URL(normalized);
  if (
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "::1"
  ) {
    return "http://localhost:3000";
  }

  if (url.hostname.includes("team8-api.")) {
    return `${url.protocol}//${url.hostname.replace("team8-api.", "team-8-frontend.")}`;
  }

  return url.origin;
}

export function buildAppUrl(path: string, baseUrl?: string | null): string {
  return new URL(path, resolveFrontendOrigin(baseUrl)).toString();
}

export function buildAdminPanelUrl(
  path = "/admin-panel",
  baseUrl?: string | null,
): string {
  return buildAppUrl(path, baseUrl);
}

export function buildEmployeePanelUrl(
  path = "/employee-panel",
  baseUrl?: string | null,
): string {
  return buildAppUrl(path, baseUrl);
}
