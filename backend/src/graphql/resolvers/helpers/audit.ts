import { schema } from "../../../db";
import type { Database } from "../../../db";
import type { Employee } from "../../../db";
import { getInternalRole } from "../../../auth";

export type AuditActionType =
  | "REQUEST_SUBMITTED"
  | "REQUEST_CANCELLED"
  | "REQUEST_APPROVED"
  | "REQUEST_REJECTED"
  | "REQUEST_HR_APPROVED"
  | "REQUEST_FINANCE_APPROVED"
  | "CONTRACT_ACCEPTED"
  | "ELIGIBILITY_OVERRIDE_SET"
  | "ELIGIBILITY_RULE_CREATED"
  | "ELIGIBILITY_RULE_UPDATED"
  | "ELIGIBILITY_RULE_DELETED"
  | "CONTRACT_UPLOADED"
  | "EMPLOYEE_CONTRACT_UPLOADED"
  | "ENROLLMENT_CREATED"
  | "ENROLLMENT_SUSPENDED"
  | "ENROLLMENT_REACTIVATED"
  | "RULE_PROPOSAL_SUBMITTED"
  | "RULE_PROPOSAL_APPROVED"
  | "RULE_PROPOSAL_REJECTED"
  | "ATTENDANCE_IMPORT"
  | "ELIGIBILITY_RECOMPUTED"
  | "OKR_SYNC"
  | "OKR_EVENT"
  | "CONTRACT_EXPIRY_ALERT"
  | "CONTRACT_VIEWED";

export type AuditEntityType =
  | "benefit_request"
  | "benefit_eligibility"
  | "eligibility_rule"
  | "contract"
  | "employee_contract"
  | "enrollment"
  | "rule_proposal";

export interface WriteAuditLogParams {
  db: Database;
  actor: Employee | null;
  actionType: AuditActionType;
  entityType: AuditEntityType;
  entityId: string;
  targetEmployeeId?: string | null;
  benefitId?: string | null;
  requestId?: string | null;
  contractId?: string | null;
  reason?: string | null;
  before?: unknown;
  after?: unknown;
  metadata?: unknown;
  ipAddress?: string | null;
}

/** Append-only audit log write. Never updates existing rows. */
export async function writeAuditLog(params: WriteAuditLogParams): Promise<void> {
  const {
    db,
    actor,
    actionType,
    entityType,
    entityId,
    targetEmployeeId,
    benefitId,
    requestId,
    contractId,
    reason,
    before,
    after,
    metadata,
    ipAddress,
  } = params;

  const actorRole = getInternalRole(actor);

  await db.insert(schema.auditLogs).values({
    actorEmployeeId: actor?.id ?? null,
    actorRole,
    actionType,
    entityType,
    entityId,
    targetEmployeeId: targetEmployeeId ?? null,
    benefitId: benefitId ?? null,
    requestId: requestId ?? null,
    contractId: contractId ?? null,
    reason: reason ?? null,
    beforeJson: before !== undefined ? JSON.stringify(before) : null,
    afterJson: after !== undefined ? JSON.stringify(after) : null,
    metadataJson: metadata !== undefined ? JSON.stringify(metadata) : null,
    ipAddress: ipAddress ?? null,
  });
}
