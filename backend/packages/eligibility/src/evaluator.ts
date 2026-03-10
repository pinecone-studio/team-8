import type { BenefitRuleSeed, BenefitSeed } from "@ebms/config";
import { benefitCatalog } from "@ebms/config";

export interface EmployeeSnapshot {
  id: string;
  role: string;
  responsibilityLevel: number;
  employmentStatus: "active" | "probation" | "leave" | "terminated";
  hireDate: string;
  okrSubmitted: boolean;
  lateArrivalCount: number;
}

export interface RuleEvaluationResult {
  ruleId: string;
  ruleType: BenefitRuleSeed["ruleType"];
  passed: boolean;
  expected: BenefitRuleSeed["value"];
  actual: string | number | boolean | string[];
  errorMessage: string | null;
}

export interface BenefitEvaluationResult {
  benefitId: string;
  benefitSlug: string;
  benefitName: string;
  status: "eligible" | "locked";
  requiresContract: boolean;
  requiresFinanceApproval: boolean;
  requiresManagerApproval: boolean;
  evaluations: RuleEvaluationResult[];
}

function daysSinceHire(hireDate: string, now = new Date()): number {
  const hiredAt = new Date(hireDate);
  const msInDay = 1000 * 60 * 60 * 24;
  return Math.floor((now.getTime() - hiredAt.getTime()) / msInDay);
}

function resolveActualValue(employee: EmployeeSnapshot, rule: BenefitRuleSeed): RuleEvaluationResult["actual"] {
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

export function evaluateBenefit(
  employee: EmployeeSnapshot,
  benefit: BenefitSeed
): BenefitEvaluationResult {
  const evaluations = [...benefit.rules]
    .sort((left, right) => left.priority - right.priority)
    .map((rule) => evaluateRule(employee, rule));

  const status = evaluations.every((entry) => entry.passed) ? "eligible" : "locked";

  return {
    benefitId: benefit.id,
    benefitSlug: benefit.slug,
    benefitName: benefit.name,
    status,
    requiresContract: benefit.requiresContract,
    requiresFinanceApproval: benefit.requiresFinanceApproval,
    requiresManagerApproval: benefit.requiresManagerApproval,
    evaluations
  };
}

export function evaluateAllBenefits(employee: EmployeeSnapshot): BenefitEvaluationResult[] {
  return benefitCatalog.map((benefit) => evaluateBenefit(employee, benefit));
}
