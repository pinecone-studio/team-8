import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAuth } from "../../../auth";
import { writeAuditLog } from "../helpers/audit";
import { expireOpenPaymentsForRequest } from "../../../payments/benefit-request-payments";

const CANCELLABLE_STATUSES = new Set([
  "pending",
  "awaiting_contract_acceptance",
  "awaiting_hr_review",
  "awaiting_finance_review",
  "awaiting_payment",
  "awaiting_employee_signed_contract",
]);

/** Employee: cancel own non-terminal benefit request. */
export const cancelBenefitRequest = async (
  _: unknown,
  { requestId }: { requestId: string },
  { db, currentEmployee }: GraphQLContext,
) => {
  const employee = requireAuth(currentEmployee);
  const requests = await db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.id, requestId));
  const req = requests[0];
  if (!req) throw new Error("Benefit request not found");
  if (req.employeeId !== employee.id) {
    throw new Error("You can only cancel your own request.");
  }
  if (!CANCELLABLE_STATUSES.has(req.status)) {
    throw new Error(
      `Request cannot be cancelled from status: ${req.status}. Requests that are already approved, paid, or under payment review cannot be cancelled.`,
    );
  }

  const expiredPayments =
    req.status === "awaiting_payment"
      ? await expireOpenPaymentsForRequest(db, requestId)
      : { count: 0, paymentIds: [] as string[] };

  const [updated] = await db
    .update(schema.benefitRequests)
    .set({ status: "cancelled", updatedAt: new Date().toISOString() })
    .where(eq(schema.benefitRequests.id, requestId))
    .returning();

  // Phase 4: Audit log
  await writeAuditLog({
    db,
    actor: employee,
    actionType: "REQUEST_CANCELLED",
    entityType: "benefit_request",
    entityId: requestId,
    targetEmployeeId: employee.id,
    benefitId: req.benefitId,
    requestId,
    reason: "Cancelled by employee",
    before: { status: req.status },
    after: {
      status: "cancelled",
      expiredPaymentCount: expiredPayments.count,
      expiredPaymentIds: expiredPayments.paymentIds,
    },
  });

  return updated;
};
