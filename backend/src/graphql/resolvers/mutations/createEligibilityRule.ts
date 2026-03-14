import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAdmin } from "../../../auth";

export const createEligibilityRule = async (
  _: unknown,
  { input }: { input: { benefitId: string; ruleType: string; operator: string; value: string; errorMessage: string; priority?: number | null } },
  { db, currentEmployee }: GraphQLContext,
) => {
  requireAdmin(currentEmployee);
  const [row] = await db
    .insert(schema.eligibilityRules)
    .values({
      benefitId: input.benefitId,
      ruleType: input.ruleType,
      operator: input.operator,
      value: input.value,
      errorMessage: input.errorMessage,
      priority: input.priority ?? 0,
      isActive: true,
    })
    .returning();
  if (!row) throw new Error("Failed to create eligibility rule");
  return row;
};
