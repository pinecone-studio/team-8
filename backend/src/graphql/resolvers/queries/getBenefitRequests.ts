import { desc, eq } from "drizzle-orm";
import { schema } from "../../../db";
import { QueryResolvers } from "../../generated/graphql";

/** Employee-ийн benefit request жагсаалтыг буцаана. */
export const getBenefitRequests: QueryResolvers["benefitRequests"] = async (
  _,
  { employeeId },
  { db }
) => {
  return db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.employeeId, employeeId))
    .orderBy(desc(schema.benefitRequests.createdAt));
};
