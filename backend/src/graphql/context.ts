import type { Database } from "../db";
import type { CurrentUser } from "../auth";

export interface Env {
  DB: D1Database;
  CONTRACTS_BUCKET?: R2Bucket;
  CONTRACT_VIEW_TOKENS: KVNamespace;
  ENVIRONMENT: string;
  CLERK_SECRET_KEY?: string;
  CLERK_JWT_KEY?: string;
}

export interface GraphQLContext {
  db: Database;
  env: Env;
  /** Origin/base URL for building contract view URLs (e.g. request.url) */
  baseUrl: string;
  currentUser: CurrentUser;
}
