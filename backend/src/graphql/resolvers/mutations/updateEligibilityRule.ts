import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAdmin } from "../../../auth";

export const updateEligibilityRule = async (
  _: unknown,
  { id, input }: { id: string; input: { ruleType?: string | null; operator?: string | null; value?: string | null; errorMessage?: string | null; priority?: number | null; isActive?: boolean | null } },
  { db, currentEmployee }: GraphQLContext,
) => {
  requireAdmin(currentEmployee);
  const updates: Record<string, unknown> = {};
  if (input.ruleType != null) updates.ruleType = input.ruleType;
  if (input.operator != null) updates.operator = input.operator;
  if (input.value != null) updates.value = input.value;
  if (input.errorMessage != null) updates.errorMessage = input.errorMessage;
  if (input.priority != null) updates.priority = input.priority;
  if (input.isActive != null) updates.isActive = input.isActive;

  const [row] = await db
    .update(schema.eligibilityRules)
    .set(updates)
    .where(eq(schema.eligibilityRules.id, id))
    .returning();
  if (!row) throw new Error("Eligibility rule not found");
  return row;
};
