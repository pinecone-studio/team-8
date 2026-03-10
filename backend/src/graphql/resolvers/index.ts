import { queries } from "./queries";
import { mutations } from "./mutations";
import { BenefitEligibility } from "./benefit";

export const resolvers = {
  Query: queries,
  Mutation: mutations,
  BenefitEligibility,
};
