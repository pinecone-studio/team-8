import { eq } from "drizzle-orm";
import { schema } from "../../../db";

/** HR / C-level: decline benefit request. */
export const declineBenefitRequest = async (
  _: unknown,
  {
    requestId,
    reviewedBy,
    reason,
  }: { requestId: string; reviewedBy: string; reason?: string | null },
  { db }: { db: import("../../../db").Database }
) => {
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
      reviewedBy,
      declineReason: reason ?? null,
      updatedAt: now,
    })
    .where(eq(schema.benefitRequests.id, requestId))
    .returning();

  return updated;
};
