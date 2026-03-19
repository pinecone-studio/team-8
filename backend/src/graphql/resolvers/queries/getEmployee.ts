import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { isAdminEmployee, requireAuth } from "../../../auth";
import { syncEmployeeProfile } from "../../../clerk/sync-employee-profiles";

export const getEmployee = async (
  _: unknown,
  { id }: { id: string },
  { db, env, currentEmployee }: GraphQLContext,
) => {
  const me = requireAuth(currentEmployee);
  const isAdmin = isAdminEmployee(me);
  if (!isAdmin && me.id !== id) {
    throw new Error("Access denied.");
  }
  const results = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.id, id));
  return syncEmployeeProfile(db, env, results[0] ?? null);
};
