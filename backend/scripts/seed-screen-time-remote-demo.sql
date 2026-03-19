-- Remote-safe demo seed for the existing screen-time benefit.
-- Replaces only screen-time-specific demo data for the live benefit:
--   benefit_id = 25VdL8ehz6b_fGu9WExFb
--
-- This seed intentionally leaves other benefits, contracts, and requests untouched.
-- Monthly result rows are cleared so the runtime recomputes them fresh from the
-- Friday submissions below using the new ranking-based rules.
--
-- Scenarios covered:
-- - Closed month final ranking with winner / qualified / disqualified outcomes
-- - Current-month provisional ranking
-- - Missing required Friday slot
-- - Rejected required Friday slot
-- - Pending Friday submission
-- - Eligible employees with no submissions yet
-- - Locked non-participant (leave employee)

DELETE FROM screen_time_monthly_results
WHERE benefit_id = '25VdL8ehz6b_fGu9WExFb';

DELETE FROM screen_time_submissions
WHERE benefit_id = '25VdL8ehz6b_fGu9WExFb';

DELETE FROM screen_time_program_tiers
WHERE benefit_id = '25VdL8ehz6b_fGu9WExFb';

DELETE FROM screen_time_programs
WHERE benefit_id = '25VdL8ehz6b_fGu9WExFb';

DELETE FROM benefit_eligibility
WHERE benefit_id = '25VdL8ehz6b_fGu9WExFb';

DELETE FROM eligibility_rules
WHERE benefit_id = '25VdL8ehz6b_fGu9WExFb';

UPDATE benefits
SET
  name = 'Digital Wellness Screen Time Competition',
  description = 'Upload one 7-day average screen-time screenshot on each required Friday. Employees are ranked by the lowest monthly averages, and the top 25% win a fixed 150,000 MNT reward.',
  category = 'wellness',
  subsidy_percent = 0,
  vendor_name = 'Google Gemini',
  requires_contract = 0,
  flow_type = 'screen_time',
  is_active = 1,
  approval_policy = 'hr'
WHERE id = '25VdL8ehz6b_fGu9WExFb';

