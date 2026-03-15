import { and, desc, eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";

export const getEnrollments = async (
  _: unknown,
  {
    employeeId,
    benefitId,
  }: {
    employeeId?: string | null;
    benefitId?: string | null;
  },
  { db, currentEmployee }: GraphQLContext,
) => {
  requireHrAdmin(currentEmployee);

  const conditions = [];
  if (employeeId) conditions.push(eq(schema.employeeBenefitEnrollments.employeeId, employeeId));
  if (benefitId) conditions.push(eq(schema.employeeBenefitEnrollments.benefitId, benefitId));

  return db
    .select()
    .from(schema.employeeBenefitEnrollments)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(schema.employeeBenefitEnrollments.createdAt));
};
