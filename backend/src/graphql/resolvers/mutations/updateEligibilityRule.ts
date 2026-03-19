import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database } from "../../../db";
import { requireHrAdmin } from "../../../auth";
import type { GraphQLContext } from "../../context";
import { writeAuditLog } from "../helpers/audit";
import { recomputeAllEmployeeEligibilities } from "../helpers/benefitCatalogRefresh";
import { rejectPendingRuleProposalsForRule } from "../helpers/ruleProposalLifecycle";

type UpdateEligibilityRuleInput = {
  ruleType?: string | null;
  operator?: string | null;
  value?: string | null;
  errorMessage?: string | null;
  priority?: number | null;
  isActive?: boolean | null;
};

export const updateEligibilityRule = async (
  _: unknown,
  { id, input }: { id: string; input: UpdateEligibilityRuleInput },
  { db, env, currentEmployee }: GraphQLContext & { db: Database },
) => {
  const admin = requireHrAdmin(currentEmployee);

  const [existingRule] = await db
    .select()
    .from(schema.eligibilityRules)
    .where(eq(schema.eligibilityRules.id, id))
    .limit(1);

  if (!existingRule) {
    throw new Error("Eligibility rule not found.");
  }

  const changes: Partial<typeof existingRule> = {};

  if (input.ruleType != null) changes.ruleType = input.ruleType;
  if (input.operator != null) changes.operator = input.operator;
  if (input.value != null) changes.value = input.value;
  if (input.errorMessage != null) changes.errorMessage = input.errorMessage;
  if (input.priority != null) changes.priority = input.priority;
  if (input.isActive != null) changes.isActive = input.isActive;

  if (Object.keys(changes).length === 0) {
    return existingRule;
  }

  const [updatedRule] = await db
    .update(schema.eligibilityRules)
    .set(changes)
    .where(eq(schema.eligibilityRules.id, id))
    .returning();

  await rejectPendingRuleProposalsForRule({
    db,
    actor: admin,
    benefitId: updatedRule.benefitId,
    ruleId: updatedRule.id,
    reason: "Superseded by a direct rule edit in the benefit detail screen.",
    metadata: {
      trigger: "updateEligibilityRule",
      supersededByRuleId: updatedRule.id,
    },
  });

  await writeAuditLog({
    db,
    actor: admin,
    actionType: "ELIGIBILITY_RULE_UPDATED",
    entityType: "eligibility_rule",
    entityId: updatedRule.id,
    benefitId: updatedRule.benefitId,
    before: existingRule,
    after: updatedRule,
  });

  try {
    await recomputeAllEmployeeEligibilities(db, {
      source: "manual",
      actor: admin,
      kvCache: env.ELIGIBILITY_CACHE,
      metadata: {
        trigger: "updateEligibilityRule",
        benefitId: updatedRule.benefitId,
        ruleId: updatedRule.id,
      },
    });
  } catch (err) {
    console.error(
      `[updateEligibilityRule] Failed to recompute eligibilities after updating rule ${updatedRule.id}:`,
      err,
    );
  }

  return updatedRule;
};
