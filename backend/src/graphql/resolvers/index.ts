import { queries } from "./queries";
import { mutations } from "./mutations";
import { DateTime } from "./scalars";
import { Employee } from "./employee";
import {
  Benefit,
  BenefitEligibility,
  BenefitRequest,
  EmployeeSignedContract,
} from "./benefit";

export const resolvers = {
  Query: queries,
  Mutation: mutations,
  DateTime,
  Employee,
  Benefit,
  BenefitEligibility,
  BenefitRequest,
  EmployeeSignedContract,
};
