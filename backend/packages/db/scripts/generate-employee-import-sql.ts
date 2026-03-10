import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { benefitCatalog } from "../../config/dist/index.js";

type BenefitSeed = (typeof benefitCatalog)[number];
type BenefitRuleSeed = BenefitSeed["rules"][number];

interface EmployeeSnapshot {
  id: string;
  role: string;
  responsibilityLevel: number;
  employmentStatus: "active" | "probation" | "leave" | "terminated";
  hireDate: string;
  okrSubmitted: boolean;
  lateArrivalCount: number;
}

interface RuleEvaluationResult {
  ruleId: string;
  ruleType: BenefitRuleSeed["ruleType"];
  passed: boolean;
  expected: BenefitRuleSeed["value"];
  actual: string | number | boolean | string[];
  errorMessage: string | null;
}

interface BenefitEvaluationResult {
  benefitId: string;
  benefitSlug: string;
  benefitName: string;
  status: "eligible" | "locked";
  evaluations: RuleEvaluationResult[];
}

interface BenefitEligibilityImportRow {
  employeeId: string;
  benefitId: string;
  status: BenefitEvaluationResult["status"];
  ruleEvaluationJson: string;
  computedAt: string;
}

interface AuditLogImportRow {
  id: string;
  employeeId: string;
  benefitId: string;
  actorId: string;
  actorRole: "system";
  action: "eligibility_computed";
  entityType: "benefit_eligibility";
  entityId: string;
  reason: string;
  payloadJson: string;
}

type RawRecord = Record<string, string>;

interface NormalizedEmployeeRecord {
  id: string;
  employeeCode: string;
  email: string;
  name: string;
  nameEng: string | null;
  role: string;
  department: string;
  responsibilityLevel: number;
  employmentStatus: EmployeeSnapshot["employmentStatus"];
  hireDate: string;
  okrSubmitted: boolean;
  lateArrivalCount: number;
}

function fail(message: string): never {
  throw new Error(message);
}

function escapeSql(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function toSqlText(value: string | null): string {
  return value === null ? "NULL" : escapeSql(value);
}

function toSqlBoolean(value: boolean): string {
  return value ? "1" : "0";
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

function getField(record: RawRecord, aliases: string[]): string | undefined {
  for (const alias of aliases) {
    if (record[alias] !== undefined) {
      return record[alias];
    }
  }

  return undefined;
}

function parseBoolean(value: string | undefined, fallback = false): boolean {
  if (!value || !value.trim()) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();

  if (["1", "true", "yes", "y"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "n"].includes(normalized)) {
    return false;
  }

  fail(`Invalid boolean value: ${value}`);
}

function parseInteger(value: string | undefined, fieldName: string, fallback?: number): number {
  if (!value || !value.trim()) {
    if (fallback !== undefined) {
      return fallback;
    }

    fail(`${fieldName} is required`);
  }

  const parsed = Number.parseInt(value.trim(), 10);

  if (!Number.isFinite(parsed)) {
    fail(`Invalid integer for ${fieldName}: ${value}`);
  }

  return parsed;
}

function parseEmploymentStatus(value: string | undefined): EmployeeSnapshot["employmentStatus"] {
  if (!value || !value.trim()) {
    fail("employment_status is required");
  }

  const normalized = normalizeKey(value);

  switch (normalized) {
    case "active":
      return "active";
    case "probation":
    case "probationary":
      return "probation";
    case "leave":
    case "on_leave":
      return "leave";
    case "terminated":
      return "terminated";
    default:
      fail(`Unsupported employment_status: ${value}`);
  }
}

function parseIsoDate(value: string | undefined, fieldName: string): string {
  if (!value || !value.trim()) {
    fail(`${fieldName} is required`);
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    fail(`Invalid date for ${fieldName}: ${value}`);
  }

  return parsed.toISOString();
}

function parseCsv(content: string): RawRecord[] {
  const rows: string[][] = [];
  let currentCell = "";
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }

      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }

      currentRow.push(currentCell);
      if (currentRow.some((cell) => cell.trim() !== "")) {
        rows.push(currentRow);
      }
      currentCell = "";
      currentRow = [];
      continue;
    }

    currentCell += char;
  }

  currentRow.push(currentCell);
  if (currentRow.some((cell) => cell.trim() !== "")) {
    rows.push(currentRow);
  }

  if (rows.length < 2) {
    fail("CSV must include a header row and at least one data row");
  }

  const [headerRow, ...dataRows] = rows;
  const normalizedHeaders = headerRow.map((header) => normalizeKey(header));

  return dataRows.map((row, rowIndex) => {
    const record: RawRecord = {};

    normalizedHeaders.forEach((header, cellIndex) => {
      record[header] = row[cellIndex]?.trim() ?? "";
    });

    if (!record.email) {
      fail(`Row ${rowIndex + 2}: email is required`);
    }

    return record;
  });
}

