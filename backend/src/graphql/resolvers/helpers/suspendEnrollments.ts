import { and, eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database } from "../../../db";
import type { Employee } from "../../../db";
import { writeAuditLog } from "./audit";

/**
 * Finds all active enrollments for the given (employeeId, benefitId) pair,
 * marks them as `suspended`, and writes an audit log entry for each one.
 *
 * Called when eligibility for an employee+benefit is forced to "locked" via
 * an override or an approved rule-proposal deletion/update.
 *
 * Returns the number of enrollments suspended.
 */
export async function suspendActiveEnrollments(
  db: Database,
  actor: Employee | null,
  employeeId: string,
  benefitId: string,
  reason: string,
): Promise<number> {
  const now = new Date().toISOString();

  const activeEnrollments = await db
    .select()
    .from(schema.employeeBenefitEnrollments)
    .where(
      and(
        eq(schema.employeeBenefitEnrollments.employeeId, employeeId),
        eq(schema.employeeBenefitEnrollments.benefitId, benefitId),
        eq(schema.employeeBenefitEnrollments.status, "active"),
      ),
    );

  if (activeEnrollments.length === 0) return 0;

  for (const enrollment of activeEnrollments) {
    await db
      .update(schema.employeeBenefitEnrollments)
      .set({ status: "suspended", updatedAt: now })
      .where(eq(schema.employeeBenefitEnrollments.id, enrollment.id));

    await writeAuditLog({
      db,
      actor,
      actionType: "ENROLLMENT_SUSPENDED",
      entityType: "enrollment",
      entityId: enrollment.id,
      targetEmployeeId: employeeId,
      benefitId,
      reason,
      before: { status: "active" },
      after: { status: "suspended" },
    });
  }

  return activeEnrollments.length;
}

/**
 * Finds all suspended enrollments for the given (employeeId, benefitId) pair,
 * marks them as `active`, and writes an audit log entry for each one.
 *
 * Called when an HR admin explicitly overrides eligibility back to "eligible"
 * or "active", signalling that the employee should be restored.
 *
 * Returns the number of enrollments reactivated.
 */
export async function reactivateSuspendedEnrollments(
  db: Database,
  actor: Employee | null,
  employeeId: string,
  benefitId: string,
  reason: string,
): Promise<number> {
  const now = new Date().toISOString();

  const suspendedEnrollments = await db
    .select()
    .from(schema.employeeBenefitEnrollments)
    .where(
      and(
        eq(schema.employeeBenefitEnrollments.employeeId, employeeId),
        eq(schema.employeeBenefitEnrollments.benefitId, benefitId),
        eq(schema.employeeBenefitEnrollments.status, "suspended"),
      ),
    );

  if (suspendedEnrollments.length === 0) return 0;

  for (const enrollment of suspendedEnrollments) {
    await db
      .update(schema.employeeBenefitEnrollments)
      .set({ status: "active", updatedAt: now })
      .where(eq(schema.employeeBenefitEnrollments.id, enrollment.id));

    await writeAuditLog({
      db,
      actor,
      actionType: "ENROLLMENT_REACTIVATED",
      entityType: "enrollment",
      entityId: enrollment.id,
      targetEmployeeId: employeeId,
      benefitId,
      reason,
      before: { status: "suspended" },
      after: { status: "active" },
    });
  }

  return suspendedEnrollments.length;
}
