import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { GraphQLContext } from "../../context";

export const benefitFieldResolvers = {
  rules: async (
    benefit: { id: string },
    _: unknown,
    { db }: GraphQLContext
  ) => {
    return db
      .select()
      .from(schema.benefitRules)
      .where(eq(schema.benefitRules.benefitId, benefit.id));
  },
};
