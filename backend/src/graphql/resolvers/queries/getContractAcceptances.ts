import { and, desc, eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";

export const getContractAcceptances = async (
  _: unknown,
  {
    employeeId,
    benefitId,
    requestId,
  }: {
    employeeId?: string | null;
    benefitId?: string | null;
    requestId?: string | null;
  },
  { db, currentEmployee }: GraphQLContext,
) => {
  requireHrAdmin(currentEmployee);

  const conditions = [];
  if (employeeId) conditions.push(eq(schema.contractAcceptances.employeeId, employeeId));
  if (benefitId) conditions.push(eq(schema.contractAcceptances.benefitId, benefitId));
  if (requestId) conditions.push(eq(schema.contractAcceptances.requestId, requestId));

  return db
    .select()
    .from(schema.contractAcceptances)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(schema.contractAcceptances.createdAt));
};
