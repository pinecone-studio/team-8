import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const employeeBenefitEnrollments = sqliteTable("employee_benefit_enrollments", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  employeeId: text("employee_id").notNull(),
  benefitId: text("benefit_id").notNull(),
  requestId: text("request_id"),
  status: text("status").notNull().default("active"), // active | suspended | ended
  subsidyPercentApplied: integer("subsidy_percent_applied"),
  employeePercentApplied: integer("employee_percent_applied"),
  approvedBy: text("approved_by"),
  startedAt: text("started_at").notNull(),
  endedAt: text("ended_at"),
  metadataJson: text("metadata_json"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type EmployeeBenefitEnrollment = typeof employeeBenefitEnrollments.$inferSelect;
export type NewEmployeeBenefitEnrollment = typeof employeeBenefitEnrollments.$inferInsert;
