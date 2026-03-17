/**
 * Retry utilities for Cloudflare Workers.
 *
 * Provides:
 *   - withRetry<T>()   — generic exponential back-off wrapper
 *   - fetchWithRetry() — fetch() that auto-retries on 5xx + network errors
 *   - HttpError        — error class carrying an HTTP status code
 *
 * Design notes:
 *   - Full-jitter back-off: delay ∈ [0, min(maxDelayMs, base * 2^(attempt-1))]
 *     (avoids thundering-herd on coordinated restarts)
 *   - HTTP 4xx responses are NOT retried (client errors → fix the request)
 *   - HTTP 5xx responses ARE retried (server/transient errors)
 *   - Network errors (fetch throws) are always retried
 *   - setTimeout is available in the Cloudflare Workers runtime (WHATWG timers)
 */

// ---------------------------------------------------------------------------
// HttpError
// ---------------------------------------------------------------------------

/** Thrown by fetchWithRetry when the server returns a 4xx or terminal 5xx. */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

// ---------------------------------------------------------------------------
// withRetry
// ---------------------------------------------------------------------------

export type RetryOptions = {
  /** Maximum number of attempts including the first. Default: 3 */
  maxAttempts?: number;
  /** Delay before the second attempt in ms (doubles each round). Default: 500 */
  baseDelayMs?: number;
  /** Upper cap on the computed delay (before jitter). Default: 8_000 */
  maxDelayMs?: number;
  /**
   * Called before each retry.  Return false to abort early and re-throw the
   * current error immediately (e.g. skip retrying on 4xx).
   * Receives (error, attemptThatJustFailed).
   */
  shouldRetry?: (err: unknown, attempt: number) => boolean;
};

/** Sleep helper — compatible with the Cloudflare Workers runtime. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute `fn`, retrying on failure with exponential back-off + full jitter.
 *
 * On the final attempt the error is re-thrown.  Intermediate errors are
 * swallowed (but logged via shouldRetry callbacks if desired).
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions,
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelayMs = 500,
    maxDelayMs = 8_000,
    shouldRetry = () => true,
  } = options ?? {};

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      const isLastAttempt = attempt === maxAttempts;
      if (isLastAttempt || !shouldRetry(err, attempt)) {
        throw err;
      }

      // Full-jitter: pick a random delay in [0, cap] where cap grows exponentially
      const cap = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt - 1));
      await sleep(Math.random() * cap);
    }
  }

  // Unreachable, but keeps TypeScript happy
  throw lastError;
}

// ---------------------------------------------------------------------------
// fetchWithRetry
// ---------------------------------------------------------------------------

/**
 * Thin wrapper around `fetch()` that retries on 5xx and network errors.
 *
 * - HTTP 4xx → returned immediately as-is (caller reads body/status)
 * - HTTP 5xx → throws HttpError after maxAttempts retries
 * - Network error → retried up to maxAttempts; last error re-thrown
 *
 * @param url     Request URL
 * @param init    Standard RequestInit (method, headers, body, …)
 * @param options Retry tuning (maxAttempts, baseDelayMs, maxDelayMs)
 */
export async function fetchWithRetry(
  url: string,
  init?: RequestInit,
  options?: Omit<RetryOptions, "shouldRetry">,
): Promise<Response> {
  return withRetry(
    async () => {
      const res = await fetch(url, init);

      if (res.status >= 500) {
        // Drain the body to avoid resource-leak warnings, then throw so the
        // retry loop triggers.  The HttpError carries the status for logging.
        await res.text().catch(() => {});
        throw new HttpError(res.status, `Upstream HTTP ${res.status}`);
      }

      return res;
    },
    {
      ...options,
      // Only retry on 5xx HttpErrors or network-level errors (fetch throws).
      // 4xx HttpErrors should never reach here (we return 4xx as-is above),
      // but guard defensively anyway.
      shouldRetry: (err) =>
        !(err instanceof HttpError) || err.status >= 500,
    },
  );
}
