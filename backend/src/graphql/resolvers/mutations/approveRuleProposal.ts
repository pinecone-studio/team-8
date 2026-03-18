import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";
import { writeAuditLog } from "../helpers/audit";
import { recomputeAllEmployeeEligibilities } from "../helpers/benefitCatalogRefresh";

export const approveRuleProposal = async (
  _: unknown,
  { id, reason }: { id: string; reason?: string | null },
  { db, env, currentEmployee }: GraphQLContext & { db: Database },
) => {
  const admin = requireHrAdmin(currentEmployee);

  const [existing] = await db
    .select()
    .from(schema.ruleProposals)
    .where(eq(schema.ruleProposals.id, id))
    .limit(1);

  if (!existing) throw new Error("Rule proposal not found.");
  if (existing.status !== "pending") throw new Error("Proposal is no longer pending.");

  // Second-approver rule: cannot approve your own proposal
  if (existing.proposedByEmployeeId === admin.id) {
    throw new Error("You cannot approve your own proposal. A second HR admin must review it.");
  }

  const [updated] = await db
    .update(schema.ruleProposals)
    .set({
      status: "approved",
      reviewedByEmployeeId: admin.id,
      reviewedAt: new Date().toISOString(),
      reason: reason ?? null,
    })
    .where(eq(schema.ruleProposals.id, id))
    .returning();

  // Apply the rule change now that it's approved
  const proposedData = JSON.parse(existing.proposedData);

  if (existing.changeType === "create") {
    await db.insert(schema.eligibilityRules).values({
      benefitId: existing.benefitId,
      ruleType: proposedData.ruleType,
      operator: proposedData.operator,
      value: proposedData.value,
      errorMessage: proposedData.errorMessage,
      priority: proposedData.priority ?? 0,
      isActive: true,
    });
  } else if (existing.changeType === "update" && existing.ruleId) {
    await db
      .update(schema.eligibilityRules)
      .set({
        ruleType: proposedData.ruleType,
        operator: proposedData.operator,
        value: proposedData.value,
        errorMessage: proposedData.errorMessage,
        priority: proposedData.priority,
        isActive: proposedData.isActive,
      })
      .where(eq(schema.eligibilityRules.id, existing.ruleId));
  } else if (existing.changeType === "delete" && existing.ruleId) {
    await db
      .delete(schema.eligibilityRules)
      .where(eq(schema.eligibilityRules.id, existing.ruleId));
  }

  // Write audit log for the approval
  await writeAuditLog({
    db,
    actor: admin,
    actionType: "RULE_PROPOSAL_APPROVED",
    entityType: "rule_proposal",
    entityId: id,
    benefitId: existing.benefitId,
    reason: reason ?? null,
    before: { status: "pending", proposedByEmployeeId: existing.proposedByEmployeeId },
    after: {
      status: "approved",
      reviewedByEmployeeId: admin.id,
      changeType: existing.changeType,
      summary: existing.summary,
    },
  });

  try {
    await recomputeAllEmployeeEligibilities(db, {
      source: "manual",
      actor: admin,
      kvCache: env.ELIGIBILITY_CACHE,
      metadata: {
        trigger: "approveRuleProposal",
        proposalId: id,
        benefitId: existing.benefitId,
        changeType: existing.changeType,
      },
    });
  } catch (err) {
    console.error(
      `[approveRuleProposal] Failed to recompute eligibilities after approving proposal ${id}:`,
      err,
    );
  }

  return updated;
};