function parseJson(content: string): RawRecord[] {
  const parsed = JSON.parse(content) as unknown;

  if (!Array.isArray(parsed)) {
    fail("JSON input must be an array of employee records");
  }

  return parsed.map((entry, rowIndex) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      fail(`JSON row ${rowIndex + 1} is not an object`);
    }

    const record: RawRecord = {};

    for (const [key, value] of Object.entries(entry)) {
      record[normalizeKey(key)] = value === null || value === undefined ? "" : String(value);
    }

    return record;
  });
}

function loadRawRecords(filePath: string): RawRecord[] {
  const absolutePath = resolve(process.cwd(), filePath);
  const content = readFileSync(absolutePath, "utf8");

  if (filePath.toLowerCase().endsWith(".json")) {
    return parseJson(content);
  }

  if (filePath.toLowerCase().endsWith(".csv")) {
    return parseCsv(content);
  }

  fail("Only .csv and .json employee import files are supported");
}

function normalizeEmployeeRecord(record: RawRecord): NormalizedEmployeeRecord {
  const employeeCode =
    getField(record, ["employee_code", "employeecode", "code"])?.trim() ||
    getField(record, ["id", "employee_id", "employeeid"])?.trim();

  if (!employeeCode) {
    fail("Each row requires employee_code or id");
  }

  const id = getField(record, ["id", "employee_id", "employeeid"])?.trim() || slugify(employeeCode);
  const email = getField(record, ["email"])?.trim().toLowerCase();
  const name = getField(record, ["name", "full_name", "fullname"])?.trim();
  const department = getField(record, ["department", "team"])?.trim();
  const roleRaw = getField(record, ["role", "job_role", "jobrole"])?.trim();

  if (!email) {
    fail(`Employee ${employeeCode}: email is required`);
  }

  if (!name) {
    fail(`Employee ${employeeCode}: name is required`);
  }

  if (!department) {
    fail(`Employee ${employeeCode}: department is required`);
  }

  if (!roleRaw) {
    fail(`Employee ${employeeCode}: role is required`);
  }

  return {
    id,
    employeeCode,
    email,
    name,
    nameEng: getField(record, ["name_eng", "nameeng", "english_name", "englishname"])?.trim() || null,
    role: normalizeKey(roleRaw),
    department,
    responsibilityLevel: parseInteger(
      getField(record, ["responsibility_level", "responsibilitylevel", "level"]),
      "responsibility_level"
    ),
    employmentStatus: parseEmploymentStatus(
      getField(record, ["employment_status", "employmentstatus", "status"])
    ),
    hireDate: parseIsoDate(getField(record, ["hire_date", "hiredate", "start_date", "startdate"]), "hire_date"),
    okrSubmitted: parseBoolean(getField(record, ["okr_submitted", "okrsubmitted"]), false),
    lateArrivalCount: parseInteger(
      getField(record, ["late_arrival_count", "latearrivalcount", "attendance_late_count"]),
      "late_arrival_count",
      0
    )
  };
}

function daysSinceHire(hireDate: string, now = new Date()): number {
  const hiredAt = new Date(hireDate);
  const msInDay = 1000 * 60 * 60 * 24;
  return Math.floor((now.getTime() - hiredAt.getTime()) / msInDay);
}

