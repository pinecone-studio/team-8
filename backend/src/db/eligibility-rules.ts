import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const eligibilityRules = sqliteTable("eligibility_rules", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  benefitId: text("benefit_id").notNull(),
  ruleType: text("rule_type").notNull(), // employment_status | okr_submitted | attendance | responsibility_level | role | tenure_days
  operator: text("operator").notNull(), // eq | neq | gte | lte | in | not_in
  value: text("value").notNull(), // JSON expected value(s)
  errorMessage: text("error_message").notNull(),
  priority: integer("priority").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export type EligibilityRule = typeof eligibilityRules.$inferSelect;
export type NewEligibilityRule = typeof eligibilityRules.$inferInsert;
