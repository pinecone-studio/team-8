import { schema } from "../../../db";
import type { Database } from "../../../db";
import { requireHrAdmin } from "../../../auth";
import type { GraphQLContext } from "../../context";
import { writeAuditLog } from "../helpers/audit";
import { recomputeAllEmployeeEligibilities } from "../helpers/benefitCatalogRefresh";

type CreateEligibilityRuleInput = {
  benefitId: string;
  ruleType: string;
  operator: string;
  value: string;
  errorMessage: string;
  priority?: number | null;
};

export const createEligibilityRule = async (
  _: unknown,
  { input }: { input: CreateEligibilityRuleInput },
  { db, env, currentEmployee }: GraphQLContext & { db: Database },
) => {
  const admin = requireHrAdmin(currentEmployee);

  const [createdRule] = await db
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

  await writeAuditLog({
    db,
    actor: admin,
    actionType: "ELIGIBILITY_RULE_CREATED",
    entityType: "eligibility_rule",
    entityId: createdRule.id,
    benefitId: createdRule.benefitId,
    after: createdRule,
  });

  try {
    await recomputeAllEmployeeEligibilities(db, {
      source: "manual",
      actor: admin,
      kvCache: env.ELIGIBILITY_CACHE,
      metadata: {
        trigger: "createEligibilityRule",
        benefitId: createdRule.benefitId,
        ruleId: createdRule.id,
      },
    });
  } catch (err) {
    console.error(
      `[createEligibilityRule] Failed to recompute eligibilities after creating rule ${createdRule.id}:`,
      err,
    );
  }

  return createdRule;
};
