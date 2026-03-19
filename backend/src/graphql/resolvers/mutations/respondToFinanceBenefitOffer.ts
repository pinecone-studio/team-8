import { eq } from "drizzle-orm";
import { requireAuth } from "../../../auth";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import {
  AWAITING_EMPLOYEE_DECISION_STATUS,
  getFinanceBenefitNextRequestStatusAfterEmployeeDecision,
  isFinanceBenefit,
} from "../../../benefits/finance";
import { writeAuditLog } from "../helpers/audit";

export const respondToFinanceBenefitOffer = async (
  _: unknown,
  {
    input,
  }: {
    input: { requestId: string; accept: boolean; note?: string | null };
  },
  { db, currentEmployee }: GraphQLContext,
) => {
  const employee = requireAuth(currentEmployee);

  const requestRows = await db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.id, input.requestId))
    .limit(1);
  const benefitRequest = requestRows[0];

  if (!benefitRequest) {
    throw new Error("Benefit request not found.");
  }
  if (benefitRequest.employeeId !== employee.id) {
    throw new Error("You can only respond to your own finance offer.");
  }
  if (benefitRequest.status !== AWAITING_EMPLOYEE_DECISION_STATUS) {
    throw new Error("This finance offer is not waiting for your decision.");
  }

  const benefitRows = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, benefitRequest.benefitId))
    .limit(1);
  const benefit = benefitRows[0];
  if (!isFinanceBenefit(benefit)) {
    throw new Error("This request is not a finance benefit request.");
  }
  if (
    !benefitRequest.financeProposedAmount ||
    !benefitRequest.financeProposedRepaymentMonths ||
    !benefitRequest.financeContractKey
  ) {
    throw new Error(
      "The finance offer is incomplete. Please contact Finance to resend it.",
    );
  }

  const nextStatus = getFinanceBenefitNextRequestStatusAfterEmployeeDecision(
    input.accept,
  );
  const now = new Date().toISOString();
  const [updated] = await db
    .update(schema.benefitRequests)
    .set({
      status: nextStatus,
      employeeDecisionAt: now,
      declineReason: input.accept
        ? null
        : (input.note?.trim() || "Employee declined the finance offer."),
      updatedAt: now,
    })
    .where(eq(schema.benefitRequests.id, input.requestId))
    .returning();

  await writeAuditLog({
    db,
    actor: employee,
    actionType: input.accept
      ? "REQUEST_EMPLOYEE_ACCEPTED_OFFER"
      : "REQUEST_EMPLOYEE_DECLINED_OFFER",
    entityType: "benefit_request",
    entityId: input.requestId,
    targetEmployeeId: employee.id,
    benefitId: benefitRequest.benefitId,
    requestId: input.requestId,
    reason: input.accept ? null : input.note ?? null,
    before: { status: benefitRequest.status },
    after: { status: nextStatus },
    metadata: {
      financeProposedAmount: benefitRequest.financeProposedAmount,
      financeProposedRepaymentMonths:
        benefitRequest.financeProposedRepaymentMonths,
    },
  });

  return updated;
};
