import { and, eq, inArray } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database, Employee, EligibilityRule, BenefitEligibility } from "../../../db";
import { writeAuditLog } from "./audit";
import { suspendActiveEnrollments } from "./suspendEnrollments";

// ---------------------------------------------------------------------------
// Internal helpers (mirroring employeeBenefits.ts rule evaluator, kept local
// to avoid circular imports between the two helper files)
// ---------------------------------------------------------------------------

function getTenureDays(hireDate: string): number {
  return Math.floor((Date.now() - new Date(hireDate).getTime()) / (24 * 60 * 60 * 1000));
}

function getEmployeeValue(employee: Employee, ruleType: string): string | number | boolean {
  switch (ruleType) {
    case "employment_status":
      return employee.employmentStatus;
    case "okr_submitted":
      return Boolean(employee.okrSubmitted);
    case "attendance":
      return employee.lateArrivalCount;
    case "responsibility_level":
      return employee.responsibilityLevel;
    case "role":
      return employee.role;
    case "tenure_days":
      return getTenureDays(employee.hireDate);
    default:
      return "";
  }
}

function parseRuleValue(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function evaluateRule(rule: EligibilityRule, employee: Employee): { ruleType: string; passed: boolean; reason: string } {
  const actual = getEmployeeValue(employee, rule.ruleType);
  const expected = parseRuleValue(rule.value);

  let passed = false;

  switch (rule.operator) {
    case "eq":
      passed =
        typeof expected === "boolean"
          ? Boolean(actual) === expected
          : typeof expected === "number"
            ? Number(actual) === expected
            : String(actual) === String(expected);
      break;
    case "neq":
      passed =
        typeof expected === "boolean"
          ? Boolean(actual) !== expected
          : typeof expected === "number"
            ? Number(actual) !== expected
            : String(actual) !== String(expected);
      break;
    case "gte":
      passed = Number(actual) >= Number(expected);
      break;
    case "gt":
      passed = Number(actual) > Number(expected);
      break;
    case "lte":
      passed = Number(actual) <= Number(expected);
      break;
    case "lt":
      passed = Number(actual) < Number(expected);
      break;
    case "in":
      passed = Array.isArray(expected) && expected.map(String).includes(String(actual));
      break;
    case "not_in":
      passed = Array.isArray(expected) && !expected.map(String).includes(String(actual));
      break;
    default:
      passed = false;
  }

  return {
    ruleType: rule.ruleType,
    passed,
    reason: passed
      ? `Passed: ${rule.ruleType} ${rule.operator} ${JSON.stringify(expected)}`
      : rule.errorMessage,
  };
}

function isOverrideActive(row: Pick<BenefitEligibility, "overrideStatus" | "overrideExpiresAt">): boolean {
  if (!row.overrideStatus) return false;
  if (!row.overrideExpiresAt) return true;
  return new Date(row.overrideExpiresAt) > new Date();
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface RecomputeOptions {
  /** Who triggered the recompute (used in audit metadata). */
  source: "attendance_import" | "okr_sync" | "manual";
  /** Extra metadata to store in the audit log. */
  metadata?: unknown;
  /**
   * Actor employee used for audit logging.
   * Pass null for system-originated recomputes (webhooks / cron).
   */
  actor?: Employee | null;
  /**
   * When provided, the eligibility KV cache entry for each recomputed employee
   * is invalidated so the next read reflects the fresh D1 snapshot.
   * Omit from call sites that don't have env access — TTL expiry is the fallback.
   */
  kvCache?: KVNamespace;
}

export interface RecomputeResult {
  /** Total employee x benefit pairs evaluated. */
  evaluated: number;
  /** Pairs where the stored eligibility status actually changed. */
  changed: number;
  /** Pairs skipped because an active HR override is in place. */
  skipped: number;
  /** Active enrollments suspended because rules now fail. */
  suspended: number;
}

/**
 * Recomputes benefit eligibility snapshots for a specific set of employees.
 *
 * - Respects active HR overrides (rows with overrideStatus set + not expired).
 * - Upserts benefit_eligibility for all non-overridden employee x benefit pairs.
 * - When rules fail and an active enrollment exists, suspends that enrollment
 *   via the same path as overrideEligibility("locked"), giving recompute a
 *   truthful, observable effect on enrolled benefits.
 * - Writes a single ELIGIBILITY_RECOMPUTED audit entry per employee.
 * - Designed to be called from attendance import, OKR sync, or manual triggers.
 */
/** KV cache key for a given employeeId — must stay in sync with getMyBenefits.ts. */
export const eligibilityCacheKey = (employeeId: string) => `eligibility:v1:${employeeId}`;

export async function recomputeEligibilityForEmployees(
  db: Database,
  employeeIds: string[],
  options: RecomputeOptions,
): Promise<RecomputeResult> {
  if (employeeIds.length === 0) return { evaluated: 0, changed: 0, skipped: 0, suspended: 0 };

  const { source, metadata, actor = null, kvCache } = options;
  const now = new Date().toISOString();

  // Batch-fetch all data we need
  const [employees, activeBenefits, activeRules, storedRows, activeEnrollments] = await Promise.all([
    db.select().from(schema.employees).where(inArray(schema.employees.id, employeeIds)),
    db.select().from(schema.benefits).where(eq(schema.benefits.isActive, true)),
    db.select().from(schema.eligibilityRules).where(eq(schema.eligibilityRules.isActive, true)),
    db
      .select()
      .from(schema.benefitEligibility)
      .where(inArray(schema.benefitEligibility.employeeId, employeeIds)),
    db
      .select()
      .from(schema.employeeBenefitEnrollments)
      .where(
        and(
          inArray(schema.employeeBenefitEnrollments.employeeId, employeeIds),
          eq(schema.employeeBenefitEnrollments.status, "active"),
        ),
      ),
  ]);

  // Index for fast lookup
  const rulesByBenefit = activeRules.reduce<Record<string, EligibilityRule[]>>((acc, rule) => {
    (acc[rule.benefitId] ??= []).push(rule);
    return acc;
  }, {});
  for (const rules of Object.values(rulesByBenefit)) {
    rules.sort((a, b) => a.priority - b.priority);
  }

  const storedByKey = new Map<string, BenefitEligibility>();
  for (const row of storedRows) {
    storedByKey.set(`${row.employeeId}:${row.benefitId}`, row);
  }

  // Keys of currently active enrollments: "employeeId:benefitId"
  const activeEnrollmentKeys = new Set(
    activeEnrollments.map((e) => `${e.employeeId}:${e.benefitId}`),
  );

  let evaluated = 0;
  let changed = 0;
  let skipped = 0;
  let suspended = 0;

  for (const employee of employees) {
    const changedBenefits: string[] = [];
    const suspendedBenefits: string[] = [];

    for (const benefit of activeBenefits) {
      const stored = storedByKey.get(`${employee.id}:${benefit.id}`);

      // Skip if an active HR override is controlling this row
      if (stored && isOverrideActive(stored)) {
        skipped++;
        continue;
      }

      evaluated++;

      const rules = rulesByBenefit[benefit.id] ?? [];
      const ruleEvals = rules.map((r) => evaluateRule(r, employee));
      const allPassed = ruleEvals.every((r) => r.passed);
      const newStatus = allPassed ? "eligible" : "locked";
      const ruleEvaluationJson = JSON.stringify(ruleEvals);

      const prevStatus = stored?.status ?? null;

      if (stored) {
        await db
          .update(schema.benefitEligibility)
          .set({ status: newStatus, ruleEvaluationJson, computedAt: now })
          .where(
            and(
              eq(schema.benefitEligibility.employeeId, employee.id),
              eq(schema.benefitEligibility.benefitId, benefit.id),
            ),
          );
      } else {
        await db.insert(schema.benefitEligibility).values({
          employeeId: employee.id,
          benefitId: benefit.id,
          status: newStatus,
          ruleEvaluationJson,
          computedAt: now,
        });
      }

      if (prevStatus !== newStatus) {
        changed++;
        changedBenefits.push(benefit.id);
      }

      // Fix 2: When rules now fail and an active enrollment exists, suspend it.
      // This gives recompute the same real effect as overrideEligibility("locked"),
      // making attendance-driven eligibility changes immediately visible.
      // We do NOT auto-reactivate when rules pass again — that requires explicit
      // HR action (re-request or override), keeping HR informed of all recoveries.
      if (newStatus === "locked" && activeEnrollmentKeys.has(`${employee.id}:${benefit.id}`)) {
        const suspendedCount = await suspendActiveEnrollments(
          db,
          actor,
          employee.id,
          benefit.id,
          `Eligibility recomputed (${source}): attendance or rule threshold exceeded.`,
        );
        if (suspendedCount > 0) {
          suspended += suspendedCount;
          suspendedBenefits.push(benefit.id);
        }
      }
    }

    // One audit entry per employee summarising what changed
    await writeAuditLog({
      db,
      actor,
      actionType: "ELIGIBILITY_RECOMPUTED",
      entityType: "benefit_eligibility",
      entityId: employee.id,
      targetEmployeeId: employee.id,
      metadata: {
        source,
        changedBenefits,
        suspendedBenefits,
        evaluatedBenefits: activeBenefits.length,
        ...(metadata !== undefined ? { importMetadata: metadata } : {}),
      },
    });
  }

  // Invalidate KV eligibility cache for all recomputed employees so the next
  // getMyBenefits call returns fresh D1 data instead of a stale snapshot.
  if (kvCache && employeeIds.length > 0) {
    await Promise.all(
      employeeIds.map((id) =>
        kvCache.delete(eligibilityCacheKey(id)).catch((err) =>
          console.error(`[recomputeEligibility] KV cache invalidation failed for ${id}:`, err),
        ),
      ),
    );
  }

  return { evaluated, changed, skipped, suspended };
}
