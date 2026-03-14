import { desc, eq } from "drizzle-orm";
import { schema } from "../../../db";
import { QueryResolvers } from "../../generated/graphql";

/** Employee-ийн benefit request жагсаалтыг буцаана. */
export const getBenefitRequests: QueryResolvers["benefitRequests"] = async (
  _,
  { employeeId },
  { db, currentUser },
) => {
  if (!currentUser.employee) {
    throw new Error("Not authenticated.");
  }

  if (!currentUser.isAdmin && currentUser.employee.id !== employeeId) {
    throw new Error("Not authorized to view these requests.");
  }

  return db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.employeeId, employeeId))
    .orderBy(desc(schema.benefitRequests.createdAt));
};
