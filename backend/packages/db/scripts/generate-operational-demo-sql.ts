import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { benefitCatalog } from "../../config/dist/index.js";

interface DemoEmployeeRecord {
  id: string;
  email: string;
  role: string;
}

interface ContractManifestEntry {
  id: string;
  benefitId: string;
  benefitSlug: string;
  vendorName: string;
  version: string;
  filePath: string;
  objectKey: string;
}

interface RequestSeed {
  id: string;
  employeeId: string;
  benefitId: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewerRole?: "hr_admin" | "finance_manager";
  reviewReason?: string | null;
  contractId?: string;
  requesterIp?: string;
}

interface SyncRunSeed {
  id: string;
  syncType: "okr" | "attendance";
  source: string;
  status: "completed" | "partial";
  recordCount: number;
  initiatedBy: string;
  startedAt: string;
  finishedAt: string;
  summary: {
    updated: number;
    recomputed: number;
    missing: number;
    errors: number;
  };
}

const DEMO_EMPLOYEE_DATASET = "./data/demo-employees.csv";
const CONTRACT_MANIFEST_PATH = "./data/contracts/contract-manifest.json";

const requestSeeds: RequestSeed[] = [
  {
    id: "req-demo-001",
    employeeId: "emp-demo-001",
    benefitId: "benefit-gym-pinefit",
    status: "approved",
    createdAt: "2026-03-01T09:00:00.000Z",
    updatedAt: "2026-03-01T12:00:00.000Z",
    reviewedBy: "emp-demo-008",
    reviewerRole: "hr_admin",
    reviewReason: "Wellness request approved for Q1.",
    contractId: "contract-gym-v2026-1",
    requesterIp: "103.57.92.10"
  },
  {
    id: "req-demo-002",
    employeeId: "emp-demo-004",
    benefitId: "benefit-private-insurance",
    status: "pending",
    createdAt: "2026-03-02T08:45:00.000Z",
    updatedAt: "2026-03-02T08:45:00.000Z",
    contractId: "contract-insurance-v2026-1",
    requesterIp: "103.57.92.11"
  },
  {
    id: "req-demo-003",
    employeeId: "emp-demo-016",
    benefitId: "benefit-travel",
    status: "pending",
    createdAt: "2026-03-02T14:30:00.000Z",
    updatedAt: "2026-03-02T14:30:00.000Z",
    contractId: "contract-travel-v2026-1",
    requesterIp: "103.57.92.12"
  },
  {
    id: "req-demo-004",
    employeeId: "emp-demo-007",
    benefitId: "benefit-down-payment",
    status: "pending",
    createdAt: "2026-03-03T10:20:00.000Z",
    updatedAt: "2026-03-03T10:20:00.000Z",
    requesterIp: "103.57.92.13"
  },
  {
    id: "req-demo-005",
    employeeId: "emp-demo-021",
    benefitId: "benefit-bonus-based-on-okr",
    status: "rejected",
    createdAt: "2026-03-03T15:15:00.000Z",
    updatedAt: "2026-03-04T09:10:00.000Z",
    reviewedBy: "emp-demo-009",
    reviewerRole: "finance_manager",
    reviewReason: "Bonus budget cap reached for this cycle.",
    requesterIp: "103.57.92.14"
  },
  {
    id: "req-demo-006",
    employeeId: "emp-demo-020",
    benefitId: "benefit-macbook",
    status: "approved",
    createdAt: "2026-03-04T11:00:00.000Z",
    updatedAt: "2026-03-04T13:20:00.000Z",
    reviewedBy: "emp-demo-008",
    reviewerRole: "hr_admin",
    reviewReason: "Device refresh approved.",
    contractId: "contract-macbook-v2026-1",
    requesterIp: "103.57.92.15"
  },
  {
    id: "req-demo-007",
    employeeId: "emp-demo-018",
    benefitId: "benefit-remote-work",
    status: "cancelled",
    createdAt: "2026-03-05T09:25:00.000Z",
    updatedAt: "2026-03-05T10:40:00.000Z",
    reviewedBy: "emp-demo-008",
    reviewerRole: "hr_admin",
    reviewReason: "Request cancelled after schedule change.",
    requesterIp: "103.57.92.16"
  },
  {
    id: "req-demo-008",
    employeeId: "emp-demo-013",
    benefitId: "benefit-digital-wellness",
    status: "approved",
    createdAt: "2026-03-05T16:10:00.000Z",
    updatedAt: "2026-03-05T16:55:00.000Z",
    reviewedBy: "emp-demo-008",
    reviewerRole: "hr_admin",
    reviewReason: "Core wellness access enabled.",
    requesterIp: "103.57.92.17"
  }
];

