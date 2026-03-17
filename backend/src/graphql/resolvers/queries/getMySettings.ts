import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAuth } from "../../../auth";

const DEFAULTS = {
  notificationEmail: true,
  notificationEligibility: true,
  notificationRenewals: false,
  language: "English",
  timezone: "UTC",
};

export const getMySettings = async (
  _: unknown,
  __: unknown,
  { db, currentEmployee }: GraphQLContext,
) => {
  const employee = requireAuth(currentEmployee);

  const rows = await db
    .select()
    .from(schema.employeeSettings)
    .where(eq(schema.employeeSettings.employeeId, employee.id))
    .limit(1);

  // Return persisted settings or defaults when no row exists yet
  return rows[0] ?? { ...DEFAULTS, employeeId: employee.id, updatedAt: new Date().toISOString() };
};
