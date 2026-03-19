import { and, eq, ne } from "drizzle-orm";
import type { Database } from "../db";
import { schema } from "../db";

export const FINANCE_FLOW_TYPE = "down_payment";
export const AWAITING_FINANCE_REVIEW_STATUS = "awaiting_finance_review";
export const AWAITING_EMPLOYEE_DECISION_STATUS = "awaiting_employee_decision";
export const AWAITING_EMPLOYEE_SIGNED_CONTRACT_STATUS =
  "awaiting_employee_signed_contract";
export const AWAITING_FINAL_FINANCE_APPROVAL_STATUS =
  "awaiting_final_finance_approval";

export function isFinanceBenefitFlowType(flowType: string | null | undefined) {
  return String(flowType ?? "").trim().toLowerCase() === FINANCE_FLOW_TYPE;
}

export function isFinanceBenefit(
  benefit: { flowType?: string | null } | null | undefined,
) {
  return isFinanceBenefitFlowType(benefit?.flowType);
}

export async function assertSingleActiveFinanceBenefit(
  db: Database,
  options?: { excludeBenefitId?: string | null },
) {
  const filters = [
    eq(schema.benefits.flowType, FINANCE_FLOW_TYPE),
    eq(schema.benefits.isActive, true),
  ];

  if (options?.excludeBenefitId) {
    filters.push(ne(schema.benefits.id, options.excludeBenefitId));
  }

  const rows = await db
    .select({ id: schema.benefits.id, name: schema.benefits.name })
    .from(schema.benefits)
    .where(and(...filters))
    .limit(1);

  if (rows[0]) {
    throw new Error(
      `An active finance benefit already exists (${rows[0].name}). Deactivate it before creating or reactivating another one.`,
    );
  }
}

export function getFinanceBenefitNextRequestStatusAfterEmployeeDecision(
  accepted: boolean,
) {
  return accepted
    ? AWAITING_EMPLOYEE_SIGNED_CONTRACT_STATUS
    : "cancelled";
}
