-- Local-only helper seed for the standalone screen-time competition feature.
-- Run this after the base local mock seed so employee records already exist.
--
-- Scenarios covered:
-- - Closed month final ranking with winner / qualified / disqualified outcomes
-- - Current-month provisional ranking
-- - Missing required Friday slot
-- - Rejected required Friday slot
-- - Pending Friday submission
-- - Eligible employees with no submissions yet
-- - Locked employee outside the competition pool
--
-- Recommended local override for upload testing:
--   SCREEN_TIME_DEBUG_TODAY_LOCAL_DATE=2026-03-20

DELETE FROM screen_time_monthly_results
WHERE benefit_id = 'screen_time_salary_uplift';

DELETE FROM screen_time_submissions
WHERE benefit_id = 'screen_time_salary_uplift';

DELETE FROM screen_time_program_tiers
WHERE benefit_id = 'screen_time_salary_uplift';

DELETE FROM screen_time_programs
WHERE benefit_id = 'screen_time_salary_uplift';

DELETE FROM benefit_eligibility
WHERE benefit_id = 'screen_time_salary_uplift';

DELETE FROM eligibility_rules
WHERE benefit_id = 'screen_time_salary_uplift';

DELETE FROM benefits
WHERE id = 'screen_time_salary_uplift';

INSERT INTO benefits (
  id,
  name,
  description,
  category,
  subsidy_percent,
  vendor_name,
  requires_contract,
  flow_type,
  is_active,
  approval_policy
)
VALUES (
  'screen_time_salary_uplift',
  'Digital Wellness Screen Time Competition',
  'Upload one 7-day average screen-time screenshot on each required Friday. Employees are ranked by the lowest monthly averages, and the top 25% win a fixed 150,000 MNT reward.',
  'wellness',
  0,
  'Google Gemini',
  0,
  'screen_time',
  1,
  'hr'
);

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
  'rule_screen_time_active',
  'screen_time_salary_uplift',
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
  computed_at
)
VALUES
  ('emp_eng_ariunbat', 'screen_time_salary_uplift', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z'),
  ('emp_eng_erdene', 'screen_time_salary_uplift', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z'),
  ('emp_demo_ariunbatbumba', 'screen_time_salary_uplift', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z'),
  ('emp_demo_bumbaariunbat', 'screen_time_salary_uplift', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z'),
  ('emp_design_naraa', 'screen_time_salary_uplift', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z'),
  ('emp_fin_anu', 'screen_time_salary_uplift', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z'),
  ('emp_fin_bilguun', 'screen_time_salary_uplift', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z'),
  ('emp_fin_munkh', 'screen_time_salary_uplift', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z'),
  ('emp_hr_nomin', 'screen_time_salary_uplift', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z'),
  ('emp_hr_otgon', 'screen_time_salary_uplift', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z'),
  ('emp_hr_oyuna', 'screen_time_salary_uplift', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z'),
  ('emp_sales_tselmeg', 'screen_time_salary_uplift', 'ELIGIBLE', '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]', '2026-03-20T08:00:00.000Z'),
  ('emp_ops_bolor', 'screen_time_salary_uplift', 'LOCKED', '[{"ruleType":"employment_status","passed":false,"reason":"Only active employees can participate in the screen time competition."}]', '2026-03-20T08:00:00.000Z');

INSERT INTO screen_time_programs (
  benefit_id,
  screenshot_retention_days,
  winner_percent,
  reward_amount_mnt,
  is_active
)
VALUES ('screen_time_salary_uplift', 30, 25, 150000, 1);

-- Closed month demo data: February 2026.
-- Friday slots assigned to 2026-02: 2026-02-06, 2026-02-13, 2026-02-20, 2026-02-27
INSERT INTO screen_time_submissions (
  id,
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
  review_note,
  raw_extraction_json,
  submitted_at,
  reviewed_at
)
VALUES
  ('st_2026_02_erdene_1', 'screen_time_salary_uplift', 'emp_eng_erdene', '2026-02', '2026-02-06', 55, 97, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":55}', '2026-02-06T08:10:00.000Z', '2026-02-06T08:10:00.000Z'),
  ('st_2026_02_erdene_2', 'screen_time_salary_uplift', 'emp_eng_erdene', '2026-02', '2026-02-13', 52, 96, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":52}', '2026-02-13T08:10:00.000Z', '2026-02-13T08:10:00.000Z'),
  ('st_2026_02_erdene_3', 'screen_time_salary_uplift', 'emp_eng_erdene', '2026-02', '2026-02-20', 58, 95, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":58}', '2026-02-20T08:10:00.000Z', '2026-02-20T08:10:00.000Z'),
  ('st_2026_02_erdene_4', 'screen_time_salary_uplift', 'emp_eng_erdene', '2026-02', '2026-02-27', 60, 94, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":60}', '2026-02-27T08:10:00.000Z', '2026-02-27T08:10:00.000Z'),

  ('st_2026_02_ariunbat_1', 'screen_time_salary_uplift', 'emp_eng_ariunbat', '2026-02', '2026-02-06', 82, 94, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":82}', '2026-02-06T08:15:00.000Z', '2026-02-06T08:15:00.000Z'),
  ('st_2026_02_ariunbat_2', 'screen_time_salary_uplift', 'emp_eng_ariunbat', '2026-02', '2026-02-13', 86, 93, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":86}', '2026-02-13T08:15:00.000Z', '2026-02-13T08:15:00.000Z'),
  ('st_2026_02_ariunbat_3', 'screen_time_salary_uplift', 'emp_eng_ariunbat', '2026-02', '2026-02-20', 88, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":88}', '2026-02-20T08:15:00.000Z', '2026-02-20T08:15:00.000Z'),
  ('st_2026_02_ariunbat_4', 'screen_time_salary_uplift', 'emp_eng_ariunbat', '2026-02', '2026-02-27', 84, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":84}', '2026-02-27T08:15:00.000Z', '2026-02-27T08:15:00.000Z'),

  ('st_2026_02_naraa_1', 'screen_time_salary_uplift', 'emp_design_naraa', '2026-02', '2026-02-06', 96, 98, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":96}', '2026-02-06T08:20:00.000Z', '2026-02-06T08:20:00.000Z'),
  ('st_2026_02_naraa_2', 'screen_time_salary_uplift', 'emp_design_naraa', '2026-02', '2026-02-13', 104, 96, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":104}', '2026-02-13T08:20:00.000Z', '2026-02-13T08:20:00.000Z'),
  ('st_2026_02_naraa_3', 'screen_time_salary_uplift', 'emp_design_naraa', '2026-02', '2026-02-20', 110, 95, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":110}', '2026-02-20T08:20:00.000Z', '2026-02-20T08:20:00.000Z'),
  ('st_2026_02_naraa_4', 'screen_time_salary_uplift', 'emp_design_naraa', '2026-02', '2026-02-27', 108, 95, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":108}', '2026-02-27T08:20:00.000Z', '2026-02-27T08:20:00.000Z'),

  ('st_2026_02_tselmeg_1', 'screen_time_salary_uplift', 'emp_sales_tselmeg', '2026-02', '2026-02-06', 145, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":145}', '2026-02-06T08:25:00.000Z', '2026-02-06T08:25:00.000Z'),
  ('st_2026_02_tselmeg_2', 'screen_time_salary_uplift', 'emp_sales_tselmeg', '2026-02', '2026-02-13', 152, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":152}', '2026-02-13T08:25:00.000Z', '2026-02-13T08:25:00.000Z'),
  ('st_2026_02_tselmeg_3', 'screen_time_salary_uplift', 'emp_sales_tselmeg', '2026-02', '2026-02-20', 149, 91, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":149}', '2026-02-20T08:25:00.000Z', '2026-02-20T08:25:00.000Z'),
  ('st_2026_02_tselmeg_4', 'screen_time_salary_uplift', 'emp_sales_tselmeg', '2026-02', '2026-02-27', 148, 91, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":148}', '2026-02-27T08:25:00.000Z', '2026-02-27T08:25:00.000Z'),

  ('st_2026_02_ariunbatbumba_1', 'screen_time_salary_uplift', 'emp_demo_ariunbatbumba', '2026-02', '2026-02-06', 172, 93, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":172}', '2026-02-06T08:30:00.000Z', '2026-02-06T08:30:00.000Z'),
  ('st_2026_02_ariunbatbumba_2', 'screen_time_salary_uplift', 'emp_demo_ariunbatbumba', '2026-02', '2026-02-13', 176, 93, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":176}', '2026-02-13T08:30:00.000Z', '2026-02-13T08:30:00.000Z'),
  ('st_2026_02_ariunbatbumba_3', 'screen_time_salary_uplift', 'emp_demo_ariunbatbumba', '2026-02', '2026-02-20', 181, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":181}', '2026-02-20T08:30:00.000Z', '2026-02-20T08:30:00.000Z'),
  ('st_2026_02_ariunbatbumba_4', 'screen_time_salary_uplift', 'emp_demo_ariunbatbumba', '2026-02', '2026-02-27', 175, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":175}', '2026-02-27T08:30:00.000Z', '2026-02-27T08:30:00.000Z'),

  ('st_2026_02_anu_1', 'screen_time_salary_uplift', 'emp_fin_anu', '2026-02', '2026-02-06', 195, 90, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":195}', '2026-02-06T08:35:00.000Z', '2026-02-06T08:35:00.000Z'),
  ('st_2026_02_anu_2', 'screen_time_salary_uplift', 'emp_fin_anu', '2026-02', '2026-02-13', 205, 89, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":205}', '2026-02-13T08:35:00.000Z', '2026-02-13T08:35:00.000Z'),
  ('st_2026_02_anu_3', 'screen_time_salary_uplift', 'emp_fin_anu', '2026-02', '2026-02-20', 210, 88, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":210}', '2026-02-20T08:35:00.000Z', '2026-02-20T08:35:00.000Z'),
  ('st_2026_02_anu_4', 'screen_time_salary_uplift', 'emp_fin_anu', '2026-02', '2026-02-27', 198, 88, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":198}', '2026-02-27T08:35:00.000Z', '2026-02-27T08:35:00.000Z'),

  ('st_2026_02_munkh_1', 'screen_time_salary_uplift', 'emp_fin_munkh', '2026-02', '2026-02-06', 206, 89, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":206}', '2026-02-06T08:40:00.000Z', '2026-02-06T08:40:00.000Z'),
  ('st_2026_02_munkh_2', 'screen_time_salary_uplift', 'emp_fin_munkh', '2026-02', '2026-02-13', 210, 88, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":210}', '2026-02-13T08:40:00.000Z', '2026-02-13T08:40:00.000Z'),
  ('st_2026_02_munkh_3', 'screen_time_salary_uplift', 'emp_fin_munkh', '2026-02', '2026-02-20', 204, 88, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":204}', '2026-02-20T08:40:00.000Z', '2026-02-20T08:40:00.000Z'),
  ('st_2026_02_munkh_4', 'screen_time_salary_uplift', 'emp_fin_munkh', '2026-02', '2026-02-27', 208, 88, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":208}', '2026-02-27T08:40:00.000Z', '2026-02-27T08:40:00.000Z'),

  ('st_2026_02_bumbaariunbat_1', 'screen_time_salary_uplift', 'emp_demo_bumbaariunbat', '2026-02', '2026-02-06', 224, 90, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":224}', '2026-02-06T08:45:00.000Z', '2026-02-06T08:45:00.000Z'),
  ('st_2026_02_bumbaariunbat_2', 'screen_time_salary_uplift', 'emp_demo_bumbaariunbat', '2026-02', '2026-02-13', 229, 90, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":229}', '2026-02-13T08:45:00.000Z', '2026-02-13T08:45:00.000Z'),
  ('st_2026_02_bumbaariunbat_3', 'screen_time_salary_uplift', 'emp_demo_bumbaariunbat', '2026-02', '2026-02-20', 232, 89, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":232}', '2026-02-20T08:45:00.000Z', '2026-02-20T08:45:00.000Z'),
  ('st_2026_02_bumbaariunbat_4', 'screen_time_salary_uplift', 'emp_demo_bumbaariunbat', '2026-02', '2026-02-27', 227, 89, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":227}', '2026-02-27T08:45:00.000Z', '2026-02-27T08:45:00.000Z'),

  ('st_2026_02_bilguun_1', 'screen_time_salary_uplift', 'emp_fin_bilguun', '2026-02', '2026-02-06', 166, 91, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":166}', '2026-02-06T08:50:00.000Z', '2026-02-06T08:50:00.000Z'),
  ('st_2026_02_bilguun_2', 'screen_time_salary_uplift', 'emp_fin_bilguun', '2026-02', '2026-02-13', 171, 91, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":171}', '2026-02-13T08:50:00.000Z', '2026-02-13T08:50:00.000Z'),
  ('st_2026_02_bilguun_3', 'screen_time_salary_uplift', 'emp_fin_bilguun', '2026-02', '2026-02-20', 174, 90, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":174}', '2026-02-20T08:50:00.000Z', '2026-02-20T08:50:00.000Z'),

  ('st_2026_02_oyuna_1', 'screen_time_salary_uplift', 'emp_hr_oyuna', '2026-02', '2026-02-06', 115, 93, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":115}', '2026-02-06T08:55:00.000Z', '2026-02-06T08:55:00.000Z'),
  ('st_2026_02_oyuna_2', 'screen_time_salary_uplift', 'emp_hr_oyuna', '2026-02', '2026-02-13', 119, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":119}', '2026-02-13T08:55:00.000Z', '2026-02-13T08:55:00.000Z'),
  ('st_2026_02_oyuna_3', 'screen_time_salary_uplift', 'emp_hr_oyuna', '2026-02', '2026-02-20', NULL, 41, 'ios', 'last_7_days', 'rejected', 'rejected', 'Gemini could not confirm a valid last 7 days screen-time view.', '{"reason":"invalid_or_cropped_screen_time_view"}', '2026-02-20T08:55:00.000Z', '2026-02-20T08:55:00.000Z'),
  ('st_2026_02_oyuna_4', 'screen_time_salary_uplift', 'emp_hr_oyuna', '2026-02', '2026-02-27', 117, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":117}', '2026-02-27T08:55:00.000Z', '2026-02-27T08:55:00.000Z');

-- Current month demo data: March 2026.
-- Friday slots assigned to 2026-03: 2026-03-06, 2026-03-13, 2026-03-20, 2026-03-27, 2026-04-03
-- With SCREEN_TIME_DEBUG_TODAY_LOCAL_DATE=2026-03-20, the due slots are:
--   2026-03-06, 2026-03-13, 2026-03-20
INSERT INTO screen_time_submissions (
  id,
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
  review_note,
  raw_extraction_json,
  submitted_at,
  reviewed_at
)
VALUES
  ('st_2026_03_erdene_1', 'screen_time_salary_uplift', 'emp_eng_erdene', '2026-03', '2026-03-06', 54, 97, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":54}', '2026-03-06T08:10:00.000Z', '2026-03-06T08:10:00.000Z'),
  ('st_2026_03_erdene_2', 'screen_time_salary_uplift', 'emp_eng_erdene', '2026-03', '2026-03-13', 57, 96, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":57}', '2026-03-13T08:10:00.000Z', '2026-03-13T08:10:00.000Z'),
  ('st_2026_03_erdene_3', 'screen_time_salary_uplift', 'emp_eng_erdene', '2026-03', '2026-03-20', 58, 95, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":58}', '2026-03-20T08:10:00.000Z', '2026-03-20T08:10:00.000Z'),

  ('st_2026_03_naraa_1', 'screen_time_salary_uplift', 'emp_design_naraa', '2026-03', '2026-03-06', 109, 95, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":109}', '2026-03-06T08:20:00.000Z', '2026-03-06T08:20:00.000Z'),
  ('st_2026_03_naraa_2', 'screen_time_salary_uplift', 'emp_design_naraa', '2026-03', '2026-03-13', 114, 94, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":114}', '2026-03-13T08:20:00.000Z', '2026-03-13T08:20:00.000Z'),
  ('st_2026_03_naraa_3', 'screen_time_salary_uplift', 'emp_design_naraa', '2026-03', '2026-03-20', 118, 94, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":118}', '2026-03-20T08:20:00.000Z', '2026-03-20T08:20:00.000Z'),

  ('st_2026_03_anu_1', 'screen_time_salary_uplift', 'emp_fin_anu', '2026-03', '2026-03-06', 172, 93, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":172}', '2026-03-06T08:30:00.000Z', '2026-03-06T08:30:00.000Z'),
  ('st_2026_03_anu_2', 'screen_time_salary_uplift', 'emp_fin_anu', '2026-03', '2026-03-13', 168, 92, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":168}', '2026-03-13T08:30:00.000Z', '2026-03-13T08:30:00.000Z'),
  ('st_2026_03_anu_3', 'screen_time_salary_uplift', 'emp_fin_anu', '2026-03', '2026-03-20', 170, 92, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":170}', '2026-03-20T08:30:00.000Z', '2026-03-20T08:30:00.000Z'),

  ('st_2026_03_bilguun_1', 'screen_time_salary_uplift', 'emp_fin_bilguun', '2026-03', '2026-03-06', 180, 91, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":180}', '2026-03-06T08:35:00.000Z', '2026-03-06T08:35:00.000Z'),
  ('st_2026_03_bilguun_2', 'screen_time_salary_uplift', 'emp_fin_bilguun', '2026-03', '2026-03-13', 179, 91, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":179}', '2026-03-13T08:35:00.000Z', '2026-03-13T08:35:00.000Z'),
  ('st_2026_03_bilguun_3', 'screen_time_salary_uplift', 'emp_fin_bilguun', '2026-03', '2026-03-20', 181, 90, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":181}', '2026-03-20T08:35:00.000Z', '2026-03-20T08:35:00.000Z'),

  ('st_2026_03_munkh_1', 'screen_time_salary_uplift', 'emp_fin_munkh', '2026-03', '2026-03-06', 206, 89, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":206}', '2026-03-06T08:40:00.000Z', '2026-03-06T08:40:00.000Z'),
  ('st_2026_03_munkh_2', 'screen_time_salary_uplift', 'emp_fin_munkh', '2026-03', '2026-03-13', 210, 88, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":210}', '2026-03-13T08:40:00.000Z', '2026-03-13T08:40:00.000Z'),
  ('st_2026_03_munkh_3', 'screen_time_salary_uplift', 'emp_fin_munkh', '2026-03', '2026-03-20', 205, 88, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":205}', '2026-03-20T08:40:00.000Z', '2026-03-20T08:40:00.000Z'),

  ('st_2026_03_ariunbatbumba_1', 'screen_time_salary_uplift', 'emp_demo_ariunbatbumba', '2026-03', '2026-03-06', 171, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":171}', '2026-03-06T08:45:00.000Z', '2026-03-06T08:45:00.000Z'),
  ('st_2026_03_ariunbatbumba_2', 'screen_time_salary_uplift', 'emp_demo_ariunbatbumba', '2026-03', '2026-03-13', 176, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":176}', '2026-03-13T08:45:00.000Z', '2026-03-13T08:45:00.000Z'),
  ('st_2026_03_ariunbatbumba_3', 'screen_time_salary_uplift', 'emp_demo_ariunbatbumba', '2026-03', '2026-03-20', 181, 91, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":181}', '2026-03-20T08:45:00.000Z', '2026-03-20T08:45:00.000Z'),

  ('st_2026_03_bumbaariunbat_1', 'screen_time_salary_uplift', 'emp_demo_bumbaariunbat', '2026-03', '2026-03-06', 226, 89, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":226}', '2026-03-06T08:50:00.000Z', '2026-03-06T08:50:00.000Z'),
  ('st_2026_03_bumbaariunbat_2', 'screen_time_salary_uplift', 'emp_demo_bumbaariunbat', '2026-03', '2026-03-13', 228, 89, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":228}', '2026-03-13T08:50:00.000Z', '2026-03-13T08:50:00.000Z'),
  ('st_2026_03_bumbaariunbat_3', 'screen_time_salary_uplift', 'emp_demo_bumbaariunbat', '2026-03', '2026-03-20', 230, 88, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":230}', '2026-03-20T08:50:00.000Z', '2026-03-20T08:50:00.000Z'),

  ('st_2026_03_ariunbat_1', 'screen_time_salary_uplift', 'emp_eng_ariunbat', '2026-03', '2026-03-06', 84, 94, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":84}', '2026-03-06T08:55:00.000Z', '2026-03-06T08:55:00.000Z'),
  ('st_2026_03_ariunbat_2', 'screen_time_salary_uplift', 'emp_eng_ariunbat', '2026-03', '2026-03-13', 79, 94, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":79}', '2026-03-13T08:55:00.000Z', '2026-03-13T08:55:00.000Z'),

  ('st_2026_03_tselmeg_1', 'screen_time_salary_uplift', 'emp_sales_tselmeg', '2026-03', '2026-03-06', 142, 91, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":142}', '2026-03-06T09:00:00.000Z', '2026-03-06T09:00:00.000Z'),
  ('st_2026_03_tselmeg_2', 'screen_time_salary_uplift', 'emp_sales_tselmeg', '2026-03', '2026-03-13', 147, 90, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":147}', '2026-03-13T09:00:00.000Z', '2026-03-13T09:00:00.000Z'),
  ('st_2026_03_tselmeg_3', 'screen_time_salary_uplift', 'emp_sales_tselmeg', '2026-03', '2026-03-20', NULL, 44, 'ios', 'last_7_days', 'rejected', 'rejected', 'Gemini could not confirm a valid last 7 days screen-time view.', '{"reason":"invalid_or_cropped_screen_time_view"}', '2026-03-20T09:00:00.000Z', '2026-03-20T09:00:00.000Z'),

  ('st_2026_03_oyuna_1', 'screen_time_salary_uplift', 'emp_hr_oyuna', '2026-03', '2026-03-06', 116, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":116}', '2026-03-06T09:05:00.000Z', '2026-03-06T09:05:00.000Z'),
  ('st_2026_03_oyuna_2', 'screen_time_salary_uplift', 'emp_hr_oyuna', '2026-03', '2026-03-13', 118, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":118}', '2026-03-13T09:05:00.000Z', '2026-03-13T09:05:00.000Z'),
  ('st_2026_03_oyuna_3', 'screen_time_salary_uplift', 'emp_hr_oyuna', '2026-03', '2026-03-20', NULL, NULL, 'ios', 'last_7_days', 'pending', 'pending', 'Waiting for Gemini extraction.', '{"status":"queued_for_processing"}', '2026-03-20T09:05:00.000Z', NULL);
