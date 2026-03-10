import { sql } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const employees = sqliteTable("employees", {
  id: text("id").primaryKey(),
  employeeCode: text("employee_code").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  nameEng: text("name_eng"),
  role: text("role").notNull(),
  department: text("department").notNull(),
  responsibilityLevel: integer("responsibility_level").notNull(),
  employmentStatus: text("employment_status").notNull(),
  hireDate: text("hire_date").notNull(),
  okrSubmitted: integer("okr_submitted", { mode: "boolean" }).notNull().default(false),
  lateArrivalCount: integer("late_arrival_count").notNull().default(0),
  lateArrivalUpdatedAt: text("late_arrival_updated_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const accessCredentials = sqliteTable("access_credentials", {
  employeeId: text("employee_id").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  passwordIterations: integer("password_iterations").notNull().default(310000),
  passwordAlgorithm: text("password_algorithm").notNull().default("pbkdf2-sha256"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  lastLoginAt: text("last_login_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const benefits = sqliteTable("benefits", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  subsidyPercent: integer("subsidy_percent").notNull(),
  vendorName: text("vendor_name"),
  requiresContract: integer("requires_contract", { mode: "boolean" }).notNull().default(false),
  requiresFinanceApproval: integer("requires_finance_approval", { mode: "boolean" })
    .notNull()
    .default(false),
  requiresManagerApproval: integer("requires_manager_approval", { mode: "boolean" })
    .notNull()
    .default(false),
  isCoreBenefit: integer("is_core_benefit", { mode: "boolean" }).notNull().default(false),
  activeContractId: text("active_contract_id"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const eligibilityRules = sqliteTable("eligibility_rules", {
  id: text("id").primaryKey(),
  benefitId: text("benefit_id").notNull(),
  ruleType: text("rule_type").notNull(),
  operator: text("operator").notNull(),
  value: text("value").notNull(),
  errorMessage: text("error_message").notNull(),
  priority: integer("priority").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const benefitEligibility = sqliteTable(
  "benefit_eligibility",
  {
    employeeId: text("employee_id").notNull(),
    benefitId: text("benefit_id").notNull(),
    status: text("status").notNull(),
    ruleEvaluationJson: text("rule_evaluation_json").notNull(),
    computedAt: text("computed_at").notNull(),
    overrideBy: text("override_by"),
    overrideReason: text("override_reason"),
    overrideExpiresAt: text("override_expires_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => [primaryKey({ columns: [table.employeeId, table.benefitId] })]
);

export const benefitRequests = sqliteTable("benefit_requests", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  benefitId: text("benefit_id").notNull(),
  status: text("status").notNull(),
  contractVersionAccepted: text("contract_version_accepted"),
  contractAcceptedAt: text("contract_accepted_at"),
  reviewedBy: text("reviewed_by"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const contracts = sqliteTable("contracts", {
  id: text("id").primaryKey(),
  benefitId: text("benefit_id").notNull(),
  vendorName: text("vendor_name").notNull(),
  version: text("version").notNull(),
  r2ObjectKey: text("r2_object_key").notNull(),
  sha256Hash: text("sha256_hash").notNull(),
  effectiveDate: text("effective_date").notNull(),
  expiryDate: text("expiry_date").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const contractAcceptanceLogs = sqliteTable("contract_acceptance_logs", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  contractId: text("contract_id").notNull(),
  contractVersion: text("contract_version").notNull(),
  contractHash: text("contract_hash").notNull(),
  acceptedAt: text("accepted_at").notNull(),
  ipAddress: text("ip_address").notNull(),
  requestId: text("request_id"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id"),
  benefitId: text("benefit_id"),
  actorId: text("actor_id"),
  actorRole: text("actor_role").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  reason: text("reason"),
  payloadJson: text("payload_json").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const notificationEvents = sqliteTable("notification_events", {
  id: text("id").primaryKey(),
  eventType: text("event_type").notNull(),
  audience: text("audience").notNull(),
  recipientEmployeeId: text("recipient_employee_id"),
  recipientEmail: text("recipient_email"),
  status: text("status").notNull().default("pending"),
  sourceEntityType: text("source_entity_type").notNull(),
  sourceEntityId: text("source_entity_id").notNull(),
  payloadJson: text("payload_json").notNull(),
  dispatchedAt: text("dispatched_at"),
  failedAt: text("failed_at"),
  lastError: text("last_error"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const syncRuns = sqliteTable("sync_runs", {
  id: text("id").primaryKey(),
  syncType: text("sync_type").notNull(),
  source: text("source").notNull(),
  status: text("status").notNull(),
  recordCount: integer("record_count").notNull().default(0),
  initiatedBy: text("initiated_by").notNull(),
  payloadJson: text("payload_json").notNull(),
  summaryJson: text("summary_json"),
  startedAt: text("started_at").notNull(),
  finishedAt: text("finished_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});
