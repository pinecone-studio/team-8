import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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

function escapeSql(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function loadManifest(filePath: string): ContractManifestEntry[] {
  return JSON.parse(readFileSync(resolve(process.cwd(), filePath), "utf8")) as ContractManifestEntry[];
}

function toSha256(filePath: string) {
  return createHash("sha256").update(readFileSync(resolve(process.cwd(), filePath))).digest("hex");
}

function main() {
  const manifestPath = process.argv[2] ?? "./data/contracts/contract-manifest.json";
  const manifest = loadManifest(manifestPath);
  const statements: string[] = ["BEGIN TRANSACTION;"];

  for (const contract of manifest) {
    const sha256Hash = toSha256(contract.filePath);

    statements.push(
      [
        "UPDATE contracts",
        "SET is_active = 0,",
        "    updated_at = CURRENT_TIMESTAMP",
        `WHERE benefit_id = ${escapeSql(contract.benefitId)};`
      ].join("\n")
    );

    statements.push(
      [
        "INSERT INTO contracts (",
        "  id,",
        "  benefit_id,",
        "  vendor_name,",
        "  version,",
        "  r2_object_key,",
        "  sha256_hash,",
        "  effective_date,",
        "  expiry_date,",
        "  is_active",
        ") VALUES (",
        `  ${escapeSql(contract.id)},`,
        `  ${escapeSql(contract.benefitId)},`,
        `  ${escapeSql(contract.vendorName)},`,
        `  ${escapeSql(contract.version)},`,
        `  ${escapeSql(contract.objectKey)},`,
        `  ${escapeSql(sha256Hash)},`,
        `  ${escapeSql(contract.effectiveDate)},`,
        `  ${escapeSql(contract.expiryDate)},`,
        "  1",
        ")",
        "ON CONFLICT(id) DO UPDATE SET",
        "  benefit_id = excluded.benefit_id,",
        "  vendor_name = excluded.vendor_name,",
        "  version = excluded.version,",
        "  r2_object_key = excluded.r2_object_key,",
        "  sha256_hash = excluded.sha256_hash,",
        "  effective_date = excluded.effective_date,",
        "  expiry_date = excluded.expiry_date,",
        "  is_active = excluded.is_active,",
        "  updated_at = CURRENT_TIMESTAMP;"
      ].join("\n")
    );

    statements.push(
      [
        "UPDATE benefits",
        `SET active_contract_id = ${escapeSql(contract.id)},`,
        "    updated_at = CURRENT_TIMESTAMP",
        `WHERE id = ${escapeSql(contract.benefitId)};`
      ].join("\n")
    );

    statements.push(
      [
        "INSERT INTO audit_logs (",
        "  id,",
        "  employee_id,",
        "  benefit_id,",
        "  actor_id,",
        "  actor_role,",
        "  action,",
        "  entity_type,",
        "  entity_id,",
        "  reason,",
        "  payload_json",
        ") VALUES (",
        `  ${escapeSql(crypto.randomUUID())},`,
        "  NULL,",
        `  ${escapeSql(contract.benefitId)},`,
        "  'system-import',",
        "  'system',",
        "  'contract_uploaded',",
        "  'contract',",
        `  ${escapeSql(contract.id)},`,
        `  ${escapeSql(`Imported contract version ${contract.version}`)},`,
        `  ${escapeSql(
          JSON.stringify({
            benefitId: contract.benefitId,
            benefitSlug: contract.benefitSlug,
            version: contract.version,
            vendorName: contract.vendorName,
            objectKey: contract.objectKey,
            sha256Hash,
            effectiveDate: contract.effectiveDate,
            expiryDate: contract.expiryDate
          })
        )}`,
        ");"
      ].join("\n")
    );
  }

  statements.push("COMMIT;");
  process.stdout.write(`${statements.join("\n\n")}\n`);
}

main();
