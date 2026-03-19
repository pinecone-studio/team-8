import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const benefitRequests = sqliteTable("benefit_requests", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  employeeId: text("employee_id").notNull(),
  benefitId: text("benefit_id").notNull(),
  status: text("status").notNull(), // pending | approved | rejected | cancelled
  contractVersionAccepted: text("contract_version_accepted"),
  contractAcceptedAt: text("contract_accepted_at"),
  reviewedBy: text("reviewed_by"),
  requestedAmount: integer("requested_amount"),
  repaymentMonths: integer("repayment_months"),
  financeProposedAmount: integer("finance_proposed_amount"),
  financeProposedRepaymentMonths: integer("finance_proposed_repayment_months"),
  financeProposalNote: text("finance_proposal_note"),
  financeProposedBy: text("finance_proposed_by"),
  financeProposedAt: text("finance_proposed_at"),
  financeContractKey: text("finance_contract_key"),
  financeContractFileName: text("finance_contract_file_name"),
  financeContractMimeType: text("finance_contract_mime_type"),
  financeContractUploadedAt: text("finance_contract_uploaded_at"),
  employeeApprovedAt: text("employee_approved_at"),
  employeeDecisionAt: text("employee_decision_at"),
  finalApprovedBy: text("final_approved_by"),
  finalApprovedAt: text("final_approved_at"),
  declineReason: text("decline_reason"),
  employeeContractKey: text("employee_contract_key"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type BenefitRequest = typeof benefitRequests.$inferSelect;
export type NewBenefitRequest = typeof benefitRequests.$inferInsert;
