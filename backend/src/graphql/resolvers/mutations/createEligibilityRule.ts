import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";
import { writeAuditLog } from "../helpers/audit";

export const createEligibilityRule = async (
  _: unknown,
  {
    input,
  }: {
    input: {
      benefitId: string;
      ruleType: string;
      operator: string;
      value: string;
      errorMessage: string;
      priority?: number | null;
    };
  },
  { db, currentEmployee }: GraphQLContext,
) => {
  requireHrAdmin(currentEmployee);

  const [row] = await db
    .insert(schema.eligibilityRules)
    .values({
      benefitId: input.benefitId,
      ruleType: input.ruleType,
      operator: input.operator,
      value: input.value,
      errorMessage: input.errorMessage,
      priority: input.priority ?? 0,
    })
    .returning();

  if (!row) throw new Error("Failed to create eligibility rule");

  await writeAuditLog({
    db,
    actor: currentEmployee,
    actionType: "ELIGIBILITY_RULE_CREATED",
    entityType: "eligibility_rule",
    entityId: row.id,
    benefitId: input.benefitId,
    after: row,
  });

  return row;
};
