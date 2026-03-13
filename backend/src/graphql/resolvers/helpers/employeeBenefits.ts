import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database } from "../../../db";
import type { Benefit, BenefitEligibility, EligibilityRule, Employee } from "../../../db";

type GraphqlBenefit = {
  category: string;
  employeePercent: number;
  flowType: "contract" | "normal";
  id: string;
  name: string;
  nameEng: string | null;
  optionsDescription: string | null;
  requiresContract: boolean;
  subsidyPercent: number;
  unitPrice: number | null;
  vendorName: string | null;
};

type RuleEvaluation = {
  passed: boolean;
  reason: string;
  ruleType: string;
};

type FailedRule = {
  errorMessage: string;
  ruleType: string;
};

type BenefitStatus = "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING";

type BenefitEligibilityResult = {
  benefit: GraphqlBenefit;
  benefitId: string;
  failedRule?: FailedRule;
  ruleEvaluation: RuleEvaluation[];
  status: BenefitStatus;
};

export function mapBenefitRecordToGraphql(benefit: Benefit): GraphqlBenefit {
  return {
    category: benefit.category,
    employeePercent: 100 - benefit.subsidyPercent,
    flowType: benefit.requiresContract ? "contract" : "normal",
    id: benefit.id,
    name: benefit.name,
    nameEng: null,
    optionsDescription: null,
    requiresContract: benefit.requiresContract,
    subsidyPercent: benefit.subsidyPercent,
    unitPrice: null,
    vendorName: benefit.vendorName ?? null,
  };
}

function getTenureDays(hireDate: string): number {
  const start = new Date(hireDate).getTime();
  const now = Date.now();
  return Math.floor((now - start) / (24 * 60 * 60 * 1000));
}

function getEmployeeValue(employee: Employee, ruleType: string): string | number | boolean {
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
      return "";
  }
}

function parseRuleValue(rawValue: string): unknown {
  try {
    return JSON.parse(rawValue);
  } catch {
    return rawValue;
  }
}

function evaluateRule(rule: EligibilityRule, employee: Employee): RuleEvaluation {
  const actual = getEmployeeValue(employee, rule.ruleType);
  const expected = parseRuleValue(rule.value);

  let passed = false;

  switch (rule.operator) {
    case "eq":
      passed =
        typeof expected === "boolean"
          ? Boolean(actual) === expected
          : typeof expected === "number"
            ? Number(actual) === expected
            : String(actual) === String(expected);
      break;
    case "neq":
      passed =
        typeof expected === "boolean"
          ? Boolean(actual) !== expected
          : typeof expected === "number"
            ? Number(actual) !== expected
            : String(actual) !== String(expected);
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
      passed =
        Array.isArray(expected) && expected.map(String).includes(String(actual));
      break;
    case "not_in":
      passed =
        Array.isArray(expected) && !expected.map(String).includes(String(actual));
      break;
    default:
      passed = false;
  }

  return {
    passed,
    reason: passed
      ? `Passed: ${rule.ruleType} ${rule.operator} ${JSON.stringify(expected)}`
      : rule.errorMessage,
    ruleType: rule.ruleType,
  };
}

function normalizeStatus(
  status: string | null | undefined,
  requestStatus?: string
): BenefitStatus {
  if (requestStatus === "approved") return "ACTIVE";
  if (requestStatus === "pending") return "PENDING";

  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "ACTIVE";
    case "ELIGIBLE":
      return "ELIGIBLE";
    case "PENDING":
      return "PENDING";
    default:
      return "LOCKED";
  }
}

function normalizeRuleEvaluation(rawJson: string | null | undefined): RuleEvaluation[] {
  if (!rawJson) return [];

  try {
    const parsed = JSON.parse(rawJson);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((entry) => ({
      passed: Boolean(
        typeof entry === "object" && entry !== null
          ? "passed" in entry
            ? entry.passed
            : entry.met
          : false
      ),
      reason:
        typeof entry === "object" && entry !== null
          ? String(entry.reason ?? entry.detail ?? "")
          : "",
      ruleType:
        typeof entry === "object" && entry !== null
          ? String(entry.ruleType ?? entry.rule_type ?? entry.label ?? "unknown")
          : "unknown",
    }));
  } catch {
    return [];
  }
}

