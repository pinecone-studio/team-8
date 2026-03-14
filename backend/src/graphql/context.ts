import type { Database } from "../db";
import type { Employee } from "../db";

export interface Env {
  DB: D1Database;
  CONTRACTS_BUCKET?: R2Bucket;
  CONTRACT_VIEW_TOKENS: KVNamespace;
  ENVIRONMENT: string;
}

export interface GraphQLContext {
  db: Database;
  env: Env;
  /** Origin/base URL for building contract view URLs (e.g. request.url origin). */
  baseUrl: string;
  /** Currently authenticated employee, or null if unauthenticated. */
  currentEmployee: Employee | null;
}
