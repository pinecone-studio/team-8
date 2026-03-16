import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import {
  requireAdmin,
  canReviewHrBenefit,
  canReviewFinanceBenefit,
  getInternalRole,
} from "../../../auth";
import { sendBenefitRequestRejectedEmail } from "../../../email/sendTransactionalEmail";
import { writeAuditLog } from "../helpers/audit";

const DECLINABLE_STATUSES = new Set([
  "pending",
  "awaiting_contract_acceptance",
  "awaiting_hr_review",
  "awaiting_finance_review",
  "hr_approved",
  "finance_approved",
]);

// States where HR reviewer is the appropriate party
const HR_PHASE_STATUSES = new Set([
  "pending",
  "awaiting_contract_acceptance",
  "awaiting_hr_review",
  "finance_approved", // dual: finance done, HR is next
]);

// States where Finance reviewer is the appropriate party
const FINANCE_PHASE_STATUSES = new Set([
  "awaiting_finance_review",
  "hr_approved", // dual: HR done, Finance is next
]);

/** HR / Finance admin: decline benefit request with strict role-state enforcement. */
export const declineBenefitRequest = async (
  _: unknown,
  { requestId, reason }: { requestId: string; reason?: string | null },
  { db, env, currentEmployee }: GraphQLContext,
) => {
  const admin = requireAdmin(currentEmployee);

  const requests = await db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.id, requestId));
  const req = requests[0];
  if (!req) throw new Error("Benefit request not found");

  if (!DECLINABLE_STATUSES.has(req.status)) {
    throw new Error(
      `Request cannot be declined from status: ${req.status}.`
    );
  }

  const reviewerRole = getInternalRole(admin);

  // Enforce strict role-state matching
  if (HR_PHASE_STATUSES.has(req.status) && !canReviewHrBenefit(admin)) {
    throw new Error(
      `This request is in HR review phase (${req.status}). Requires HR admin role. Your role: ${reviewerRole}.`
    );
  }
  if (FINANCE_PHASE_STATUSES.has(req.status) && !canReviewFinanceBenefit(admin)) {
    throw new Error(
      `This request is in Finance review phase (${req.status}). Requires Finance admin role. Your role: ${reviewerRole}.`
    );
  }

  const benefitRows = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, req.benefitId));
  const approvalPolicy = benefitRows[0]?.approvalPolicy ?? "hr";

  const now = new Date().toISOString();
  const [updated] = await db
    .update(schema.benefitRequests)
    .set({
      status: "rejected",
      reviewedBy: admin.id,
      declineReason: reason ?? null,
      updatedAt: now,
    })
    .where(eq(schema.benefitRequests.id, requestId))
    .returning();

  await writeAuditLog({
    db,
    actor: admin,
    actionType: "REQUEST_REJECTED",
    entityType: "benefit_request",
    entityId: requestId,
    targetEmployeeId: req.employeeId,
    benefitId: req.benefitId,
    requestId,
    reason: reason ?? null,
    before: { status: req.status },
    after: { status: "rejected" },
    metadata: { approvalPolicy, reviewerRole },
  });

  const employeeRows = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.id, req.employeeId));
  const targetEmployee = employeeRows[0];
  const benefit = benefitRows[0];

  if (targetEmployee && benefit) {
    await sendBenefitRequestRejectedEmail(env, targetEmployee, benefit, reason);
  }

  return updated;
};
