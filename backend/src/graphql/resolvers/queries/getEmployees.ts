import { schema } from "../../../db";
import { QueryResolvers } from "../../generated/graphql";

/** Өгөгдлийн сан дахь бүх ажилчдыг буцаана (хязгааргүй). */
export const getEmployees: QueryResolvers["getEmployees"] = async (_, __, { db }) => {
  return db.select().from(schema.employees);
};
