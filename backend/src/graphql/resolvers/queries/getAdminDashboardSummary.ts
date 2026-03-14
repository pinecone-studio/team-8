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

export const getAdminDashboardSummary = async (
  _: unknown,
  __: unknown,
  { db, currentUser }: GraphQLContext & { db: Database },
) => {
  if (!currentUser.isAdmin) {
    throw new Error("Not authorized to view admin dashboard.");
  }

  const [employees, benefits, eligibilityRows, requestRows] = await Promise.all([
    db
      .select({
        employmentStatus: schema.employees.employmentStatus,
      })
      .from(schema.employees),
    db
      .select({
        id: schema.benefits.id,
        category: schema.benefits.category,
      })
      .from(schema.benefits)
      .where(eq(schema.benefits.isActive, true)),
    db
      .select({
        benefitId: schema.benefitEligibility.benefitId,
        ruleEvaluationJson: schema.benefitEligibility.ruleEvaluationJson,
        status: schema.benefitEligibility.status,
      })
      .from(schema.benefitEligibility),
    db
      .select({
        status: schema.benefitRequests.status,
      })
      .from(schema.benefitRequests),
  ]);

  const benefitCategoryById = new Map(
    benefits.map((benefit) => [benefit.id, formatCategoryLabel(benefit.category)])
  );

  const usageByCategory = new Map<string, number>();
  const lockReasons = new Map<string, number>();

  for (const row of eligibilityRows) {
    const status = normalizeStatus(row.status);

    if (status === "active" || status === "pending") {
      const category = benefitCategoryById.get(row.benefitId);
      if (category) {
        usageByCategory.set(category, (usageByCategory.get(category) ?? 0) + 1);
      }
    }

    if (status === "locked") {
      const failedRule = parseRuleEvaluations(row.ruleEvaluationJson).find(
        (entry) => entry.passed === false
      );
      const label =
        failedRule?.reason?.trim() ||
        failedRule?.ruleType?.trim() ||
        failedRule?.rule_type?.trim() ||
        "Locked by policy";

      lockReasons.set(label, (lockReasons.get(label) ?? 0) + 1);
    }
  }

  return {
    activeBenefits: eligibilityRows.filter(
      (row) => normalizeStatus(row.status) === "active"
    ).length,
    lockReasons: toBuckets(lockReasons),
    lockedBenefits: eligibilityRows.filter(
      (row) => normalizeStatus(row.status) === "locked"
    ).length,
    pendingRequests: requestRows.filter(
      (row) => normalizeStatus(row.status) === "pending"
    ).length,
    totalEmployees: employees.filter(
      (employee) => normalizeStatus(employee.employmentStatus) !== "terminated"
    ).length,
    usageByCategory: toBuckets(usageByCategory),
  };
};
