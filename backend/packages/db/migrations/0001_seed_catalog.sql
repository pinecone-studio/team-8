BEGIN TRANSACTION;

DELETE FROM eligibility_rules WHERE benefit_id IN ('benefit-gym-pinefit', 'benefit-private-insurance', 'benefit-digital-wellness', 'benefit-macbook', 'benefit-extra-responsibility', 'benefit-ux-engineer-tools', 'benefit-down-payment', 'benefit-shit-happened-days', 'benefit-remote-work', 'benefit-travel', 'benefit-bonus-based-on-okr');

DELETE FROM benefits WHERE id IN ('benefit-gym-pinefit', 'benefit-private-insurance', 'benefit-digital-wellness', 'benefit-macbook', 'benefit-extra-responsibility', 'benefit-ux-engineer-tools', 'benefit-down-payment', 'benefit-shit-happened-days', 'benefit-remote-work', 'benefit-travel', 'benefit-bonus-based-on-okr');

INSERT INTO benefits (
  id,
  slug,
  name,
  category,
  subsidy_percent,
  vendor_name,
  requires_contract,
  requires_finance_approval,
  requires_manager_approval,
  is_core_benefit,
  is_active
) VALUES (
  'benefit-gym-pinefit',
  'gym-pinefit',
  'Gym - PineFit',
  'wellness',
  50,
  'PineFit',
  1,
  0,
  0,
  0,
  1
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
) VALUES (
  'gym-employment-status',
  'benefit-gym-pinefit',
  'employment_status',
  'eq',
  '"active"',
  'Not available during probation or leave.',
  10,
  1
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
) VALUES (
  'gym-okr',
  'benefit-gym-pinefit',
  'okr_submitted',
  'eq',
  'true',
  'Submit your current OKR to unlock this benefit.',
  20,
  1
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
) VALUES (
  'gym-attendance',
  'benefit-gym-pinefit',
  'attendance',
  'lte',
  '2',
  'Attendance threshold exceeded this month.',
  30,
  1
);

INSERT INTO benefits (
  id,
  slug,
  name,
  category,
  subsidy_percent,
  vendor_name,
  requires_contract,
  requires_finance_approval,
  requires_manager_approval,
  is_core_benefit,
  is_active
) VALUES (
  'benefit-private-insurance',
  'private-insurance',
  'Private Insurance',
  'wellness',
  50,
  'Insurance Partner',
  1,
  0,
  0,
  0,
  1
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
) VALUES (
  'insurance-employment-status',
  'benefit-private-insurance',
  'employment_status',
  'eq',
  '"active"',
  'Not available during probation or leave.',
  10,
  1
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
) VALUES (
  'insurance-okr',
  'benefit-private-insurance',
  'okr_submitted',
  'eq',
  'true',
  'Submit your current OKR to unlock this benefit.',
  20,
  1
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
) VALUES (
  'insurance-attendance',
  'benefit-private-insurance',
  'attendance',
  'lte',
  '2',
  'Attendance threshold exceeded this month.',
  30,
  1
);

INSERT INTO benefits (
  id,
  slug,
  name,
  category,
  subsidy_percent,
  vendor_name,
  requires_contract,
  requires_finance_approval,
  requires_manager_approval,
  is_core_benefit,
  is_active
) VALUES (
  'benefit-digital-wellness',
  'digital-wellness',
  'Digital Wellness',
  'wellness',
  100,
  NULL,
  0,
  0,
  0,
  1,
  1
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
) VALUES (
  'digital-wellness-status',
  'benefit-digital-wellness',
  'employment_status',
  'neq',
  '"terminated"',
  'Not available after termination.',
  10,
  1
);

