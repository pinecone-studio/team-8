import { schema } from "../../../db";
import { QueryResolvers } from "../../generated/graphql";

export const getEmployees: QueryResolvers["getEmployees"] = async (_, __, { db }) => {
  return db.select().from(schema.employees);
};
