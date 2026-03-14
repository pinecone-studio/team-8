import { schema } from "../../../db";
import { mapBenefitRecordToGraphql } from "../helpers/employeeBenefits";
import type { GraphQLContext } from "../../context";

export const getAdminBenefits = async (
  _: unknown,
  __: unknown,
  { db, currentUser }: GraphQLContext,
) => {
  if (!currentUser.isAdmin) {
    throw new Error("Not authorized to view admin benefits.");
  }

  const rows = await db.select().from(schema.benefits);
  return rows.map(mapBenefitRecordToGraphql);
};
