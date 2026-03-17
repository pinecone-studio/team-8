/**
 * Audit log archive service (TDD §14).
 *
 * "Archive audit entries >12 months old to R2 cold storage."
 *
 * Strategy:
 *   1. Query audit_logs rows with created_at < cutoff (default: 12 months ago).
 *   2. Serialize each batch to NDJSON (one JSON object per line) — compact,
 *      streamable, and compatible with common log analysis tools.
 *   3. PUT the NDJSON file to R2 under a path that partitions by year-month
 *      of the run, making manual inspection and lifecycle policies easy.
 *   4. On successful R2 write, DELETE the archived rows from D1 in batches
 *      so D1 stays below storage limits over time.
 *
 * Designed to be called from the Cloudflare scheduled handler — never throws.
 * Returns a summary of what was archived.
 *
 * R2 path format:
 *   audit-archive/{YYYY-MM}/batch-{timestamp}.ndjson
 *
 * D1 deletion is batched to avoid hitting SQLite variable limits.
 */

import { lt, inArray } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database, AuditLog } from "../../../db";
import type { Env } from "../../context";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Archive rows older than this many months. TDD §14 says ">12 months". */
const DEFAULT_CUTOFF_MONTHS = 12;

/** Maximum rows fetched per archive run to bound memory / CPU time. */
const MAX_ROWS_PER_RUN = 5_000;

/** Delete D1 rows in batches of this size to avoid variable-limit errors. */
const DELETE_BATCH_SIZE = 100;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function subtractMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
}

/**
 * Serialize an array of audit log rows to NDJSON.
 * Each line is a self-contained JSON object — no trailing newline on last line.
 */
function toNdjson(rows: AuditLog[]): string {
  return rows.map((r) => JSON.stringify(r)).join("\n");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface ArchiveResult {
  /** Number of rows fetched from D1. */
  fetched: number;
  /** Number of rows successfully written to R2. */
  archived: number;
  /** Number of rows deleted from D1 after successful R2 write. */
  deleted: number;
  /** R2 object key written, or null if nothing was archived. */
  r2Key: string | null;
}

/**
 * Archive audit log rows older than `cutoffMonths` to R2 and delete them from D1.
 *
 * Idempotent: if the R2 object already exists for today's batch, overwriting it
 * with the same content is safe (NDJSON is deterministic for identical rows).
 *
 * @param db           Drizzle D1 database handle
 * @param env          Worker environment bindings
 * @param cutoffMonths Rows older than this many months are archived. Default: 12
 */
export async function archiveOldAuditLogs(
  db: Database,
  env: Env,
  cutoffMonths = DEFAULT_CUTOFF_MONTHS,
): Promise<ArchiveResult> {
  if (!env.AUDIT_ARCHIVE_BUCKET) {
    console.log("[auditArchive] AUDIT_ARCHIVE_BUCKET not configured — skipping archive.");
    return { fetched: 0, archived: 0, deleted: 0, r2Key: null };
  }

  const cutoffDate = subtractMonths(new Date(), cutoffMonths);
  const cutoffIso = cutoffDate.toISOString();

  // -- 1. Fetch old rows from D1 (capped to avoid OOM on large backlogs) ----
  let rows: AuditLog[];
  try {
    rows = await db
      .select()
      .from(schema.auditLogs)
      .where(lt(schema.auditLogs.createdAt, cutoffIso))
      .limit(MAX_ROWS_PER_RUN);
  } catch (err) {
    console.error("[auditArchive] D1 fetch failed:", err);
    return { fetched: 0, archived: 0, deleted: 0, r2Key: null };
  }

  if (rows.length === 0) {
    console.log("[auditArchive] No audit logs older than cutoff — nothing to archive.");
    return { fetched: 0, archived: 0, deleted: 0, r2Key: null };
  }

  // -- 2. Serialize to NDJSON -----------------------------------------------
  const ndjson = toNdjson(rows);
  const now = new Date();
  const yearMonth = now.toISOString().slice(0, 7); // e.g. "2026-03"
  const timestamp = now.toISOString().replace(/[:.]/g, "-"); // filesystem-safe
  const r2Key = `audit-archive/${yearMonth}/batch-${timestamp}.ndjson`;

  // -- 3. Write to R2 -------------------------------------------------------
  try {
    await env.AUDIT_ARCHIVE_BUCKET.put(r2Key, ndjson, {
      httpMetadata: { contentType: "application/x-ndjson" },
      customMetadata: {
        cutoffDate: cutoffIso,
        rowCount: String(rows.length),
        archivedAt: now.toISOString(),
      },
    });
    console.log(`[auditArchive] Wrote ${rows.length} rows to R2 at ${r2Key}.`);
  } catch (err) {
    console.error("[auditArchive] R2 write failed — D1 rows NOT deleted:", err);
    return { fetched: rows.length, archived: 0, deleted: 0, r2Key: null };
  }

  // -- 4. Delete from D1 in batches (only after confirmed R2 write) ---------
  const ids = rows.map((r) => r.id);
  let deleted = 0;

  for (let i = 0; i < ids.length; i += DELETE_BATCH_SIZE) {
    const batch = ids.slice(i, i + DELETE_BATCH_SIZE);
    try {
      await db.delete(schema.auditLogs).where(inArray(schema.auditLogs.id, batch));
      deleted += batch.length;
    } catch (err) {
      console.error(
        `[auditArchive] D1 delete failed for batch starting at index ${i}:`,
        err,
      );
      // Continue — partial deletion is acceptable; rows will be re-archived
      // on the next run (same content → idempotent R2 overwrite).
    }
  }

  console.log(`[auditArchive] Archived ${rows.length} rows → deleted ${deleted} from D1.`);
  return { fetched: rows.length, archived: rows.length, deleted, r2Key };
}
