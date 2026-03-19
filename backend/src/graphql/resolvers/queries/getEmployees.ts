import { and, eq, inArray, sql } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAdmin } from "../../../auth";
import { syncEmployeeProfiles } from "../../../clerk/sync-employee-profiles";

type GetEmployeesArgs = {
  search?: string | null;
  department?: string | null;
  benefitId?: string | null;
  limit?: number | null;
};

function hasActiveOverride(
  overrideStatus: string | null,
  overrideExpiresAt: string | null,
) {
  if (!overrideStatus) return false;
  if (!overrideExpiresAt) return true;

  const expiresAt = new Date(overrideExpiresAt).getTime();
  if (Number.isNaN(expiresAt)) return true;

  return expiresAt >= Date.now();
}

export const getEmployees = async (
  _: unknown,
  { search, department, benefitId, limit }: GetEmployeesArgs,
  { db, env, currentEmployee }: GraphQLContext,
) => {
  requireAdmin(currentEmployee);

  const conditions = [];

  if (department) {
    conditions.push(eq(schema.employees.department, department));
  }

  if (search) {
    const pattern = `%${search}%`;
    conditions.push(
      sql`(${schema.employees.name} LIKE ${pattern} OR ${schema.employees.email} LIKE ${pattern} OR ${schema.employees.nameEng} LIKE ${pattern})`,
    );
  }

  if (benefitId) {
    const [eligibilityRows, activeEnrollmentRows] = await Promise.all([
      db
        .select({
          employeeId: schema.benefitEligibility.employeeId,
          status: schema.benefitEligibility.status,
          overrideStatus: schema.benefitEligibility.overrideStatus,
          overrideExpiresAt: schema.benefitEligibility.overrideExpiresAt,
        })
        .from(schema.benefitEligibility)
        .where(eq(schema.benefitEligibility.benefitId, benefitId)),
      db
        .selectDistinct({
          employeeId: schema.employeeBenefitEnrollments.employeeId,
        })
        .from(schema.employeeBenefitEnrollments)
        .where(
          and(
            eq(schema.employeeBenefitEnrollments.benefitId, benefitId),
            eq(schema.employeeBenefitEnrollments.status, "active"),
          ),
        ),
    ]);

    const eligibleEmployeeIds = new Set(
      activeEnrollmentRows.map((row) => row.employeeId),
    );

    for (const row of eligibilityRows) {
      const effectiveStatus = hasActiveOverride(
        row.overrideStatus,
        row.overrideExpiresAt,
      )
        ? row.overrideStatus
        : row.status;

      if (
        effectiveStatus &&
        ["eligible", "active"].includes(effectiveStatus.toLowerCase())
      ) {
        eligibleEmployeeIds.add(row.employeeId);
      }
    }

    if (eligibleEmployeeIds.size === 0) {
      return [];
    }

    conditions.push(inArray(schema.employees.id, Array.from(eligibleEmployeeIds)));
  }

  const employees = await db
    .select()
    .from(schema.employees)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(limit ?? 50);

  return syncEmployeeProfiles(db, env, employees);
};
