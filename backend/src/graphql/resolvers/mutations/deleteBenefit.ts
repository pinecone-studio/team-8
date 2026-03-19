import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";
import { invalidateAllEmployeeEligibilityCaches } from "../helpers/benefitCatalogRefresh";

export const deleteBenefit = async (
  _: unknown,
  { id }: { id: string },
  { db, env, currentEmployee }: GraphQLContext,
) => {
  requireHrAdmin(currentEmployee);
  await db.delete(schema.screenTimeSubmissions).where(eq(schema.screenTimeSubmissions.benefitId, id));
  await db.delete(schema.screenTimeMonthlyResults).where(eq(schema.screenTimeMonthlyResults.benefitId, id));
  await db.delete(schema.screenTimeProgramTiers).where(eq(schema.screenTimeProgramTiers.benefitId, id));
  await db.delete(schema.screenTimePrograms).where(eq(schema.screenTimePrograms.benefitId, id));
  await db.delete(schema.eligibilityRules).where(eq(schema.eligibilityRules.benefitId, id));
  await db.delete(schema.benefitRequests).where(eq(schema.benefitRequests.benefitId, id));
  await db.delete(schema.benefitEligibility).where(eq(schema.benefitEligibility.benefitId, id));
  await db.delete(schema.contracts).where(eq(schema.contracts.benefitId, id));
  await db.delete(schema.benefits).where(eq(schema.benefits.id, id));

  try {
    await invalidateAllEmployeeEligibilityCaches(
      db,
      env.ELIGIBILITY_CACHE,
      "deleteBenefit",
    );
  } catch (err) {
    console.error(
      `[deleteBenefit] Failed to invalidate employee eligibility caches for benefit ${id}:`,
      err,
    );
  }

  return true;
};
