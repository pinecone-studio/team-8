import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { mapBenefitRecordToGraphql } from "../helpers/employeeBenefits";
import { requireHrAdmin } from "../../../auth";

export const createBenefit = async (
  _: unknown,
  {
    input,
  }: {
    input: {
      name: string;
      description?: string | null;
      category: string;
      subsidyPercent: number;
      vendorName?: string | null;
      requiresContract?: boolean | null;
      approvalPolicy?: string | null;
    };
  },
  { db, currentEmployee }: GraphQLContext,
) => {
  requireHrAdmin(currentEmployee);
  const [row] = await db
    .insert(schema.benefits)
    .values({
      name: input.name,
      description: input.description ?? null,
      category: input.category,
      subsidyPercent: input.subsidyPercent,
      vendorName: input.vendorName ?? null,
      requiresContract: input.requiresContract ?? false,
      approvalPolicy: input.approvalPolicy ?? "hr",
    })
    .returning();
  if (!row) throw new Error("Failed to create benefit");
  return mapBenefitRecordToGraphql(row);
};
