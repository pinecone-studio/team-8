import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { mapBenefitRecordToGraphql } from "../helpers/employeeBenefits";
import { requireHrAdmin } from "../../../auth";
import { invalidateAllEmployeeEligibilityCaches } from "../helpers/benefitCatalogRefresh";

export const updateBenefit = async (
  _: unknown,
  {
    id,
    input,
  }: {
    id: string;
    input: {
      name?: string | null;
      description?: string | null;
      category?: string | null;
      subsidyPercent?: number | null;
      vendorName?: string | null;
      requiresContract?: boolean | null;
      approvalPolicy?: string | null;
      amount?: number | null;
      location?: string | null;
      imageUrl?: string | null;
    };
  },
  { db, env, currentEmployee }: GraphQLContext,
) => {
  requireHrAdmin(currentEmployee);

  const updates: Record<string, unknown> = {};
  if (input.name != null) updates.name = input.name;
  if ("description" in input) updates.description = input.description ?? null;
  if (input.category != null) updates.category = input.category;
  if (input.subsidyPercent != null) updates.subsidyPercent = input.subsidyPercent;
  if ("vendorName" in input) updates.vendorName = input.vendorName ?? null;
  if (input.requiresContract != null) updates.requiresContract = input.requiresContract;
  if (input.approvalPolicy != null) updates.approvalPolicy = input.approvalPolicy;
  if ("amount" in input) updates.amount = input.amount ?? null;
  if ("location" in input) updates.location = input.location ?? null;
  if ("imageUrl" in input) updates.imageUrl = input.imageUrl ?? null;

  const [row] = await db
    .update(schema.benefits)
    .set(updates)
    .where(eq(schema.benefits.id, id))
    .returning();

  if (!row) throw new Error("Benefit not found");

  try {
    await invalidateAllEmployeeEligibilityCaches(
      db,
      env.ELIGIBILITY_CACHE,
      "updateBenefit",
    );
  } catch (err) {
    console.error(
      `[updateBenefit] Failed to invalidate employee eligibility caches for benefit ${id}:`,
      err,
    );
  }

  return mapBenefitRecordToGraphql(row);
};
