import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { GraphQLContext } from "../../context";

export const setBenefitRules = async (
  _: unknown,
  { benefitId, rules }: { benefitId: string; rules: any[] },
  { db }: GraphQLContext
) => {
  await db
    .delete(schema.benefitRules)
    .where(eq(schema.benefitRules.benefitId, benefitId));

  if (rules.length === 0) {
    return [];
  }

  const inserted = await db
    .insert(schema.benefitRules)
    .values(
      rules.map((rule) => ({
        benefitId,
        ruleType: rule.ruleType,
        conditionJson: rule.conditionJson,
        blockingMessage: rule.blockingMessage ?? null,
        priority: rule.priority ?? 0,
        isBlocking: rule.isBlocking ?? 1,
      }))
    )
    .returning();

  return inserted;
};
