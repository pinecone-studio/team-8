import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database } from "../../../db";
import type { GraphQLContext } from "../../context";

type DashboardBucket = {
  label: string;
  value: number;
};

type StoredRuleEvaluation = {
  passed?: boolean;
  reason?: string;
  ruleType?: string;
  rule_type?: string;
};

// All non-terminal in-flight statuses
const IN_FLIGHT_STATUSES = new Set([
  "pending",
  "awaiting_contract_acceptance",
  "awaiting_hr_review",
  "awaiting_finance_review",
  "hr_approved",
  "finance_approved",
  "awaiting_employee_signed_contract",
]);

function normalizeStatus(status: string | null | undefined) {
  return status?.trim().toLowerCase() ?? "";
}

function formatCategoryLabel(value: string) {
  return value
    .split("_")
    .join(" ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function parseRuleEvaluations(rawJson: string): StoredRuleEvaluation[] {
  try {
    const parsed = JSON.parse(rawJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toBuckets(counts: Map<string, number>): DashboardBucket[] {
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => {
      if (b.value !== a.value) return b.value - a.value;
      return a.label.localeCompare(b.label);
    });
}

function isOverrideActive(input: {
  overrideStatus?: string | null;
  overrideExpiresAt?: string | null;
}) {
  if (!input.overrideStatus) return false;
  if (!input.overrideExpiresAt) return true;
  return new Date(input.overrideExpiresAt) > new Date();
}

export const getAdminDashboardSummary = async (
  _: unknown,
  __: unknown,
  { db, currentUser }: GraphQLContext & { db: Database },
) => {
  if (!currentUser.isAdmin) {
    throw new Error("Not authorized to view admin dashboard.");
  }

  const [employees, benefits, enrollmentRows, eligibilityRows, requestRows, contractRows] = await Promise.all([
    db
      .select({ employmentStatus: schema.employees.employmentStatus })
      .from(schema.employees),
    db
      .select({ id: schema.benefits.id, category: schema.benefits.category, requiresContract: schema.benefits.requiresContract })
      .from(schema.benefits)
      .where(eq(schema.benefits.isActive, true)),
    // Canonical source for active enrollments (activeBenefits + usageByCategory)
    db
      .select({
        benefitId: schema.employeeBenefitEnrollments.benefitId,
        status: schema.employeeBenefitEnrollments.status,
      })
      .from(schema.employeeBenefitEnrollments),
    // Eligibility engine output — canonical source for locked state
    db
      .select({
        benefitId: schema.benefitEligibility.benefitId,
        ruleEvaluationJson: schema.benefitEligibility.ruleEvaluationJson,
        status: schema.benefitEligibility.status,
        overrideReason: schema.benefitEligibility.overrideReason,
        overrideStatus: schema.benefitEligibility.overrideStatus,
        overrideExpiresAt: schema.benefitEligibility.overrideExpiresAt,
      })
      .from(schema.benefitEligibility),
    db
      .select({
        status: schema.benefitRequests.status,
        updatedAt: schema.benefitRequests.updatedAt,
      })
      .from(schema.benefitRequests),
    db
      .select({
        id: schema.contracts.id,
        benefitId: schema.contracts.benefitId,
        isActive: schema.contracts.isActive,
        expiryDate: schema.contracts.expiryDate,
      })
      .from(schema.contracts),
  ]);

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const sixtyDaysFromNow = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

  const benefitCategoryById = new Map(
    benefits.map((benefit) => [benefit.id, formatCategoryLabel(benefit.category)])
  );

  // ── Contract health metrics ────────────────────────────────────────────────
  const activeContracts = contractRows.filter((c) => c.isActive);
  const activeContractBenefitIds = new Set(activeContracts.map((c) => c.benefitId));

  const contractsExpiringSoon = activeContracts.filter((c) => {
    if (!c.expiryDate) return false;
    return c.expiryDate >= new Date().toISOString() && c.expiryDate <= sixtyDaysFromNow;
  }).length;

  const benefitsMissingContracts = benefits.filter(
    (b) => b.requiresContract && !activeContractBenefitIds.has(b.id)
  ).length;

  // ── Suspended enrollments ─────────────────────────────────────────────────
  const suspendedEnrollments = enrollmentRows.filter(
    (row) => normalizeStatus(row.status) === "suspended"
  ).length;

  // ── Active enrollments (canonical) ────────────────────────────────────────
  const usageByCategory = new Map<string, number>();
  let activeBenefitsCount = 0;

  for (const row of enrollmentRows) {
    if (normalizeStatus(row.status) === "active") {
      activeBenefitsCount++;
      const category = benefitCategoryById.get(row.benefitId);
      if (category) {
        usageByCategory.set(category, (usageByCategory.get(category) ?? 0) + 1);
      }
    }
  }

  // ── Locked benefits (from eligibility engine snapshots) ───────────────────
  const lockReasons = new Map<string, number>();
  let lockedBenefitsCount = 0;

  for (const row of eligibilityRows) {
    const effectiveStatus = isOverrideActive(row)
      ? normalizeStatus(row.overrideStatus)
      : normalizeStatus(row.status);

    if (effectiveStatus !== "locked") continue;

    lockedBenefitsCount++;
    const failedRule = parseRuleEvaluations(row.ruleEvaluationJson).find(
      (entry) => entry.passed === false
    );
    const label =
      row.overrideReason?.trim() ||
      failedRule?.reason?.trim() ||
      failedRule?.ruleType?.trim() ||
      failedRule?.rule_type?.trim() ||
      "Locked by policy";
    lockReasons.set(label, (lockReasons.get(label) ?? 0) + 1);
  }

  return {
    activeBenefits: activeBenefitsCount,
    lockReasons: toBuckets(lockReasons),
    lockedBenefits: lockedBenefitsCount,
    pendingRequests: requestRows.filter(
      (row) => IN_FLIGHT_STATUSES.has(normalizeStatus(row.status))
    ).length,
    totalEmployees: employees.filter(
      (employee) => normalizeStatus(employee.employmentStatus) !== "terminated"
    ).length,
    usageByCategory: toBuckets(usageByCategory),
    // Operational queue counts
    hrQueueCount: requestRows.filter(
      (row) => normalizeStatus(row.status) === "awaiting_hr_review"
    ).length,
    financeQueueCount: requestRows.filter((row) =>
      ["awaiting_finance_review", "hr_approved"].includes(
        normalizeStatus(row.status),
      )
    ).length,
    awaitingContractCount: requestRows.filter(
      (row) => normalizeStatus(row.status) === "awaiting_contract_acceptance"
    ).length,
    approvedThisWeekCount: requestRows.filter(
      (row) =>
        normalizeStatus(row.status) === "approved" &&
        !!row.updatedAt &&
        row.updatedAt >= oneWeekAgo
    ).length,
    contractsExpiringSoon,
    benefitsMissingContracts,
    suspendedEnrollments,
  };
};
