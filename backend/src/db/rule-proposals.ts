import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const ruleProposals = sqliteTable("rule_proposals", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  benefitId: text("benefit_id").notNull(),
  ruleId: text("rule_id"), // null for create proposals, non-null for update/delete
  changeType: text("change_type").notNull(), // create | update | delete
  proposedData: text("proposed_data").notNull(), // JSON snapshot of full proposed rule
  summary: text("summary").notNull(), // human-readable change summary
  status: text("status").notNull().default("pending"), // pending | approved | rejected
  proposedByEmployeeId: text("proposed_by_employee_id").notNull(),
  reviewedByEmployeeId: text("reviewed_by_employee_id"),
  proposedAt: text("proposed_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  reviewedAt: text("reviewed_at"),
  reason: text("reason"), // reject reason or approval note
});

export type RuleProposal = typeof ruleProposals.$inferSelect;
export type NewRuleProposal = typeof ruleProposals.$inferInsert;