const syncRunSeeds: SyncRunSeed[] = [
  {
    id: "sync-demo-okr-001",
    syncType: "okr",
    source: "workday-demo-feed",
    status: "completed",
    recordCount: 24,
    initiatedBy: "emp-demo-017",
    startedAt: "2026-03-02T07:00:00.000Z",
    finishedAt: "2026-03-02T07:04:00.000Z",
    summary: {
      updated: 24,
      recomputed: 24,
      missing: 0,
      errors: 0
    }
  },
  {
    id: "sync-demo-attendance-001",
    syncType: "attendance",
    source: "kiosk-demo-feed",
    status: "completed",
    recordCount: 24,
    initiatedBy: "emp-demo-009",
    startedAt: "2026-03-02T07:10:00.000Z",
    finishedAt: "2026-03-02T07:14:00.000Z",
    summary: {
      updated: 24,
      recomputed: 24,
      missing: 0,
      errors: 0
    }
  },
  {
    id: "sync-demo-okr-002",
    syncType: "okr",
    source: "manual-reconciliation",
    status: "partial",
    recordCount: 6,
    initiatedBy: "emp-demo-008",
    startedAt: "2026-03-06T08:00:00.000Z",
    finishedAt: "2026-03-06T08:03:00.000Z",
    summary: {
      updated: 4,
      recomputed: 4,
      missing: 2,
      errors: 0
    }
  },
  {
    id: "sync-demo-attendance-002",
    syncType: "attendance",
    source: "manual-correction",
    status: "completed",
    recordCount: 3,
    initiatedBy: "emp-demo-009",
    startedAt: "2026-03-06T08:15:00.000Z",
    finishedAt: "2026-03-06T08:18:00.000Z",
    summary: {
      updated: 3,
      recomputed: 3,
      missing: 0,
      errors: 0
    }
  }
];

function fail(message: string): never {
  throw new Error(message);
}

