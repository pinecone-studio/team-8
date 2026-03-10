import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { MutationResolvers } from "../../generated/graphql";

export const deleteEmployee: MutationResolvers["deleteEmployee"] = async (_, { id }, { db }) => {
  const results = await db
    .delete(schema.employees)
    .where(eq(schema.employees.id, id))
    .returning();
  return results.length > 0;
};
