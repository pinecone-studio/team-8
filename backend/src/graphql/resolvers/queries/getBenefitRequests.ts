import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { GraphQLContext } from "../../context";

export const getBenefitRequests = async (
  _: unknown,
  { employeeId }: { employeeId: string },
  { db }: GraphQLContext
) => {
  return db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.employeeId, employeeId));
};
