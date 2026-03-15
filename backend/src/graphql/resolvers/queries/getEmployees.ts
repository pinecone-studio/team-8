import { and, eq, sql } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAdmin } from "../../../auth";

type GetEmployeesArgs = {
  search?: string | null;
  department?: string | null;
  limit?: number | null;
};

export const getEmployees = async (
  _: unknown,
  { search, department, limit }: GetEmployeesArgs,
  { db, currentEmployee }: GraphQLContext,
) => {
  requireAdmin(currentEmployee);

  const conditions = [];

  if (department) {
    conditions.push(eq(schema.employees.department, department));
  }

  if (search) {
    const pattern = `%${search}%`;
    conditions.push(
      sql`(${schema.employees.name} LIKE ${pattern} OR ${schema.employees.email} LIKE ${pattern} OR ${schema.employees.nameEng} LIKE ${pattern})`,
    );
  }

  const query = db
    .select()
    .from(schema.employees)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(limit ?? 50);

  return query;
};
