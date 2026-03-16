import { eq, and } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";
import { writeAuditLog } from "../helpers/audit";
import { suspendActiveEnrollments, reactivateSuspendedEnrollments } from "../helpers/suspendEnrollments";
import { getBenefitsForEmployee } from "../helpers/employeeBenefits";

const VALID_OVERRIDE_STATUSES = new Set(["eligible", "active", "locked"]);

export const overrideEligibility = async (
  _: unknown,
  {
    input,
  }: {
    input: {
      employeeId: string;
      benefitId: string;
      overrideStatus: string;
      reason: string;
      expiresAt?: string | null;
    };
  },
  { db, currentEmployee }: GraphQLContext,
) => {
  const admin = requireHrAdmin(currentEmployee);

  const { employeeId, benefitId, overrideStatus, reason, expiresAt } = input;

  if (!reason || reason.trim().length === 0) {
    throw new Error("Override reason is required.");
  }

  const normalizedStatus = overrideStatus.toLowerCase();
  if (!VALID_OVERRIDE_STATUSES.has(normalizedStatus)) {
    throw new Error(
      `Invalid override status: ${overrideStatus}. Must be one of: eligible, active, locked.`
    );
  }

  // Validate employee exists
  const employees = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.id, employeeId));
  if (!employees[0]) throw new Error("Employee not found.");

  // Validate benefit exists
  const benefits = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, benefitId));
  if (!benefits[0]) throw new Error("Benefit not found.");

  // Validate expiry date is in the future if provided
  if (expiresAt) {
    const expiryDate = new Date(expiresAt);
    if (isNaN(expiryDate.getTime())) {
      throw new Error("Invalid expiresAt date format.");
    }
    if (expiryDate <= new Date()) {
      throw new Error("Override expiry date must be in the future.");
    }
  }

  const now = new Date().toISOString();

  // Check if row exists
  const existing = await db
    .select()
    .from(schema.benefitEligibility)
    .where(
      and(
        eq(schema.benefitEligibility.employeeId, employeeId),
        eq(schema.benefitEligibility.benefitId, benefitId)
      )
    );

  const overrideValues = {
    overrideBy: admin.id,
    overrideReason: reason.trim(),
    overrideExpiresAt: expiresAt ?? null,
    overrideStatus: normalizedStatus,
    computedAt: now,
  };

  if (existing[0]) {
    await db
      .update(schema.benefitEligibility)
      .set(overrideValues)
      .where(
        and(
          eq(schema.benefitEligibility.employeeId, employeeId),
          eq(schema.benefitEligibility.benefitId, benefitId)
        )
      );
  } else {
    // Create new row with override — use override status as the status too
    await db.insert(schema.benefitEligibility).values({
      employeeId,
      benefitId,
      status: normalizedStatus,
      ruleEvaluationJson: "[]",
      computedAt: now,
      overrideBy: admin.id,
      overrideReason: reason.trim(),
      overrideExpiresAt: expiresAt ?? null,
      overrideStatus: normalizedStatus,
    });
  }

  // Phase 4: Audit log
  await writeAuditLog({
    db,
    actor: admin,
    actionType: "ELIGIBILITY_OVERRIDE_SET",
    entityType: "benefit_eligibility",
    entityId: `${employeeId}:${benefitId}`,
    targetEmployeeId: employeeId,
    benefitId,
    reason: reason.trim(),
    before: existing[0]
      ? {
          overrideStatus: existing[0].overrideStatus,
          overrideBy: existing[0].overrideBy,
          overrideReason: existing[0].overrideReason,
          overrideExpiresAt: existing[0].overrideExpiresAt,
        }
      : null,
    after: {
      overrideStatus: normalizedStatus,
      overrideBy: admin.id,
      overrideReason: reason.trim(),
      overrideExpiresAt: expiresAt ?? null,
    },
  });

  // When overriding to locked → suspend any active enrollments for this employee+benefit.
  // When overriding to eligible/active → reactivate any previously suspended enrollments.
  // This gives HR a clear and symmetric recovery path via the same Eligibility Inspector action.
  if (normalizedStatus === "locked") {
    await suspendActiveEnrollments(db, admin, employeeId, benefitId, reason.trim());
  } else if (normalizedStatus === "eligible" || normalizedStatus === "active") {
    await reactivateSuspendedEnrollments(db, admin, employeeId, benefitId, reason.trim());
  }

  // Return the updated eligibility in BenefitEligibility shape
  const eligibilities = await getBenefitsForEmployee(db, employeeId);
  const result = eligibilities.find((e) => e.benefitId === benefitId);

  if (!result) {
    throw new Error("Could not retrieve updated eligibility.");
  }

  return result;
};
