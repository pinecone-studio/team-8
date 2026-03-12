import { eq } from "drizzle-orm";
import { schema } from "../../db";
import { getBenefitConfig } from "../../eligibility";
import { createContractViewToken, getContractViewUrl } from "../../contracts";

/** Resolve Benefit.employeePercent when returned from Query.benefits (config may omit it) */
export const Benefit = {
  employeePercent(parent: { subsidyPercent: number; employeePercent?: number }) {
    return parent.employeePercent ?? 100 - parent.subsidyPercent;
  },
};

/** Resolve BenefitEligibility.benefit from benefitId */
export const BenefitEligibility = {
  benefit(parent: { benefitId: string }) {
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
        duration: null,
      };
    }
    const employeePercent =
      config.employeePercent ?? (100 - config.subsidyPercent);
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
      duration: config.duration ?? null,
    };
  },
};

/** Resolve BenefitRequest fields. */
export const BenefitRequest = {
  async employee(
    parent: { employeeId: string },
    _: unknown,
    { db }: { db: import("../../db").Database }
  ) {
    const rows = await db
      .select()
      .from(schema.employees)
      .where(eq(schema.employees.id, parent.employeeId));
    return rows[0] ?? null;
  },
  benefit(parent: { benefitId: string }) {
    const config = getBenefitConfig(parent.benefitId);
    if (!config) return null;
    return {
      id: config.id,
      name: config.name,
      nameEng: config.nameEng ?? null,
      category: config.category,
      subsidyPercent: config.subsidyPercent,
      employeePercent: config.employeePercent ?? 100 - config.subsidyPercent,
      unitPrice: config.unitPrice ?? null,
      vendorName: config.vendorName,
      requiresContract: config.requiresContract,
      flowType: config.flowType,
      optionsDescription: config.optionsDescription ?? null,
      duration: config.duration ?? null,
    };
  },
  async viewContractUrl(
    parent: { id: string; benefitId: string; status: string },
    _: unknown,
    { db, env, baseUrl }: import("../context").GraphQLContext
  ): Promise<string | null> {
    if (parent.status !== "pending") return null;
    const config = getBenefitConfig(parent.benefitId);
    if (!config?.requiresContract || !env.CONTRACT_VIEW_TOKENS) return null;
    const contracts = await db
      .select()
      .from(schema.contracts)
      .where(eq(schema.contracts.benefitId, parent.benefitId));
    const active = contracts.find((c) => c.isActive);
    if (!active) return null;
    const token = await createContractViewToken(env.CONTRACT_VIEW_TOKENS, active.r2ObjectKey);
    return getContractViewUrl(baseUrl, token);
  },
};
