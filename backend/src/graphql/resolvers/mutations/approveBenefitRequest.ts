import { eq } from "drizzle-orm";
import { schema } from "../../../db";

/** HR / C-level: approve benefit request. */
export const approveBenefitRequest = async (
  _: unknown,
  { requestId, reviewedBy }: { requestId: string; reviewedBy: string },
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
      status: "approved",
      reviewedBy,
      updatedAt: now,
    })
    .where(eq(schema.benefitRequests.id, requestId))
    .returning();

  return updated;
};
