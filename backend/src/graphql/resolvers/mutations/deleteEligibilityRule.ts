import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAdmin } from "../../../auth";

export const deleteEligibilityRule = async (
  _: unknown,
  { id }: { id: string },
  { db, currentEmployee }: GraphQLContext,
) => {
  requireAdmin(currentEmployee);
  await db
    .delete(schema.eligibilityRules)
    .where(eq(schema.eligibilityRules.id, id));
  return true;
};
