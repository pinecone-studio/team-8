import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";
import { writeAuditLog } from "../helpers/audit";

export const rejectRuleProposal = async (
  _: unknown,
  { id, reason }: { id: string; reason: string },
  { db, currentEmployee }: GraphQLContext & { db: Database },
) => {
  const admin = requireHrAdmin(currentEmployee);

  const [existing] = await db
    .select()
    .from(schema.ruleProposals)
    .where(eq(schema.ruleProposals.id, id))
    .limit(1);

  if (!existing) throw new Error("Rule proposal not found.");
  if (existing.status !== "pending") throw new Error("Proposal is no longer pending.");

  const [updated] = await db
    .update(schema.ruleProposals)
    .set({
      status: "rejected",
      reviewedByEmployeeId: admin.id,
      reviewedAt: new Date().toISOString(),
      reason,
    })
    .where(eq(schema.ruleProposals.id, id))
    .returning();

  await writeAuditLog({
    db,
    actor: admin,
    actionType: "RULE_PROPOSAL_REJECTED",
    entityType: "rule_proposal",
    entityId: id,
    benefitId: existing.benefitId,
    reason,
    before: { status: "pending", proposedByEmployeeId: existing.proposedByEmployeeId },
    after: {
      status: "rejected",
      reviewedByEmployeeId: admin.id,
      changeType: existing.changeType,
      summary: existing.summary,
    },
  });

  return updated;
};