function getLatestRequestStatusByBenefit(
  requests: Array<{ benefitId: string; createdAt: string; updatedAt: string; status: string }>
): Record<string, string> {
  const latestByBenefit: Record<
    string,
    { createdAt: string; updatedAt: string; status: string }
  > = {};

  for (const request of requests) {
    const existing = latestByBenefit[request.benefitId];
    if (!existing || request.updatedAt > existing.updatedAt) {
      latestByBenefit[request.benefitId] = request;
    }
  }

  return Object.fromEntries(
    Object.entries(latestByBenefit).map(([benefitId, request]) => [
      benefitId,
      request.status,
    ])
  );
}

function buildComputedEligibility(input: {
  benefit: Benefit;
  employee: Employee;
  requestStatus?: string;
  rules: EligibilityRule[];
}): BenefitEligibilityResult {
  const ruleEvaluation = input.rules.map((rule) => evaluateRule(rule, input.employee));
  const failedRuleEvaluation = ruleEvaluation.find((rule) => !rule.passed);

  return {
    benefit: mapBenefitRecordToGraphql(input.benefit),
    benefitId: input.benefit.id,
    failedRule: failedRuleEvaluation
      ? {
          errorMessage: failedRuleEvaluation.reason,
          ruleType: failedRuleEvaluation.ruleType,
        }
      : undefined,
    ruleEvaluation,
    status: failedRuleEvaluation
      ? "LOCKED"
      : normalizeStatus("ELIGIBLE", input.requestStatus),
  };
}

function buildStoredEligibility(input: {
  benefit: Benefit;
  requestStatus?: string;
  rules: EligibilityRule[];
  storedEligibility: BenefitEligibility;
}): BenefitEligibilityResult {
  const ruleEvaluation = normalizeRuleEvaluation(input.storedEligibility.ruleEvaluationJson);
  const failedRuleEvaluation = ruleEvaluation.find((rule) => !rule.passed);
  const fallbackFailedRule = input.rules.find(
    (rule) => rule.ruleType === failedRuleEvaluation?.ruleType
  );

  return {
    benefit: mapBenefitRecordToGraphql(input.benefit),
    benefitId: input.benefit.id,
    failedRule: failedRuleEvaluation
      ? {
          errorMessage:
            failedRuleEvaluation.reason ||
            fallbackFailedRule?.errorMessage ||
            "Eligibility requirements not met.",
          ruleType: failedRuleEvaluation.ruleType,
        }
      : undefined,
    ruleEvaluation,
    status: normalizeStatus(input.storedEligibility.status, input.requestStatus),
  };
}

/**
 * Get benefit eligibilities for an employee (shared by myBenefits, getEmployeeBenefits, Employee.benefits).
 */
export async function getBenefitsForEmployee(
  db: Database,
  employeeId: string
) {
  const employees = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.id, employeeId));
  const employee = employees[0];
  if (!employee) return [];

  const activeBenefits = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.isActive, true));

  const activeRules = await db
    .select()
    .from(schema.eligibilityRules)
    .where(eq(schema.eligibilityRules.isActive, true));

  const storedEligibilities = await db
    .select()
    .from(schema.benefitEligibility)
    .where(eq(schema.benefitEligibility.employeeId, employeeId));

  const requests = await db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.employeeId, employeeId));

  const requestStatusByBenefit = getLatestRequestStatusByBenefit(requests);
  const storedEligibilityByBenefit = Object.fromEntries(
    storedEligibilities.map((eligibility) => [eligibility.benefitId, eligibility])
  );
  const rulesByBenefit = activeRules.reduce<Record<string, EligibilityRule[]>>(
    (accumulator, rule) => {
      const existingRules = accumulator[rule.benefitId] ?? [];
      existingRules.push(rule);
      accumulator[rule.benefitId] = existingRules.sort(
        (left, right) => left.priority - right.priority
      );
      return accumulator;
    },
    {}
  );

  return activeBenefits.map((benefit) => {
    const storedEligibility = storedEligibilityByBenefit[benefit.id];
    const rules = rulesByBenefit[benefit.id] ?? [];
    const requestStatus = requestStatusByBenefit[benefit.id];

    if (storedEligibility) {
      return buildStoredEligibility({
        benefit,
        requestStatus,
        rules,
        storedEligibility,
      });
    }

    return buildComputedEligibility({
      benefit,
      employee,
      requestStatus,
      rules,
    });
  });
}
