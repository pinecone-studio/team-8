import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAdmin } from "../../../auth";

/** HR / Finance admin: decline benefit request. */
export const declineBenefitRequest = async (
  _: unknown,
  { requestId, reason }: { requestId: string; reason?: string | null },
  { db, currentEmployee }: GraphQLContext,
) => {
  const admin = requireAdmin(currentEmployee);
  const requests = await db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.id, requestId));
  const req = requests[0];
  if (!req) throw new Error("Benefit request not found");
  if (req.status !== "pending") {
    throw new Error(`Request is not pending (current: ${req.status}).`);
  }

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

  return updated;
};
