import {
  buildEligibilityPersistenceBundle,
  type ActorRole,
  type EligibilityTrigger,
  type EmployeeSnapshot
} from "@ebms/eligibility";

import type { Env } from "./types";

const allowedTriggers = new Set<EligibilityTrigger>([
  "login",
  "okr_sync",
  "attendance_import",
  "manual_override",
  "responsibility_change",
  "hire_date_change",
  "role_change"
]);

interface EmployeeRow {
  id: string;
  role: string;
  responsibility_level: number;
  employment_status: EmployeeSnapshot["employmentStatus"];
  hire_date: string;
  okr_submitted: number;
  late_arrival_count: number;
}

export function isEligibilityTrigger(value: string): value is EligibilityTrigger {
  return allowedTriggers.has(value as EligibilityTrigger);
}

export async function loadEmployeeSnapshot(
  env: Env,
  employeeId: string
): Promise<EmployeeSnapshot | null> {
  const row = await env.DB.prepare(
    `SELECT
      id,
      role,
      responsibility_level,
      employment_status,
      hire_date,
      okr_submitted,
      late_arrival_count
    FROM employees
    WHERE id = ?`
  )
    .bind(employeeId)
    .first<EmployeeRow>();

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    role: row.role,
    responsibilityLevel: row.responsibility_level,
    employmentStatus: row.employment_status,
    hireDate: row.hire_date,
    okrSubmitted: Boolean(row.okr_submitted),
    lateArrivalCount: row.late_arrival_count
  };
}

export async function recomputeEmployeeEligibility(input: {
  env: Env;
  employeeId: string;
  trigger: EligibilityTrigger;
  actorId: string;
  actorRole: ActorRole;
}) {
  const employee = await loadEmployeeSnapshot(input.env, input.employeeId);

  if (!employee) {
    return null;
  }

  const bundle = buildEligibilityPersistenceBundle({
    employee,
    trigger: input.trigger,
    actor: {
      actorId: input.actorId,
      actorRole: input.actorRole
    }
  });

  const eligibilityStatements = bundle.benefitEligibilityRows.map((row) =>
    input.env.DB.prepare(
      `INSERT INTO benefit_eligibility (
        employee_id,
        benefit_id,
        status,
        rule_evaluation_json,
        computed_at,
        override_by,
        override_reason,
        override_expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
        status = excluded.status,
        rule_evaluation_json = excluded.rule_evaluation_json,
        computed_at = excluded.computed_at,
        override_by = excluded.override_by,
        override_reason = excluded.override_reason,
        override_expires_at = excluded.override_expires_at,
        updated_at = CURRENT_TIMESTAMP`
    ).bind(
      row.employeeId,
      row.benefitId,
      row.status,
      row.ruleEvaluationJson,
      row.computedAt,
      row.overrideBy,
      row.overrideReason,
      row.overrideExpiresAt
    )
  );

  const auditStatements = bundle.auditLogRows.map((row) =>
    input.env.DB.prepare(
      `INSERT INTO audit_logs (
        id,
        employee_id,
        benefit_id,
        actor_id,
        actor_role,
        action,
        entity_type,
        entity_id,
        reason,
        payload_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      row.id,
      row.employeeId,
      row.benefitId,
      row.actorId,
      row.actorRole,
      row.action,
      row.entityType,
      row.entityId,
      row.reason,
      row.payloadJson
    )
  );

  await input.env.DB.batch([...eligibilityStatements, ...auditStatements]);
  await Promise.all(bundle.cacheKeysToInvalidate.map((key) => input.env.ELIGIBILITY_CACHE.delete(key)));

  return bundle;
}
