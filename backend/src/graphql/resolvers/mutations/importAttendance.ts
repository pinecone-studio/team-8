import { and, eq, gte, lte, or } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireHrAdmin } from "../../../auth";
import { writeAuditLog } from "../helpers/audit";
import { recomputeEligibilityForEmployees } from "../helpers/recomputeEligibility";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AttendanceRowInput {
  employeeId?: string | null;
  email?: string | null;
  date: string;        // YYYY-MM-DD
  checkInTime: string; // HH:MM (24-hour)
}

export interface AttendanceImportError {
  row: number;
  identifier: string;
  reason: string;
}

export interface AttendanceImportResult {
  processed: number;
  updated: number;
  invalid: number;
  errors: AttendanceImportError[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse "HH:MM" into total minutes since midnight. Returns null on bad format. */
function parseTimeMinutes(time: string): number | null {
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/** Late threshold: teacher -> 09:00 (540 min), everyone else -> 10:00 (600 min). */
function lateThresholdMinutes(role: string): number {
  return role === "teacher" ? 9 * 60 : 10 * 60;
}

function isValidDateString(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());
}

/** YYYY-MM-DD string for the date N days before today (UTC). */
function dateNDaysAgo(n: number): string {
  const d = new Date(Date.now() - n * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Resolver
// ---------------------------------------------------------------------------

export const importAttendance = async (
  _: unknown,
  { rows }: { rows: AttendanceRowInput[] },
  { db, currentEmployee }: GraphQLContext & { db: Database },
): Promise<AttendanceImportResult> => {
  const actor = requireHrAdmin(currentEmployee);

  if (!rows || rows.length === 0) {
    return { processed: 0, updated: 0, invalid: 0, errors: [] };
  }

  const errors: AttendanceImportError[] = [];
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

    if (!row.date || !isValidDateString(row.date)) {
      errors.push({ row: i + 1, identifier, reason: `Invalid date: "${row.date}".` });
      continue;
    }

    if (!row.checkInTime || parseTimeMinutes(row.checkInTime) === null) {
      errors.push({ row: i + 1, identifier, reason: `Invalid checkInTime: "${row.checkInTime}".` });
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

  // -- Step 3: Resolve employee + cross-validate identity (Fix 3) -----------
  // If a row supplies both employeeId and email, they must point to the same
  // employee. A mismatch is rejected as an invalid row.

  type ResolvedRow = { employeeId: string; date: string; checkInTime: string; isLate: boolean };
  const resolvedRows: ResolvedRow[] = [];
  const seenEmployeeIds = new Set<string>();

  for (const i of validRowIndices) {
    const row = rows[i];
    const identifier = row.employeeId ?? row.email ?? `row-${i + 1}`;

    const empById = row.employeeId ? byId.get(row.employeeId) : undefined;
    const empByEmail = row.email ? byEmail.get(row.email.toLowerCase()) : undefined;

    // Fix 3: When both identifiers are supplied, both must resolve and agree.
    // Permitting one to pass while the other fails silently is too permissive
    // for admin-imported data.
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

    const checkinMinutes = parseTimeMinutes(row.checkInTime)!;
    const isLate = checkinMinutes > lateThresholdMinutes(employee.role);

    resolvedRows.push({ employeeId: employee.id, date: row.date, checkInTime: row.checkInTime, isLate });
    seenEmployeeIds.add(employee.id);
  }

  if (resolvedRows.length === 0) {
    await writeAuditLog({
      db,
      actor,
      actionType: "ATTENDANCE_IMPORT",
      entityType: "benefit_eligibility",
      entityId: `attendance-import:${now}`,
      reason: `Imported ${rows.length} row(s); 0 employees updated (all rows invalid).`,
      metadata: { totalRows: rows.length, updatedEmployees: 0, invalidRows: errors.length },
    });
    return { processed: rows.length, updated: 0, invalid: errors.length, errors };
  }

  // -- Step 4: Upsert attendance records (Fix 1 - durable per-day storage) --
  // PK is (employee_id, date): re-importing the same day replaces the record.
  // Old records outside the 30-day window are preserved but excluded from the
  // late-count computation below.

  for (const record of resolvedRows) {
    const existing = await db
      .select({ employeeId: schema.attendanceRecords.employeeId })
      .from(schema.attendanceRecords)
      .where(
        and(
          eq(schema.attendanceRecords.employeeId, record.employeeId),
          eq(schema.attendanceRecords.date, record.date),
        ),
      );

    if (existing.length > 0) {
      await db
        .update(schema.attendanceRecords)
        .set({ checkInTime: record.checkInTime, isLate: record.isLate, importedAt: now })
        .where(
          and(
            eq(schema.attendanceRecords.employeeId, record.employeeId),
            eq(schema.attendanceRecords.date, record.date),
          ),
        );
    } else {
      await db.insert(schema.attendanceRecords).values({
        employeeId: record.employeeId,
        date: record.date,
        checkInTime: record.checkInTime,
        isLate: record.isLate,
        importedAt: now,
      });
    }
  }

  // -- Step 5: Compute rolling 30-day late count from durable records --------
  // Fix 1: Count only records within the last 30 days regardless of what was
  // submitted in this batch. Rows outside the window are stored but ignored
  // for the gate count.

  const cutoffDate = dateNDaysAgo(30);
  const todayDate = dateNDaysAgo(0); // upper bound: exclude future-dated records
  let updated = 0;
  const affectedEmployeeIds: string[] = [];

  for (const employeeId of seenEmployeeIds) {
    const recentRecords = await db
      .select({ isLate: schema.attendanceRecords.isLate })
      .from(schema.attendanceRecords)
      .where(
        and(
          eq(schema.attendanceRecords.employeeId, employeeId),
          gte(schema.attendanceRecords.date, cutoffDate),
          lte(schema.attendanceRecords.date, todayDate),
        ),
      );

    const lateCount = recentRecords.filter((r) => r.isLate).length;

    await db
      .update(schema.employees)
      .set({ lateArrivalCount: lateCount, lateArrivalUpdatedAt: now, updatedAt: now })
      .where(eq(schema.employees.id, employeeId));

    updated++;
    affectedEmployeeIds.push(employeeId);
  }

  // -- Step 6: Audit the import run -----------------------------------------

  await writeAuditLog({
    db,
    actor,
    actionType: "ATTENDANCE_IMPORT",
    entityType: "benefit_eligibility",
    entityId: `attendance-import:${now}`,
    reason: `Imported ${rows.length} attendance row(s); updated ${updated} employee(s).`,
    metadata: {
      totalRows: rows.length,
      validRows: resolvedRows.length,
      updatedEmployees: updated,
      invalidRows: errors.length,
      rollingWindowCutoff: cutoffDate,
      affectedEmployeeIds,
    },
  });

  // -- Step 7: Recompute eligibility for affected employees only -------------

  if (affectedEmployeeIds.length > 0) {
    await recomputeEligibilityForEmployees(db, affectedEmployeeIds, {
      source: "attendance_import",
      actor,
      metadata: { importedAt: now, rowCount: rows.length, rollingWindowCutoff: cutoffDate },
    });
  }

  return {
    processed: rows.length,
    updated,
    invalid: errors.length,
    errors,
  };
};
