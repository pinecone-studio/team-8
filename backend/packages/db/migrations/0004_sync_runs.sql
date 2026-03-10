CREATE TABLE IF NOT EXISTS sync_runs (
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

CREATE INDEX IF NOT EXISTS idx_sync_runs_type
  ON sync_runs(sync_type);

CREATE INDEX IF NOT EXISTS idx_sync_runs_status
  ON sync_runs(status);

CREATE INDEX IF NOT EXISTS idx_sync_runs_started_at
  ON sync_runs(started_at);
