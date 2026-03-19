import { and, eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import {
  requireAdmin,
  canReviewHrBenefit,
  canReviewFinanceBenefit,
  getInternalRole,
} from "../../../auth";
import { sendBenefitRequestApprovedEmail } from "../../../email/sendTransactionalEmail";
import { writeAuditLog } from "../helpers/audit";

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
  { db, env, currentEmployee }: GraphQLContext,
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
  const requiresEmployeePayment =
    benefit?.flowType === "contract" && Boolean(benefit?.amount);

  const reviewerRole = getInternalRole(admin);
  const reviewerIsHr = canReviewHrBenefit(admin);
  const reviewerIsFinance = canReviewFinanceBenefit(admin);
  const status = req.status;

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
    const existingEnrollments = await db
      .select()
      .from(schema.employeeBenefitEnrollments)
      .where(
        and(
          eq(schema.employeeBenefitEnrollments.employeeId, req.employeeId),
          eq(schema.employeeBenefitEnrollments.benefitId, req.benefitId),
          eq(schema.employeeBenefitEnrollments.status, "active"),
        ),
      );

    if (!existingEnrollments[0]) {
      await db.insert(schema.employeeBenefitEnrollments).values({
        employeeId: req.employeeId,
        benefitId: req.benefitId,
        requestId: req.id,
        status: "active",
        subsidyPercentApplied: benefit.subsidyPercent,
        employeePercentApplied: 100 - benefit.subsidyPercent,
        approvedBy: admin.id,
        startedAt: now,
      });

      await writeAuditLog({
        db,
        actor: admin,
        actionType: "ENROLLMENT_CREATED",
        entityType: "enrollment",
        entityId: req.id,
        targetEmployeeId: req.employeeId,
        benefitId: req.benefitId,
        requestId: req.id,
        metadata: { subsidyPercentApplied: benefit.subsidyPercent },
      });
    }
  }

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

  if (nextStatus === "approved" && benefit) {
    const employeeRows = await db
      .select()
      .from(schema.employees)
      .where(eq(schema.employees.id, req.employeeId));
    const targetEmployee = employeeRows[0];

    if (targetEmployee) {
      await sendBenefitRequestApprovedEmail(env, targetEmployee, benefit);
    }
  }

  return updated;
};
