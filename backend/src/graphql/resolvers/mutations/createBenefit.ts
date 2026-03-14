import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { mapBenefitRecordToGraphql } from "../helpers/employeeBenefits";
import { requireAdmin } from "../../../auth";

export const createBenefit = async (
  _: unknown,
  { input }: { input: { name: string; category: string; subsidyPercent: number; vendorName?: string | null; requiresContract?: boolean | null } },
  { db, currentEmployee }: GraphQLContext,
) => {
  requireAdmin(currentEmployee);
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
