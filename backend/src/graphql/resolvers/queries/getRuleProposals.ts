import { and, desc, eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";

type GetRuleProposalsArgs = {
  benefitId?: string | null;
  status?: string | null;
};

export const getRuleProposals = async (
  _: unknown,
  { benefitId, status }: GetRuleProposalsArgs,
  { db, currentEmployee }: GraphQLContext & { db: Database },
) => {
  requireHrAdmin(currentEmployee);

  const conditions = [];
  if (benefitId) conditions.push(eq(schema.ruleProposals.benefitId, benefitId));
  if (status) conditions.push(eq(schema.ruleProposals.status, status));

  const rows = await db
    .select()
    .from(schema.ruleProposals)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(schema.ruleProposals.proposedAt));

  return rows;
};
