import type {
  BenefitRule,
  BenefitContractAcceptance,
  Employee,
} from "../../../db/schema";

export type EligibilityStatus = "eligible" | "ineligible" | "requires_approval";

type RuleCondition = {
  allowed?: string[];
  disallowed?: string[];
  required?: boolean;
  maxLateArrivals?: number;
  min?: number;
  minDays?: number;
  vendor?: string;
  minScore?: number;
  probationMaxDays?: number;
  activeMaxDays?: number;
  requiresOkrForFull?: boolean;
};

const approvalRuleTypes = new Set([
  "contract_acceptance",
  "manager_approval",
  "finance_approval",
]);

export function evaluateBenefitEligibility(params: {
  employee: Employee;
  rules: BenefitRule[];
  requestedUnits?: number;
  contractAcceptances: BenefitContractAcceptance[];
}): { status: EligibilityStatus; blockingMessages: string[] } {
  const { employee, rules, requestedUnits, contractAcceptances } = params;
  const blockingMessages: string[] = [];
  let hasApprovalBlock = false;

  for (const rule of rules) {
    const condition = parseCondition(rule.conditionJson);
    const ruleType = rule.ruleType;
    const message = rule.blockingMessage || "Eligibility rule not met.";

    if (ruleType === "employment_status") {
      const allowed = condition.allowed;
      const disallowed = condition.disallowed;
      if (allowed && !allowed.includes(employee.employmentStatus)) {
        blockingMessages.push(message);
        continue;
      }
      if (disallowed && disallowed.includes(employee.employmentStatus)) {
        blockingMessages.push(message);
      }
      continue;
    }

    if (ruleType === "okr_gate") {
      const required = condition.required ?? true;
      if (required && employee.okrSubmitted <= 0) {
        blockingMessages.push(message);
      }
      continue;
    }

    if (ruleType === "attendance_gate") {
      const maxLateArrivals = condition.maxLateArrivals ?? 0;
      if (employee.lateArrivalCount >= maxLateArrivals) {
        blockingMessages.push(message);
      }
      continue;
    }

    if (ruleType === "responsibility_level") {
      const min = condition.min ?? 1;
      if (employee.responsibilityLevel < min) {
        blockingMessages.push(message);
      }
      continue;
    }

    if (ruleType === "role") {
      const allowed = condition.allowed ?? [];
      if (!allowed.includes(employee.role)) {
        blockingMessages.push(message);
      }
      continue;
    }

    if (ruleType === "tenure") {
      const minDays = condition.minDays ?? 0;
      const daysSinceHire = daysSince(employee.hireDate);
      if (daysSinceHire < minDays) {
        blockingMessages.push(message);
      }
      continue;
    }

    if (ruleType === "okr_score") {
      const minScore = condition.minScore ?? 0;
      if (employee.okrScore < minScore || employee.okrSubmitted <= 0) {
        blockingMessages.push(message);
      }
      continue;
    }

    if (ruleType === "allocation") {
      if (!requestedUnits || requestedUnits <= 0) {
        continue;
      }
      const probationMax = condition.probationMaxDays ?? 1;
      const activeMax = condition.activeMaxDays ?? 3;
      if (
        employee.employmentStatus === "probation" &&
        requestedUnits > probationMax
      ) {
        blockingMessages.push(message);
        continue;
      }
      if (
        employee.employmentStatus === "active" &&
        requestedUnits > activeMax
      ) {
        blockingMessages.push(message);
        continue;
      }
      if (condition.requiresOkrForFull && employee.okrSubmitted <= 0) {
        blockingMessages.push(message);
      }
      continue;
    }

    if (approvalRuleTypes.has(ruleType)) {
      if (ruleType === "contract_acceptance") {
        const vendor = condition.vendor;
        const hasAcceptance = vendor
          ? contractAcceptances.some((a) => a.vendor === vendor)
          : false;
        if (!hasAcceptance) {
          hasApprovalBlock = true;
          blockingMessages.push(message);
        }
        continue;
      }

      hasApprovalBlock = true;
      blockingMessages.push(message);
    }
  }

  if (blockingMessages.length === 0) {
    return { status: "eligible", blockingMessages };
  }

  if (hasApprovalBlock) {
    return { status: "requires_approval", blockingMessages };
  }

  return { status: "ineligible", blockingMessages };
}

function parseCondition(conditionJson: string): RuleCondition {
  try {
    return JSON.parse(conditionJson) as RuleCondition;
  } catch {
    return {};
  }
}

function daysSince(dateIso: string): number {
  const ms = Date.now() - new Date(dateIso).getTime();
  if (Number.isNaN(ms)) return 0;
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}
