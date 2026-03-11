import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const benefitRequests = sqliteTable("benefit_requests", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  employeeId: text("employee_id").notNull(),
  benefitId: text("benefit_id").notNull(),
  status: text("status").notNull(), // pending | approved | rejected | cancelled
  contractVersionAccepted: text("contract_version_accepted"),
  contractAcceptedAt: text("contract_accepted_at"),
  reviewedBy: text("reviewed_by"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type BenefitRequest = typeof benefitRequests.$inferSelect;
export type NewBenefitRequest = typeof benefitRequests.$inferInsert;
