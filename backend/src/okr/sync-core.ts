/**
 * syncOkrStatusCore — inner layer for OKR status sync.
 *
 * Accepts a list of OKR rows (from webhook, cron poll, or manual trigger),
 * resolves employee identities, updates okrSubmitted flags, audits the sync,
 * and triggers eligibility recompute for affected employees.
 *
 * This function is intentionally decoupled from GraphQL context so it can be
 * called from the REST adapter (adapter.ts) and the GraphQL resolver
 * (syncOkrStatus.ts) alike.
 *
 * Identity resolution follows the strict importAttendance pattern:
 *   - employeeId only → must resolve
 *   - email only → must resolve
 *   - both supplied → both must resolve AND point to the same employee
 *
 * actor is null when the sync is system-originated (webhook, cron).
 */

import { createHash } from "node:crypto";
import { eq, or, inArray } from "drizzle-orm";
import { schema } from "../db";
import type { Database, Employee } from "../db";
import { writeAuditLog } from "../graphql/resolvers/helpers/audit";
import { recomputeEligibilityForEmployees } from "../graphql/resolvers/helpers/recomputeEligibility";

// ---------------------------------------------------------------------------
// Types (re-exported so adapter.ts can use them)
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
  skipped: number;
  invalid: number;
  errors: OkrSyncError[];
}

/**
 * Compute a stable idempotency key for one OKR event.
 * Encodes (employeeId, quarter, okrSubmitted) so that:
 *  - retransmitted webhook payloads with the same data are de-duplicated
 *  - genuinely new events (value flipped back, new quarter) pass through
 * Using (employee_id, quarter, event_hash) — NOT quarter alone — per TDD §2.1.
 */
function computeOkrEventKey(employeeId: string, quarter: string | null, okrSubmitted: boolean): string {
  const hash = createHash("sha1")
    .update(`${employeeId}|${quarter ?? "none"}|${okrSubmitted.toString()}`)
    .digest("hex")
    .slice(0, 12);
  return `okr-event:${employeeId}:${quarter ?? "none"}:${hash}`;
}

// ---------------------------------------------------------------------------
// Core function
// ---------------------------------------------------------------------------

export async function syncOkrStatusCore(
  db: Database,
  rows: OkrSyncRowInput[],
  actor: Employee | null,
  kvCache?: KVNamespace,
): Promise<OkrSyncResult> {
  if (!rows || rows.length === 0) {
    return { processed: 0, updated: 0, skipped: 0, invalid: 0, errors: [] };
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
    return { processed: rows.length, updated: 0, skipped: 0, invalid: errors.length, errors };
  }

  // -- Step 2: Batch-fetch employees ----------------------------------------

  const conditions: ReturnType<typeof eq>[] = [];
  for (const id of idsToLookup) conditions.push(eq(schema.employees.id, id));
  for (const email of emailsToLookup) conditions.push(eq(schema.employees.email, email));

  const employeeRows = await db.select().from(schema.employees).where(or(...conditions));
  const byId = new Map(employeeRows.map((e) => [e.id, e]));
  const byEmail = new Map(employeeRows.map((e) => [e.email.toLowerCase(), e]));

  // -- Step 3: Resolve employee + cross-validate identity -------------------

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
    return { processed: rows.length, updated: 0, skipped: 0, invalid: errors.length, errors };
  }

  // -- Step 3.5: Idempotency check ------------------------------------------
  // Compute a stable key for each resolved row: (employee_id, quarter, event_hash).
  // Batch-check which keys already exist in the audit log (written in Step 4 below).
  // Skip rows that were already committed — handles webhook retries and duplicate crons.

  const rowsWithKeys = resolvedRows.map((row) => ({
    row,
    eventKey: computeOkrEventKey(row.employeeId, row.quarter, row.okrSubmitted),
  }));

  // Intra-batch dedup: if the same event key appears multiple times in this
  // payload (e.g. two webhook retries merged into one call), keep only the
  // last occurrence so we process it exactly once.
  const dedupedByKey = new Map<string, typeof rowsWithKeys[number]>();
  for (const entry of rowsWithKeys) {
    dedupedByKey.set(entry.eventKey, entry);
  }
  const dedupedRows = [...dedupedByKey.values()];
  const intraBatchDupes = rowsWithKeys.length - dedupedRows.length;

  // Cross-run dedup: batch-check which keys were already committed in a prior run.
  const allEventKeys = dedupedRows.map((r) => r.eventKey);
  const existingEvents = allEventKeys.length > 0
    ? await db
        .select({ entityId: schema.auditLogs.entityId })
        .from(schema.auditLogs)
        .where(inArray(schema.auditLogs.entityId, allEventKeys))
    : [];
  const processedSet = new Set(existingEvents.map((r) => r.entityId));

  const newRowsWithKeys = dedupedRows.filter(({ eventKey }) => !processedSet.has(eventKey));
  const skipped = intraBatchDupes + (dedupedRows.length - newRowsWithKeys.length);

  if (newRowsWithKeys.length === 0) {
    await writeAuditLog({
      db,
      actor,
      actionType: "OKR_SYNC",
      entityType: "benefit_eligibility",
      entityId: `okr-sync:${now}`,
      reason: `OKR sync of ${rows.length} row(s); all ${skipped} event(s) skipped (${intraBatchDupes} intra-batch, ${skipped - intraBatchDupes} already committed).`,
      metadata: { totalRows: rows.length, validRows: resolvedRows.length, updatedEmployees: 0, skippedDuplicates: skipped, intraBatchDuplicates: intraBatchDupes, invalidRows: errors.length },
    });
    return { processed: rows.length, updated: 0, skipped, invalid: errors.length, errors };
  }

  // -- Step 4: Update okrSubmitted on each new (non-duplicate) row ----------

  let updated = 0;
  const affectedEmployeeIds: string[] = [];
  const quarters = new Set<string>();

  for (const { row: record, eventKey } of newRowsWithKeys) {
    await db
      .update(schema.employees)
      .set({ okrSubmitted: record.okrSubmitted ? 1 : 0, updatedAt: now })
      .where(eq(schema.employees.id, record.employeeId));

    updated++;
    affectedEmployeeIds.push(record.employeeId);
    if (record.quarter) quarters.add(record.quarter);

    // Write per-event audit log — this is the idempotency marker checked above.
    await writeAuditLog({
      db,
      actor,
      actionType: "OKR_EVENT",
      entityType: "benefit_eligibility",
      entityId: eventKey,
      targetEmployeeId: record.employeeId,
      reason: `OKR event: employee=${record.employeeId} quarter=${record.quarter ?? "none"} okrSubmitted=${record.okrSubmitted}`,
      metadata: { employeeId: record.employeeId, quarter: record.quarter, okrSubmitted: record.okrSubmitted },
    });
  }

  // -- Step 5: Audit the sync run -------------------------------------------

  await writeAuditLog({
    db,
    actor,
    actionType: "OKR_SYNC",
    entityType: "benefit_eligibility",
    entityId: `okr-sync:${now}`,
    reason: `OKR sync of ${rows.length} row(s); updated ${updated} employee(s), skipped ${skipped} duplicate(s) (${intraBatchDupes} intra-batch).`,
    metadata: {
      totalRows: rows.length,
      validRows: resolvedRows.length,
      updatedEmployees: updated,
      skippedDuplicates: skipped,
      intraBatchDuplicates: intraBatchDupes,
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
      kvCache,
    });
  }

  return {
    processed: rows.length,
    updated,
    skipped,
    invalid: errors.length,
    errors,
  };
}
