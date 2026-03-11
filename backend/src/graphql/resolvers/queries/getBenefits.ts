import { getAllBenefitConfigs } from "../../../eligibility";

export const getBenefits = async (
  _: unknown,
  { category }: { category?: string | null },
  __: unknown
) => {
  const all = getAllBenefitConfigs();
  if (category) {
    return all.filter((b) => b.category === category);
  }
  return all;
};
