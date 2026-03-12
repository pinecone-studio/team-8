import { eq, desc } from "drizzle-orm";
import { schema } from "../../../db";

/** Get all benefit requests for an employee. */
export const getEmployeeRequests = async (
  _: unknown,
  { employeeId }: { employeeId: string },
  { db }: { db: import("../../../db").Database }
) => {
  const requests = await db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.employeeId, employeeId))
    .orderBy(desc(schema.benefitRequests.createdAt));
  return requests;
};
