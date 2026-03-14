import { desc, eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";

/** Admin: бүх benefit request-ийг буцаана; status өгвөл тухайн статусаар шүүнэ. */
export const getAllBenefitRequests = async (
  _: unknown,
  { status }: { status?: string | null },
  { db, currentUser }: GraphQLContext,
) => {
  if (!currentUser.isAdmin) {
    throw new Error("Not authorized to view benefit requests.");
  }

  if (status) {
    return db
      .select()
      .from(schema.benefitRequests)
      .where(eq(schema.benefitRequests.status, status))
      .orderBy(desc(schema.benefitRequests.createdAt));
  }

  return db
    .select()
    .from(schema.benefitRequests)
    .orderBy(desc(schema.benefitRequests.createdAt));
};
