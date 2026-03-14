import { desc, eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAdmin } from "../../../auth";

/** Admin: return all benefit requests, optionally filtered by status. */
export const getAllBenefitRequests = async (
  _: unknown,
  { status }: { status?: string | null },
  { db, currentEmployee }: GraphQLContext,
) => {
  requireAdmin(currentEmployee);
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
