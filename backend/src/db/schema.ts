import * as employeeSchema from "./employee";
import * as benefitsSchema from "./benefits";
import * as contractsSchema from "./contracts";
import * as eligibilityRulesSchema from "./eligibility-rules";
import * as benefitEligibilitySchema from "./benefit-eligibility";
import * as benefitRequestsSchema from "./benefit-requests";
import * as auditLogsSchema from "./audit-logs";
import * as contractAcceptancesSchema from "./contract-acceptances";
import * as employeeSignedContractsSchema from "./employee-signed-contracts";
import * as enrollmentsSchema from "./enrollments";
import * as ruleProposalsSchema from "./rule-proposals";
import * as notificationReadsSchema from "./notification-reads";
import * as attendanceRecordsSchema from "./attendance-records";
import * as employeeSettingsSchema from "./employee-settings";
import * as screenTimeSchema from "./screen-time";
import * as bonumAuthTokensSchema from "./bonum-auth-tokens";
import * as benefitRequestPaymentsSchema from "./benefit-request-payments";

// Combine schema pieces — benefits, contracts, eligibility_rules, benefit_eligibility, benefit_requests (TDD §10)
export const schema = {
  ...employeeSchema,
  ...benefitsSchema,
  ...contractsSchema,
  ...eligibilityRulesSchema,
  ...benefitEligibilitySchema,
  ...benefitRequestsSchema,
  ...auditLogsSchema,
  ...contractAcceptancesSchema,
  ...employeeSignedContractsSchema,
  ...enrollmentsSchema,
  ...ruleProposalsSchema,
  ...notificationReadsSchema,
  ...attendanceRecordsSchema,
  ...employeeSettingsSchema,
  ...screenTimeSchema,
  ...bonumAuthTokensSchema,
  ...benefitRequestPaymentsSchema,
};

// Re-export tables and types for consumers and GraphQL codegen
export * from "./employee";
export * from "./benefits";
export * from "./contracts";
export * from "./eligibility-rules";
export * from "./benefit-eligibility";
export * from "./benefit-requests";
export * from "./audit-logs";
export * from "./contract-acceptances";
export * from "./employee-signed-contracts";
export * from "./enrollments";
export * from "./rule-proposals";
export * from "./notification-reads";
export * from "./attendance-records";
export * from "./employee-settings";
export * from "./screen-time";
export * from "./bonum-auth-tokens";
export * from "./benefit-request-payments";
