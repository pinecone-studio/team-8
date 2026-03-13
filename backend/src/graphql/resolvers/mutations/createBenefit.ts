import { schema } from "../../../db";
import type { MutationResolvers } from "../../generated/graphql";
import { mapBenefitRecordToGraphql } from "../helpers/employeeBenefits";

export const createBenefit: MutationResolvers["createBenefit"] = async (
  _,
  { input },
  { db }
) => {
  const [row] = await db
    .insert(schema.benefits)
    .values({
      name: input.name,
      category: input.category,
      subsidyPercent: input.subsidyPercent,
      vendorName: input.vendorName ?? null,
      requiresContract: input.requiresContract ?? false,
    })
    .returning();
  if (!row) throw new Error("Failed to create benefit");
  return mapBenefitRecordToGraphql(row);
};
