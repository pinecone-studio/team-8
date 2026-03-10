import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { GraphQLContext } from "../../context";

export const getBenefit = async (
  _: unknown,
  { id }: { id: string },
  { db }: GraphQLContext
) => {
  const benefits = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, id));
  return benefits[0] || null;
};
