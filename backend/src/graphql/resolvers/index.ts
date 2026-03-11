import { queries } from "./queries";
import { mutations } from "./mutations";
import { DateTime } from "./scalars";
import { Employee } from "./employee";
import { BenefitEligibility } from "./benefit";

export const resolvers = {
  Query: queries,
  Mutation: mutations,
  DateTime,
  Employee,
  BenefitEligibility,
};
