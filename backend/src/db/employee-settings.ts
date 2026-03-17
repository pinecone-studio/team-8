import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Per-employee notification and UI preferences.
 * Created on first save; defaults are returned by the resolver when no row exists.
 */
export const employeeSettings = sqliteTable("employee_settings", {
  employeeId: text("employee_id").notNull().primaryKey(),
  notificationEmail: integer("notification_email", { mode: "boolean" }).notNull().default(true),
  notificationEligibility: integer("notification_eligibility", { mode: "boolean" }).notNull().default(true),
  notificationRenewals: integer("notification_renewals", { mode: "boolean" }).notNull().default(false),
  language: text("language").notNull().default("English"),
  timezone: text("timezone").notNull().default("UTC"),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type EmployeeSettings = typeof employeeSettings.$inferSelect;
export type NewEmployeeSettings = typeof employeeSettings.$inferInsert;
