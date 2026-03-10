import { pbkdf2Sync, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

interface DemoEmployeeRecord {
  id: string;
  employeeCode: string;
  role: string;
  department: string;
}

const DEMO_EMPLOYEE_DATASET = "./data/demo-employees.csv";

function escapeSql(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function parseCsv(content: string): DemoEmployeeRecord[] {
  const lines = content.trim().split(/\r?\n/);
  const headers = lines[0]!.split(",");
  const indexes = {
    id: headers.indexOf("id"),
    employeeCode: headers.indexOf("employee_code"),
    role: headers.indexOf("role"),
    department: headers.indexOf("department")
  };

  if (Object.values(indexes).some((index) => index === -1)) {
    throw new Error("demo employee dataset must include id, employee_code, role, department");
  }

  return lines.slice(1).map((line) => {
      const columns = line.split(",");

      return {
        id: columns[indexes.id]!.trim(),
        employeeCode: columns[indexes.employeeCode]!.trim(),
        role: columns[indexes.role]!.trim(),
        department: columns[indexes.department]!.trim()
      };
  });
}

function derivePassword(record: DemoEmployeeRecord) {
  return `${record.employeeCode}!2026`;
}

function hashPassword(password: string, salt: Buffer) {
  return pbkdf2Sync(password, salt, 310000, 32, "sha256").toString("base64");
}

const dataset = parseCsv(readFileSync(resolve(process.cwd(), DEMO_EMPLOYEE_DATASET), "utf8"));

const rows = dataset.map((record) => {
  const salt = randomBytes(16);
  const password = derivePassword(record);
  const hash = hashPassword(password, salt);

  return `(
  ${escapeSql(record.id)},
  ${escapeSql(hash)},
  ${escapeSql(salt.toString("base64"))},
  310000,
  'pbkdf2-sha256',
  1
)`;
});

process.stdout.write(`BEGIN TRANSACTION;

DELETE FROM access_credentials;

INSERT INTO access_credentials (
  employee_id,
  password_hash,
  password_salt,
  password_iterations,
  password_algorithm,
  is_active
) VALUES
${rows.join(",\n")};

COMMIT;
`);