INSERT INTO benefits (
  id,
  slug,
  name,
  category,
  subsidy_percent,
  vendor_name,
  requires_contract,
  requires_finance_approval,
  requires_manager_approval,
  is_core_benefit,
  is_active
) VALUES (
  'benefit-macbook',
  'macbook',
  'MacBook Subsidy',
  'equipment',
  50,
  'Apple Reseller',
  1,
  0,
  0,
  0,
  1
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
) VALUES (
  'macbook-tenure',
  'benefit-macbook',
  'tenure_days',
  'gte',
  '180',
  'Available after 6 months of employment.',
  10,
  1
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
) VALUES (
  'macbook-employment-status',
  'benefit-macbook',
  'employment_status',
  'eq',
  '"active"',
  'Not available during probation or leave.',
  20,
  1
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
) VALUES (
  'macbook-okr',
  'benefit-macbook',
  'okr_submitted',
  'eq',
  'true',
  'Submit your current OKR to unlock this benefit.',
  30,
  1
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
) VALUES (
  'macbook-responsibility',
  'benefit-macbook',
  'responsibility_level',
  'gte',
  '1',
  'Requires level 1 or above.',
  40,
  1
);

INSERT INTO benefits (
  id,
  slug,
  name,
  category,
  subsidy_percent,
  vendor_name,
  requires_contract,
  requires_finance_approval,
  requires_manager_approval,
  is_core_benefit,
  is_active
) VALUES (
  'benefit-extra-responsibility',
  'extra-responsibility',
  'Extra Responsibility',
  'career',
  100,
  NULL,
  0,
  0,
  0,
  0,
  1
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
) VALUES (
  'extra-responsibility-status',
  'benefit-extra-responsibility',
  'employment_status',
  'eq',
  '"active"',
  'Not available during probation.',
  10,
  1
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
) VALUES (
  'extra-responsibility-okr',
  'benefit-extra-responsibility',
  'okr_submitted',
  'eq',
  'true',
  'OKR submission required.',
  20,
  1
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
) VALUES (
  'extra-responsibility-attendance',
  'benefit-extra-responsibility',
  'attendance',
  'lte',
  '2',
  'Attendance threshold exceeded.',
  30,
  1
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
) VALUES (
  'extra-responsibility-level',
  'benefit-extra-responsibility',
  'responsibility_level',
  'gte',
  '2',
  'Requires Senior level (Level 2+).',
  40,
  1
);

INSERT INTO benefits (
  id,
  slug,
  name,
  category,
  subsidy_percent,
  vendor_name,
  requires_contract,
  requires_finance_approval,
  requires_manager_approval,
  is_core_benefit,
  is_active
) VALUES (
  'benefit-ux-engineer-tools',
  'ux-engineer-tools',
  'UX Engineer Tools',
  'career',
  100,
  NULL,
  0,
  0,
  0,
  0,
  1
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
) VALUES (
  'ux-tools-role',
  'benefit-ux-engineer-tools',
  'role',
  'eq',
  '"ux_engineer"',
  'Available to UX/Design role only.',
  10,
  1
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
) VALUES (
  'ux-tools-status',
  'benefit-ux-engineer-tools',
  'employment_status',
  'eq',
  '"active"',
  'Active employment required.',
  20,
  1
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
) VALUES (
  'ux-tools-okr',
  'benefit-ux-engineer-tools',
  'okr_submitted',
  'eq',
  'true',
  'OKR submission required.',
  30,
  1
);

INSERT INTO benefits (
  id,
  slug,
  name,
  category,
  subsidy_percent,
  vendor_name,
  requires_contract,
  requires_finance_approval,
  requires_manager_approval,
  is_core_benefit,
  is_active
) VALUES (
  'benefit-down-payment',
  'down-payment',
  'Down Payment Assistance',
  'financial',
  100,
  NULL,
  0,
  1,
  0,
  0,
  1
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
) VALUES (
  'down-payment-tenure',
  'benefit-down-payment',
  'tenure_days',
  'gte',
  '730',
  'Available after 2 years of employment.',
  10,
  1
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
) VALUES (
  'down-payment-status',
  'benefit-down-payment',
  'employment_status',
  'eq',
  '"active"',
  'Active employment required.',
  20,
  1
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
) VALUES (
  'down-payment-level',
  'benefit-down-payment',
  'responsibility_level',
  'gte',
  '2',
  'Requires Senior level (Level 2+).',
  30,
  1
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
) VALUES (
  'down-payment-okr',
  'benefit-down-payment',
  'okr_submitted',
  'eq',
  'true',
  'OKR submission required.',
  40,
  1
);

