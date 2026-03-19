import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import {
  requireAdmin,
  canReviewHrBenefit,
  canReviewFinanceBenefit,
  getInternalRole,
  isFinanceManager,
} from "../../../auth";
import { writeAuditLog } from "../helpers/audit";
import { finalizeBenefitApproval } from "../helpers/finalizeBenefitApproval";
import { requiresEmployeePaymentForBenefit } from "../../../payments/amounts";
import {
  sendBenefitRequestStatusUpdateEmail,
  sendDownPaymentReadyForSignedContractEmail,
} from "../../../email/sendTransactionalEmail";
import {
  AWAITING_FINAL_FINANCE_APPROVAL_STATUS,
  isFinanceBenefit,
} from "../../../benefits/finance";

const HR_REVIEWABLE = new Set([
  "pending",
  "awaiting_hr_review",
  "awaiting_payment_review",
  "finance_approved",
]);

const FINANCE_REVIEWABLE = new Set([
  "awaiting_finance_review",
  "hr_approved",
]);

export const approveBenefitRequest = async (
  _: unknown,
  { requestId }: { requestId: string },
  { db, env, currentEmployee, baseUrl }: GraphQLContext,
) => {
  const admin = requireAdmin(currentEmployee);

  const requests = await db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.id, requestId));
  const req = requests[0];
  if (!req) throw new Error("Benefit request not found");

  const benefitRows = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, req.benefitId));
  const benefit = benefitRows[0];
  const approvalPolicy = benefit?.approvalPolicy ?? "hr";
  const requiresEmployeePayment = requiresEmployeePaymentForBenefit(benefit);

  const reviewerRole = getInternalRole(admin);
  const reviewerIsHr = canReviewHrBenefit(admin);
  const reviewerIsFinance = canReviewFinanceBenefit(admin);
  const status = req.status;

  if (isFinanceBenefit(benefit)) {
    if (status !== AWAITING_FINAL_FINANCE_APPROVAL_STATUS) {
      throw new Error(
        "Finance benefits cannot be directly approved from this stage. Send a finance offer first, then wait for the employee’s signed contract and final finance-manager approval.",
      );
    }
    if (!isFinanceManager(admin)) {
      throw new Error(
        `Final finance approval requires a finance manager. Your role (${reviewerRole}) does not have this permission.`,
      );
    }

    const now = new Date().toISOString();
    const [updated] = await db
      .update(schema.benefitRequests)
      .set({
        status: "approved",
        reviewedBy: admin.id,
        finalApprovedBy: admin.id,
        finalApprovedAt: now,
        employeeApprovedAt: now,
        updatedAt: now,
      })
      .where(eq(schema.benefitRequests.id, requestId))
      .returning();

    if (!updated || !benefit) {
      throw new Error("Benefit request not found");
    }

    await finalizeBenefitApproval({
      db,
      env,
      appBaseUrl: baseUrl,
      actor: admin,
      benefitRequest: updated,
      benefit,
      beforeStatus: status,
      actionType: "REQUEST_FINANCE_APPROVED",
      metadata: {
        approvalPolicy: "finance",
        reviewerRole,
        finalFinanceApproval: true,
      },
    });

    return updated;
  }

  let nextStatus: string;
  let auditAction:
    | "REQUEST_APPROVED"
    | "REQUEST_HR_APPROVED"
    | "REQUEST_FINANCE_APPROVED" = "REQUEST_APPROVED";

  if (HR_REVIEWABLE.has(status)) {
    if (!reviewerIsHr) {
      throw new Error(
        `This request (${status}) requires HR review. Your role (${reviewerRole}) does not have HR review permissions.`,
      );
    }

    if (status === "awaiting_payment_review") {
      nextStatus = "approved";
      auditAction = "REQUEST_APPROVED";
    } else if (approvalPolicy === "dual" && status !== "finance_approved") {
      nextStatus = "hr_approved";
      auditAction = "REQUEST_HR_APPROVED";
    } else if (requiresEmployeePayment) {
      nextStatus = "awaiting_payment";
      auditAction = "REQUEST_HR_APPROVED";
    } else {
      nextStatus = "approved";
      auditAction = "REQUEST_APPROVED";
    }
  } else if (FINANCE_REVIEWABLE.has(status)) {
    if (!reviewerIsFinance) {
      throw new Error(
        `This request (${status}) requires Finance review. Your role (${reviewerRole}) does not have Finance review permissions.`,
      );
    }

    if (approvalPolicy === "dual" && status !== "hr_approved") {
      nextStatus = "finance_approved";
      auditAction = "REQUEST_FINANCE_APPROVED";
    } else if (requiresEmployeePayment) {
      nextStatus = "awaiting_payment";
      auditAction = "REQUEST_FINANCE_APPROVED";
    } else {
      nextStatus = "approved";
      auditAction = "REQUEST_APPROVED";
    }
  } else {
    throw new Error(
      `Request cannot be approved from status: ${status}. Only requests in a pending review state can be approved.`,
    );
  }

  // Finance-first flow: approvals finish before employee signs (down_payment, or dual+contract with loan fields on request).
  const flowNorm = String(benefit?.flowType ?? "").trim().toLowerCase();
  const hasLoanTermsOnRequest =
    req.requestedAmount != null &&
    Number(req.requestedAmount) > 0 &&
    req.repaymentMonths != null &&
    Number(req.repaymentMonths) > 0;
  if (
    nextStatus === "approved" &&
    benefit?.requiresContract &&
    (flowNorm === "down_payment" ||
      (approvalPolicy === "dual" && hasLoanTermsOnRequest))
  ) {
    nextStatus = "awaiting_employee_signed_contract";
  }

  const now = new Date().toISOString();
  const [updated] = await db
    .update(schema.benefitRequests)
    .set({
      status: nextStatus,
      reviewedBy: admin.id,
      updatedAt: now,
    })
    .where(eq(schema.benefitRequests.id, requestId))
    .returning();

  if (nextStatus === "approved" && benefit) {
    await finalizeBenefitApproval({
      db,
      env,
      appBaseUrl: baseUrl,
      actor: admin,
      benefitRequest: updated,
      benefit,
      beforeStatus: status,
      actionType: auditAction,
      metadata: { approvalPolicy, reviewerRole, requiresEmployeePayment },
    });
  } else {
    await writeAuditLog({
      db,
      actor: admin,
      actionType: auditAction,
      entityType: "benefit_request",
      entityId: requestId,
      targetEmployeeId: req.employeeId,
      benefitId: req.benefitId,
      requestId,
      before: { status },
      after: { status: nextStatus },
      metadata: { approvalPolicy, reviewerRole, requiresEmployeePayment },
    });

    const employeeRows = await db
      .select()
      .from(schema.employees)
      .where(eq(schema.employees.id, req.employeeId))
      .limit(1);
    const targetEmployee = employeeRows[0];

    if (targetEmployee && benefit) {
      if (nextStatus === "awaiting_employee_signed_contract") {
        await sendDownPaymentReadyForSignedContractEmail(env, targetEmployee, benefit, {
          appBaseUrl: baseUrl,
        }).catch((error) =>
          console.error(
            "[approveBenefitRequest] Signed-contract-ready email failed:",
            error,
          ),
        );
      } else {
        await sendBenefitRequestStatusUpdateEmail(env, targetEmployee, benefit, {
          status: nextStatus,
          appBaseUrl: baseUrl,
          declineReason: updated.declineReason,
          requestedAmount: updated.requestedAmount,
          repaymentMonths: updated.repaymentMonths,
          financeProposedAmount: updated.financeProposedAmount,
          financeProposedRepaymentMonths: updated.financeProposedRepaymentMonths,
          financeProposalNote: updated.financeProposalNote,
        }).catch((error) =>
          console.error(
            "[approveBenefitRequest] Status update email failed:",
            error,
          ),
        );
      }
    }
  }

  return updated;
};
