import { schema } from "../../../db";
import { GraphQLContext } from "../../context";

export const createBenefit = async (
  _: unknown,
  { input }: { input: any },
  { db }: GraphQLContext
) => {
  const [benefit] = await db
    .insert(schema.benefits)
    .values({
      name: input.name,
      category: input.category,
      description: input.description ?? null,
      subsidyPercent: input.subsidyPercent ?? 0,
      isCore: input.isCore ?? 0,
      active: input.active ?? 1,
    })
    .returning();
  return benefit;
};
