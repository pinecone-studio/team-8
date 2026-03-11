import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";

export const benefitEligibility = sqliteTable(
  "benefit_eligibility",
  {
    employeeId: text("employee_id").notNull(),
    benefitId: text("benefit_id").notNull(),
    status: text("status").notNull(), // active | eligible | locked | pending
    ruleEvaluationJson: text("rule_evaluation_json").notNull(), // JSON array of { rule_type, passed, reason }
    computedAt: text("computed_at").notNull(),
    overrideBy: text("override_by"),
    overrideReason: text("override_reason"),
    overrideExpiresAt: text("override_expires_at"),
  },
  (table) => [
    primaryKey({ columns: [table.employeeId, table.benefitId] }),
  ]
);

export type BenefitEligibility = typeof benefitEligibility.$inferSelect;
export type NewBenefitEligibility = typeof benefitEligibility.$inferInsert;
