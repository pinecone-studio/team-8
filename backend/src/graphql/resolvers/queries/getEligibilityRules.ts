import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAdmin } from "../../../auth";

export const getEligibilityRules = async (
  _: unknown,
  { benefitId }: { benefitId: string },
  { db, currentEmployee }: GraphQLContext,
) => {
  requireAdmin(currentEmployee);
  return db
    .select()
    .from(schema.eligibilityRules)
    .where(eq(schema.eligibilityRules.benefitId, benefitId));
};
