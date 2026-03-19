import type { Database } from "../db";
import type { Employee } from "../db";
import type { CurrentUser } from "../auth";

export interface Env {
  DB: D1Database;
  CONTRACTS_BUCKET?: R2Bucket;
  CONTRACT_VIEW_TOKENS: KVNamespace;
  /** KV namespace for caching per-employee eligibility snapshots (TTL 1 h). */
  ELIGIBILITY_CACHE: KVNamespace;
  /** R2 bucket for archiving audit_logs rows older than 12 months (TDD §14). */
  AUDIT_ARCHIVE_BUCKET?: R2Bucket;
  ENVIRONMENT: string;
  CLERK_SECRET_KEY?: string;
  CLERK_JWT_KEY?: string;
  // Gmail API transactional email (OAuth 2.0 refresh-token flow).
  // Set all four vars to enable email; any missing var silently disables email.
  //   GMAIL_CLIENT_ID      – Google OAuth 2.0 client ID
  //   GMAIL_CLIENT_SECRET  – Google OAuth 2.0 client secret
  //   GMAIL_REFRESH_TOKEN  – Long-lived refresh token for the sender Gmail account
  //   GMAIL_SENDER_EMAIL   – The Gmail address to send from (must match the OAuth account)
  GMAIL_CLIENT_ID?: string;
  GMAIL_CLIENT_SECRET?: string;
  GMAIL_REFRESH_TOKEN?: string;
  GMAIL_SENDER_EMAIL?: string;
  // OKR integration adapter
  OKR_WEBHOOK_SECRET?: string;
  OKR_API_URL?: string;
  // Gemini image extraction for screen-time screenshots.
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  // Local/dev-only override for testing Friday slot flows on non-Friday days.
  SCREEN_TIME_DEBUG_TODAY_LOCAL_DATE?: string;
  // Bonum payment integration.
  BONUM_API_BASE_URL?: string;
  BONUM_APP_SECRET?: string;
  BONUM_TERMINAL_ID?: string;
  BONUM_ACCEPT_LANGUAGE?: string;
  BONUM_CALLBACK_URL?: string;
  BONUM_RETURN_URL?: string;
  BONUM_MERCHANT_CHECKSUM_KEY?: string;
  BONUM_INVOICE_EXPIRES_SECONDS?: string;
}

export interface GraphQLContext {
  db: Database;
  env: Env;
  /** Origin/base URL for building contract view URLs (e.g. request.url origin). */
  baseUrl: string;
  /** Currently authenticated employee, or null if unauthenticated. */
  currentEmployee: Employee | null;
  currentUser: CurrentUser;
  /**
   * Client IP address from CF-Connecting-IP (Cloudflare) or X-Forwarded-For fallback.
   * Null when unavailable (e.g. local dev without proxy).
   * Used for contract acceptance audit trail per TDD compliance requirements.
   */
  ipAddress: string | null;
}
