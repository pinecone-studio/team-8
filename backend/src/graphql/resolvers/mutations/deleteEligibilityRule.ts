import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";
import { writeAuditLog } from "../helpers/audit";

export const deleteEligibilityRule = async (
  _: unknown,
  { id }: { id: string },
  { db, currentEmployee }: GraphQLContext,
) => {
  requireHrAdmin(currentEmployee);

  const existing = await db
    .select()
    .from(schema.eligibilityRules)
    .where(eq(schema.eligibilityRules.id, id));
  const before = existing[0];
  if (!before) return false;

  await db.delete(schema.eligibilityRules).where(eq(schema.eligibilityRules.id, id));

  await writeAuditLog({
    db,
    actor: currentEmployee,
    actionType: "ELIGIBILITY_RULE_DELETED",
    entityType: "eligibility_rule",
    entityId: id,
    benefitId: before.benefitId,
    before,
  });

  return true;
};
