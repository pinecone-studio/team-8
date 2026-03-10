-- Benefit catalog
INSERT INTO benefits (
  id, name, category, description, subsidy_percent, is_core, active, created_at, updated_at
) VALUES
  (
    'benefit_gym_pinefit',
    'Gym — PineFit',
    'wellness',
    '50% subsidy. Vendor contract acceptance required.',
    50,
    0,
    1,
    datetime('now'),
    datetime('now')
  ),
  (
    'benefit_private_insurance',
    'Private Insurance',
    'wellness',
    '50% subsidy.',
    50,
    0,
    1,
    datetime('now'),
    datetime('now')
  ),
  (
    'benefit_digital_wellness',
    'Digital Wellness',
    'wellness',
    '100% core benefit. Available to all active employees.',
    100,
    1,
    1,
    datetime('now'),
    datetime('now')
  ),
  (
    'benefit_macbook',
    'MacBook',
    'equipment_career',
    '50% subsidy.',
    50,
    0,
    1,
    datetime('now'),
    datetime('now')
  ),
  (
    'benefit_extra_responsibility',
    'Extra Responsibility',
    'equipment_career',
    'Requires senior level.',
    0,
    0,
    1,
    datetime('now'),
    datetime('now')
  ),
  (
    'benefit_ux_tools',
    'UX Engineer Tools',
    'equipment_career',
    '100% subsidy.',
    100,
    0,
    1,
    datetime('now'),
    datetime('now')
  ),
  (
    'benefit_down_payment',
    'Down Payment Assistance',
    'financial_flexibility',
    'Requires finance approval.',
    0,
    0,
    1,
    datetime('now'),
    datetime('now')
  ),
  (
    'benefit_shit_happened',
    'Shit Happened Days',
    'financial_flexibility',
    'Probation: 1 day max; Active: 3 days/year.',
    100,
    0,
    1,
    datetime('now'),
    datetime('now')
  ),
  (
    'benefit_remote_work',
    'Remote Work',
    'financial_flexibility',
    'Remote work eligibility.',
    0,
    0,
    1,
    datetime('now'),
    datetime('now')
  ),
  (
    'benefit_travel',
    'Travel',
    'financial_flexibility',
    '50% subsidy. Manager pre-approval required.',
    50,
    0,
    1,
    datetime('now'),
    datetime('now')
  ),
  (
    'benefit_bonus_okr',
    'Bonus Based on OKR',
    'financial_flexibility',
    'Bonus based on OKR score and attendance.',
    0,
    0,
    1,
    datetime('now'),
    datetime('now')
  );

