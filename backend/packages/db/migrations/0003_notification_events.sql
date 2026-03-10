CREATE TABLE IF NOT EXISTS notification_events (
  id TEXT PRIMARY KEY NOT NULL,
  event_type TEXT NOT NULL,
  audience TEXT NOT NULL,
  recipient_employee_id TEXT,
  recipient_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  source_entity_type TEXT NOT NULL,
  source_entity_id TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  dispatched_at TEXT,
  failed_at TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipient_employee_id) REFERENCES employees(id)
);

CREATE INDEX IF NOT EXISTS idx_notification_events_status
  ON notification_events(status);

CREATE INDEX IF NOT EXISTS idx_notification_events_audience
  ON notification_events(audience);

CREATE INDEX IF NOT EXISTS idx_notification_events_source
  ON notification_events(source_entity_type, source_entity_id);
