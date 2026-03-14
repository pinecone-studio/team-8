import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { QueryResolvers } from "../../generated/graphql";

export const getEmployeeByEmail: QueryResolvers["getEmployeeByEmail"] = async (
  _,
  { email },
  { db, currentUser },
) => {
  if (!currentUser.employee) {
    throw new Error("Not authenticated.");
  }

  const requestedEmail = email.trim().toLowerCase();
  const sessionEmail = currentUser.email?.trim().toLowerCase() ?? null;

  if (!currentUser.isAdmin && sessionEmail && sessionEmail !== requestedEmail) {
    throw new Error("Not authorized to view this employee.");
  }

  const results = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.email, requestedEmail));

  return results[0] ?? null;
};
