export interface Env {
  DB: D1Database;
  ELIGIBILITY_CACHE: KVNamespace;
  CONTRACTS_BUCKET: R2Bucket;
  AUTH_JWT_SECRET: string;
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_BUCKET_NAME?: string;
  NOTIFICATION_WEBHOOK_URL?: string;
  NOTIFICATION_WEBHOOK_SECRET?: string;
}
