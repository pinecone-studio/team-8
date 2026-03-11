import * as employeeSchema from "./employee";
import * as benefitsSchema from "./benefits";
import * as contractsSchema from "./contracts";
import * as eligibilityRulesSchema from "./eligibility-rules";
import * as benefitEligibilitySchema from "./benefit-eligibility";
import * as benefitRequestsSchema from "./benefit-requests";

// Combine schema pieces — benefits, contracts, eligibility_rules, benefit_eligibility, benefit_requests (TDD §10)
export const schema = {
  ...employeeSchema,
  ...benefitsSchema,
  ...contractsSchema,
  ...eligibilityRulesSchema,
  ...benefitEligibilitySchema,
  ...benefitRequestsSchema,
};

// Re-export tables and types for consumers and GraphQL codegen
export * from "./employee";
export * from "./benefits";
export * from "./contracts";
export * from "./eligibility-rules";
export * from "./benefit-eligibility";
export * from "./benefit-requests";
