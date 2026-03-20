import { and, eq, lt } from "drizzle-orm";
import { getBenefitsForEmployee } from "../helpers/employeeBenefits";
import type { GraphQLContext } from "../../context";
import { requireAuth } from "../../../auth";
import { recomputeEligibilityForEmployees, eligibilityCacheKey } from "../helpers/recomputeEligibility";
import { schema } from "../../../db";

type CachedBenefitRecord = {
  benefitId?: unknown;
  benefit?: {
    id?: unknown;
  } | null;
};

function isValidCachedBenefitsPayload(
  cached: unknown,
  activeBenefitIds: Set<string>,
): cached is CachedBenefitRecord[] {
  if (!Array.isArray(cached)) return false;

  return cached.every((item) => {
    if (!item || typeof item !== "object") return false;

    const benefitId =
      typeof (item as CachedBenefitRecord).benefitId === "string"
        ? (item as CachedBenefitRecord).benefitId
        : null;
    const nestedBenefitId =
      typeof (item as CachedBenefitRecord).benefit?.id === "string"
        ? (item as CachedBenefitRecord).benefit?.id
        : null;

    if (!benefitId || !nestedBenefitId) return false;
    if (benefitId !== nestedBenefitId) return false;

    return activeBenefitIds.has(benefitId);
  });
}

/**
 * Eligibility snapshots older than this threshold are considered stale.
 * On stale detection we fire a background recompute so this response already
 * sees fresh data.
 *
 * TDD §3.1: "The system must provide each authenticated employee a real-time,
 * personalized dashboard showing their full benefit portfolio with eligibility status."
 */
const STALE_THRESHOLD_MS = 60 * 60 * 1000; // 1 hour
const CACHE_TTL_SECONDS = 3600; // KV TTL matches the stale threshold

export const getMyBenefits = async (
  _: unknown,
  __: unknown,
  { db, env, currentEmployee }: GraphQLContext,
) => {
  const employee = requireAuth(currentEmployee);
  const cacheKey = eligibilityCacheKey(employee.id);

  // ── 1. KV cache read ──────────────────────────────────────────────────────
  // A warm cache means eligibility was computed within the last hour and no
  // downstream recompute has invalidated it.  Return immediately without
  // touching D1.
  try {
    const cached = await env.ELIGIBILITY_CACHE.get(cacheKey, "json");
    if (cached !== null) {
      const activeBenefitRows = await db
        .select({ id: schema.benefits.id })
        .from(schema.benefits)
        .where(eq(schema.benefits.isActive, true));
      const activeBenefitIds = new Set(activeBenefitRows.map((row) => row.id));

      if (isValidCachedBenefitsPayload(cached, activeBenefitIds)) {
        return cached;
      }

      env.ELIGIBILITY_CACHE.delete(cacheKey).catch((err) =>
        console.error("[getMyBenefits] Failed to delete invalid KV cache entry:", err),
      );
    }
  } catch (err) {
    // KV read failure must not block the query — fall through to D1 path.
    console.error("[getMyBenefits] KV cache read failed:", err);
  }

  // ── 2. Stale-check (D1 path) ──────────────────────────────────────────────
  // Look for any stored eligibility row older than the threshold, or no rows at
  // all (e.g. new employee / first login after seed).
  const cutoff = new Date(Date.now() - STALE_THRESHOLD_MS).toISOString();
  const staleRows = await db
    .select({ computedAt: schema.benefitEligibility.computedAt })
    .from(schema.benefitEligibility)
    .where(
      and(
        eq(schema.benefitEligibility.employeeId, employee.id),
        lt(schema.benefitEligibility.computedAt, cutoff),
      ),
    )
    .limit(1);

  const hasNoRows = staleRows.length === 0;

  // Distinguish "all fresh" (staleRows empty + any row exists) from "none exist".
  let isStale = staleRows.length > 0;
  if (!isStale) {
    const anyRow = await db
      .select({ computedAt: schema.benefitEligibility.computedAt })
      .from(schema.benefitEligibility)
      .where(eq(schema.benefitEligibility.employeeId, employee.id))
      .limit(1);
    isStale = anyRow.length === 0; // no rows at all → needs initial compute
  }

  // ── 3. Recompute when stale ───────────────────────────────────────────────
  // Track success so we can decide whether to cache the result below.
  // A failed recompute leaves stale D1 rows in place; writing those rows into
  // KV would suppress further recomputes for up to 1 hour, widening the stale
  // window rather than narrowing it.  Skip the KV write in that case.
  let recomputeOk = true;
  if (isStale) {
    try {
      await recomputeEligibilityForEmployees(db, [employee.id], {
        source: "manual",
        actor: employee,
        metadata: { trigger: "session_stale_check", staleRows: hasNoRows ? "none" : "some" },
        // Pass kvCache so the old entry is removed before we write the fresh one.
        kvCache: env.ELIGIBILITY_CACHE,
      });
    } catch (err) {
      recomputeOk = false;
      console.error("[getMyBenefits] Stale recompute failed — returning current snapshot:", err);
    }
  }

  // ── 4. D1 fetch + KV cache write ─────────────────────────────────────────
  const result = await getBenefitsForEmployee(db, employee.id);

  // Only populate the cache when data is confirmed fresh:
  //   • non-stale path  → D1 rows are within the TTL, safe to cache
  //   • stale + recompute succeeded  → D1 rows were just refreshed, safe to cache
  //   • stale + recompute FAILED     → D1 rows may still be stale; skip KV write
  //     so the next request triggers another recompute attempt.
  if (!isStale || recomputeOk) {
    env.ELIGIBILITY_CACHE.put(cacheKey, JSON.stringify(result), {
      expirationTtl: CACHE_TTL_SECONDS,
    }).catch((err) => console.error("[getMyBenefits] KV cache write failed:", err));
  }

  return result;
};
