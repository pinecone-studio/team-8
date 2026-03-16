import { and, desc, eq, gte, lte } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";

export const getAuditLogs = async (
  _: unknown,
  {
    employeeId,
    benefitId,
    actionType,
    fromDate,
    toDate,
    limit,
  }: {
    employeeId?: string | null;
    benefitId?: string | null;
    actionType?: string | null;
    fromDate?: string | null;
    toDate?: string | null;
    limit?: number | null;
  },
  { db, currentEmployee }: GraphQLContext,
) => {
  requireHrAdmin(currentEmployee);

  const conditions = [];
  if (employeeId) {
    conditions.push(eq(schema.auditLogs.targetEmployeeId, employeeId));
  }
  if (benefitId) {
    conditions.push(eq(schema.auditLogs.benefitId, benefitId));
  }
  if (actionType) {
    conditions.push(eq(schema.auditLogs.actionType, actionType));
  }
  if (fromDate) {
    conditions.push(gte(schema.auditLogs.createdAt, fromDate));
  }
  if (toDate) {
    // Append end-of-day so the filter includes all events on the selected date
    conditions.push(lte(schema.auditLogs.createdAt, `${toDate}T23:59:59.999Z`));
  }

  const query = db
    .select()
    .from(schema.auditLogs)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(schema.auditLogs.createdAt))
    .limit(limit ?? 100);

  return query;
};
