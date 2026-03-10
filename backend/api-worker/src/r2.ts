import { AwsClient } from "aws4fetch";

import type { Env } from "./types";

const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7;
const DEFAULT_BUCKET_NAME = "ebms-migration-source";

function encodeObjectKey(objectKey: string): string {
  return objectKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export async function createSignedContractUrl(input: {
  env: Env;
  objectKey: string;
  ttlSeconds?: number;
}): Promise<{ url: string; expiresAt: string }> {
  const accountId = input.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = input.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = input.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucketName = input.env.R2_BUCKET_NAME?.trim() || DEFAULT_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 signing credentials are not configured.");
  }

  const ttlSeconds = input.ttlSeconds ?? SEVEN_DAYS_IN_SECONDS;
  const baseUrl = new URL(
    `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${encodeObjectKey(
      input.objectKey
    )}`
  );
  baseUrl.searchParams.set("X-Amz-Expires", String(ttlSeconds));

  const client = new AwsClient({
    accessKeyId,
    secretAccessKey,
    service: "s3",
    region: "auto"
  });

  const signedRequest = await client.sign(
    new Request(baseUrl.toString(), {
      method: "GET"
    }),
    {
      aws: {
        signQuery: true
      }
    }
  );

  return {
    url: signedRequest.url,
    expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString()
  };
}
