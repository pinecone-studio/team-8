import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { MutationResolvers } from "../../generated/graphql";

export const updateEmployee: MutationResolvers["updateEmployee"] = async (_, { id, input }, { db }) => {
  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && value !== null) {
      updates[key] = value;
    }
  }
  updates.updatedAt = new Date().toISOString();

  const results = await db
    .update(schema.employees)
    .set(updates)
    .where(eq(schema.employees.id, id))
    .returning();
  return results[0] ?? null;
};