function resolveActualValue(employee: EmployeeSnapshot, rule: BenefitRuleSeed) {
  switch (rule.ruleType) {
    case "employment_status":
      return employee.employmentStatus;
    case "okr_submitted":
      return employee.okrSubmitted;
    case "attendance":
      return employee.lateArrivalCount;
    case "responsibility_level":
      return employee.responsibilityLevel;
    case "role":
      return employee.role;
    case "tenure_days":
      return daysSinceHire(employee.hireDate);
  }
}

function evaluateRule(employee: EmployeeSnapshot, rule: BenefitRuleSeed): RuleEvaluationResult {
  const actual = resolveActualValue(employee, rule);
  let passed = false;

  switch (rule.operator) {
    case "eq":
      passed = actual === rule.value;
      break;
    case "neq":
      passed = actual !== rule.value;
      break;
    case "gte":
      passed = Number(actual) >= Number(rule.value);
      break;
    case "lte":
      passed = Number(actual) <= Number(rule.value);
      break;
    case "in":
      passed = Array.isArray(rule.value) && rule.value.includes(String(actual));
      break;
    case "not_in":
      passed = Array.isArray(rule.value) && !rule.value.includes(String(actual));
      break;
  }

  return {
    ruleId: rule.id,
    ruleType: rule.ruleType,
    passed,
    expected: rule.value,
    actual,
    errorMessage: passed ? null : rule.errorMessage
  };
}

function evaluateBenefit(employee: EmployeeSnapshot, benefit: BenefitSeed): BenefitEvaluationResult {
  const evaluations = [...benefit.rules]
    .sort((left, right) => left.priority - right.priority)
    .map((rule) => evaluateRule(employee, rule));

  return {
    benefitId: benefit.id,
    benefitSlug: benefit.slug,
    benefitName: benefit.name,
    status: evaluations.every((entry) => entry.passed) ? "eligible" : "locked",
    evaluations
  };
}

function buildEligibilityBundle(employee: EmployeeSnapshot): {
  benefitEligibilityRows: BenefitEligibilityImportRow[];
  auditLogRows: AuditLogImportRow[];
} {
  const computedAt = new Date().toISOString();
  const evaluations = benefitCatalog.map((benefit) => evaluateBenefit(employee, benefit));

  return {
    benefitEligibilityRows: evaluations.map((evaluation) => ({
      employeeId: employee.id,
      benefitId: evaluation.benefitId,
      status: evaluation.status,
      ruleEvaluationJson: JSON.stringify(evaluation.evaluations),
      computedAt
    })),
    auditLogRows: evaluations.map((evaluation) => ({
      id: crypto.randomUUID(),
      employeeId: employee.id,
      benefitId: evaluation.benefitId,
      actorId: "system-import",
      actorRole: "system" as const,
      action: "eligibility_computed" as const,
      entityType: "benefit_eligibility" as const,
      entityId: `${employee.id}:${evaluation.benefitId}`,
      reason: "Eligibility recomputed from data_import",
      payloadJson: JSON.stringify({
        trigger: "data_import",
        computedAt,
        benefitSlug: evaluation.benefitSlug,
        benefitName: evaluation.benefitName,
        status: evaluation.status,
        evaluations: evaluation.evaluations
      })
    }))
  };
}

function buildEmployeeInsertSql(employee: NormalizedEmployeeRecord): string {
  return [
    "INSERT INTO employees (",
    "  id,",
    "  employee_code,",
    "  email,",
    "  name,",
    "  name_eng,",
    "  role,",
    "  department,",
    "  responsibility_level,",
    "  employment_status,",
    "  hire_date,",
    "  okr_submitted,",
    "  late_arrival_count",
    ") VALUES (",
    `  ${escapeSql(employee.id)},`,
    `  ${escapeSql(employee.employeeCode)},`,
    `  ${escapeSql(employee.email)},`,
    `  ${escapeSql(employee.name)},`,
    `  ${toSqlText(employee.nameEng)},`,
    `  ${escapeSql(employee.role)},`,
    `  ${escapeSql(employee.department)},`,
    `  ${employee.responsibilityLevel},`,
    `  ${escapeSql(employee.employmentStatus)},`,
    `  ${escapeSql(employee.hireDate)},`,
    `  ${toSqlBoolean(employee.okrSubmitted)},`,
    `  ${employee.lateArrivalCount}`,
    ")",
    "ON CONFLICT(id) DO UPDATE SET",
    "  employee_code = excluded.employee_code,",
    "  email = excluded.email,",
    "  name = excluded.name,",
    "  name_eng = excluded.name_eng,",
    "  role = excluded.role,",
    "  department = excluded.department,",
    "  responsibility_level = excluded.responsibility_level,",
    "  employment_status = excluded.employment_status,",
    "  hire_date = excluded.hire_date,",
    "  okr_submitted = excluded.okr_submitted,",
    "  late_arrival_count = excluded.late_arrival_count,",
    "  updated_at = CURRENT_TIMESTAMP;"
  ].join("\n");
}

