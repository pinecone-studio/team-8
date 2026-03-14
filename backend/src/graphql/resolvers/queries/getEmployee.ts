import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { QueryResolvers } from "../../generated/graphql";

export const getEmployee: QueryResolvers["getEmployee"] = async (
  _,
  { id },
  { db, currentUser },
) => {
  if (!currentUser.employee) {
    throw new Error("Not authenticated.");
  }

  if (!currentUser.isAdmin && currentUser.employee.id !== id) {
    throw new Error("Not authorized to view this employee.");
  }

  const results = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.id, id));

  return results[0] ?? null;
};
