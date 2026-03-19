-- seed-screen-time-all-employees.sql
--
-- Inserts synthetic "auto_approved" screen time submissions for EVERY employee
-- in the database for the current month (2026-03), covering the three Monday
-- slots that have already passed: 2026-03-02, 2026-03-09, 2026-03-16.
--
-- Safe to run multiple times — uses INSERT OR IGNORE on the unique index
-- (benefit_id, employee_id, slot_date).
--
-- Run with:
--   npx wrangler d1 execute team8 --remote \
--     --file=scripts/seed-screen-time-all-employees.sql
--
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Ensure a screen_time_programs row exists for every screen_time benefit.
--    Without this row, buildAdminScreenTimeMonthBoard() returns [] immediately.
INSERT OR IGNORE INTO screen_time_programs
  (benefit_id, screenshot_retention_days, is_active, created_at, updated_at)
SELECT
  id,
  30,
  1,
  datetime('now'),
  datetime('now')
FROM benefits
WHERE flow_type = 'screen_time';

-- 2. Seed one submission per employee per due Monday slot for 2026-03.
--    avg_daily_minutes is deterministic per employee (varies 30–300 min/day).
--    Slot variation adds ±15 min so each Monday looks slightly different.
INSERT OR IGNORE INTO screen_time_submissions
  (id,
   benefit_id,
   employee_id,
   month_key,
   slot_date,
   avg_daily_minutes,
   confidence_score,
   platform,
   period_type,
   extraction_status,
   review_status,
   reviewed_at,
   submitted_at,
   created_at,
   updated_at)
SELECT
  lower(hex(randomblob(15))),
  b.id,
  e.id,
  '2026-03',
  s.slot_date,
  -- deterministic base [30..300] per employee + small slot variation [-15..+15]
  max(15, min(360,
    (30 + (
        (unicode(substr(e.id, 1, 1)) * 17)
      + (unicode(substr(e.id, 2, 1)) * 13)
      + (length(e.id) * 11)
    ) % 271)
    + (unicode(substr(s.slot_date, 9, 1)) * 7 % 31) - 15
  )),
  95,
  'ios',
  'weekly',
  'accepted',
  'auto_approved',
  datetime('now'),
  datetime('now'),
  datetime('now'),
  datetime('now')
FROM employees AS e
CROSS JOIN (
  SELECT id FROM benefits WHERE flow_type = 'screen_time' ORDER BY created_at LIMIT 1
) AS b
CROSS JOIN (
  SELECT '2026-03-02' AS slot_date
  UNION ALL SELECT '2026-03-09'
  UNION ALL SELECT '2026-03-16'
) AS s;
