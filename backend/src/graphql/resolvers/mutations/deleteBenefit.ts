import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";

export const deleteBenefit = async (
  _: unknown,
  { id }: { id: string },
  { db, currentEmployee }: GraphQLContext,
) => {
  requireHrAdmin(currentEmployee);
  await db.delete(schema.eligibilityRules).where(eq(schema.eligibilityRules.benefitId, id));
  await db.delete(schema.benefitRequests).where(eq(schema.benefitRequests.benefitId, id));
  await db.delete(schema.benefitEligibility).where(eq(schema.benefitEligibility.benefitId, id));
  await db.delete(schema.contracts).where(eq(schema.contracts.benefitId, id));
  await db.delete(schema.benefits).where(eq(schema.benefits.id, id));
  return true;
};
