import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const employees = sqliteTable("employees", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  nameEng: text("name_eng"),
  role: text("role").notNull(),
  department: text("department").notNull(),
  responsibilityLevel: integer("responsibility_level").notNull().default(1),
  employmentStatus: text("employment_status").notNull().default("active"),
  hireDate: text("hire_date").notNull(),
  okrSubmitted: integer("okr_submitted").notNull().default(0),
  okrScore: integer("okr_score").notNull().default(0),
  lateArrivalCount: integer("late_arrival_count").notNull().default(0),
  lateArrivalUpdatedAt: text("late_arrival_updated_at"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
