import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const benefits = sqliteTable("benefits", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  subsidyPercent: integer("subsidy_percent").notNull().default(0),
  isCore: integer("is_core").notNull().default(0),
  active: integer("active").notNull().default(1),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const benefitRules = sqliteTable("benefit_rules", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  benefitId: text("benefit_id").notNull(),
  ruleType: text("rule_type").notNull(),
  conditionJson: text("condition_json").notNull(),
  blockingMessage: text("blocking_message"),
  priority: integer("priority").notNull().default(0),
  isBlocking: integer("is_blocking").notNull().default(1),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const benefitRequests = sqliteTable("benefit_requests", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  benefitId: text("benefit_id").notNull(),
  employeeId: text("employee_id").notNull(),
  requestedUnits: integer("requested_units").notNull().default(1),
  status: text("status").notNull().default("pending"),
  statusReason: text("status_reason"),
  managerApproved: integer("manager_approved").notNull().default(0),
  financeApproved: integer("finance_approved").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const benefitContractAcceptances = sqliteTable(
  "benefit_contract_acceptances",
  {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    employeeId: text("employee_id").notNull(),
    vendor: text("vendor").notNull(),
    acceptedAt: text("accepted_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  }
);

export type Benefit = typeof benefits.$inferSelect;
export type NewBenefit = typeof benefits.$inferInsert;
export type BenefitRule = typeof benefitRules.$inferSelect;
export type NewBenefitRule = typeof benefitRules.$inferInsert;
export type BenefitRequest = typeof benefitRequests.$inferSelect;
export type NewBenefitRequest = typeof benefitRequests.$inferInsert;
export type BenefitContractAcceptance =
  typeof benefitContractAcceptances.$inferSelect;
export type NewBenefitContractAcceptance =
  typeof benefitContractAcceptances.$inferInsert;
