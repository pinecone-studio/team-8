import { and, desc, eq } from "drizzle-orm";
import { schema } from "../../../db";
import { getBenefitConfig } from "../../../eligibility";
import { createContractViewToken, getContractViewUrl } from "../../../contracts";
import type { GraphQLContext } from "../../context";
import { requireAuth, isAdminEmployee } from "../../../auth";

type ContractsArgs = { benefitId?: string | null };

// Statuses where seeing the contract is relevant for the employee
const CONTRACT_RELEVANT_STATUSES = new Set([
  "pending",
  "awaiting_contract_acceptance",
  "awaiting_hr_review",
  "awaiting_finance_review",
  "hr_approved",
  "finance_approved",
  "approved",
]);

export const getContracts = async (
  _: unknown,
  { benefitId }: ContractsArgs,
  { db, env, baseUrl, currentEmployee }: GraphQLContext,
) => {
  const employee = requireAuth(currentEmployee);
  const canViewAllContracts = isAdminEmployee(employee);

  let rows = benefitId
    ? await db
        .select()
        .from(schema.contracts)
        .where(eq(schema.contracts.benefitId, benefitId))
        .orderBy(desc(schema.contracts.effectiveDate))
    : await db
        .select()
        .from(schema.contracts)
        .orderBy(desc(schema.contracts.effectiveDate));

  if (!canViewAllContracts) {
    // If querying a specific benefit, any authenticated employee can see its active contract
    if (benefitId) {
      rows = rows.filter((row) => row.isActive);
    } else {
      // Without benefitId: scope to contracts for benefits the employee is enrolled in
      // or has a relevant in-flight / historical request for
      const [enrollmentRows, requestRows] = await Promise.all([
        db
          .select({ benefitId: schema.employeeBenefitEnrollments.benefitId })
          .from(schema.employeeBenefitEnrollments)
          .where(
            and(
              eq(schema.employeeBenefitEnrollments.employeeId, employee.id),
              eq(schema.employeeBenefitEnrollments.status, "active"),
            ),
          ),
        db
          .select({ benefitId: schema.benefitRequests.benefitId, status: schema.benefitRequests.status })
          .from(schema.benefitRequests)
          .where(eq(schema.benefitRequests.employeeId, employee.id)),
      ]);

      const allowedBenefitIds = new Set<string>();
      for (const row of enrollmentRows) {
        allowedBenefitIds.add(row.benefitId);
      }
      for (const row of requestRows) {
        if (CONTRACT_RELEVANT_STATUSES.has(row.status)) {
          allowedBenefitIds.add(row.benefitId);
        }
      }

      rows = rows.filter(
        (row) => row.isActive && allowedBenefitIds.has(row.benefitId),
      );
    }
  }

  // Preload benefit names from D1 for all benefitIds
  const benefitIds = [...new Set(rows.map((r) => r.benefitId))];
  const dbBenefitsMap = new Map<string, string>();
  if (benefitIds.length > 0) {
    const dbBenefits = await db.select().from(schema.benefits);
    for (const b of dbBenefits) {
      dbBenefitsMap.set(b.id, b.name);
    }
  }

  return Promise.all(
    rows.map(async (row) => {
      // Prefer D1 name, fall back to static config name
      const benefitName =
        dbBenefitsMap.get(row.benefitId) ??
        getBenefitConfig(row.benefitId)?.name ??
        null;
      let viewUrl: string | null = null;
      try {
        // Bind token to the requesting employee so handleContractView can
        // enforce that only this employee (or an HR admin) may open the URL.
        // Admin tokens are left unbound — they bypass the session check anyway.
        const meta = canViewAllContracts
          ? undefined
          : { employeeId: employee.id, contractId: row.id };
        const token = await createContractViewToken(
          env.CONTRACT_VIEW_TOKENS,
          row.r2ObjectKey,
          undefined,
          meta,
        );
        viewUrl = getContractViewUrl(baseUrl, token);
      } catch {
        viewUrl = null;
      }

      return {
        id: row.id,
        benefitId: row.benefitId,
        benefitName,
        vendorName: row.vendorName,
        version: row.version,
        effectiveDate: row.effectiveDate,
        expiryDate: row.expiryDate,
        isActive: row.isActive,
        viewUrl,
      };
    }),
  );
};
