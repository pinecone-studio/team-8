PRAGMA foreign_keys = OFF;

CREATE TABLE IF NOT EXISTS sync_runs__new (
  id TEXT PRIMARY KEY NOT NULL,
  sync_type TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  record_count INTEGER NOT NULL DEFAULT 0,
  initiated_by TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  summary_json TEXT,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sync_runs__new (
  id,
  sync_type,
  source,
  status,
  record_count,
  initiated_by,
  payload_json,
  summary_json,
  started_at,
  finished_at,
  created_at,
  updated_at
)
SELECT
  id,
  sync_type,
  source,
  status,
  record_count,
  initiated_by,
  payload_json,
  summary_json,
  started_at,
  finished_at,
  created_at,
  updated_at
FROM sync_runs;

DROP TABLE sync_runs;

ALTER TABLE sync_runs__new RENAME TO sync_runs;

CREATE INDEX IF NOT EXISTS idx_sync_runs_type
  ON sync_runs(sync_type);

CREATE INDEX IF NOT EXISTS idx_sync_runs_status
  ON sync_runs(status);

CREATE INDEX IF NOT EXISTS idx_sync_runs_started_at
  ON sync_runs(started_at);

PRAGMA foreign_keys = ON;
