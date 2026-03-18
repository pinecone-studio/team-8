import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const employeeSignedContracts = sqliteTable(
  "employee_signed_contracts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    employeeId: text("employee_id").notNull(),
    benefitId: text("benefit_id").notNull(),
    requestId: text("request_id"),
    hrContractId: text("hr_contract_id"),
    hrContractVersion: text("hr_contract_version"),
    hrContractHash: text("hr_contract_hash"),
    r2ObjectKey: text("r2_object_key").notNull(),
    fileName: text("file_name"),
    mimeType: text("mime_type"),
    status: text("status").notNull().default("uploaded"),
    uploadedAt: text("uploaded_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updated_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
);

export type EmployeeSignedContract = typeof employeeSignedContracts.$inferSelect;
export type NewEmployeeSignedContract = typeof employeeSignedContracts.$inferInsert;
