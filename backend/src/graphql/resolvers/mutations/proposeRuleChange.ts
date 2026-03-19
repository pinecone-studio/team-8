import { and, eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";
import { writeAuditLog } from "../helpers/audit";

type ProposeRuleChangeInput = {
  proposalId?: string | null;
  benefitId: string;
  ruleId?: string | null;
  changeType: string; // create | update | delete
  proposedData: string; // JSON
  summary: string;
};

export const proposeRuleChange = async (
  _: unknown,
  { input }: { input: ProposeRuleChangeInput },
  { db, currentEmployee }: GraphQLContext & { db: Database },
) => {
  const admin = requireHrAdmin(currentEmployee);

  if (input.proposalId) {
    const [existingProposal] = await db
      .select()
      .from(schema.ruleProposals)
      .where(eq(schema.ruleProposals.id, input.proposalId))
      .limit(1);

    if (!existingProposal) {
      throw new Error("Pending proposal not found.");
    }
    if (existingProposal.status !== "pending") {
      throw new Error("Only pending proposals can be revised.");
    }
    if (existingProposal.proposedByEmployeeId !== admin.id) {
      throw new Error(
        "Only the original proposer can revise this pending proposal.",
      );
    }

    const [updatedProposal] = await db
      .update(schema.ruleProposals)
      .set({
        benefitId: input.benefitId,
        ruleId: input.ruleId ?? null,
        changeType: input.changeType,
        proposedData: input.proposedData,
        summary: input.summary,
        proposedAt: new Date().toISOString(),
      })
      .where(eq(schema.ruleProposals.id, input.proposalId))
      .returning();

    await writeAuditLog({
      db,
      actor: admin,
      actionType: "RULE_PROPOSAL_SUBMITTED",
      entityType: "rule_proposal",
      entityId: updatedProposal.id,
      benefitId: input.benefitId,
      reason: input.summary,
      before: {
        changeType: existingProposal.changeType,
        ruleId: existingProposal.ruleId,
        summary: existingProposal.summary,
      },
      after: {
        changeType: input.changeType,
        ruleId: input.ruleId ?? null,
        summary: input.summary,
        revised: true,
      },
    });

    return updatedProposal;
  }

  if (input.ruleId && input.changeType !== "create") {
    const [existingPendingProposal] = await db
      .select()
      .from(schema.ruleProposals)
      .where(
        and(
          eq(schema.ruleProposals.benefitId, input.benefitId),
          eq(schema.ruleProposals.ruleId, input.ruleId),
          eq(schema.ruleProposals.status, "pending"),
        ),
      )
      .limit(1);

    if (existingPendingProposal) {
      throw new Error(
        "This rule already has a pending proposal. Revise the existing proposal instead.",
      );
    }
  }

  const [proposal] = await db
    .insert(schema.ruleProposals)
    .values({
      benefitId: input.benefitId,
      ruleId: input.ruleId ?? null,
      changeType: input.changeType,
      proposedData: input.proposedData,
      summary: input.summary,
      status: "pending",
      proposedByEmployeeId: admin.id,
    })
    .returning();

  await writeAuditLog({
    db,
    actor: admin,
    actionType: "RULE_PROPOSAL_SUBMITTED",
    entityType: "rule_proposal",
    entityId: proposal.id,
    benefitId: input.benefitId,
    reason: input.summary,
    after: {
      changeType: input.changeType,
      ruleId: input.ruleId ?? null,
      summary: input.summary,
    },
  });

  return proposal;
};
