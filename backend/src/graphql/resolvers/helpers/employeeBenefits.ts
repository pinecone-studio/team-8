import { and, eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database } from "../../../db";
import type { Benefit, BenefitEligibility, EligibilityRule, Employee } from "../../../db";

type GraphqlBenefit = {
  category: string;
  description: string | null;
  employeePercent: number;
  flowType: "contract" | "normal";
  id: string;
  isActive: boolean;
  name: string;
  nameEng: string | null;
  optionsDescription: string | null;
  requiresContract: boolean;
  subsidyPercent: number;
  unitPrice: number | null;
  vendorName: string | null;
  approvalPolicy: string;
  amount: number | null;
  location: string | null;
  imageUrl: string | null;
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
  overrideStatus?: string | null;
  overrideBy?: string | null;
  overrideReason?: string | null;
  overrideExpiresAt?: string | null;
};

const IN_FLIGHT_REQUEST_STATUSES = new Set([
  "pending",
  "awaiting_contract_acceptance",
  "awaiting_hr_review",
  "awaiting_finance_review",
  "hr_approved",
  "finance_approved",
]);

export function mapBenefitRecordToGraphql(benefit: Benefit): GraphqlBenefit {
  return {
    category: benefit.category,
    description: benefit.description ?? null,
    employeePercent: 100 - benefit.subsidyPercent,
    flowType: benefit.requiresContract ? "contract" : "normal",
    id: benefit.id,
    isActive: benefit.isActive,
    name: benefit.name,
    nameEng: null,
    optionsDescription: null,
    requiresContract: benefit.requiresContract,
    subsidyPercent: benefit.subsidyPercent,
    unitPrice: null,
    vendorName: benefit.vendorName ?? null,
    approvalPolicy: benefit.approvalPolicy ?? "hr",
    amount: benefit.amount ?? null,
    location: benefit.location ?? null,
    imageUrl: benefit.imageUrl ?? null,
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

function isOverrideActive(row: Pick<BenefitEligibility, "overrideStatus" | "overrideExpiresAt">): boolean {
  if (!row.overrideStatus) return false;
  if (!row.overrideExpiresAt) return true; // indefinite override
  return new Date(row.overrideExpiresAt) > new Date();
}

function normalizeStatus(
  status: string | null | undefined,
  requestStatus?: string
): BenefitStatus {
  if (requestStatus === "approved") return "ACTIVE";
  if (requestStatus && IN_FLIGHT_REQUEST_STATUSES.has(requestStatus)) return "PENDING";

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
  storedEligibility?: BenefitEligibility | null;
  isEnrolled?: boolean;
}): BenefitEligibilityResult {
  const { benefit, employee, requestStatus, rules, storedEligibility, isEnrolled } = input;

  // Phase 3: Check active override first
  if (storedEligibility && isOverrideActive(storedEligibility)) {
    const overrideStatusNorm = normalizeStatus(storedEligibility.overrideStatus ?? "eligible");
    return {
      benefit: mapBenefitRecordToGraphql(benefit),
      benefitId: benefit.id,
      ruleEvaluation: normalizeRuleEvaluation(storedEligibility.ruleEvaluationJson),
      status: overrideStatusNorm,
      overrideStatus: storedEligibility.overrideStatus,
      overrideBy: storedEligibility.overrideBy,
      overrideReason: storedEligibility.overrideReason,
      overrideExpiresAt: storedEligibility.overrideExpiresAt,
    };
  }

  // Phase 6: Active enrollment → ACTIVE
  if (isEnrolled) {
    const ruleEvaluation = rules.map((rule) => evaluateRule(rule, employee));
    return {
      benefit: mapBenefitRecordToGraphql(benefit),
      benefitId: benefit.id,
      ruleEvaluation,
      status: "ACTIVE",
    };
  }

  const ruleEvaluation = rules.map((rule) => evaluateRule(rule, employee));
  const failedRuleEvaluation = ruleEvaluation.find((rule) => !rule.passed);

  return {
    benefit: mapBenefitRecordToGraphql(benefit),
    benefitId: benefit.id,
    failedRule: failedRuleEvaluation
      ? {
          errorMessage: failedRuleEvaluation.reason,
          ruleType: failedRuleEvaluation.ruleType,
        }
      : undefined,
    ruleEvaluation,
    status: failedRuleEvaluation
      ? "LOCKED"
      : normalizeStatus("ELIGIBLE", requestStatus),
  };
}

function buildStoredEligibility(input: {
  benefit: Benefit;
  requestStatus?: string;
  rules: EligibilityRule[];
  storedEligibility: BenefitEligibility;
  employee: Employee;
  isEnrolled?: boolean;
}): BenefitEligibilityResult {
  const { benefit, requestStatus, rules, storedEligibility, employee, isEnrolled } = input;

  // Phase 3: Check active override
  if (isOverrideActive(storedEligibility)) {
    const overrideStatusNorm = normalizeStatus(storedEligibility.overrideStatus ?? "eligible");
    return {
      benefit: mapBenefitRecordToGraphql(benefit),
      benefitId: benefit.id,
      ruleEvaluation: normalizeRuleEvaluation(storedEligibility.ruleEvaluationJson),
      status: overrideStatusNorm,
      overrideStatus: storedEligibility.overrideStatus,
      overrideBy: storedEligibility.overrideBy,
      overrideReason: storedEligibility.overrideReason,
      overrideExpiresAt: storedEligibility.overrideExpiresAt,
    };
  }

  // Phase 6: Active enrollment → ACTIVE
  if (isEnrolled) {
    return {
      benefit: mapBenefitRecordToGraphql(benefit),
      benefitId: benefit.id,
      ruleEvaluation: normalizeRuleEvaluation(storedEligibility.ruleEvaluationJson),
      status: "ACTIVE",
    };
  }

  const ruleEvaluation = normalizeRuleEvaluation(storedEligibility.ruleEvaluationJson);
  const failedRuleEvaluation = ruleEvaluation.find((rule) => !rule.passed);
  const fallbackFailedRule = rules.find(
    (rule) => rule.ruleType === failedRuleEvaluation?.ruleType
  );

  // Legacy snapshot rows may carry status='active' from the old approval-based model.
  // At this point isEnrolled is false (checked above), so a stored 'active' must NOT
  // produce ACTIVE — that would be a ghost enrollment.
  // Derive status from: in-flight request state first, then live rule evaluation.
  let storedStatus: BenefitStatus;
  if (requestStatus === "approved") {
    // Defensive: approved request without enrollment (backfill may have missed this row)
    storedStatus = "ACTIVE";
  } else if (requestStatus && IN_FLIGHT_REQUEST_STATUSES.has(requestStatus)) {
    storedStatus = "PENDING";
  } else if (storedEligibility.status?.toUpperCase() === "ACTIVE") {
    // Legacy snapshot: re-evaluate live rules to determine true eligibility
    const liveEval = rules.map((rule) => evaluateRule(rule, employee));
    storedStatus = liveEval.some((r) => !r.passed) ? "LOCKED" : "ELIGIBLE";
  } else {
    storedStatus = normalizeStatus(storedEligibility.status, undefined);
  }

  return {
    benefit: mapBenefitRecordToGraphql(benefit),
    benefitId: benefit.id,
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
    status: storedStatus,
    overrideStatus: null,
    overrideBy: storedEligibility.overrideBy,
    overrideReason: storedEligibility.overrideReason,
    overrideExpiresAt: storedEligibility.overrideExpiresAt,
  };

}

/**
 * Get benefit eligibilities for an employee (shared by myBenefits, getEmployeeBenefits, Employee.benefits).
 * Phase 3: Respects active eligibility overrides.
 * Phase 6: Uses enrollment table for durable ACTIVE status.
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

  // Phase 6: Load active enrollments
  const activeEnrollments = await db
    .select()
    .from(schema.employeeBenefitEnrollments)
    .where(
      and(
        eq(schema.employeeBenefitEnrollments.employeeId, employeeId),
        eq(schema.employeeBenefitEnrollments.status, "active")
      )
    );
  const enrolledBenefitIds = new Set(activeEnrollments.map((e) => e.benefitId));

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
    const isEnrolled = enrolledBenefitIds.has(benefit.id);

    if (storedEligibility) {
      return buildStoredEligibility({
        benefit,
        requestStatus,
        rules,
        storedEligibility,
        employee,
        isEnrolled,
      });
    }

    return buildComputedEligibility({
      benefit,
      employee,
      requestStatus,
      rules,
      storedEligibility: null,
      isEnrolled,
    });
  });
}
