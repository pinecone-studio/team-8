import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { AwsClient } from "aws4fetch";

interface ContractManifestEntry {
  id: string;
  benefitId: string;
  benefitSlug: string;
  vendorName: string;
  version: string;
  fileName: string;
  filePath: string;
  objectKey: string;
  effectiveDate: string;
  expiryDate: string;
}

function fail(message: string): never {
  throw new Error(message);
}

function loadDotEnv(filePath: string) {
  const absolutePath = resolve(process.cwd(), filePath);
  const content = readFileSync(absolutePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function encodeObjectKey(objectKey: string): string {
  return objectKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

async function main() {
  const manifestPath = process.argv[2] ?? "./data/contracts/contract-manifest.json";

  loadDotEnv("../../api-worker/.dev.vars");

  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucketName = process.env.R2_BUCKET_NAME?.trim();

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    fail("R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME are required.");
  }

  const manifest = JSON.parse(
    readFileSync(resolve(process.cwd(), manifestPath), "utf8")
  ) as ContractManifestEntry[];

  const client = new AwsClient({
    accessKeyId,
    secretAccessKey,
    service: "s3",
    region: "auto"
  });

  for (const contract of manifest) {
    const fileBytes = readFileSync(resolve(process.cwd(), contract.filePath));
    const uploadUrl = `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${encodeObjectKey(
      contract.objectKey
    )}`;

    const signedRequest = await client.sign(
      new Request(uploadUrl, {
        method: "PUT",
        headers: {
          "content-type": "application/pdf"
        },
        body: fileBytes
      })
    );

    const response = await fetch(signedRequest);

    if (!response.ok) {
      fail(`Failed to upload ${contract.objectKey}: ${response.status}`);
    }

    process.stdout.write(`Uploaded ${contract.objectKey}\n`);
  }
}

void main();
