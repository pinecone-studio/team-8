import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const screenTimePrograms = sqliteTable("screen_time_programs", {
  benefitId: text("benefit_id").primaryKey(),
  screenshotRetentionDays: integer("screenshot_retention_days")
    .notNull()
    .default(30),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const screenTimeProgramTiers = sqliteTable("screen_time_program_tiers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  benefitId: text("benefit_id").notNull(),
  label: text("label").notNull(),
  maxDailyMinutes: integer("max_daily_minutes").notNull(),
  salaryUpliftPercent: integer("salary_uplift_percent").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const screenTimeSubmissions = sqliteTable(
  "screen_time_submissions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    benefitId: text("benefit_id").notNull(),
    employeeId: text("employee_id").notNull(),
    monthKey: text("month_key").notNull(),
    slotDate: text("slot_date").notNull(),
    screenshotR2Key: text("screenshot_r2_key"),
    fileName: text("file_name"),
    mimeType: text("mime_type"),
    screenshotSha256: text("screenshot_sha256"),
    avgDailyMinutes: integer("avg_daily_minutes"),
    confidenceScore: integer("confidence_score"),
    platform: text("platform"),
    periodType: text("period_type"),
    extractionStatus: text("extraction_status").notNull().default("pending"),
    reviewStatus: text("review_status").notNull().default("pending"),
    reviewNote: text("review_note"),
    rawExtractionJson: text("raw_extraction_json"),
    submittedAt: text("submitted_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    reviewedAt: text("reviewed_at"),
    reviewedByEmployeeId: text("reviewed_by_employee_id"),
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updated_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => ({
    employeeMonthIndex: uniqueIndex("screen_time_submissions_employee_slot_idx").on(
      table.benefitId,
      table.employeeId,
      table.slotDate,
    ),
  }),
);

export const screenTimeMonthlyResults = sqliteTable(
  "screen_time_monthly_results",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    benefitId: text("benefit_id").notNull(),
    employeeId: text("employee_id").notNull(),
    monthKey: text("month_key").notNull(),
    requiredSlotCount: integer("required_slot_count").notNull().default(0),
    submittedSlotCount: integer("submitted_slot_count").notNull().default(0),
    approvedSlotCount: integer("approved_slot_count").notNull().default(0),
    missingDueSlotDatesJson: text("missing_due_slot_dates_json")
      .notNull()
      .default("[]"),
    monthlyAvgDailyMinutes: integer("monthly_avg_daily_minutes"),
    awardedSalaryUpliftPercent: integer("awarded_salary_uplift_percent")
      .notNull()
      .default(0),
    status: text("status").notNull().default("in_progress"),
    approvedByEmployeeId: text("approved_by_employee_id"),
    approvedAt: text("approved_at"),
    decisionNote: text("decision_note"),
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updated_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => ({
    employeeMonthIndex: uniqueIndex("screen_time_monthly_results_employee_month_idx").on(
      table.benefitId,
      table.employeeId,
      table.monthKey,
    ),
  }),
);

export type ScreenTimeProgram = typeof screenTimePrograms.$inferSelect;
export type NewScreenTimeProgram = typeof screenTimePrograms.$inferInsert;
export type ScreenTimeProgramTier = typeof screenTimeProgramTiers.$inferSelect;
export type NewScreenTimeProgramTier = typeof screenTimeProgramTiers.$inferInsert;
export type ScreenTimeSubmission = typeof screenTimeSubmissions.$inferSelect;
export type NewScreenTimeSubmission = typeof screenTimeSubmissions.$inferInsert;
export type ScreenTimeMonthlyResult = typeof screenTimeMonthlyResults.$inferSelect;
export type NewScreenTimeMonthlyResult = typeof screenTimeMonthlyResults.$inferInsert;
