import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { mapBenefitRecordToGraphql } from "../helpers/employeeBenefits";
import { requireHrAdmin } from "../../../auth";

export const updateBenefit = async (
  _: unknown,
  {
    id,
    input,
  }: {
    id: string;
    input: {
      name?: string | null;
      category?: string | null;
      subsidyPercent?: number | null;
      vendorName?: string | null;
      requiresContract?: boolean | null;
      approvalPolicy?: string | null;
    };
  },
  { db, currentEmployee }: GraphQLContext,
) => {
  requireHrAdmin(currentEmployee);

  const updates: Record<string, unknown> = {};
  if (input.name != null) updates.name = input.name;
  if (input.category != null) updates.category = input.category;
  if (input.subsidyPercent != null) updates.subsidyPercent = input.subsidyPercent;
  if ("vendorName" in input) updates.vendorName = input.vendorName ?? null;
  if (input.requiresContract != null) updates.requiresContract = input.requiresContract;
  if (input.approvalPolicy != null) updates.approvalPolicy = input.approvalPolicy;

  const [row] = await db
    .update(schema.benefits)
    .set(updates)
    .where(eq(schema.benefits.id, id))
    .returning();

  if (!row) throw new Error("Benefit not found");
  return mapBenefitRecordToGraphql(row);
};
