import type { AppRole } from "./auth";
import { recomputeEmployeeEligibility } from "./recompute";
import type { Env } from "./types";

type SyncType = "okr" | "attendance";
type SyncStatus = "running" | "completed" | "partial" | "failed";

interface OkrRecord {
  employeeId: string;
  okrSubmitted: boolean;
}

interface AttendanceRecord {
  employeeId: string;
  lateArrivalCount: number;
  lateArrivalUpdatedAt?: string;
}

interface SyncRunSummary {
  updated: number;
  recomputed: number;
  missing: number;
  errors: number;
}

export interface SyncRunResult {
  syncRunId: string;
  syncType: SyncType;
  source: string;
  status: SyncStatus;
  recordCount: number;
  summary: SyncRunSummary;
}

async function createSyncRun(input: {
  env: Env;
  syncType: SyncType;
  source: string;
  initiatedBy: string;
  recordCount: number;
  payloadJson: string;
}) {
  const syncRunId = crypto.randomUUID();
  const startedAt = new Date().toISOString();

  await input.env.DB.prepare(
    `INSERT INTO sync_runs (
      id,
      sync_type,
      source,
      status,
      record_count,
      initiated_by,
      payload_json,
      summary_json,
      started_at,
      finished_at
    ) VALUES (?, ?, ?, 'running', ?, ?, ?, NULL, ?, NULL)`
  )
    .bind(
      syncRunId,
      input.syncType,
      input.source,
      input.recordCount,
      input.initiatedBy,
      input.payloadJson,
      startedAt
    )
    .run();

  return {
    syncRunId,
    startedAt
  };
}

async function finalizeSyncRun(input: {
  env: Env;
  syncRunId: string;
  syncType: SyncType;
  initiatedBy: string;
  actorRole: AppRole;
  status: SyncStatus;
  summary: SyncRunSummary;
}) {
  const finishedAt = new Date().toISOString();
  const summaryJson = JSON.stringify(input.summary);

  await input.env.DB.batch([
    input.env.DB.prepare(
      `UPDATE sync_runs
       SET status = ?,
           summary_json = ?,
           finished_at = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(input.status, summaryJson, finishedAt, input.syncRunId),
    input.env.DB.prepare(
      `INSERT INTO audit_logs (
        id,
        employee_id,
        benefit_id,
        actor_id,
        actor_role,
        action,
        entity_type,
        entity_id,
        reason,
        payload_json
      ) VALUES (?, NULL, NULL, ?, ?, ?, 'sync_run', ?, ?, ?)`
    ).bind(
      crypto.randomUUID(),
      input.initiatedBy,
      input.actorRole,
      input.syncType === "okr" ? "okr_sync_ingested" : "attendance_sync_ingested",
      input.syncRunId,
      `${input.syncType} sync ${input.status}`,
      summaryJson
    )
  ]);
}

function deriveSyncStatus(summary: SyncRunSummary): SyncStatus {
  if (summary.errors > 0 && summary.updated === 0) {
    return "failed";
  }

  if (summary.errors > 0 || summary.missing > 0) {
    return "partial";
  }

  return "completed";
}

async function runSync<TRecord>(input: {
  env: Env;
  syncType: SyncType;
  source?: string;
  records: TRecord[];
  actorId: string;
  actorRole: AppRole;
  applyRecord: (record: TRecord) => Promise<{ employeeId: string; updated: boolean }>;
}) {
  if (input.records.length === 0) {
    throw new Error("At least one sync record is required");
  }

  const source = input.source?.trim() || "manual";
  const { syncRunId } = await createSyncRun({
    env: input.env,
    syncType: input.syncType,
    source,
    initiatedBy: input.actorId,
    recordCount: input.records.length,
    payloadJson: JSON.stringify({
      recordCount: input.records.length,
      source
    })
  });

  const summary: SyncRunSummary = {
    updated: 0,
    recomputed: 0,
    missing: 0,
    errors: 0
  };

  for (const record of input.records) {
    try {
      const result = await input.applyRecord(record);

      if (!result.updated) {
        summary.missing += 1;
        continue;
      }

      summary.updated += 1;

      const recompute = await recomputeEmployeeEligibility({
        env: input.env,
        employeeId: result.employeeId,
        trigger: input.syncType === "okr" ? "okr_sync" : "attendance_import",
        actorId: input.actorId,
        actorRole: input.actorRole
      });

      if (recompute) {
        summary.recomputed += 1;
      } else {
        summary.missing += 1;
      }
    } catch {
      summary.errors += 1;
    }
  }

  const status = deriveSyncStatus(summary);

  await finalizeSyncRun({
    env: input.env,
    syncRunId,
    syncType: input.syncType,
    initiatedBy: input.actorId,
    actorRole: input.actorRole,
    status,
    summary
  });

  return {
    syncRunId,
    syncType: input.syncType,
    source,
    status,
    recordCount: input.records.length,
    summary
  } satisfies SyncRunResult;
}

export async function ingestOkrSync(input: {
  env: Env;
  source?: string;
  records: OkrRecord[];
  actorId: string;
  actorRole: AppRole;
}): Promise<SyncRunResult> {
  return runSync({
    env: input.env,
    syncType: "okr",
    source: input.source,
    records: input.records,
    actorId: input.actorId,
    actorRole: input.actorRole,
    applyRecord: async (record) => {
      const result = await input.env.DB.prepare(
        `UPDATE employees
         SET okr_submitted = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
        .bind(record.okrSubmitted ? 1 : 0, record.employeeId)
        .run();

      return {
        employeeId: record.employeeId,
        updated: Boolean(result.meta.changes)
      };
    }
  });
}

export async function ingestAttendanceSync(input: {
  env: Env;
  source?: string;
  records: AttendanceRecord[];
  actorId: string;
  actorRole: AppRole;
}): Promise<SyncRunResult> {
  return runSync({
    env: input.env,
    syncType: "attendance",
    source: input.source,
    records: input.records,
    actorId: input.actorId,
    actorRole: input.actorRole,
    applyRecord: async (record) => {
      const result = await input.env.DB.prepare(
        `UPDATE employees
         SET late_arrival_count = ?,
             late_arrival_updated_at = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
        .bind(
          record.lateArrivalCount,
          record.lateArrivalUpdatedAt ?? new Date().toISOString(),
          record.employeeId
        )
        .run();

      return {
        employeeId: record.employeeId,
        updated: Boolean(result.meta.changes)
      };
    }
  });
}