function escapeSql(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function toSqlText(value: string | null | undefined): string {
  return value == null ? "NULL" : escapeSql(value);
}

function parseDemoEmployees(filePath: string): Map<string, DemoEmployeeRecord> {
  const content = readFileSync(resolve(process.cwd(), filePath), "utf8").trim();
  const [headerRow, ...rows] = content.split(/\r?\n/);
  const headers = headerRow.split(",");
  const idIndex = headers.indexOf("id");
  const emailIndex = headers.indexOf("email");
  const roleIndex = headers.indexOf("role");

  if (idIndex === -1 || emailIndex === -1 || roleIndex === -1) {
    fail("demo employee dataset must include id, email, and role columns");
  }

  return new Map(
    rows.map((row) => {
      const columns = row.split(",");
      const record: DemoEmployeeRecord = {
        id: columns[idIndex]!,
        email: columns[emailIndex]!,
        role: columns[roleIndex]!
      };

      return [record.id, record];
    })
  );
}

function loadContractManifest(filePath: string): Map<string, ContractManifestEntry> {
  const manifest = JSON.parse(
    readFileSync(resolve(process.cwd(), filePath), "utf8")
  ) as ContractManifestEntry[];

  return new Map(manifest.map((entry) => [entry.id, entry]));
}

function toSha256(filePath: string): string {
  return createHash("sha256").update(readFileSync(resolve(process.cwd(), filePath))).digest("hex");
}

function main() {
  const demoEmployees = parseDemoEmployees(DEMO_EMPLOYEE_DATASET);
  const contracts = loadContractManifest(CONTRACT_MANIFEST_PATH);
  const benefitMap = new Map(benefitCatalog.map((benefit) => [benefit.id, benefit]));
  const statements: string[] = ["BEGIN TRANSACTION;"];

  for (const request of requestSeeds) {
    const employee = demoEmployees.get(request.employeeId);
    const benefit = benefitMap.get(request.benefitId);

    if (!employee) {
      fail(`Unknown employee id in request seed: ${request.employeeId}`);
    }

    if (!benefit) {
      fail(`Unknown benefit id in request seed: ${request.benefitId}`);
    }

    let contractVersion: string | null = null;
    let contractAcceptedAt: string | null = null;

    let acceptanceStatement: string | null = null;

    if (request.contractId) {
      const contract = contracts.get(request.contractId);

      if (!contract) {
        fail(`Unknown contract id in request seed: ${request.contractId}`);
      }

      contractVersion = contract.version;
      contractAcceptedAt = request.createdAt;
      const contractHash = toSha256(contract.filePath);
      const acceptanceLogId = `cal-${request.id}`;

      acceptanceStatement = [
        [
          "INSERT INTO contract_acceptance_logs (",
          "  id,",
          "  employee_id,",
          "  contract_id,",
          "  contract_version,",
          "  contract_hash,",
          "  accepted_at,",
          "  ip_address,",
          "  request_id,",
          "  created_at",
          ") VALUES (",
          `  ${escapeSql(acceptanceLogId)},`,
          `  ${escapeSql(request.employeeId)},`,
          `  ${escapeSql(request.contractId)},`,
          `  ${escapeSql(contract.version)},`,
          `  ${escapeSql(contractHash)},`,
          `  ${escapeSql(request.createdAt)},`,
          `  ${escapeSql(request.requesterIp ?? "0.0.0.0")},`,
          `  ${escapeSql(request.id)},`,
          `  ${escapeSql(request.createdAt)}`,
          ")",
          "ON CONFLICT(id) DO UPDATE SET",
          "  employee_id = excluded.employee_id,",
          "  contract_id = excluded.contract_id,",
          "  contract_version = excluded.contract_version,",
          "  contract_hash = excluded.contract_hash,",
          "  accepted_at = excluded.accepted_at,",
          "  ip_address = excluded.ip_address,",
          "  request_id = excluded.request_id,",
          "  created_at = excluded.created_at;"
        ].join("\n")
      ].join("\n");
    }

    statements.push(
      [
        "INSERT INTO benefit_requests (",
        "  id,",
        "  employee_id,",
        "  benefit_id,",
        "  status,",
        "  contract_version_accepted,",
        "  contract_accepted_at,",
        "  reviewed_by,",
        "  created_at,",
        "  updated_at",
        ") VALUES (",
        `  ${escapeSql(request.id)},`,
        `  ${escapeSql(request.employeeId)},`,
        `  ${escapeSql(request.benefitId)},`,
        `  ${escapeSql(request.status)},`,
        `  ${toSqlText(contractVersion)},`,
        `  ${toSqlText(contractAcceptedAt)},`,
        `  ${toSqlText(request.reviewedBy)},`,
        `  ${escapeSql(request.createdAt)},`,
        `  ${escapeSql(request.updatedAt)}`,
        ")",
        "ON CONFLICT(id) DO UPDATE SET",
        "  employee_id = excluded.employee_id,",
        "  benefit_id = excluded.benefit_id,",
        "  status = excluded.status,",
        "  contract_version_accepted = excluded.contract_version_accepted,",
        "  contract_accepted_at = excluded.contract_accepted_at,",
        "  reviewed_by = excluded.reviewed_by,",
        "  created_at = excluded.created_at,",
        "  updated_at = excluded.updated_at;"
      ].join("\n")
    );

    if (acceptanceStatement) {
      statements.push(acceptanceStatement);
    }

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
        "  payload_json,",
        "  created_at",
        ") VALUES (",
        `  ${escapeSql(`audit-requested-${request.id}`)},`,
        `  ${escapeSql(request.employeeId)},`,
        `  ${escapeSql(request.benefitId)},`,
        `  ${escapeSql(request.employeeId)},`,
        "  'employee',",
        "  'benefit_requested',",
        "  'benefit_request',",
        `  ${escapeSql(request.id)},`,
        "  'Employee submitted benefit request',",
        `  ${escapeSql(
          JSON.stringify({
            requestId: request.id,
            benefitId: request.benefitId,
            requiresContract: benefit.requiresContract,
            contractId: request.contractId ?? null
          })
        )},`,
        `  ${escapeSql(request.createdAt)}`,
        ")",
        "ON CONFLICT(id) DO UPDATE SET",
        "  employee_id = excluded.employee_id,",
        "  benefit_id = excluded.benefit_id,",
        "  actor_id = excluded.actor_id,",
        "  actor_role = excluded.actor_role,",
        "  action = excluded.action,",
        "  entity_type = excluded.entity_type,",
        "  entity_id = excluded.entity_id,",
        "  reason = excluded.reason,",
        "  payload_json = excluded.payload_json,",
        "  created_at = excluded.created_at;"
      ].join("\n")
    );

    statements.push(
      [
        "INSERT INTO notification_events (",
        "  id,",
        "  event_type,",
        "  audience,",
        "  recipient_employee_id,",
        "  recipient_email,",
        "  status,",
        "  source_entity_type,",
        "  source_entity_id,",
        "  payload_json,",
        "  dispatched_at,",
        "  failed_at,",
        "  last_error,",
        "  created_at,",
        "  updated_at",
        ") VALUES (",
        `  ${escapeSql(`notif-submitted-${request.id}`)},`,
        "  'benefit_request_submitted',",
        "  'hr_admins',",
        "  NULL,",
        "  NULL,",
        `  ${escapeSql(request.status === "pending" ? "pending" : "sent")},`,
        "  'benefit_request',",
        `  ${escapeSql(request.id)},`,
        `  ${escapeSql(
          JSON.stringify({
            requestId: request.id,
            employeeId: request.employeeId,
            employeeEmail: employee.email,
            benefitId: benefit.id,
            benefitSlug: benefit.slug,
            benefitName: benefit.name
          })
        )},`,
        `  ${request.status === "pending" ? "NULL" : escapeSql(request.updatedAt)},`,
        "  NULL,",
        "  NULL,",
        `  ${escapeSql(request.createdAt)},`,
        `  ${escapeSql(request.updatedAt)}`,
        ")",
        "ON CONFLICT(id) DO UPDATE SET",
        "  event_type = excluded.event_type,",
        "  audience = excluded.audience,",
        "  recipient_employee_id = excluded.recipient_employee_id,",
        "  recipient_email = excluded.recipient_email,",
        "  status = excluded.status,",
        "  source_entity_type = excluded.source_entity_type,",
        "  source_entity_id = excluded.source_entity_id,",
        "  payload_json = excluded.payload_json,",
        "  dispatched_at = excluded.dispatched_at,",
        "  failed_at = excluded.failed_at,",
        "  last_error = excluded.last_error,",
        "  created_at = excluded.created_at,",
        "  updated_at = excluded.updated_at;"
      ].join("\n")
    );

    if (benefit.requiresFinanceApproval) {
      statements.push(
        [
          "INSERT INTO notification_events (",
          "  id,",
          "  event_type,",
          "  audience,",
          "  recipient_employee_id,",
          "  recipient_email,",
          "  status,",
          "  source_entity_type,",
          "  source_entity_id,",
          "  payload_json,",
          "  dispatched_at,",
          "  failed_at,",
          "  last_error,",
          "  created_at,",
          "  updated_at",
          ") VALUES (",
          `  ${escapeSql(`notif-finance-${request.id}`)},`,
          "  'benefit_request_finance_review_required',",
          "  'finance_managers',",
          "  NULL,",
          "  NULL,",
          `  ${escapeSql(request.status === "pending" ? "pending" : "sent")},`,
          "  'benefit_request',",
          `  ${escapeSql(request.id)},`,
          `  ${escapeSql(
            JSON.stringify({
              requestId: request.id,
              employeeId: request.employeeId,
              employeeEmail: employee.email,
              benefitId: benefit.id,
              benefitSlug: benefit.slug,
              benefitName: benefit.name
            })
          )},`,
          `  ${request.status === "pending" ? "NULL" : escapeSql(request.updatedAt)},`,
          "  NULL,",
          "  NULL,",
          `  ${escapeSql(request.createdAt)},`,
          `  ${escapeSql(request.updatedAt)}`,
          ")",
          "ON CONFLICT(id) DO UPDATE SET",
          "  event_type = excluded.event_type,",
          "  audience = excluded.audience,",
          "  recipient_employee_id = excluded.recipient_employee_id,",
          "  recipient_email = excluded.recipient_email,",
          "  status = excluded.status,",
          "  source_entity_type = excluded.source_entity_type,",
          "  source_entity_id = excluded.source_entity_id,",
          "  payload_json = excluded.payload_json,",
          "  dispatched_at = excluded.dispatched_at,",
          "  failed_at = excluded.failed_at,",
          "  last_error = excluded.last_error,",
          "  created_at = excluded.created_at,",
          "  updated_at = excluded.updated_at;"
        ].join("\n")
      );
    }

    if (benefit.requiresManagerApproval) {
      statements.push(
        [
          "INSERT INTO notification_events (",
          "  id,",
          "  event_type,",
          "  audience,",
          "  recipient_employee_id,",
          "  recipient_email,",
          "  status,",
          "  source_entity_type,",
          "  source_entity_id,",
          "  payload_json,",
          "  dispatched_at,",
          "  failed_at,",
          "  last_error,",
          "  created_at,",
          "  updated_at",
          ") VALUES (",
          `  ${escapeSql(`notif-manager-${request.id}`)},`,
          "  'benefit_request_manager_review_required',",
          "  'managers',",
          "  NULL,",
          "  NULL,",
          `  ${escapeSql(request.status === "pending" ? "pending" : "sent")},`,
          "  'benefit_request',",
          `  ${escapeSql(request.id)},`,
          `  ${escapeSql(
            JSON.stringify({
              requestId: request.id,
              employeeId: request.employeeId,
              employeeEmail: employee.email,
              benefitId: benefit.id,
              benefitSlug: benefit.slug,
              benefitName: benefit.name
            })
          )},`,
          `  ${request.status === "pending" ? "NULL" : escapeSql(request.updatedAt)},`,
          "  NULL,",
          "  NULL,",
          `  ${escapeSql(request.createdAt)},`,
          `  ${escapeSql(request.updatedAt)}`,
          ")",
          "ON CONFLICT(id) DO UPDATE SET",
          "  event_type = excluded.event_type,",
          "  audience = excluded.audience,",
          "  recipient_employee_id = excluded.recipient_employee_id,",
          "  recipient_email = excluded.recipient_email,",
          "  status = excluded.status,",
          "  source_entity_type = excluded.source_entity_type,",
          "  source_entity_id = excluded.source_entity_id,",
          "  payload_json = excluded.payload_json,",
          "  dispatched_at = excluded.dispatched_at,",
          "  failed_at = excluded.failed_at,",
          "  last_error = excluded.last_error,",
          "  created_at = excluded.created_at,",
          "  updated_at = excluded.updated_at;"
        ].join("\n")
      );
    }

    if (request.reviewedBy && request.reviewerRole) {
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
          "  payload_json,",
          "  created_at",
          ") VALUES (",
          `  ${escapeSql(`audit-reviewed-${request.id}`)},`,
          `  ${escapeSql(request.employeeId)},`,
          `  ${escapeSql(request.benefitId)},`,
          `  ${escapeSql(request.reviewedBy)},`,
          `  ${escapeSql(request.reviewerRole)},`,
          "  'benefit_request_reviewed',",
          "  'benefit_request',",
          `  ${escapeSql(request.id)},`,
          `  ${toSqlText(request.reviewReason ?? null)},`,
          `  ${escapeSql(
            JSON.stringify({
              requestId: request.id,
              previousStatus: "pending",
              nextStatus: request.status,
              reviewedAt: request.updatedAt
            })
          )},`,
          `  ${escapeSql(request.updatedAt)}`,
          ")",
          "ON CONFLICT(id) DO UPDATE SET",
          "  employee_id = excluded.employee_id,",
          "  benefit_id = excluded.benefit_id,",
          "  actor_id = excluded.actor_id,",
          "  actor_role = excluded.actor_role,",
          "  action = excluded.action,",
          "  entity_type = excluded.entity_type,",
          "  entity_id = excluded.entity_id,",
          "  reason = excluded.reason,",
          "  payload_json = excluded.payload_json,",
          "  created_at = excluded.created_at;"
        ].join("\n")
      );

      statements.push(
        [
          "INSERT INTO notification_events (",
          "  id,",
          "  event_type,",
          "  audience,",
          "  recipient_employee_id,",
          "  recipient_email,",
          "  status,",
          "  source_entity_type,",
          "  source_entity_id,",
          "  payload_json,",
          "  dispatched_at,",
          "  failed_at,",
          "  last_error,",
          "  created_at,",
          "  updated_at",
          ") VALUES (",
          `  ${escapeSql(`notif-reviewed-${request.id}`)},`,
          "  'benefit_request_reviewed',",
          "  'employee',",
          `  ${escapeSql(request.employeeId)},`,
          `  ${escapeSql(employee.email)},`,
          "  'sent',",
          "  'benefit_request',",
          `  ${escapeSql(request.id)},`,
          `  ${escapeSql(
            JSON.stringify({
              requestId: request.id,
              employeeId: request.employeeId,
              benefitId: request.benefitId,
              status: request.status,
              reason: request.reviewReason ?? null,
              reviewedBy: request.reviewedBy,
              reviewerRole: request.reviewerRole
            })
          )},`,
          `  ${escapeSql(request.updatedAt)},`,
          "  NULL,",
          "  NULL,",
          `  ${escapeSql(request.updatedAt)},`,
          `  ${escapeSql(request.updatedAt)}`,
          ")",
          "ON CONFLICT(id) DO UPDATE SET",
          "  event_type = excluded.event_type,",
          "  audience = excluded.audience,",
          "  recipient_employee_id = excluded.recipient_employee_id,",
          "  recipient_email = excluded.recipient_email,",
          "  status = excluded.status,",
          "  source_entity_type = excluded.source_entity_type,",
          "  source_entity_id = excluded.source_entity_id,",
          "  payload_json = excluded.payload_json,",
          "  dispatched_at = excluded.dispatched_at,",
          "  failed_at = excluded.failed_at,",
          "  last_error = excluded.last_error,",
          "  created_at = excluded.created_at,",
          "  updated_at = excluded.updated_at;"
        ].join("\n")
      );
    }
  }

  for (const syncRun of syncRunSeeds) {
    statements.push(
      [
        "INSERT INTO sync_runs (",
        "  id,",
        "  sync_type,",
        "  source,",
        "  status,",
        "  record_count,",
        "  initiated_by,",
        "  payload_json,",
        "  summary_json,",
        "  started_at,",
        "  finished_at,",
        "  created_at,",
        "  updated_at",
        ") VALUES (",
        `  ${escapeSql(syncRun.id)},`,
        `  ${escapeSql(syncRun.syncType)},`,
        `  ${escapeSql(syncRun.source)},`,
        `  ${escapeSql(syncRun.status)},`,
        `  ${syncRun.recordCount},`,
        `  ${escapeSql(syncRun.initiatedBy)},`,
        `  ${escapeSql(JSON.stringify({ recordCount: syncRun.recordCount, source: syncRun.source }))},`,
        `  ${escapeSql(JSON.stringify(syncRun.summary))},`,
        `  ${escapeSql(syncRun.startedAt)},`,
        `  ${escapeSql(syncRun.finishedAt)},`,
        `  ${escapeSql(syncRun.startedAt)},`,
        `  ${escapeSql(syncRun.finishedAt)}`,
        ")",
        "ON CONFLICT(id) DO UPDATE SET",
        "  sync_type = excluded.sync_type,",
        "  source = excluded.source,",
        "  status = excluded.status,",
        "  record_count = excluded.record_count,",
        "  initiated_by = excluded.initiated_by,",
        "  payload_json = excluded.payload_json,",
        "  summary_json = excluded.summary_json,",
        "  started_at = excluded.started_at,",
        "  finished_at = excluded.finished_at,",
        "  created_at = excluded.created_at,",
        "  updated_at = excluded.updated_at;"
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
        "  payload_json,",
        "  created_at",
        ") VALUES (",
        `  ${escapeSql(`audit-${syncRun.id}`)},`,
        "  NULL,",
        "  NULL,",
        `  ${escapeSql(syncRun.initiatedBy)},`,
        `  ${escapeSql(syncRun.initiatedBy === "emp-demo-009" ? "finance_manager" : "hr_admin")},`,
        `  ${escapeSql(syncRun.syncType === "okr" ? "okr_sync_ingested" : "attendance_sync_ingested")},`,
        "  'sync_run',",
        `  ${escapeSql(syncRun.id)},`,
        `  ${escapeSql(`${syncRun.syncType} sync ${syncRun.status}`)},`,
        `  ${escapeSql(JSON.stringify(syncRun.summary))},`,
        `  ${escapeSql(syncRun.finishedAt)}`,
        ")",
        "ON CONFLICT(id) DO UPDATE SET",
        "  employee_id = excluded.employee_id,",
        "  benefit_id = excluded.benefit_id,",
        "  actor_id = excluded.actor_id,",
        "  actor_role = excluded.actor_role,",
        "  action = excluded.action,",
        "  entity_type = excluded.entity_type,",
        "  entity_id = excluded.entity_id,",
        "  reason = excluded.reason,",
        "  payload_json = excluded.payload_json,",
        "  created_at = excluded.created_at;"
      ].join("\n")
    );
  }

  statements.push("COMMIT;");
  process.stdout.write(`${statements.join("\n\n")}\n`);
}

main();
