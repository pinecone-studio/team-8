import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAdmin } from "../../../auth";

export const getDepartments = async (
  _: unknown,
  __: unknown,
  { db, currentEmployee }: GraphQLContext,
) => {
  requireAdmin(currentEmployee);
  const rows = await db
    .selectDistinct({ department: schema.employees.department })
    .from(schema.employees);
  return rows
    .map((r) => r.department)
    .filter((d): d is string => !!d)
    .sort();
};
