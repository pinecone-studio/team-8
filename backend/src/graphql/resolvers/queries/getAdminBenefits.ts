import { schema } from "../../../db";
import { mapBenefitRecordToGraphql } from "../helpers/employeeBenefits";

export const getAdminBenefits = async (
  _: unknown,
  __: unknown,
  { db }: { db: import("../../../db").Database }
) => {
  const rows = await db.select().from(schema.benefits);
  return rows.map(mapBenefitRecordToGraphql);
};
