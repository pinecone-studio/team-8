import type { Database } from "../db";
import type { Employee } from "../db";
import type { CurrentUser } from "../auth";

export interface Env {
  DB: D1Database;
  CONTRACTS_BUCKET?: R2Bucket;
  CONTRACT_VIEW_TOKENS: KVNamespace;
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
}

export interface GraphQLContext {
  db: Database;
  env: Env;
  /** Origin/base URL for building contract view URLs (e.g. request.url origin). */
  baseUrl: string;
  /** Currently authenticated employee, or null if unauthenticated. */
  currentEmployee: Employee | null;
  currentUser: CurrentUser;
}