INSERT INTO eligibility_rules (
  id,
  benefit_id,
  rule_type,
  operator,
  value,
  error_message,
  priority,
  is_active
)
VALUES (
  'rule_screen_time_remote_active_only',
  '25VdL8ehz6b_fGu9WExFb',
  'employment_status',
  'eq',
  '"active"',
  'Only active employees can participate in the screen time competition.',
  0,
  1
);

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at,
  override_status
)
VALUES
  ('emp_design_naraa', '25VdL8ehz6b_fGu9WExFb', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z', NULL, NULL, NULL, NULL),
  ('emp_eng_ariunbat', '25VdL8ehz6b_fGu9WExFb', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z', NULL, NULL, NULL, NULL),
  ('emp_eng_erdene', '25VdL8ehz6b_fGu9WExFb', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z', NULL, NULL, NULL, NULL),
  ('emp_fin_anu', '25VdL8ehz6b_fGu9WExFb', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z', NULL, NULL, NULL, NULL),
  ('emp_fin_bilguun', '25VdL8ehz6b_fGu9WExFb', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z', NULL, NULL, NULL, NULL),
  ('emp_fin_munkh', '25VdL8ehz6b_fGu9WExFb', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z', NULL, NULL, NULL, NULL),
  ('emp_hr_nomin', '25VdL8ehz6b_fGu9WExFb', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z', NULL, NULL, NULL, NULL),
  ('emp_hr_otgon', '25VdL8ehz6b_fGu9WExFb', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z', NULL, NULL, NULL, NULL),
  ('emp_hr_oyuna', '25VdL8ehz6b_fGu9WExFb', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z', NULL, NULL, NULL, NULL),
  ('emp_sales_tselmeg', '25VdL8ehz6b_fGu9WExFb', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z', NULL, NULL, NULL, NULL),
  ('emp_ops_bolor', '25VdL8ehz6b_fGu9WExFb', 'LOCKED', '[{"ruleType":"employment_status","passed":false,"reason":"Only active employees can participate in the screen time competition."}]', '2026-03-20T08:00:00.000Z', NULL, NULL, NULL, NULL);

INSERT INTO screen_time_programs (
  benefit_id,
  screenshot_retention_days,
  winner_percent,
  reward_amount_mnt,
  is_active
)
VALUES ('25VdL8ehz6b_fGu9WExFb', 30, 25, 150000, 1);

-- Closed month demo data: February 2026.
-- Friday slots assigned to 2026-02: 2026-02-06, 2026-02-13, 2026-02-20, 2026-02-27
INSERT INTO screen_time_submissions (
  id,
  benefit_id,
  employee_id,
  month_key,
  slot_date,
  screenshot_r2_key,
  file_name,
  mime_type,
  screenshot_sha256,
  avg_daily_minutes,
  confidence_score,
  platform,
  period_type,
  extraction_status,
  review_status,
  review_note,
  raw_extraction_json,
  submitted_at,
  reviewed_at,
  reviewed_by_employee_id,
  created_at,
  updated_at
)
VALUES
  ('st_remote_2026_02_erdene_1', '25VdL8ehz6b_fGu9WExFb', 'emp_eng_erdene', '2026-02', '2026-02-06', NULL, 'erdene-2026-02-06.png', 'image/png', NULL, 55, 97, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":55,"platform":"ios","periodType":"last_7_days"}', '2026-02-06T08:10:00.000Z', '2026-02-06T08:10:00.000Z', NULL, '2026-02-06T08:10:00.000Z', '2026-02-06T08:10:00.000Z'),
  ('st_remote_2026_02_erdene_2', '25VdL8ehz6b_fGu9WExFb', 'emp_eng_erdene', '2026-02', '2026-02-13', NULL, 'erdene-2026-02-13.png', 'image/png', NULL, 52, 96, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":52,"platform":"ios","periodType":"last_7_days"}', '2026-02-13T08:10:00.000Z', '2026-02-13T08:10:00.000Z', NULL, '2026-02-13T08:10:00.000Z', '2026-02-13T08:10:00.000Z'),
  ('st_remote_2026_02_erdene_3', '25VdL8ehz6b_fGu9WExFb', 'emp_eng_erdene', '2026-02', '2026-02-20', NULL, 'erdene-2026-02-20.png', 'image/png', NULL, 58, 95, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":58,"platform":"ios","periodType":"last_7_days"}', '2026-02-20T08:10:00.000Z', '2026-02-20T08:10:00.000Z', NULL, '2026-02-20T08:10:00.000Z', '2026-02-20T08:10:00.000Z'),
  ('st_remote_2026_02_erdene_4', '25VdL8ehz6b_fGu9WExFb', 'emp_eng_erdene', '2026-02', '2026-02-27', NULL, 'erdene-2026-02-27.png', 'image/png', NULL, 60, 94, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":60,"platform":"ios","periodType":"last_7_days"}', '2026-02-27T08:10:00.000Z', '2026-02-27T08:10:00.000Z', NULL, '2026-02-27T08:10:00.000Z', '2026-02-27T08:10:00.000Z'),

  ('st_remote_2026_02_ariunbat_1', '25VdL8ehz6b_fGu9WExFb', 'emp_eng_ariunbat', '2026-02', '2026-02-06', NULL, 'ariunbat-2026-02-06.png', 'image/png', NULL, 82, 94, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":82,"platform":"ios","periodType":"last_7_days"}', '2026-02-06T08:15:00.000Z', '2026-02-06T08:15:00.000Z', NULL, '2026-02-06T08:15:00.000Z', '2026-02-06T08:15:00.000Z'),
  ('st_remote_2026_02_ariunbat_2', '25VdL8ehz6b_fGu9WExFb', 'emp_eng_ariunbat', '2026-02', '2026-02-13', NULL, 'ariunbat-2026-02-13.png', 'image/png', NULL, 86, 93, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":86,"platform":"ios","periodType":"last_7_days"}', '2026-02-13T08:15:00.000Z', '2026-02-13T08:15:00.000Z', NULL, '2026-02-13T08:15:00.000Z', '2026-02-13T08:15:00.000Z'),
  ('st_remote_2026_02_ariunbat_3', '25VdL8ehz6b_fGu9WExFb', 'emp_eng_ariunbat', '2026-02', '2026-02-20', NULL, 'ariunbat-2026-02-20.png', 'image/png', NULL, 88, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":88,"platform":"ios","periodType":"last_7_days"}', '2026-02-20T08:15:00.000Z', '2026-02-20T08:15:00.000Z', NULL, '2026-02-20T08:15:00.000Z', '2026-02-20T08:15:00.000Z'),
  ('st_remote_2026_02_ariunbat_4', '25VdL8ehz6b_fGu9WExFb', 'emp_eng_ariunbat', '2026-02', '2026-02-27', NULL, 'ariunbat-2026-02-27.png', 'image/png', NULL, 84, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":84,"platform":"ios","periodType":"last_7_days"}', '2026-02-27T08:15:00.000Z', '2026-02-27T08:15:00.000Z', NULL, '2026-02-27T08:15:00.000Z', '2026-02-27T08:15:00.000Z'),

  ('st_remote_2026_02_naraa_1', '25VdL8ehz6b_fGu9WExFb', 'emp_design_naraa', '2026-02', '2026-02-06', NULL, 'naraa-2026-02-06.png', 'image/png', NULL, 96, 98, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":96,"platform":"android","periodType":"last_7_days"}', '2026-02-06T08:20:00.000Z', '2026-02-06T08:20:00.000Z', NULL, '2026-02-06T08:20:00.000Z', '2026-02-06T08:20:00.000Z'),
  ('st_remote_2026_02_naraa_2', '25VdL8ehz6b_fGu9WExFb', 'emp_design_naraa', '2026-02', '2026-02-13', NULL, 'naraa-2026-02-13.png', 'image/png', NULL, 104, 96, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":104,"platform":"android","periodType":"last_7_days"}', '2026-02-13T08:20:00.000Z', '2026-02-13T08:20:00.000Z', NULL, '2026-02-13T08:20:00.000Z', '2026-02-13T08:20:00.000Z'),
  ('st_remote_2026_02_naraa_3', '25VdL8ehz6b_fGu9WExFb', 'emp_design_naraa', '2026-02', '2026-02-20', NULL, 'naraa-2026-02-20.png', 'image/png', NULL, 110, 95, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":110,"platform":"android","periodType":"last_7_days"}', '2026-02-20T08:20:00.000Z', '2026-02-20T08:20:00.000Z', NULL, '2026-02-20T08:20:00.000Z', '2026-02-20T08:20:00.000Z'),
  ('st_remote_2026_02_naraa_4', '25VdL8ehz6b_fGu9WExFb', 'emp_design_naraa', '2026-02', '2026-02-27', NULL, 'naraa-2026-02-27.png', 'image/png', NULL, 108, 95, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":108,"platform":"android","periodType":"last_7_days"}', '2026-02-27T08:20:00.000Z', '2026-02-27T08:20:00.000Z', NULL, '2026-02-27T08:20:00.000Z', '2026-02-27T08:20:00.000Z'),

  ('st_remote_2026_02_tselmeg_1', '25VdL8ehz6b_fGu9WExFb', 'emp_sales_tselmeg', '2026-02', '2026-02-06', NULL, 'tselmeg-2026-02-06.png', 'image/png', NULL, 145, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":145,"platform":"ios","periodType":"last_7_days"}', '2026-02-06T08:25:00.000Z', '2026-02-06T08:25:00.000Z', NULL, '2026-02-06T08:25:00.000Z', '2026-02-06T08:25:00.000Z'),
  ('st_remote_2026_02_tselmeg_2', '25VdL8ehz6b_fGu9WExFb', 'emp_sales_tselmeg', '2026-02', '2026-02-13', NULL, 'tselmeg-2026-02-13.png', 'image/png', NULL, 152, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":152,"platform":"ios","periodType":"last_7_days"}', '2026-02-13T08:25:00.000Z', '2026-02-13T08:25:00.000Z', NULL, '2026-02-13T08:25:00.000Z', '2026-02-13T08:25:00.000Z'),
  ('st_remote_2026_02_tselmeg_3', '25VdL8ehz6b_fGu9WExFb', 'emp_sales_tselmeg', '2026-02', '2026-02-20', NULL, 'tselmeg-2026-02-20.png', 'image/png', NULL, 149, 91, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":149,"platform":"ios","periodType":"last_7_days"}', '2026-02-20T08:25:00.000Z', '2026-02-20T08:25:00.000Z', NULL, '2026-02-20T08:25:00.000Z', '2026-02-20T08:25:00.000Z'),
  ('st_remote_2026_02_tselmeg_4', '25VdL8ehz6b_fGu9WExFb', 'emp_sales_tselmeg', '2026-02', '2026-02-27', NULL, 'tselmeg-2026-02-27.png', 'image/png', NULL, 148, 91, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":148,"platform":"ios","periodType":"last_7_days"}', '2026-02-27T08:25:00.000Z', '2026-02-27T08:25:00.000Z', NULL, '2026-02-27T08:25:00.000Z', '2026-02-27T08:25:00.000Z'),

  ('st_remote_2026_02_anu_1', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_anu', '2026-02', '2026-02-06', NULL, 'anu-2026-02-06.png', 'image/png', NULL, 195, 90, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":195,"platform":"android","periodType":"last_7_days"}', '2026-02-06T08:30:00.000Z', '2026-02-06T08:30:00.000Z', NULL, '2026-02-06T08:30:00.000Z', '2026-02-06T08:30:00.000Z'),
  ('st_remote_2026_02_anu_2', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_anu', '2026-02', '2026-02-13', NULL, 'anu-2026-02-13.png', 'image/png', NULL, 205, 89, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":205,"platform":"android","periodType":"last_7_days"}', '2026-02-13T08:30:00.000Z', '2026-02-13T08:30:00.000Z', NULL, '2026-02-13T08:30:00.000Z', '2026-02-13T08:30:00.000Z'),
  ('st_remote_2026_02_anu_3', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_anu', '2026-02', '2026-02-20', NULL, 'anu-2026-02-20.png', 'image/png', NULL, 210, 88, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":210,"platform":"android","periodType":"last_7_days"}', '2026-02-20T08:30:00.000Z', '2026-02-20T08:30:00.000Z', NULL, '2026-02-20T08:30:00.000Z', '2026-02-20T08:30:00.000Z'),
  ('st_remote_2026_02_anu_4', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_anu', '2026-02', '2026-02-27', NULL, 'anu-2026-02-27.png', 'image/png', NULL, 198, 88, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":198,"platform":"android","periodType":"last_7_days"}', '2026-02-27T08:30:00.000Z', '2026-02-27T08:30:00.000Z', NULL, '2026-02-27T08:30:00.000Z', '2026-02-27T08:30:00.000Z'),

  ('st_remote_2026_02_munkh_1', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_munkh', '2026-02', '2026-02-06', NULL, 'munkh-2026-02-06.png', 'image/png', NULL, 206, 89, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":206,"platform":"ios","periodType":"last_7_days"}', '2026-02-06T08:35:00.000Z', '2026-02-06T08:35:00.000Z', NULL, '2026-02-06T08:35:00.000Z', '2026-02-06T08:35:00.000Z'),
  ('st_remote_2026_02_munkh_2', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_munkh', '2026-02', '2026-02-13', NULL, 'munkh-2026-02-13.png', 'image/png', NULL, 210, 88, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":210,"platform":"ios","periodType":"last_7_days"}', '2026-02-13T08:35:00.000Z', '2026-02-13T08:35:00.000Z', NULL, '2026-02-13T08:35:00.000Z', '2026-02-13T08:35:00.000Z'),
  ('st_remote_2026_02_munkh_3', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_munkh', '2026-02', '2026-02-20', NULL, 'munkh-2026-02-20.png', 'image/png', NULL, 204, 88, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":204,"platform":"ios","periodType":"last_7_days"}', '2026-02-20T08:35:00.000Z', '2026-02-20T08:35:00.000Z', NULL, '2026-02-20T08:35:00.000Z', '2026-02-20T08:35:00.000Z'),
  ('st_remote_2026_02_munkh_4', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_munkh', '2026-02', '2026-02-27', NULL, 'munkh-2026-02-27.png', 'image/png', NULL, 208, 88, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":208,"platform":"ios","periodType":"last_7_days"}', '2026-02-27T08:35:00.000Z', '2026-02-27T08:35:00.000Z', NULL, '2026-02-27T08:35:00.000Z', '2026-02-27T08:35:00.000Z'),

  ('st_remote_2026_02_bilguun_1', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_bilguun', '2026-02', '2026-02-06', NULL, 'bilguun-2026-02-06.png', 'image/png', NULL, 166, 91, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":166,"platform":"android","periodType":"last_7_days"}', '2026-02-06T08:40:00.000Z', '2026-02-06T08:40:00.000Z', NULL, '2026-02-06T08:40:00.000Z', '2026-02-06T08:40:00.000Z'),
  ('st_remote_2026_02_bilguun_2', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_bilguun', '2026-02', '2026-02-13', NULL, 'bilguun-2026-02-13.png', 'image/png', NULL, 171, 91, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":171,"platform":"android","periodType":"last_7_days"}', '2026-02-13T08:40:00.000Z', '2026-02-13T08:40:00.000Z', NULL, '2026-02-13T08:40:00.000Z', '2026-02-13T08:40:00.000Z'),
  ('st_remote_2026_02_bilguun_3', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_bilguun', '2026-02', '2026-02-20', NULL, 'bilguun-2026-02-20.png', 'image/png', NULL, 174, 90, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":174,"platform":"android","periodType":"last_7_days"}', '2026-02-20T08:40:00.000Z', '2026-02-20T08:40:00.000Z', NULL, '2026-02-20T08:40:00.000Z', '2026-02-20T08:40:00.000Z'),

  ('st_remote_2026_02_oyuna_1', '25VdL8ehz6b_fGu9WExFb', 'emp_hr_oyuna', '2026-02', '2026-02-06', NULL, 'oyuna-2026-02-06.png', 'image/png', NULL, 115, 93, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":115,"platform":"ios","periodType":"last_7_days"}', '2026-02-06T08:45:00.000Z', '2026-02-06T08:45:00.000Z', NULL, '2026-02-06T08:45:00.000Z', '2026-02-06T08:45:00.000Z'),
  ('st_remote_2026_02_oyuna_2', '25VdL8ehz6b_fGu9WExFb', 'emp_hr_oyuna', '2026-02', '2026-02-13', NULL, 'oyuna-2026-02-13.png', 'image/png', NULL, 119, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":119,"platform":"ios","periodType":"last_7_days"}', '2026-02-13T08:45:00.000Z', '2026-02-13T08:45:00.000Z', NULL, '2026-02-13T08:45:00.000Z', '2026-02-13T08:45:00.000Z'),
  ('st_remote_2026_02_oyuna_3', '25VdL8ehz6b_fGu9WExFb', 'emp_hr_oyuna', '2026-02', '2026-02-20', NULL, 'oyuna-2026-02-20.png', 'image/png', NULL, NULL, 41, 'ios', 'last_7_days', 'rejected', 'rejected', 'Gemini could not confirm a valid last 7 days screen-time view.', '{"reason":"invalid_or_cropped_screen_time_view"}', '2026-02-20T08:45:00.000Z', '2026-02-20T08:45:00.000Z', NULL, '2026-02-20T08:45:00.000Z', '2026-02-20T08:45:00.000Z'),
  ('st_remote_2026_02_oyuna_4', '25VdL8ehz6b_fGu9WExFb', 'emp_hr_oyuna', '2026-02', '2026-02-27', NULL, 'oyuna-2026-02-27.png', 'image/png', NULL, 117, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":117,"platform":"ios","periodType":"last_7_days"}', '2026-02-27T08:45:00.000Z', '2026-02-27T08:45:00.000Z', NULL, '2026-02-27T08:45:00.000Z', '2026-02-27T08:45:00.000Z'),

  -- Current month demo data: March 2026.
  -- Friday slots assigned to 2026-03: 2026-03-06, 2026-03-13, 2026-03-20, 2026-03-27, 2026-04-03
  ('st_remote_2026_03_erdene_1', '25VdL8ehz6b_fGu9WExFb', 'emp_eng_erdene', '2026-03', '2026-03-06', NULL, 'erdene-2026-03-06.png', 'image/png', NULL, 54, 97, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":54,"platform":"ios","periodType":"last_7_days"}', '2026-03-06T08:10:00.000Z', '2026-03-06T08:10:00.000Z', NULL, '2026-03-06T08:10:00.000Z', '2026-03-06T08:10:00.000Z'),
  ('st_remote_2026_03_erdene_2', '25VdL8ehz6b_fGu9WExFb', 'emp_eng_erdene', '2026-03', '2026-03-13', NULL, 'erdene-2026-03-13.png', 'image/png', NULL, 57, 96, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":57,"platform":"ios","periodType":"last_7_days"}', '2026-03-13T08:10:00.000Z', '2026-03-13T08:10:00.000Z', NULL, '2026-03-13T08:10:00.000Z', '2026-03-13T08:10:00.000Z'),
  ('st_remote_2026_03_erdene_3', '25VdL8ehz6b_fGu9WExFb', 'emp_eng_erdene', '2026-03', '2026-03-20', NULL, 'erdene-2026-03-20.png', 'image/png', NULL, 58, 95, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":58,"platform":"ios","periodType":"last_7_days"}', '2026-03-20T08:10:00.000Z', '2026-03-20T08:10:00.000Z', NULL, '2026-03-20T08:10:00.000Z', '2026-03-20T08:10:00.000Z'),

  ('st_remote_2026_03_naraa_1', '25VdL8ehz6b_fGu9WExFb', 'emp_design_naraa', '2026-03', '2026-03-06', NULL, 'naraa-2026-03-06.png', 'image/png', NULL, 109, 95, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":109,"platform":"android","periodType":"last_7_days"}', '2026-03-06T08:20:00.000Z', '2026-03-06T08:20:00.000Z', NULL, '2026-03-06T08:20:00.000Z', '2026-03-06T08:20:00.000Z'),
  ('st_remote_2026_03_naraa_2', '25VdL8ehz6b_fGu9WExFb', 'emp_design_naraa', '2026-03', '2026-03-13', NULL, 'naraa-2026-03-13.png', 'image/png', NULL, 114, 94, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":114,"platform":"android","periodType":"last_7_days"}', '2026-03-13T08:20:00.000Z', '2026-03-13T08:20:00.000Z', NULL, '2026-03-13T08:20:00.000Z', '2026-03-13T08:20:00.000Z'),
  ('st_remote_2026_03_naraa_3', '25VdL8ehz6b_fGu9WExFb', 'emp_design_naraa', '2026-03', '2026-03-20', NULL, 'naraa-2026-03-20.png', 'image/png', NULL, 118, 94, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":118,"platform":"android","periodType":"last_7_days"}', '2026-03-20T08:20:00.000Z', '2026-03-20T08:20:00.000Z', NULL, '2026-03-20T08:20:00.000Z', '2026-03-20T08:20:00.000Z'),

  ('st_remote_2026_03_anu_1', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_anu', '2026-03', '2026-03-06', NULL, 'anu-2026-03-06.png', 'image/png', NULL, 172, 93, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":172,"platform":"android","periodType":"last_7_days"}', '2026-03-06T08:30:00.000Z', '2026-03-06T08:30:00.000Z', NULL, '2026-03-06T08:30:00.000Z', '2026-03-06T08:30:00.000Z'),
  ('st_remote_2026_03_anu_2', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_anu', '2026-03', '2026-03-13', NULL, 'anu-2026-03-13.png', 'image/png', NULL, 168, 92, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":168,"platform":"android","periodType":"last_7_days"}', '2026-03-13T08:30:00.000Z', '2026-03-13T08:30:00.000Z', NULL, '2026-03-13T08:30:00.000Z', '2026-03-13T08:30:00.000Z'),
  ('st_remote_2026_03_anu_3', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_anu', '2026-03', '2026-03-20', NULL, 'anu-2026-03-20.png', 'image/png', NULL, 170, 92, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":170,"platform":"android","periodType":"last_7_days"}', '2026-03-20T08:30:00.000Z', '2026-03-20T08:30:00.000Z', NULL, '2026-03-20T08:30:00.000Z', '2026-03-20T08:30:00.000Z'),

  ('st_remote_2026_03_bilguun_1', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_bilguun', '2026-03', '2026-03-06', NULL, 'bilguun-2026-03-06.png', 'image/png', NULL, 180, 91, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":180,"platform":"android","periodType":"last_7_days"}', '2026-03-06T08:35:00.000Z', '2026-03-06T08:35:00.000Z', NULL, '2026-03-06T08:35:00.000Z', '2026-03-06T08:35:00.000Z'),
  ('st_remote_2026_03_bilguun_2', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_bilguun', '2026-03', '2026-03-13', NULL, 'bilguun-2026-03-13.png', 'image/png', NULL, 179, 91, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":179,"platform":"android","periodType":"last_7_days"}', '2026-03-13T08:35:00.000Z', '2026-03-13T08:35:00.000Z', NULL, '2026-03-13T08:35:00.000Z', '2026-03-13T08:35:00.000Z'),
  ('st_remote_2026_03_bilguun_3', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_bilguun', '2026-03', '2026-03-20', NULL, 'bilguun-2026-03-20.png', 'image/png', NULL, 181, 90, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":181,"platform":"android","periodType":"last_7_days"}', '2026-03-20T08:35:00.000Z', '2026-03-20T08:35:00.000Z', NULL, '2026-03-20T08:35:00.000Z', '2026-03-20T08:35:00.000Z'),

  ('st_remote_2026_03_munkh_1', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_munkh', '2026-03', '2026-03-06', NULL, 'munkh-2026-03-06.png', 'image/png', NULL, 206, 89, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":206,"platform":"ios","periodType":"last_7_days"}', '2026-03-06T08:40:00.000Z', '2026-03-06T08:40:00.000Z', NULL, '2026-03-06T08:40:00.000Z', '2026-03-06T08:40:00.000Z'),
  ('st_remote_2026_03_munkh_2', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_munkh', '2026-03', '2026-03-13', NULL, 'munkh-2026-03-13.png', 'image/png', NULL, 210, 88, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":210,"platform":"ios","periodType":"last_7_days"}', '2026-03-13T08:40:00.000Z', '2026-03-13T08:40:00.000Z', NULL, '2026-03-13T08:40:00.000Z', '2026-03-13T08:40:00.000Z'),
  ('st_remote_2026_03_munkh_3', '25VdL8ehz6b_fGu9WExFb', 'emp_fin_munkh', '2026-03', '2026-03-20', NULL, 'munkh-2026-03-20.png', 'image/png', NULL, 205, 88, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":205,"platform":"ios","periodType":"last_7_days"}', '2026-03-20T08:40:00.000Z', '2026-03-20T08:40:00.000Z', NULL, '2026-03-20T08:40:00.000Z', '2026-03-20T08:40:00.000Z'),

  ('st_remote_2026_03_ariunbat_1', '25VdL8ehz6b_fGu9WExFb', 'emp_eng_ariunbat', '2026-03', '2026-03-06', NULL, 'ariunbat-2026-03-06.png', 'image/png', NULL, 84, 94, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":84,"platform":"ios","periodType":"last_7_days"}', '2026-03-06T08:45:00.000Z', '2026-03-06T08:45:00.000Z', NULL, '2026-03-06T08:45:00.000Z', '2026-03-06T08:45:00.000Z'),
  ('st_remote_2026_03_ariunbat_2', '25VdL8ehz6b_fGu9WExFb', 'emp_eng_ariunbat', '2026-03', '2026-03-13', NULL, 'ariunbat-2026-03-13.png', 'image/png', NULL, 79, 94, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":79,"platform":"ios","periodType":"last_7_days"}', '2026-03-13T08:45:00.000Z', '2026-03-13T08:45:00.000Z', NULL, '2026-03-13T08:45:00.000Z', '2026-03-13T08:45:00.000Z'),

  ('st_remote_2026_03_tselmeg_1', '25VdL8ehz6b_fGu9WExFb', 'emp_sales_tselmeg', '2026-03', '2026-03-06', NULL, 'tselmeg-2026-03-06.png', 'image/png', NULL, 142, 91, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":142,"platform":"ios","periodType":"last_7_days"}', '2026-03-06T08:50:00.000Z', '2026-03-06T08:50:00.000Z', NULL, '2026-03-06T08:50:00.000Z', '2026-03-06T08:50:00.000Z'),
  ('st_remote_2026_03_tselmeg_2', '25VdL8ehz6b_fGu9WExFb', 'emp_sales_tselmeg', '2026-03', '2026-03-13', NULL, 'tselmeg-2026-03-13.png', 'image/png', NULL, 147, 90, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":147,"platform":"ios","periodType":"last_7_days"}', '2026-03-13T08:50:00.000Z', '2026-03-13T08:50:00.000Z', NULL, '2026-03-13T08:50:00.000Z', '2026-03-13T08:50:00.000Z'),
  ('st_remote_2026_03_tselmeg_3', '25VdL8ehz6b_fGu9WExFb', 'emp_sales_tselmeg', '2026-03', '2026-03-20', NULL, 'tselmeg-2026-03-20.png', 'image/png', NULL, NULL, 44, 'ios', 'last_7_days', 'rejected', 'rejected', 'Gemini could not confirm a valid last 7 days screen-time view.', '{"reason":"invalid_or_cropped_screen_time_view"}', '2026-03-20T08:50:00.000Z', '2026-03-20T08:50:00.000Z', NULL, '2026-03-20T08:50:00.000Z', '2026-03-20T08:50:00.000Z'),

  ('st_remote_2026_03_oyuna_1', '25VdL8ehz6b_fGu9WExFb', 'emp_hr_oyuna', '2026-03', '2026-03-06', NULL, 'oyuna-2026-03-06.png', 'image/png', NULL, 116, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":116,"platform":"ios","periodType":"last_7_days"}', '2026-03-06T08:55:00.000Z', '2026-03-06T08:55:00.000Z', NULL, '2026-03-06T08:55:00.000Z', '2026-03-06T08:55:00.000Z'),
  ('st_remote_2026_03_oyuna_2', '25VdL8ehz6b_fGu9WExFb', 'emp_hr_oyuna', '2026-03', '2026-03-13', NULL, 'oyuna-2026-03-13.png', 'image/png', NULL, 118, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":118,"platform":"ios","periodType":"last_7_days"}', '2026-03-13T08:55:00.000Z', '2026-03-13T08:55:00.000Z', NULL, '2026-03-13T08:55:00.000Z', '2026-03-13T08:55:00.000Z'),
  ('st_remote_2026_03_oyuna_3', '25VdL8ehz6b_fGu9WExFb', 'emp_hr_oyuna', '2026-03', '2026-03-20', NULL, 'oyuna-2026-03-20.png', 'image/png', NULL, NULL, NULL, 'ios', 'last_7_days', 'pending', 'pending', 'Waiting for Gemini extraction.', '{"status":"queued_for_processing"}', '2026-03-20T08:55:00.000Z', NULL, NULL, '2026-03-20T08:55:00.000Z', '2026-03-20T08:55:00.000Z');
