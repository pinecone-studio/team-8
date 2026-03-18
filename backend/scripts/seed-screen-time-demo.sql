-- Local-only helper seed for the standalone screen-time feature.
-- Run this after the base local mock seed so the employee records already exist.

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
  'Digital Wellness Salary Uplift',
  'Upload a 7-day average screen-time screenshot every Monday. Missing any required Monday means 0 percent uplift for that month.',
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
  'Only active employees can participate in the screen time uplift program.',
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
  (
    'emp_eng_ariunbat',
    'screen_time_salary_uplift',
    'ELIGIBLE',
    '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]',
    '2026-03-19T08:00:00.000Z'
  ),
  (
    'emp_demo_ariunbatbumba',
    'screen_time_salary_uplift',
    'ELIGIBLE',
    '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]',
    '2026-03-19T08:00:00.000Z'
  ),
  (
    'emp_demo_bumbaariunbat',
    'screen_time_salary_uplift',
    'ELIGIBLE',
    '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]',
    '2026-03-19T08:00:00.000Z'
  ),
  (
    'emp_eng_erdene',
    'screen_time_salary_uplift',
    'ELIGIBLE',
    '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]',
    '2026-03-19T08:00:00.000Z'
  ),
  (
    'emp_design_naraa',
    'screen_time_salary_uplift',
    'ELIGIBLE',
    '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]',
    '2026-03-19T08:00:00.000Z'
  ),
  (
    'emp_fin_anu',
    'screen_time_salary_uplift',
    'ELIGIBLE',
    '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]',
    '2026-03-19T08:00:00.000Z'
  ),
  (
    'emp_sales_tselmeg',
    'screen_time_salary_uplift',
    'ELIGIBLE',
    '[{"ruleType":"employment_status","passed":true,"reason":"Active employee"}]',
    '2026-03-19T08:00:00.000Z'
  );

INSERT INTO screen_time_programs (
  benefit_id,
  screenshot_retention_days,
  is_active
)
VALUES ('screen_time_salary_uplift', 30, 1);

INSERT INTO screen_time_program_tiers (
  id,
  benefit_id,
  label,
  max_daily_minutes,
  salary_uplift_percent,
  display_order
)
VALUES
  ('tier_screen_time_1', 'screen_time_salary_uplift', 'High focus', 60, 15, 0),
  ('tier_screen_time_2', 'screen_time_salary_uplift', 'Strong balance', 120, 10, 1),
  ('tier_screen_time_3', 'screen_time_salary_uplift', 'Healthy range', 180, 5, 2);

