import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAuth } from "../../../auth";

/** Employee: cancel own pending benefit request. */
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
  if (req.status !== "pending") {
    throw new Error(
      `Request cannot be cancelled (current status: ${req.status}).`,
    );
  }

  const [updated] = await db
    .update(schema.benefitRequests)
    .set({ status: "cancelled", updatedAt: new Date().toISOString() })
    .where(eq(schema.benefitRequests.id, requestId))
    .returning();

  return updated;
};
