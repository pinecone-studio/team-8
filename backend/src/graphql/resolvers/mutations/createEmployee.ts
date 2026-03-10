import { schema } from "../../../db";
import { MutationResolvers } from "../../generated/graphql";

export const createEmployee: MutationResolvers["createEmployee"] = async (_, { input }, { db }) => {
  const results = await db
    .insert(schema.employees)
    .values(input)
    .returning();
  return results[0];
};
