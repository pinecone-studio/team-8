import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { QueryResolvers } from "../../generated/graphql";

export const getEmployeeByEmail: QueryResolvers["getEmployeeByEmail"] = async (
  _,
  { email },
  { db }
) => {
  const normalizedEmail = email.trim().toLowerCase();
  const results = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.email, normalizedEmail));

  return results[0] ?? null;
};
