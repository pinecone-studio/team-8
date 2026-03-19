import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database } from "../../../db";
import { requireHrAdmin } from "../../../auth";
import type { GraphQLContext } from "../../context";
import { writeAuditLog } from "../helpers/audit";
import { recomputeAllEmployeeEligibilities } from "../helpers/benefitCatalogRefresh";
import { rejectPendingRuleProposalsForRule } from "../helpers/ruleProposalLifecycle";

export const deleteEligibilityRule = async (
  _: unknown,
  { id }: { id: string },
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

  await db.delete(schema.eligibilityRules).where(eq(schema.eligibilityRules.id, id));

  await rejectPendingRuleProposalsForRule({
    db,
    actor: admin,
    benefitId: existingRule.benefitId,
    ruleId: existingRule.id,
    reason: "Superseded by a direct rule deletion in the benefit detail screen.",
    metadata: {
      trigger: "deleteEligibilityRule",
      supersededByRuleId: existingRule.id,
    },
  });

  await writeAuditLog({
    db,
    actor: admin,
    actionType: "ELIGIBILITY_RULE_DELETED",
    entityType: "eligibility_rule",
    entityId: existingRule.id,
    benefitId: existingRule.benefitId,
    before: existingRule,
  });

  try {
    await recomputeAllEmployeeEligibilities(db, {
      source: "manual",
      actor: admin,
      kvCache: env.ELIGIBILITY_CACHE,
      metadata: {
        trigger: "deleteEligibilityRule",
        benefitId: existingRule.benefitId,
        ruleId: existingRule.id,
      },
    });
  } catch (err) {
    console.error(
      `[deleteEligibilityRule] Failed to recompute eligibilities after deleting rule ${existingRule.id}:`,
      err,
    );
  }

  return true;
};
