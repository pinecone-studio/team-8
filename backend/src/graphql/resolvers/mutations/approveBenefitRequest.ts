import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAdmin } from "../../../auth";

/** HR / Finance admin: approve benefit request. */
export const approveBenefitRequest = async (
  _: unknown,
  { requestId }: { requestId: string },
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
      status: "approved",
      reviewedBy: admin.id,
      updatedAt: now,
    })
    .where(eq(schema.benefitRequests.id, requestId))
    .returning();

  return updated;
};
