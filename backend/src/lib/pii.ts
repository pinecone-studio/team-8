/**
 * PII masking helpers for log-safe output.
 *
 * TDD §8: "Employee PII must not appear in plain-text logs."
 *
 * Rules applied here:
 *   - Email addresses  →  first char + "***" + "@" + domain
 *     e.g.  naraa@pinequest.mn  →  n***@pinequest.mn
 *   - Long strings (potential API response bodies) → truncated to 200 chars
 *     so full payloads are never written to logs.
 */

/**
 * Mask an email address, keeping enough context for log correlation without
 * exposing the full address.
 *
 * Examples:
 *   maskEmail("alice@example.com")  → "a***@example.com"
 *   maskEmail("not-an-email")       → "***"  (safe fallback)
 */
export function maskEmail(email: string): string {
  const atIdx = email.indexOf("@");
  if (atIdx <= 0) return "***";
  return `${email[0]}***${email.slice(atIdx)}`;
}

/**
 * Truncate an arbitrary string to `maxLen` characters for safe log output.
 * Appends "…" when the string is actually trimmed.
 */
export function truncateForLog(value: string, maxLen = 200): string {
  if (value.length <= maxLen) return value;
  return `${value.slice(0, maxLen)}…`;
}
