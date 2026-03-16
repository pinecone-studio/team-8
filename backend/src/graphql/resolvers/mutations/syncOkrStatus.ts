import { eq, or } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";
import { writeAuditLog } from "../helpers/audit";
import { recomputeEligibilityForEmployees } from "../helpers/recomputeEligibility";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OkrSyncRowInput {
  employeeId?: string | null;
  email?: string | null;
  okrSubmitted: boolean;
  quarter?: string | null;
}

export interface OkrSyncError {
  row: number;
  identifier: string;
  reason: string;
}

export interface OkrSyncResult {
  processed: number;
  updated: number;
  invalid: number;
  errors: OkrSyncError[];
}

// ---------------------------------------------------------------------------
// Resolver
// ---------------------------------------------------------------------------

export const syncOkrStatus = async (
  _: unknown,
  { rows }: { rows: OkrSyncRowInput[] },
  { db, currentEmployee }: GraphQLContext & { db: Database },
): Promise<OkrSyncResult> => {
  const actor = requireHrAdmin(currentEmployee);

  if (!rows || rows.length === 0) {
    return { processed: 0, updated: 0, invalid: 0, errors: [] };
  }

  const errors: OkrSyncError[] = [];
  const now = new Date().toISOString();

  // -- Step 1: Structural validation + gather identifiers -------------------

  const validRowIndices = new Set<number>();
  const emailsToLookup = new Set<string>();
  const idsToLookup = new Set<string>();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const identifier = row.employeeId ?? row.email ?? `row-${i + 1}`;

    if (!row.employeeId && !row.email) {
      errors.push({ row: i + 1, identifier: "unknown", reason: "Row must have employeeId or email." });
      continue;
    }

    if (typeof row.okrSubmitted !== "boolean") {
      errors.push({ row: i + 1, identifier, reason: "okrSubmitted must be a boolean." });
      continue;
    }

    validRowIndices.add(i);
    if (row.employeeId) idsToLookup.add(row.employeeId);
    if (row.email) emailsToLookup.add(row.email.toLowerCase());
  }

  if (validRowIndices.size === 0) {
    return { processed: rows.length, updated: 0, invalid: errors.length, errors };
  }

  // -- Step 2: Batch-fetch employees ----------------------------------------

  const conditions: ReturnType<typeof eq>[] = [];
  for (const id of idsToLookup) conditions.push(eq(schema.employees.id, id));
  for (const email of emailsToLookup) conditions.push(eq(schema.employees.email, email));

  const employeeRows = await db.select().from(schema.employees).where(or(...conditions));
  const byId = new Map(employeeRows.map((e) => [e.id, e]));
  const byEmail = new Map(employeeRows.map((e) => [e.email.toLowerCase(), e]));

  // -- Step 3: Resolve employee + cross-validate identity -------------------
  // Same strict pattern as importAttendance: when both identifiers supplied,
  // both must resolve individually and must point to the same employee.

  type ResolvedRow = { employeeId: string; okrSubmitted: boolean; quarter: string | null };
  const resolvedRows: ResolvedRow[] = [];
  const seenEmployeeIds = new Set<string>();

  for (const i of validRowIndices) {
    const row = rows[i];
    const identifier = row.employeeId ?? row.email ?? `row-${i + 1}`;

    const empById = row.employeeId ? byId.get(row.employeeId) : undefined;
    const empByEmail = row.email ? byEmail.get(row.email.toLowerCase()) : undefined;

    if (row.employeeId && row.email) {
      if (!empById) {
        errors.push({ row: i + 1, identifier, reason: `Employee not found for employeeId: "${row.employeeId}".` });
        continue;
      }
      if (!empByEmail) {
        errors.push({ row: i + 1, identifier, reason: `Employee not found for email: "${row.email}".` });
        continue;
      }
      if (empById.id !== empByEmail.id) {
        errors.push({ row: i + 1, identifier, reason: "employeeId and email refer to different employees." });
        continue;
      }
    }

    const employee = empById ?? empByEmail ?? null;
    if (!employee) {
      errors.push({ row: i + 1, identifier, reason: "Employee not found." });
      continue;
    }

    resolvedRows.push({
      employeeId: employee.id,
      okrSubmitted: row.okrSubmitted,
      quarter: row.quarter ?? null,
    });
    seenEmployeeIds.add(employee.id);
  }

  if (resolvedRows.length === 0) {
    await writeAuditLog({
      db,
      actor,
      actionType: "OKR_SYNC",
      entityType: "benefit_eligibility",
      entityId: `okr-sync:${now}`,
      reason: `OKR sync of ${rows.length} row(s); 0 employees updated (all rows invalid).`,
      metadata: { totalRows: rows.length, updatedEmployees: 0, invalidRows: errors.length },
    });
    return { processed: rows.length, updated: 0, invalid: errors.length, errors };
  }

  // -- Step 4: Update okrSubmitted on each affected employee ----------------

  let updated = 0;
  const affectedEmployeeIds: string[] = [];
  const quarters = new Set<string>();

  for (const record of resolvedRows) {
    await db
      .update(schema.employees)
      .set({ okrSubmitted: record.okrSubmitted ? 1 : 0, updatedAt: now })
      .where(eq(schema.employees.id, record.employeeId));

    updated++;
    affectedEmployeeIds.push(record.employeeId);
    if (record.quarter) quarters.add(record.quarter);
  }

  // -- Step 5: Audit the sync run -------------------------------------------

  await writeAuditLog({
    db,
    actor,
    actionType: "OKR_SYNC",
    entityType: "benefit_eligibility",
    entityId: `okr-sync:${now}`,
    reason: `OKR sync of ${rows.length} row(s); updated ${updated} employee(s).`,
    metadata: {
      totalRows: rows.length,
      validRows: resolvedRows.length,
      updatedEmployees: updated,
      invalidRows: errors.length,
      quarters: [...quarters],
      affectedEmployeeIds,
    },
  });

  // -- Step 6: Recompute eligibility for affected employees -----------------

  if (affectedEmployeeIds.length > 0) {
    await recomputeEligibilityForEmployees(db, affectedEmployeeIds, {
      source: "okr_sync",
      actor,
      metadata: { syncedAt: now, rowCount: rows.length, quarters: [...quarters] },
    });
  }

  return {
    processed: rows.length,
    updated,
    invalid: errors.length,
    errors,
  };
};
