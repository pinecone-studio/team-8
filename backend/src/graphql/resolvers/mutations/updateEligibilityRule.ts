import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";
import { writeAuditLog } from "../helpers/audit";

export const updateEligibilityRule = async (
  _: unknown,
  {
    id,
    input,
  }: {
    id: string;
    input: {
      ruleType?: string | null;
      operator?: string | null;
      value?: string | null;
      errorMessage?: string | null;
      priority?: number | null;
      isActive?: boolean | null;
    };
  },
  { db, currentEmployee }: GraphQLContext,
) => {
  requireHrAdmin(currentEmployee);

  const existing = await db
    .select()
    .from(schema.eligibilityRules)
    .where(eq(schema.eligibilityRules.id, id));
  const before = existing[0];
  if (!before) throw new Error("Eligibility rule not found");

  const updates: Record<string, unknown> = {};
  if (input.ruleType !== undefined && input.ruleType !== null) updates.ruleType = input.ruleType;
  if (input.operator !== undefined && input.operator !== null) updates.operator = input.operator;
  if (input.value !== undefined && input.value !== null) updates.value = input.value;
  if (input.errorMessage !== undefined && input.errorMessage !== null) updates.errorMessage = input.errorMessage;
  if (input.priority !== undefined && input.priority !== null) updates.priority = input.priority;
  if (input.isActive !== undefined && input.isActive !== null) updates.isActive = input.isActive;

  const [updated] = await db
    .update(schema.eligibilityRules)
    .set(updates)
    .where(eq(schema.eligibilityRules.id, id))
    .returning();

  if (!updated) throw new Error("Failed to update eligibility rule");

  await writeAuditLog({
    db,
    actor: currentEmployee,
    actionType: "ELIGIBILITY_RULE_UPDATED",
    entityType: "eligibility_rule",
    entityId: id,
    benefitId: before.benefitId,
    before,
    after: updated,
  });

  return updated;
};
