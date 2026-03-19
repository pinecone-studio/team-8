type ScreenTimeDebugEnv = {
  ENVIRONMENT?: string;
  SCREEN_TIME_DEBUG_TODAY_LOCAL_DATE?: string;
};

function isLocalHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export function resolveScreenTimeDebugDate(
  env: ScreenTimeDebugEnv,
  requestUrlOrBaseUrl?: string | null,
): string | null {
  const override = env.SCREEN_TIME_DEBUG_TODAY_LOCAL_DATE?.trim();
  if (!override) return null;
  if (env.ENVIRONMENT === "development") return override;

  if (requestUrlOrBaseUrl) {
    try {
      const hostname = new URL(requestUrlOrBaseUrl).hostname;
      if (isLocalHost(hostname)) {
        return override;
      }
    } catch {
      return null;
    }
  }

  return null;
}
