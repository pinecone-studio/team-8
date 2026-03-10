import { getBenefitConfig } from "../../eligibility";

/** Resolve BenefitEligibility.benefit from benefitId */
export const BenefitEligibility = {
  benefit(parent: { benefitId: string }) {
    const config = getBenefitConfig(parent.benefitId);
    if (!config) {
      return {
        id: parent.benefitId,
        name: "Unknown",
        category: "other",
        subsidyPercent: 0,
        vendorName: null,
        requiresContract: false,
      };
    }
    return {
      id: config.id,
      name: config.name,
      category: config.category,
      subsidyPercent: config.subsidyPercent,
      vendorName: config.vendorName,
      requiresContract: config.requiresContract,
    };
  },
};
