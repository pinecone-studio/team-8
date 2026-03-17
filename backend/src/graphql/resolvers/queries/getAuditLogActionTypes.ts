import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";

export const getAuditLogActionTypes = async (
  _: unknown,
  __: unknown,
  { db, currentEmployee }: GraphQLContext,
) => {
  requireHrAdmin(currentEmployee);

  const rows = await db
    .selectDistinct({ actionType: schema.auditLogs.actionType })
    .from(schema.auditLogs);

  return rows
    .map((r) => r.actionType)
    .filter((t): t is string => !!t)
    .sort();
};