-- Closed month demo data for leaderboard and month-end review (February 2026).
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
  ('st_2026_02_erdene_1', 'screen_time_salary_uplift', 'emp_eng_erdene', '2026-02', '2026-02-02', 55, 97, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":55}', '2026-02-02T08:10:00.000Z', '2026-02-02T08:10:00.000Z'),
  ('st_2026_02_erdene_2', 'screen_time_salary_uplift', 'emp_eng_erdene', '2026-02', '2026-02-09', 52, 96, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":52}', '2026-02-09T08:10:00.000Z', '2026-02-09T08:10:00.000Z'),
  ('st_2026_02_erdene_3', 'screen_time_salary_uplift', 'emp_eng_erdene', '2026-02', '2026-02-16', 58, 95, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":58}', '2026-02-16T08:10:00.000Z', '2026-02-16T08:10:00.000Z'),
  ('st_2026_02_erdene_4', 'screen_time_salary_uplift', 'emp_eng_erdene', '2026-02', '2026-02-23', 60, 94, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":60}', '2026-02-23T08:10:00.000Z', '2026-02-23T08:10:00.000Z'),

  ('st_2026_02_naraa_1', 'screen_time_salary_uplift', 'emp_design_naraa', '2026-02', '2026-02-02', 96, 98, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":96}', '2026-02-02T08:20:00.000Z', '2026-02-02T08:20:00.000Z'),
  ('st_2026_02_naraa_2', 'screen_time_salary_uplift', 'emp_design_naraa', '2026-02', '2026-02-09', 104, 96, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":104}', '2026-02-09T08:20:00.000Z', '2026-02-09T08:20:00.000Z'),
  ('st_2026_02_naraa_3', 'screen_time_salary_uplift', 'emp_design_naraa', '2026-02', '2026-02-16', 110, 95, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":110}', '2026-02-16T08:20:00.000Z', '2026-02-16T08:20:00.000Z'),
  ('st_2026_02_naraa_4', 'screen_time_salary_uplift', 'emp_design_naraa', '2026-02', '2026-02-23', 108, 95, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":108}', '2026-02-23T08:20:00.000Z', '2026-02-23T08:20:00.000Z'),

  ('st_2026_02_tselmeg_1', 'screen_time_salary_uplift', 'emp_sales_tselmeg', '2026-02', '2026-02-02', 145, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":145}', '2026-02-02T08:30:00.000Z', '2026-02-02T08:30:00.000Z'),
  ('st_2026_02_tselmeg_2', 'screen_time_salary_uplift', 'emp_sales_tselmeg', '2026-02', '2026-02-09', 152, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":152}', '2026-02-09T08:30:00.000Z', '2026-02-09T08:30:00.000Z'),
  ('st_2026_02_tselmeg_3', 'screen_time_salary_uplift', 'emp_sales_tselmeg', '2026-02', '2026-02-16', 149, 91, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":149}', '2026-02-16T08:30:00.000Z', '2026-02-16T08:30:00.000Z'),
  ('st_2026_02_tselmeg_4', 'screen_time_salary_uplift', 'emp_sales_tselmeg', '2026-02', '2026-02-23', 148, 91, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":148}', '2026-02-23T08:30:00.000Z', '2026-02-23T08:30:00.000Z'),

  ('st_2026_02_anu_1', 'screen_time_salary_uplift', 'emp_fin_anu', '2026-02', '2026-02-02', 195, 90, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":195}', '2026-02-02T08:40:00.000Z', '2026-02-02T08:40:00.000Z'),
  ('st_2026_02_anu_2', 'screen_time_salary_uplift', 'emp_fin_anu', '2026-02', '2026-02-09', 205, 89, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":205}', '2026-02-09T08:40:00.000Z', '2026-02-09T08:40:00.000Z'),
  ('st_2026_02_anu_3', 'screen_time_salary_uplift', 'emp_fin_anu', '2026-02', '2026-02-16', 210, 88, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":210}', '2026-02-16T08:40:00.000Z', '2026-02-16T08:40:00.000Z'),
  ('st_2026_02_anu_4', 'screen_time_salary_uplift', 'emp_fin_anu', '2026-02', '2026-02-23', 198, 88, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":198}', '2026-02-23T08:40:00.000Z', '2026-02-23T08:40:00.000Z'),

  ('st_2026_02_ariunbat_1', 'screen_time_salary_uplift', 'emp_eng_ariunbat', '2026-02', '2026-02-02', 82, 94, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":82}', '2026-02-02T08:50:00.000Z', '2026-02-02T08:50:00.000Z'),
  ('st_2026_02_ariunbat_2', 'screen_time_salary_uplift', 'emp_eng_ariunbat', '2026-02', '2026-02-09', 86, 93, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":86}', '2026-02-09T08:50:00.000Z', '2026-02-09T08:50:00.000Z'),
  ('st_2026_02_ariunbat_3', 'screen_time_salary_uplift', 'emp_eng_ariunbat', '2026-02', '2026-02-16', 88, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":88}', '2026-02-16T08:50:00.000Z', '2026-02-16T08:50:00.000Z'),
  ('st_2026_02_ariunbat_4', 'screen_time_salary_uplift', 'emp_eng_ariunbat', '2026-02', '2026-02-23', 84, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":84}', '2026-02-23T08:50:00.000Z', '2026-02-23T08:50:00.000Z'),

  ('st_2026_02_ariunbatbumba_1', 'screen_time_salary_uplift', 'emp_demo_ariunbatbumba', '2026-02', '2026-02-02', 172, 93, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":172}', '2026-02-02T09:05:00.000Z', '2026-02-02T09:05:00.000Z'),
  ('st_2026_02_ariunbatbumba_2', 'screen_time_salary_uplift', 'emp_demo_ariunbatbumba', '2026-02', '2026-02-09', 176, 93, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":176}', '2026-02-09T09:05:00.000Z', '2026-02-09T09:05:00.000Z'),
  ('st_2026_02_ariunbatbumba_3', 'screen_time_salary_uplift', 'emp_demo_ariunbatbumba', '2026-02', '2026-02-16', 181, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":181}', '2026-02-16T09:05:00.000Z', '2026-02-16T09:05:00.000Z'),
  ('st_2026_02_ariunbatbumba_4', 'screen_time_salary_uplift', 'emp_demo_ariunbatbumba', '2026-02', '2026-02-23', 175, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":175}', '2026-02-23T09:05:00.000Z', '2026-02-23T09:05:00.000Z'),

  ('st_2026_02_bumbaariunbat_1', 'screen_time_salary_uplift', 'emp_demo_bumbaariunbat', '2026-02', '2026-02-02', 224, 90, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":224}', '2026-02-02T09:15:00.000Z', '2026-02-02T09:15:00.000Z'),
  ('st_2026_02_bumbaariunbat_2', 'screen_time_salary_uplift', 'emp_demo_bumbaariunbat', '2026-02', '2026-02-09', 229, 90, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":229}', '2026-02-09T09:15:00.000Z', '2026-02-09T09:15:00.000Z'),
  ('st_2026_02_bumbaariunbat_3', 'screen_time_salary_uplift', 'emp_demo_bumbaariunbat', '2026-02', '2026-02-16', 232, 89, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":232}', '2026-02-16T09:15:00.000Z', '2026-02-16T09:15:00.000Z'),
  ('st_2026_02_bumbaariunbat_4', 'screen_time_salary_uplift', 'emp_demo_bumbaariunbat', '2026-02', '2026-02-23', 227, 89, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":227}', '2026-02-23T09:15:00.000Z', '2026-02-23T09:15:00.000Z');

INSERT INTO screen_time_monthly_results (
  id,
  benefit_id,
  employee_id,
  month_key,
  required_slot_count,
  submitted_slot_count,
  approved_slot_count,
  missing_due_slot_dates_json,
  monthly_avg_daily_minutes,
  awarded_salary_uplift_percent,
  status,
  decision_note
)
VALUES
  ('stmr_2026_02_erdene', 'screen_time_salary_uplift', 'emp_eng_erdene', '2026-02', 4, 4, 4, '[]', 56, 15, 'eligible', 'Computed automatically from all required Monday screenshots.'),
  ('stmr_2026_02_ariunbat', 'screen_time_salary_uplift', 'emp_eng_ariunbat', '2026-02', 4, 4, 4, '[]', 85, 10, 'eligible', 'Computed automatically from all required Monday screenshots.'),
  ('stmr_2026_02_naraa', 'screen_time_salary_uplift', 'emp_design_naraa', '2026-02', 4, 4, 4, '[]', 105, 10, 'eligible', 'Computed automatically from all required Monday screenshots.'),
  ('stmr_2026_02_tselmeg', 'screen_time_salary_uplift', 'emp_sales_tselmeg', '2026-02', 4, 4, 4, '[]', 149, 5, 'eligible', 'Computed automatically from all required Monday screenshots.'),
  ('stmr_2026_02_anu', 'screen_time_salary_uplift', 'emp_fin_anu', '2026-02', 4, 4, 4, '[]', 202, 0, 'not_qualified', 'Computed automatically from all required Monday screenshots.'),
  ('stmr_2026_02_ariunbatbumba', 'screen_time_salary_uplift', 'emp_demo_ariunbatbumba', '2026-02', 4, 4, 4, '[]', 176, 5, 'eligible', 'Computed automatically from all required Monday screenshots.'),
  ('stmr_2026_02_bumbaariunbat', 'screen_time_salary_uplift', 'emp_demo_bumbaariunbat', '2026-02', 4, 4, 4, '[]', 228, 0, 'not_qualified', 'Computed automatically from all required Monday screenshots.');

-- Current month demo data for upload testing (March 2026).
-- Use SCREEN_TIME_DEBUG_TODAY_LOCAL_DATE=2026-03-16 locally to open the 2026-03-16 slot.
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
  ('st_2026_03_ariunbat_1', 'screen_time_salary_uplift', 'emp_eng_ariunbat', '2026-03', '2026-03-02', 84, 94, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":84}', '2026-03-02T08:15:00.000Z', '2026-03-02T08:15:00.000Z'),
  ('st_2026_03_ariunbat_2', 'screen_time_salary_uplift', 'emp_eng_ariunbat', '2026-03', '2026-03-09', 79, 94, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":79}', '2026-03-09T08:15:00.000Z', '2026-03-09T08:15:00.000Z'),

  ('st_2026_03_erdene_1', 'screen_time_salary_uplift', 'emp_eng_erdene', '2026-03', '2026-03-02', 54, 97, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":54}', '2026-03-02T08:20:00.000Z', '2026-03-02T08:20:00.000Z'),
  ('st_2026_03_erdene_2', 'screen_time_salary_uplift', 'emp_eng_erdene', '2026-03', '2026-03-09', 57, 96, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":57}', '2026-03-09T08:20:00.000Z', '2026-03-09T08:20:00.000Z'),
  ('st_2026_03_erdene_3', 'screen_time_salary_uplift', 'emp_eng_erdene', '2026-03', '2026-03-16', 58, 95, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":58}', '2026-03-16T08:20:00.000Z', '2026-03-16T08:20:00.000Z'),

  ('st_2026_03_naraa_1', 'screen_time_salary_uplift', 'emp_design_naraa', '2026-03', '2026-03-02', 109, 95, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":109}', '2026-03-02T08:25:00.000Z', '2026-03-02T08:25:00.000Z'),
  ('st_2026_03_naraa_2', 'screen_time_salary_uplift', 'emp_design_naraa', '2026-03', '2026-03-09', 114, 94, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":114}', '2026-03-09T08:25:00.000Z', '2026-03-09T08:25:00.000Z'),
  ('st_2026_03_naraa_3', 'screen_time_salary_uplift', 'emp_design_naraa', '2026-03', '2026-03-16', 118, 94, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":118}', '2026-03-16T08:25:00.000Z', '2026-03-16T08:25:00.000Z'),

  ('st_2026_03_anu_1', 'screen_time_salary_uplift', 'emp_fin_anu', '2026-03', '2026-03-02', 172, 93, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":172}', '2026-03-02T08:35:00.000Z', '2026-03-02T08:35:00.000Z'),
  ('st_2026_03_anu_2', 'screen_time_salary_uplift', 'emp_fin_anu', '2026-03', '2026-03-09', 168, 92, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":168}', '2026-03-09T08:35:00.000Z', '2026-03-09T08:35:00.000Z'),
  ('st_2026_03_anu_3', 'screen_time_salary_uplift', 'emp_fin_anu', '2026-03', '2026-03-16', 170, 72, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":170}', '2026-03-16T08:35:00.000Z', '2026-03-16T08:35:00.000Z'),

  ('st_2026_03_tselmeg_1', 'screen_time_salary_uplift', 'emp_sales_tselmeg', '2026-03', '2026-03-02', 142, 91, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":142}', '2026-03-02T08:45:00.000Z', '2026-03-02T08:45:00.000Z'),
  ('st_2026_03_tselmeg_3', 'screen_time_salary_uplift', 'emp_sales_tselmeg', '2026-03', '2026-03-16', 151, 90, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":151}', '2026-03-16T08:45:00.000Z', '2026-03-16T08:45:00.000Z'),

  ('st_2026_03_ariunbatbumba_1', 'screen_time_salary_uplift', 'emp_demo_ariunbatbumba', '2026-03', '2026-03-02', 171, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":171}', '2026-03-02T09:05:00.000Z', '2026-03-02T09:05:00.000Z'),
  ('st_2026_03_ariunbatbumba_2', 'screen_time_salary_uplift', 'emp_demo_ariunbatbumba', '2026-03', '2026-03-09', 176, 92, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":176}', '2026-03-09T09:05:00.000Z', '2026-03-09T09:05:00.000Z'),
  ('st_2026_03_ariunbatbumba_3', 'screen_time_salary_uplift', 'emp_demo_ariunbatbumba', '2026-03', '2026-03-16', 181, 91, 'ios', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":181}', '2026-03-16T09:05:00.000Z', '2026-03-16T09:05:00.000Z'),

  ('st_2026_03_bumbaariunbat_1', 'screen_time_salary_uplift', 'emp_demo_bumbaariunbat', '2026-03', '2026-03-02', 226, 89, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":226}', '2026-03-02T09:15:00.000Z', '2026-03-02T09:15:00.000Z'),
  ('st_2026_03_bumbaariunbat_2', 'screen_time_salary_uplift', 'emp_demo_bumbaariunbat', '2026-03', '2026-03-09', 228, 89, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":228}', '2026-03-09T09:15:00.000Z', '2026-03-09T09:15:00.000Z'),
  ('st_2026_03_bumbaariunbat_3', 'screen_time_salary_uplift', 'emp_demo_bumbaariunbat', '2026-03', '2026-03-16', 230, 88, 'android', 'last_7_days', 'accepted', 'auto_approved', 'Accepted automatically from Gemini extraction.', '{"avgDailyMinutes":230}', '2026-03-16T09:15:00.000Z', '2026-03-16T09:15:00.000Z');
