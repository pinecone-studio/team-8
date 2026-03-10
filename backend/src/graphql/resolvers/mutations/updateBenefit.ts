import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { GraphQLContext } from "../../context";

export const updateBenefit = async (
  _: unknown,
  { id, input }: { id: string; input: any },
  { db }: GraphQLContext
) => {
  const [benefit] = await db
    .update(schema.benefits)
    .set({
      name: input.name,
      category: input.category,
      description: input.description ?? null,
      subsidyPercent: input.subsidyPercent ?? 0,
      isCore: input.isCore ?? 0,
      active: input.active ?? 1,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(schema.benefits.id, id))
    .returning();
  return benefit || null;
};
