import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAuth } from "../../../auth";

export const getEmployee = async (
  _: unknown,
  { id }: { id: string },
  { db, currentEmployee }: GraphQLContext,
) => {
  const me = requireAuth(currentEmployee);
  // Allow self lookup or admin lookup
  const dept = (me.department ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  const isAdmin =
    ["human resource", "human resources", "hr", "finance"].includes(dept) &&
    me.responsibilityLevel >= 2;
  if (!isAdmin && me.id !== id) {
    throw new Error("Access denied.");
  }
  const results = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.id, id));
  return results[0] ?? null;
};