-- Benefit rules
INSERT INTO benefit_rules (
  id, benefit_id, rule_type, condition_json, blocking_message, priority, is_blocking, created_at
) VALUES
  -- Gym — PineFit
  ('rule_gym_status', 'benefit_gym_pinefit', 'employment_status', '{"allowed":["active"]}', 'Not available during probation or leave.', 1, 1, datetime('now')),
  ('rule_gym_okr', 'benefit_gym_pinefit', 'okr_gate', '{"required":true}', 'Submit your OKR to unlock this benefit.', 2, 1, datetime('now')),
  ('rule_gym_att', 'benefit_gym_pinefit', 'attendance_gate', '{"maxLateArrivals":3}', 'Attendance threshold exceeded this month.', 3, 1, datetime('now')),
  ('rule_gym_contract', 'benefit_gym_pinefit', 'contract_acceptance', '{"vendor":"PineFit"}', 'Vendor contract acceptance required.', 4, 1, datetime('now')),

  -- Private Insurance
  ('rule_ins_status', 'benefit_private_insurance', 'employment_status', '{"allowed":["active"]}', 'Not available during probation or leave.', 1, 1, datetime('now')),
  ('rule_ins_okr', 'benefit_private_insurance', 'okr_gate', '{"required":true}', 'Submit your OKR to unlock this benefit.', 2, 1, datetime('now')),
  ('rule_ins_att', 'benefit_private_insurance', 'attendance_gate', '{"maxLateArrivals":3}', 'Attendance threshold exceeded this month.', 3, 1, datetime('now')),

  -- Digital Wellness
  ('rule_digital_status', 'benefit_digital_wellness', 'employment_status', '{"disallowed":["terminated"]}', 'Not available after termination.', 1, 1, datetime('now')),

  -- MacBook
  ('rule_mac_tenure', 'benefit_macbook', 'tenure', '{"minDays":180}', 'Available after 6 months of employment.', 1, 1, datetime('now')),
  ('rule_mac_status', 'benefit_macbook', 'employment_status', '{"allowed":["active"]}', 'Not available during probation or leave.', 2, 1, datetime('now')),
  ('rule_mac_okr', 'benefit_macbook', 'okr_gate', '{"required":true}', 'Submit your OKR to unlock this benefit.', 3, 1, datetime('now')),
  ('rule_mac_level', 'benefit_macbook', 'responsibility_level', '{"min":1}', 'Requires Level 1+.', 4, 1, datetime('now')),

  -- Extra Responsibility
  ('rule_extra_status', 'benefit_extra_responsibility', 'employment_status', '{"allowed":["active"]}', 'Not available during probation.', 1, 1, datetime('now')),
  ('rule_extra_okr', 'benefit_extra_responsibility', 'okr_gate', '{"required":true}', 'OKR submission required.', 2, 1, datetime('now')),
  ('rule_extra_att', 'benefit_extra_responsibility', 'attendance_gate', '{"maxLateArrivals":3}', 'Attendance threshold exceeded.', 3, 1, datetime('now')),
  ('rule_extra_level', 'benefit_extra_responsibility', 'responsibility_level', '{"min":2}', 'Requires Senior level (Level 2+).', 4, 1, datetime('now')),

  -- UX Engineer Tools
  ('rule_ux_role', 'benefit_ux_tools', 'role', '{"allowed":["ux_engineer"]}', 'Available to UX/Design role only.', 1, 1, datetime('now')),
  ('rule_ux_status', 'benefit_ux_tools', 'employment_status', '{"allowed":["active"]}', 'Active employment required.', 2, 1, datetime('now')),
  ('rule_ux_okr', 'benefit_ux_tools', 'okr_gate', '{"required":true}', 'OKR submission required.', 3, 1, datetime('now')),

  -- Down Payment Assistance
  ('rule_down_tenure', 'benefit_down_payment', 'tenure', '{"minDays":730}', 'Available after 2 years of employment.', 1, 1, datetime('now')),
  ('rule_down_status', 'benefit_down_payment', 'employment_status', '{"allowed":["active"]}', 'Active employment required.', 2, 1, datetime('now')),
  ('rule_down_level', 'benefit_down_payment', 'responsibility_level', '{"min":2}', 'Requires Senior level (Level 2+).', 3, 1, datetime('now')),
  ('rule_down_okr', 'benefit_down_payment', 'okr_gate', '{"required":true}', 'OKR submission required.', 4, 1, datetime('now')),
  ('rule_down_fin', 'benefit_down_payment', 'finance_approval', '{}', 'Pending Finance approval.', 5, 1, datetime('now')),

  -- Shit Happened Days
  ('rule_shit_status', 'benefit_shit_happened', 'employment_status', '{"disallowed":["terminated"]}', 'Not available after termination.', 1, 1, datetime('now')),
  ('rule_shit_alloc', 'benefit_shit_happened', 'allocation', '{"probationMaxDays":1,"activeMaxDays":3,"requiresOkrForFull":true}', 'Allocation exceeded or OKR required for full allocation.', 2, 1, datetime('now')),

  -- Remote Work
  ('rule_remote_status', 'benefit_remote_work', 'employment_status', '{"allowed":["active"]}', 'Not available during probation.', 1, 1, datetime('now')),
  ('rule_remote_okr', 'benefit_remote_work', 'okr_gate', '{"required":true}', 'OKR submission required.', 2, 1, datetime('now')),
  ('rule_remote_att', 'benefit_remote_work', 'attendance_gate', '{"maxLateArrivals":3}', 'Attendance threshold exceeded.', 3, 1, datetime('now')),

  -- Travel
  ('rule_travel_tenure', 'benefit_travel', 'tenure', '{"minDays":365}', 'Available after 12 months of employment.', 1, 1, datetime('now')),
  ('rule_travel_level', 'benefit_travel', 'responsibility_level', '{"min":1}', 'Requires Level 1+.', 2, 1, datetime('now')),
  ('rule_travel_okr', 'benefit_travel', 'okr_gate', '{"required":true}', 'OKR submission required.', 3, 1, datetime('now')),
  ('rule_travel_mgr', 'benefit_travel', 'manager_approval', '{}', 'Awaiting manager pre-approval.', 4, 1, datetime('now')),

  -- Bonus Based on OKR
  ('rule_bonus_okr', 'benefit_bonus_okr', 'okr_score', '{"minScore":70}', 'OKR not submitted or score below threshold.', 1, 1, datetime('now')),
  ('rule_bonus_att', 'benefit_bonus_okr', 'attendance_gate', '{"maxLateArrivals":3}', 'Attendance threshold exceeded.', 2, 1, datetime('now')),
  ('rule_bonus_status', 'benefit_bonus_okr', 'employment_status', '{"allowed":["active"]}', 'Active employment required.', 3, 1, datetime('now')),
  ('rule_bonus_fin', 'benefit_bonus_okr', 'finance_approval', '{}', 'Pending Finance processing.', 4, 1, datetime('now'));
