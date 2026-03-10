import { schema } from "../../../db";
import { GraphQLContext } from "../../context";

export const getBenefits = async (
  _: unknown,
  __: unknown,
  { db }: GraphQLContext
) => {
  return db.select().from(schema.benefits);
};
