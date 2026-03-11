import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const contracts = sqliteTable("contracts", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  benefitId: text("benefit_id").notNull(),
  vendorName: text("vendor_name").notNull(),
  version: text("version").notNull(), // e.g. '2025.1'
  r2ObjectKey: text("r2_object_key").notNull(),
  sha256Hash: text("sha256_hash").notNull(),
  effectiveDate: text("effective_date").notNull(),
  expiryDate: text("expiry_date").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(false),
});

export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
