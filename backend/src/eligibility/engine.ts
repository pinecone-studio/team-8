import type { Employee } from "../db/employee";
import type {
  BenefitConfig,
  EligibilityConfig,
  RuleConfig,
  RuleEvaluation,
  EligibilityDisplayStatus,
  ComputeStatusResult,
} from "../config/types";
import configJson from "../config/eligibility-rules.json";

const eligibilityConfig = configJson as EligibilityConfig;

/** Get benefit config by id */
export function getBenefitConfig(benefitId: string): BenefitConfig | undefined {
  return eligibilityConfig.benefits[benefitId];
}

/** Get all benefit configs (catalog) */
export function getAllBenefitConfigs(): BenefitConfig[] {
  return Object.values(eligibilityConfig.benefits);
}

/** Compute tenure in days from hire_date (ISO string) to now */
function getTenureDays(hireDate: string): number {
  const start = new Date(hireDate).getTime();
  const now = Date.now();
  return Math.floor((now - start) / (24 * 60 * 60 * 1000));
}

/** Resolve employee field value for a rule type */
function getEmployeeValue(
  employee: Employee,
  ruleType: RuleConfig["type"]
): string | number | boolean {
  switch (ruleType) {
    case "employment_status":
      return employee.employmentStatus;
    case "okr_submitted":
      return Boolean(employee.okrSubmitted);
    case "attendance":
      return employee.lateArrivalCount;
    case "responsibility_level":
      return employee.responsibilityLevel;
    case "role":
      return employee.role;
    case "tenure_days":
      return getTenureDays(employee.hireDate);
    default:
      return undefined as unknown as string;
  }
}

/** Evaluate one rule against employee */
function evaluateRule(
  rule: RuleConfig,
  employee: Employee
): { passed: boolean; reason: string } {
  const actual = getEmployeeValue(employee, rule.type);
  const expected = rule.value;

  let passed = false;
  switch (rule.operator) {
    case "eq":
      passed = actual === expected;
      break;
    case "neq":
      passed = actual !== expected;
      break;
    case "gte":
      passed = Number(actual) >= Number(expected);
      break;
    case "gt":
      passed = Number(actual) > Number(expected);
      break;
    case "lte":
      passed = Number(actual) <= Number(expected);
      break;
    case "lt":
      passed = Number(actual) < Number(expected);
      break;
    case "in":
      passed = Array.isArray(expected) && expected.includes(String(actual));
      break;
    case "not_in":
      passed = Array.isArray(expected) && !expected.includes(String(actual));
      break;
    default:
      passed = false;
  }

  const reason = passed
    ? `Passed: ${rule.type} ${rule.operator} ${JSON.stringify(expected)}`
    : rule.errorMessage;
  return { passed, reason };
}

/** Evaluate all rules for one benefit. AND logic: all must pass for eligible. */
export function evaluateBenefit(
  employee: Employee,
  benefitId: string
): {
  benefitId: string;
  status: "eligible" | "locked";
  ruleEvaluation: RuleEvaluation[];
  failedRule?: { ruleType: string; errorMessage: string };
} {
  const benefit = getBenefitConfig(benefitId);
  if (!benefit) {
    return {
      benefitId,
      status: "locked",
      ruleEvaluation: [],
      failedRule: { ruleType: "unknown", errorMessage: "Unknown benefit." },
    };
  }

  const ruleEvaluation: RuleEvaluation[] = [];
  for (const rule of benefit.rules) {
    const { passed, reason } = evaluateRule(rule, employee);
    ruleEvaluation.push({ ruleType: rule.type, passed, reason });
    if (!passed) {
      return {
        benefitId,
        status: "locked",
        ruleEvaluation,
        failedRule: { ruleType: rule.type, errorMessage: rule.errorMessage },
      };
    }
  }

  return {
    benefitId,
    status: "eligible",
    ruleEvaluation,
  };
}

/** Evaluate eligibility for all benefits in config. */
export function evaluateAllBenefits(employee: Employee): ReturnType<typeof evaluateBenefit>[] {
  const benefitIds = Object.keys(eligibilityConfig.benefits);
  return benefitIds.map((benefitId) => evaluateBenefit(employee, benefitId));
}

/**
 * Employee + rules (+ optional request status) → ACTIVE | ELIGIBLE | LOCKED | PENDING.
 * Dashboard status (TDD FR-01). Testable without GraphQL.
 */
export function computeStatus(
  employee: Employee,
  benefitId: string,
  requestStatus?: "pending" | "approved" | "rejected" | "cancelled" | null
): ComputeStatusResult {
  const evaluated = evaluateBenefit(employee, benefitId);

  if (evaluated.status === "locked") {
    return {
      benefitId: evaluated.benefitId,
      status: "LOCKED",
      ruleEvaluation: evaluated.ruleEvaluation,
      failedRule: evaluated.failedRule,
    };
  }

  switch (requestStatus) {
    case "approved":
      return {
        benefitId: evaluated.benefitId,
        status: "ACTIVE",
        ruleEvaluation: evaluated.ruleEvaluation,
      };
    case "pending":
      return {
        benefitId: evaluated.benefitId,
        status: "PENDING",
        ruleEvaluation: evaluated.ruleEvaluation,
      };
    default:
      return {
        benefitId: evaluated.benefitId,
        status: "ELIGIBLE",
        ruleEvaluation: evaluated.ruleEvaluation,
      };
  }
}

/** Compute display status for all benefits (with optional request status per benefit). */
export function computeAllStatuses(
  employee: Employee,
  requestStatusByBenefit?: Record<string, "pending" | "approved" | "rejected" | "cancelled">
): ComputeStatusResult[] {
  const benefitIds = Object.keys(eligibilityConfig.benefits);
  return benefitIds.map((benefitId) =>
    computeStatus(employee, benefitId, requestStatusByBenefit?.[benefitId])
  );
}
