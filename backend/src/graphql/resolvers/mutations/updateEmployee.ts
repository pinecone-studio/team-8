import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { MutationResolvers } from "../../generated/graphql";
import type { GraphQLContext } from "../../context";
import { recomputeEligibilityForEmployees } from "../helpers/recomputeEligibility";

const SELF_MUTABLE_FIELDS = new Set(["name", "nameEng"]);

/**
 * Fields whose change directly affects eligibility rule evaluation.
 * When any of these are updated by an admin, we trigger a best-effort recompute
 * so that benefit access immediately reflects the new profile (e.g. demotion/role change).
 * Per TDD §5: "If an employee is demoted or their role responsibility changes,
 * benefits tied to higher tiers are automatically suspended."
 */
const ELIGIBILITY_AFFECTING_FIELDS = new Set(["employmentStatus", "responsibilityLevel", "role"]);

export const updateEmployee: MutationResolvers["updateEmployee"] = async (
  _,
  { id, input },
  { db, env, currentUser, currentEmployee }: GraphQLContext,
) => {
  if (!currentUser.employee) {
    throw new Error("Not authenticated.");
  }

  const isSelf = currentUser.employee.id === id;
  const isAdmin = currentUser.isAdmin;

  if (!isAdmin && !isSelf) {
    throw new Error("Not authorized to update this employee.");
  }

  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null) continue;

    if (!isAdmin && !SELF_MUTABLE_FIELDS.has(key)) {
      continue;
    }

    updates[key] = value;
  }

  if (Object.keys(updates).length === 0) {
    return currentUser.employee;
  }

  updates.updatedAt = new Date().toISOString();

  const results = await db
    .update(schema.employees)
    .set(updates)
    .where(eq(schema.employees.id, id))
    .returning();

  const updatedEmployee = results[0] ?? null;

  // If any eligibility-affecting field changed, recompute benefit eligibility for this employee.
  // Best-effort: failure is logged but does NOT block the update response.
  // Suspension of active enrollments is handled inside recomputeEligibilityForEmployees
  // (same path as overrideEligibility("locked")), giving demotion/role-change an
  // immediate, truthful effect on enrolled benefits.
  if (isAdmin && updatedEmployee) {
    const eligibilityAffected = Object.keys(updates).some((k) =>
      ELIGIBILITY_AFFECTING_FIELDS.has(k),
    );
    if (eligibilityAffected) {
      // Best-effort: wrapped in try/catch so a recompute failure never rolls back the
      // already-committed employee update or surfaces a confusing error to the caller.
      try {
        await recomputeEligibilityForEmployees(db, [id], {
          source: "manual",
          actor: currentEmployee,
          metadata: { trigger: "updateEmployee", changedFields: Object.keys(updates) },
          kvCache: env.ELIGIBILITY_CACHE,
        });
      } catch (err: unknown) {
        console.error(`[updateEmployee] recompute failed for employee ${id}:`, err);
      }
    }
  }

  return updatedEmployee;
};
