import { queries } from "./queries";
import { mutations } from "./mutations";
import { benefitFieldResolvers } from "./types/benefit";

export const resolvers = {
  Query: queries,
  Mutation: mutations,
  Benefit: benefitFieldResolvers,
};
