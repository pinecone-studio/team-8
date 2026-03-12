import { eq, desc } from "drizzle-orm";
import { schema } from "../../../db";

/** Admin: list all benefit requests with status pending. */
export const getPendingBenefitRequests = async (
  _: unknown,
  __: unknown,
  { db }: { db: import("../../../db").Database }
) => {
  const requests = await db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.status, "pending"))
    .orderBy(desc(schema.benefitRequests.createdAt));
  return requests;
};
