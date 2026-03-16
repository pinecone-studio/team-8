import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

/**
 * One row per employee per calendar day. The composite PK (employee_id, date)
 * ensures that re-importing the same day replaces the existing record rather
 * than creating a duplicate.
 *
 * `is_late` is derived from the employee's role-aware threshold at import time
 * and stored durably so the rolling-window count is always computed from the
 * same data that was actually imported.
 */
export const attendanceRecords = sqliteTable(
  "attendance_records",
  {
    employeeId: text("employee_id").notNull(),
    date: text("date").notNull(),           // YYYY-MM-DD
    checkInTime: text("check_in_time").notNull(), // HH:MM
    isLate: integer("is_late", { mode: "boolean" }).notNull(),
    importedAt: text("imported_at").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.employeeId, table.date] }),
  ],
);

export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type NewAttendanceRecord = typeof attendanceRecords.$inferInsert;
