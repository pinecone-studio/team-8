import type { Database } from "../db";

export interface Env {
  DB: D1Database;
  CONTRACTS_BUCKET: R2Bucket;
  CONTRACT_VIEW_TOKENS: KVNamespace;
  ENVIRONMENT: string;
}

export interface GraphQLContext {
  db: Database;
  env: Env;
  /** Origin/base URL for building contract view URLs (e.g. request.url) */
  baseUrl: string;
}