INSERT INTO benefits (
  id,
  slug,
  name,
  category,
  subsidy_percent,
  vendor_name,
  requires_contract,
  requires_finance_approval,
  requires_manager_approval,
  is_core_benefit,
  is_active
) VALUES (
  'benefit-shit-happened-days',
  'shit-happened-days',
  'Shit Happened Days',
  'flexibility',
  100,
  NULL,
  0,
  0,
  0,
  1,
  1
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
) VALUES (
  'shd-status',
  'benefit-shit-happened-days',
  'employment_status',
  'in',
  '["probation","active"]',
  'Probation allocation: 1 day maximum.',
  10,
  1
);

INSERT INTO benefits (
  id,
  slug,
  name,
  category,
  subsidy_percent,
  vendor_name,
  requires_contract,
  requires_finance_approval,
  requires_manager_approval,
  is_core_benefit,
  is_active
) VALUES (
  'benefit-remote-work',
  'remote-work',
  'Remote Work',
  'flexibility',
  100,
  NULL,
  0,
  0,
  0,
  0,
  1
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
) VALUES (
  'remote-work-status',
  'benefit-remote-work',
  'employment_status',
  'eq',
  '"active"',
  'Not available during probation.',
  10,
  1
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
) VALUES (
  'remote-work-okr',
  'benefit-remote-work',
  'okr_submitted',
  'eq',
  'true',
  'OKR submission required.',
  20,
  1
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
) VALUES (
  'remote-work-attendance',
  'benefit-remote-work',
  'attendance',
  'lte',
  '2',
  'Attendance threshold exceeded.',
  30,
  1
);

INSERT INTO benefits (
  id,
  slug,
  name,
  category,
  subsidy_percent,
  vendor_name,
  requires_contract,
  requires_finance_approval,
  requires_manager_approval,
  is_core_benefit,
  is_active
) VALUES (
  'benefit-travel',
  'travel',
  'Travel',
  'financial',
  50,
  'Travel Partner',
  1,
  0,
  1,
  0,
  1
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
) VALUES (
  'travel-tenure',
  'benefit-travel',
  'tenure_days',
  'gte',
  '365',
  'Available after 12 months of employment.',
  10,
  1
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
) VALUES (
  'travel-level',
  'benefit-travel',
  'responsibility_level',
  'gte',
  '1',
  'Requires level 1 or above.',
  20,
  1
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
) VALUES (
  'travel-okr',
  'benefit-travel',
  'okr_submitted',
  'eq',
  'true',
  'OKR submission required.',
  30,
  1
);

INSERT INTO benefits (
  id,
  slug,
  name,
  category,
  subsidy_percent,
  vendor_name,
  requires_contract,
  requires_finance_approval,
  requires_manager_approval,
  is_core_benefit,
  is_active
) VALUES (
  'benefit-bonus-based-on-okr',
  'bonus-based-on-okr',
  'Bonus Based on OKR',
  'financial',
  100,
  NULL,
  0,
  1,
  0,
  0,
  1
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
) VALUES (
  'bonus-okr',
  'benefit-bonus-based-on-okr',
  'okr_submitted',
  'eq',
  'true',
  'OKR not submitted or score below threshold.',
  10,
  1
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
) VALUES (
  'bonus-attendance',
  'benefit-bonus-based-on-okr',
  'attendance',
  'lte',
  '2',
  'Attendance threshold exceeded.',
  20,
  1
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
) VALUES (
  'bonus-status',
  'benefit-bonus-based-on-okr',
  'employment_status',
  'eq',
  '"active"',
  'Active employment required.',
  30,
  1
);

COMMIT;
