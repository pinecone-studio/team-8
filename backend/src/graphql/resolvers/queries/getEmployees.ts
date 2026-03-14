import { schema } from "../../../db";
import { QueryResolvers } from "../../generated/graphql";

/** Өгөгдлийн сан дахь бүх ажилчдыг буцаана (хязгааргүй). Admin only. */
export const getEmployees: QueryResolvers["getEmployees"] = async (
  _,
  __,
  { db, currentUser },
) => {
  if (!currentUser.isAdmin) {
    throw new Error("Not authorized to view all employees.");
  }

  return db.select().from(schema.employees);
};
