import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const contractAcceptances = sqliteTable("contract_acceptances", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  employeeId: text("employee_id").notNull(),
  benefitId: text("benefit_id").notNull(),
  contractId: text("contract_id").notNull(),
  contractVersion: text("contract_version").notNull(),
  contractHash: text("contract_hash").notNull(),
  acceptedAt: text("accepted_at").notNull(),
  ipAddress: text("ip_address"),
  requestId: text("request_id"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type ContractAcceptance = typeof contractAcceptances.$inferSelect;
export type NewContractAcceptance = typeof contractAcceptances.$inferInsert;
