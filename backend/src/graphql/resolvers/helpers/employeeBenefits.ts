import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { computeAllStatuses } from "../../../eligibility";
import type { Database } from "../../../db";

/**
 * Get benefit eligibilities for an employee (shared by myBenefits, getEmployeeBenefits, Employee.benefits).
 */
export async function getBenefitsForEmployee(
  db: Database,
  employeeId: string
): Promise<ReturnType<typeof computeAllStatuses>> {
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
}
