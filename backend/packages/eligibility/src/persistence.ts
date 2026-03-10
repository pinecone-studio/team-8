import type { BenefitEvaluationResult, EmployeeSnapshot } from "./evaluator.js";
import { evaluateAllBenefits } from "./evaluator.js";

export type EligibilityTrigger =
  | "login"
  | "data_import"
  | "okr_sync"
  | "attendance_import"
  | "manual_override"
  | "responsibility_change"
  | "hire_date_change"
  | "role_change";

export type ActorRole = "system" | "employee" | "hr_admin" | "finance_manager";

export interface ActorContext {
  actorId: string;
  actorRole: ActorRole;
}

export interface BenefitEligibilityWriteModel {
  employeeId: string;
  benefitId: string;
  status: BenefitEvaluationResult["status"];
  ruleEvaluationJson: string;
  computedAt: string;
  overrideBy: string | null;
  overrideReason: string | null;
  overrideExpiresAt: string | null;
}

export interface AuditLogWriteModel {
  id: string;
  employeeId: string;
  benefitId: string;
  actorId: string;
  actorRole: ActorRole;
  action: "eligibility_computed";
  entityType: "benefit_eligibility";
  entityId: string;
  reason: string;
  payloadJson: string;
}

export interface EligibilityPersistenceBundle {
  evaluations: BenefitEvaluationResult[];
  benefitEligibilityRows: BenefitEligibilityWriteModel[];
  auditLogRows: AuditLogWriteModel[];
  cacheKeysToInvalidate: string[];
}

export function getEligibilityCacheKeys(employeeId: string): string[] {
  return [
    `employee:${employeeId}:benefits`,
    `employee:${employeeId}:eligibility`,
    `employee:${employeeId}:dashboard`
  ];
}

export function buildEligibilityPersistenceBundle(input: {
  employee: EmployeeSnapshot;
  trigger: EligibilityTrigger;
  actor: ActorContext;
  computedAt?: string;
}): EligibilityPersistenceBundle {
  const computedAt = input.computedAt ?? new Date().toISOString();
  const evaluations = evaluateAllBenefits(input.employee);

  const benefitEligibilityRows = evaluations.map((evaluation) => ({
    employeeId: input.employee.id,
    benefitId: evaluation.benefitId,
    status: evaluation.status,
    ruleEvaluationJson: JSON.stringify(evaluation.evaluations),
    computedAt,
    overrideBy: null,
    overrideReason: null,
    overrideExpiresAt: null
  }));

  const auditLogRows = evaluations.map((evaluation) => ({
    id: crypto.randomUUID(),
    employeeId: input.employee.id,
    benefitId: evaluation.benefitId,
    actorId: input.actor.actorId,
    actorRole: input.actor.actorRole,
    action: "eligibility_computed" as const,
    entityType: "benefit_eligibility" as const,
    entityId: `${input.employee.id}:${evaluation.benefitId}`,
    reason: `Eligibility recomputed from ${input.trigger}`,
    payloadJson: JSON.stringify({
      trigger: input.trigger,
      computedAt,
      benefitSlug: evaluation.benefitSlug,
      benefitName: evaluation.benefitName,
      status: evaluation.status,
      evaluations: evaluation.evaluations
    })
  }));

  return {
    evaluations,
    benefitEligibilityRows,
    auditLogRows,
    cacheKeysToInvalidate: getEligibilityCacheKeys(input.employee.id)
  };
}
