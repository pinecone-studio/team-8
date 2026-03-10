import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { computeAllStatuses } from "../../../eligibility";

export const getMyBenefits = async (
  _: unknown,
  { employeeId }: { employeeId: string },
  { db }: { db: import("../../../db").Database }
) => {
  const employees = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.id, employeeId));
  const employee = employees[0];
  if (!employee) return [];

  const requests = await db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.employeeId, employeeId));

  const requestStatusByBenefit: Record<string, "pending" | "approved" | "rejected" | "cancelled"> = {};
  for (const r of requests) {
    requestStatusByBenefit[r.benefitId] = r.status as "pending" | "approved" | "rejected" | "cancelled";
  }

  return computeAllStatuses(employee, requestStatusByBenefit);
};
