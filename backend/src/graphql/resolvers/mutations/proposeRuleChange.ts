import { schema } from "../../../db";
import type { Database } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";
import { writeAuditLog } from "../helpers/audit";

type ProposeRuleChangeInput = {
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
