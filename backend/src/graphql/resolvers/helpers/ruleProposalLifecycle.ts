import { and, eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database, Employee } from "../../../db";
import { writeAuditLog } from "./audit";

interface RejectPendingRuleProposalsParams {
  db: Database;
  actor: Employee;
  benefitId: string;
  ruleId: string;
  reason: string;
  metadata?: Record<string, unknown>;
}

export async function rejectPendingRuleProposalsForRule(
  params: RejectPendingRuleProposalsParams,
): Promise<string[]> {
  const { db, actor, benefitId, ruleId, reason, metadata } = params;

  const reviewedAt = new Date().toISOString();
  const rejected = await db
    .update(schema.ruleProposals)
    .set({
      status: "rejected",
      reviewedByEmployeeId: actor.id,
      reviewedAt,
      reason,
    })
    .where(
      and(
        eq(schema.ruleProposals.benefitId, benefitId),
        eq(schema.ruleProposals.ruleId, ruleId),
        eq(schema.ruleProposals.status, "pending"),
      ),
    )
    .returning();

  await Promise.all(
    rejected.map((proposal) =>
      writeAuditLog({
        db,
        actor,
        actionType: "RULE_PROPOSAL_REJECTED",
        entityType: "rule_proposal",
        entityId: proposal.id,
        benefitId: proposal.benefitId,
        reason,
        before: {
          status: "pending",
          proposedByEmployeeId: proposal.proposedByEmployeeId,
          changeType: proposal.changeType,
          summary: proposal.summary,
        },
        after: {
          status: "rejected",
          reviewedByEmployeeId: actor.id,
          autoRejected: true,
        },
        metadata,
      }),
    ),
  );

  return rejected.map((proposal) => proposal.id);
}
