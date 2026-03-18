import { eq } from "drizzle-orm";
import { getBenefitConfig } from "../../eligibility";
import { schema } from "../../db";
import type { GraphQLContext } from "../context";
import { mapBenefitRecordToGraphql } from "./helpers/employeeBenefits";
import { createContractViewToken, getContractViewUrl } from "../../contracts";

/** Resolve Benefit.employeePercent when returned from Query.benefits (config may omit it) */
export const Benefit = {
  employeePercent(parent: { subsidyPercent: number; employeePercent?: number }) {
    return parent.employeePercent ?? 100 - parent.subsidyPercent;
  },
  approvalPolicy(parent: { approvalPolicy?: string }) {
    return parent.approvalPolicy ?? "hr";
  },
};

/** Resolve BenefitRequest.viewContractUrl on-demand (for list queries).
 *  Only generates a URL for requests in awaiting_contract_acceptance status. */
export const BenefitRequest = {
  async viewContractUrl(
    parent: { benefitId: string; status: string; viewContractUrl?: string | null },
    _: unknown,
    { db, env, baseUrl }: GraphQLContext,
  ): Promise<string | null> {
    // Already computed (e.g., returned directly from requestBenefit mutation)
    if (parent.viewContractUrl) return parent.viewContractUrl;
    // Only relevant when awaiting employee contract acceptance
    if (parent.status !== "awaiting_contract_acceptance") return null;
    if (!env.CONTRACT_VIEW_TOKENS) return null;

    const contracts = await db
      .select()
      .from(schema.contracts)
      .where(eq(schema.contracts.benefitId, parent.benefitId));
    const active = contracts.find((c) => c.isActive);
    if (!active) return null;

    const token = await createContractViewToken(env.CONTRACT_VIEW_TOKENS, active.r2ObjectKey);
    return getContractViewUrl(baseUrl, token);
  },

  async employeeDocumentUrl(
    parent: { employeeDocumentKey?: string | null },
    _: unknown,
    { env, baseUrl }: GraphQLContext,
  ): Promise<string | null> {
    if (!parent.employeeDocumentKey) return null;
    if (!env.CONTRACT_VIEW_TOKENS) return null;
    try {
      const token = await createContractViewToken(env.CONTRACT_VIEW_TOKENS, parent.employeeDocumentKey);
      return getContractViewUrl(baseUrl, token);
    } catch {
      return null;
    }
  },
};

/** Resolve BenefitEligibility.benefit from benefitId — D1 first, static config fallback */
export const BenefitEligibility = {
  async benefit(
    parent: {
      benefit?: {
        category: string;
        employeePercent?: number;
        id: string;
        name: string;
        nameEng?: string | null;
        optionsDescription?: string | null;
        requiresContract: boolean;
        subsidyPercent: number;
        unitPrice?: number | null;
        vendorName?: string | null;
        flowType?: string;
        approvalPolicy?: string;
      };
      benefitId: string;
    },
    _: unknown,
    { db }: GraphQLContext,
  ) {
    if (parent.benefit) {
      return parent.benefit;
    }

    // Try D1 first
    const rows = await db
      .select()
      .from(schema.benefits)
      .where(eq(schema.benefits.id, parent.benefitId));
    if (rows[0]) {
      return mapBenefitRecordToGraphql(rows[0]);
    }

    // Fall back to static config
    const config = getBenefitConfig(parent.benefitId);
    if (!config) {
      return {
        id: parent.benefitId,
        name: "Unknown",
        nameEng: null,
        category: "other",
        subsidyPercent: 0,
        employeePercent: 100,
        unitPrice: null,
        vendorName: null,
        requiresContract: false,
        flowType: "normal",
        optionsDescription: null,
        approvalPolicy: "hr",
      };
    }
    const employeePercent =
      config.employeePercent ?? 100 - config.subsidyPercent;
    return {
      id: config.id,
      name: config.name,
      nameEng: config.nameEng ?? null,
      category: config.category,
      subsidyPercent: config.subsidyPercent,
      employeePercent,
      unitPrice: config.unitPrice ?? null,
      vendorName: config.vendorName,
      requiresContract: config.requiresContract,
      flowType: config.flowType,
      optionsDescription: config.optionsDescription ?? null,
      approvalPolicy: "hr",
    };
  },
};
