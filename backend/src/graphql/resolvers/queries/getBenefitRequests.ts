import { desc, eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAuth } from "../../../auth";

/** Returns benefit requests for the current authenticated employee. */
export const getBenefitRequests = async (
  _: unknown,
  __: unknown,
  { db, currentEmployee }: GraphQLContext,
) => {
  const employee = requireAuth(currentEmployee);
  return db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.employeeId, employee.id))
    .orderBy(desc(schema.benefitRequests.createdAt));
};
