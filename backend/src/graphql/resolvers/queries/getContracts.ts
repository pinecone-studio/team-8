import { desc, eq } from "drizzle-orm";
import { schema } from "../../../db";
import { getBenefitConfig } from "../../../eligibility";
import { createContractViewToken, getContractViewUrl } from "../../../contracts";
import type { GraphQLContext } from "../../context";

type ContractsArgs = { benefitId?: string | null };

export const getContracts = async (
  _: unknown,
  { benefitId }: ContractsArgs,
  { db, env, baseUrl }: GraphQLContext,
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

  // Preload benefit names from D1 for all benefitIds
  const benefitIds = [...new Set(rows.map((r) => r.benefitId))];
  const dbBenefitsMap = new Map<string, string>();
  if (benefitIds.length > 0) {
    const dbBenefits = await db.select().from(schema.benefits);
    for (const b of dbBenefits) {
      dbBenefitsMap.set(b.id, b.name);
    }
  }

  return Promise.all(
    rows.map(async (row) => {
      // Prefer D1 name, fall back to static config name
      const benefitName =
        dbBenefitsMap.get(row.benefitId) ??
        getBenefitConfig(row.benefitId)?.name ??
        null;
      let viewUrl: string | null = null;
      try {
        const token = await createContractViewToken(
          env.CONTRACT_VIEW_TOKENS,
          row.r2ObjectKey,
        );
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
    }),
  );
};
