/** Rule in eligibility-rules.json */
export type RuleConfig = {
  type:
    | "employment_status"
    | "okr_submitted"
    | "attendance"
    | "responsibility_level"
    | "role"
    | "tenure_days";
  operator: "eq" | "neq" | "gte" | "lte" | "lt" | "gt" | "in" | "not_in";
  value: string | number | boolean | string[];
  errorMessage: string;
};

/** Benefit config from eligibility-rules.json */
export type BenefitConfig = {
  id: string;
  name: string;
  category: string;
  subsidyPercent: number;
  vendorName: string | null;
  requiresContract: boolean;
  rules: RuleConfig[];
};

/** Full eligibility config */
export type EligibilityConfig = {
  version: string;
  benefits: Record<string, BenefitConfig>;
};

/** Single rule evaluation result */
export type RuleEvaluation = {
  ruleType: string;
  passed: boolean;
  reason: string;
};

/** Result for one benefit (rule evaluation only) */
export type BenefitEligibilityResult = {
  benefitId: string;
  status: "eligible" | "locked";
  ruleEvaluation: RuleEvaluation[];
  failedRule?: { errorMessage: string };
};

/** Display status for dashboard (TDD FR-01) */
export type EligibilityDisplayStatus = "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING";

/** Request status from benefit_requests table */
export type BenefitRequestStatus = "pending" | "approved" | "rejected" | "cancelled";

/** Input for computing display status (employee shape: DB employee or test fixture) */
export type ComputeStatusInput = {
  employee: {
    employmentStatus: string;
    okrSubmitted: number;
    lateArrivalCount: number;
    responsibilityLevel: number;
    role: string;
    hireDate: string;
  };
  benefitId: string;
  /** Current benefit request status, if any (from DB). */
  requestStatus?: BenefitRequestStatus | null;
};

/** Result: Employee + rules → ACTIVE | ELIGIBLE | LOCKED | PENDING */
export type ComputeStatusResult = {
  benefitId: string;
  status: EligibilityDisplayStatus;
  ruleEvaluation: RuleEvaluation[];
  failedRule?: { errorMessage: string };
};
