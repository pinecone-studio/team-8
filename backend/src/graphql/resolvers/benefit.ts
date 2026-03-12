import { getBenefitConfig } from "../../eligibility";

/** Resolve Benefit.employeePercent when returned from Query.benefits (config may omit it) */
export const Benefit = {
  employeePercent(parent: { subsidyPercent: number; employeePercent?: number }) {
    return parent.employeePercent ?? 100 - parent.subsidyPercent;
  },
};

/** Resolve BenefitEligibility.benefit from benefitId */
export const BenefitEligibility = {
  benefit(parent: {
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
    };
    benefitId: string;
  }) {
    if (parent.benefit) {
      return parent.benefit;
    }

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
    };
  },
};
