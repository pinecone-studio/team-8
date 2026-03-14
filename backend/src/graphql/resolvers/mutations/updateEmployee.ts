import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { MutationResolvers } from "../../generated/graphql";
import type { GraphQLContext } from "../../context";

const SELF_MUTABLE_FIELDS = new Set([
  "name",
  "nameEng",
]);

export const updateEmployee: MutationResolvers["updateEmployee"] = async (
  _,
  { id, input },
  { db, currentUser }: GraphQLContext,
) => {
  if (!currentUser.employee) {
    throw new Error("Not authenticated.");
  }

  const isSelf = currentUser.employee.id === id;
  const isAdmin = currentUser.isAdmin;

  if (!isAdmin && !isSelf) {
    throw new Error("Not authorized to update this employee.");
  }

  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null) continue;

    if (!isAdmin && !SELF_MUTABLE_FIELDS.has(key)) {
      continue;
    }

    updates[key] = value;
  }

  if (Object.keys(updates).length === 0) {
    return currentUser.employee;
  }

  updates.updatedAt = new Date().toISOString();

  const results = await db
    .update(schema.employees)
    .set(updates)
    .where(eq(schema.employees.id, id))
    .returning();

  return results[0] ?? null;
};
