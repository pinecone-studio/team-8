import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

function fail(message: string): never {
  throw new Error(message);
}

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  fail("Usage: node --experimental-strip-types ./scripts/strip-transaction-sql.ts <input.sql> <output.sql>");
}

const input = readFileSync(resolve(process.cwd(), inputPath), "utf8");
const output = input
  .split(/\r?\n/)
  .filter((line) => !["BEGIN TRANSACTION;", "COMMIT;"].includes(line.trim()))
  .join("\n")
  .trim();

writeFileSync(resolve(process.cwd(), outputPath), `${output}\n`);
