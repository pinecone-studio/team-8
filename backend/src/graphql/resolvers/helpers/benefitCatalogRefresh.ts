import { schema } from "../../../db";
import type { Database } from "../../../db";
import {
  eligibilityCacheKey,
  recomputeEligibilityForEmployees,
  type RecomputeOptions,
  type RecomputeResult,
} from "./recomputeEligibility";

async function getAllEmployeeIds(db: Database): Promise<string[]> {
  const rows = await db
    .select({ id: schema.employees.id })
    .from(schema.employees);

  return rows.map((row) => row.id);
}

export async function invalidateAllEmployeeEligibilityCaches(
  db: Database,
  kvCache: KVNamespace,
  logPrefix: string,
): Promise<number> {
  const employeeIds = await getAllEmployeeIds(db);
  if (employeeIds.length === 0) return 0;

  await Promise.all(
    employeeIds.map((employeeId) =>
      kvCache.delete(eligibilityCacheKey(employeeId)).catch((err) =>
        console.error(`[${logPrefix}] KV cache invalidation failed for ${employeeId}:`, err),
      ),
    ),
  );

  return employeeIds.length;
}

export async function recomputeAllEmployeeEligibilities(
  db: Database,
  options: Pick<RecomputeOptions, "source" | "metadata" | "actor" | "kvCache">,
): Promise<RecomputeResult> {
  const employeeIds = await getAllEmployeeIds(db);
  if (employeeIds.length === 0) {
    return { evaluated: 0, changed: 0, skipped: 0, suspended: 0 };
  }

  return recomputeEligibilityForEmployees(db, employeeIds, options);
}
