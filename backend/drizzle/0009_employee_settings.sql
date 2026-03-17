-- Employee notification preferences and UI settings.
-- Defaults mirror the localStorage defaults already used by the frontend.
CREATE TABLE IF NOT EXISTS employee_settings (
  employee_id       TEXT NOT NULL PRIMARY KEY,
  notification_email        INTEGER NOT NULL DEFAULT 1,
  notification_eligibility  INTEGER NOT NULL DEFAULT 1,
  notification_renewals     INTEGER NOT NULL DEFAULT 0,
  language  TEXT NOT NULL DEFAULT 'English',
  timezone  TEXT NOT NULL DEFAULT 'UTC',
  updated_at TEXT NOT NULL
);
