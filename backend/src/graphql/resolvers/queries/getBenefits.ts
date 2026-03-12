import { and, eq } from "drizzle-orm";
import { schema } from "../../../db";
import { mapBenefitRecordToGraphql } from "../helpers/employeeBenefits";

export const getBenefits = async (
  _: unknown,
  { category }: { category?: string | null },
  { db }: { db: import("../../../db").Database }
) => {
  const filters = category
    ? and(
        eq(schema.benefits.isActive, true),
        eq(schema.benefits.category, category)
      )
    : eq(schema.benefits.isActive, true);

  const benefits = await db.select().from(schema.benefits).where(filters);
  return benefits.map(mapBenefitRecordToGraphql);
};
