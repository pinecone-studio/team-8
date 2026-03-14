import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";

/** HR / C-level: approve benefit request. */
export const approveBenefitRequest = async (
  _: unknown,
  { requestId }: { requestId: string; reviewedBy: string },
  { db, currentUser }: GraphQLContext,
) => {
  if (!currentUser.isAdmin) {
    throw new Error("Not authorized to approve benefit requests.");
  }

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
  const reviewerName =
    currentUser.employee?.name ??
    currentUser.email ??
    "System";

  const [updated] = await db
    .update(schema.benefitRequests)
    .set({
      status: "approved",
      reviewedBy: reviewerName,
      updatedAt: now,
    })
    .where(eq(schema.benefitRequests.id, requestId))
    .returning();

  return updated;
};
