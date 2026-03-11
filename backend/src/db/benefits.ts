import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const benefits = sqliteTable("benefits", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  category: text("category").notNull(), // wellness | equipment | financial | career | flexibility
  subsidyPercent: integer("subsidy_percent").notNull(),
  vendorName: text("vendor_name"),
  requiresContract: integer("requires_contract", { mode: "boolean" })
    .notNull()
    .default(false),
  activeContractId: text("active_contract_id"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export type Benefit = typeof benefits.$inferSelect;
export type NewBenefit = typeof benefits.$inferInsert;