function buildEligibilityUpsertSql(rows: BenefitEligibilityImportRow[]) {
  return rows.map((row) =>
    [
      "INSERT INTO benefit_eligibility (",
      "  employee_id,",
      "  benefit_id,",
      "  status,",
      "  rule_evaluation_json,",
      "  computed_at,",
      "  override_by,",
      "  override_reason,",
      "  override_expires_at",
      ") VALUES (",
      `  ${escapeSql(row.employeeId)},`,
      `  ${escapeSql(row.benefitId)},`,
      `  ${escapeSql(row.status)},`,
      `  ${escapeSql(row.ruleEvaluationJson)},`,
      `  ${escapeSql(row.computedAt)},`,
      "  NULL,",
      "  NULL,",
      "  NULL",
      ")",
      "ON CONFLICT(employee_id, benefit_id) DO UPDATE SET",
      "  status = excluded.status,",
      "  rule_evaluation_json = excluded.rule_evaluation_json,",
      "  computed_at = excluded.computed_at,",
      "  override_by = excluded.override_by,",
      "  override_reason = excluded.override_reason,",
      "  override_expires_at = excluded.override_expires_at,",
      "  updated_at = CURRENT_TIMESTAMP;"
    ].join("\n")
  );
}

function buildAuditInsertSql(rows: AuditLogImportRow[]) {
  return rows.map((row) =>
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
      `  ${escapeSql(row.id)},`,
      `  ${escapeSql(row.employeeId)},`,
      `  ${escapeSql(row.benefitId)},`,
      `  ${escapeSql(row.actorId)},`,
      `  ${escapeSql(row.actorRole)},`,
      `  ${escapeSql(row.action)},`,
      `  ${escapeSql(row.entityType)},`,
      `  ${escapeSql(row.entityId)},`,
      `  ${escapeSql(row.reason)},`,
      `  ${escapeSql(row.payloadJson)}`,
      ");"
    ].join("\n")
  );
}

function main() {
  const importFile = process.argv[2];

  if (!importFile) {
    fail("Usage: node --experimental-strip-types ./scripts/generate-employee-import-sql.ts <employees.csv|employees.json>");
  }

  const rawRecords = loadRawRecords(importFile);
  const employees = rawRecords.map(normalizeEmployeeRecord);
  const employeeIds = employees.map((employee) => escapeSql(employee.id)).join(", ");
  const statements: string[] = [
    "BEGIN TRANSACTION;",
    `DELETE FROM audit_logs WHERE employee_id IN (${employeeIds}) AND actor_id = 'system-import' AND action = 'eligibility_computed';`
  ];

  for (const employee of employees) {
    statements.push(buildEmployeeInsertSql(employee));

    const bundle = buildEligibilityBundle({
      id: employee.id,
      role: employee.role,
      responsibilityLevel: employee.responsibilityLevel,
      employmentStatus: employee.employmentStatus,
      hireDate: employee.hireDate,
      okrSubmitted: employee.okrSubmitted,
      lateArrivalCount: employee.lateArrivalCount
    });

    statements.push(...buildEligibilityUpsertSql(bundle.benefitEligibilityRows));
    statements.push(...buildAuditInsertSql(bundle.auditLogRows));
  }

  statements.push("COMMIT;");
  process.stdout.write(`${statements.join("\n\n")}\n`);
}

main();
