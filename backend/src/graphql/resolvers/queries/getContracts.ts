import { desc, eq } from "drizzle-orm";
import { schema } from "../../../db";
import { getBenefitConfig } from "../../../eligibility";
import { createContractViewToken, getContractViewUrl } from "../../../contracts";
import type { GraphQLContext } from "../../context";

type ContractsArgs = { benefitId?: string | null };

export const getContracts = async (
  _: unknown,
  { benefitId }: ContractsArgs,
  { db, env, baseUrl }: GraphQLContext
) => {
  const rows = benefitId
    ? await db
        .select()
        .from(schema.contracts)
        .where(eq(schema.contracts.benefitId, benefitId))
        .orderBy(desc(schema.contracts.effectiveDate))
    : await db
        .select()
        .from(schema.contracts)
        .orderBy(desc(schema.contracts.effectiveDate));

  return Promise.all(
    rows.map(async (row) => {
      const benefitName = getBenefitConfig(row.benefitId)?.name ?? null;
      let viewUrl: string | null = null;
      try {
        const token = await createContractViewToken(env.CONTRACT_VIEW_TOKENS, row.r2ObjectKey);
        viewUrl = getContractViewUrl(baseUrl, token);
      } catch {
        viewUrl = null;
      }

      return {
        id: row.id,
        benefitId: row.benefitId,
        benefitName,
        vendorName: row.vendorName,
        version: row.version,
        effectiveDate: row.effectiveDate,
        expiryDate: row.expiryDate,
        isActive: row.isActive,
        viewUrl,
      };
    })
  );
};
