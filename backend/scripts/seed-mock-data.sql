DELETE FROM audit_logs;
DELETE FROM contract_acceptances;
DELETE FROM employee_benefit_enrollments;
DELETE FROM benefit_requests;
DELETE FROM benefit_eligibility;
DELETE FROM eligibility_rules;
DELETE FROM contracts;
DELETE FROM benefits;
DELETE FROM employees;

-- Employees:
--   HR and Finance are intentionally seeded with manager / admin / intern levels
--   so the permission split is obvious in the UI and approval flows.
INSERT INTO employees (
  id, email, name, name_eng, role, department, responsibility_level,
  employment_status, hire_date, okr_submitted, late_arrival_count,
  late_arrival_updated_at, created_at, updated_at
) VALUES
  ('emp_hr_otgon',        'otgon.hr@pinequest.mn',         'Otgonjargal',   'Otgonjargal',   'hr_manager',          'Human Resources', 4, 'active',     '2021-04-05T00:00:00.000Z', 1, 0, '2026-03-12T09:00:00.000Z', '2026-03-16T00:00:00.000Z', '2026-03-16T00:00:00.000Z'),
  ('emp_hr_oyuna',        'oyuna.hr@pinequest.mn',         'Oyuna Bayar',   'Oyuna Bayar',   'hr_specialist',       'Human Resources', 2, 'active',     '2023-01-16T00:00:00.000Z', 1, 1, '2026-03-12T09:00:00.000Z', '2026-03-16T00:00:00.000Z', '2026-03-16T00:00:00.000Z'),
  ('emp_hr_nomin',        'nomin.hr@pinequest.mn',         'Nomin Tungalag','Nomin Tungalag','hr_intern',           'Human Resources', 1, 'active',     '2026-02-10T00:00:00.000Z', 0, 2, '2026-03-12T09:00:00.000Z', '2026-03-16T00:00:00.000Z', '2026-03-16T00:00:00.000Z'),

  ('emp_fin_munkh',       'munkh.finance@pinequest.mn',    'Munkh-Erdene',  'Munkh-Erdene',  'finance_manager',     'Finance',         4, 'active',     '2020-08-01T00:00:00.000Z', 1, 0, '2026-03-12T09:00:00.000Z', '2026-03-16T00:00:00.000Z', '2026-03-16T00:00:00.000Z'),
  ('emp_fin_anu',         'anu.finance@pinequest.mn',      'Anujin Sukh',   'Anujin Sukh',   'finance_analyst',     'Finance',         2, 'active',     '2023-06-12T00:00:00.000Z', 1, 1, '2026-03-12T09:00:00.000Z', '2026-03-16T00:00:00.000Z', '2026-03-16T00:00:00.000Z'),
  ('emp_fin_bilguun',     'bilguun.finance@pinequest.mn',  'Bilguun Temuujin','Bilguun Temuujin','finance_intern',   'Finance',         1, 'active',     '2026-01-20T00:00:00.000Z', 0, 1, '2026-03-12T09:00:00.000Z', '2026-03-16T00:00:00.000Z', '2026-03-16T00:00:00.000Z'),

  ('emp_eng_ariunbat',    'ariunbat.eng@pinequest.mn',     'Ariunbat',      'Ariunbat',      'frontend_engineer',   'Engineering',     1, 'active',     '2024-01-15T00:00:00.000Z', 1, 1, '2026-03-12T09:00:00.000Z', '2026-03-16T00:00:00.000Z', '2026-03-16T00:00:00.000Z'),
  ('emp_eng_erdene',      'erdene.eng@pinequest.mn',       'Erdene Munkh',  'Erdene Munkh',  'senior_engineer',     'Engineering',     2, 'active',     '2022-11-07T00:00:00.000Z', 1, 0, '2026-03-12T09:00:00.000Z', '2026-03-16T00:00:00.000Z', '2026-03-16T00:00:00.000Z'),
  ('emp_design_naraa',    'naraa.design@pinequest.mn',     'Naraa Sainaa',  'Naraa Sainaa',  'ux_engineer',         'Design',          2, 'active',     '2023-02-20T00:00:00.000Z', 1, 0, '2026-03-12T09:00:00.000Z', '2026-03-16T00:00:00.000Z', '2026-03-16T00:00:00.000Z'),
  ('emp_ops_bolor',       'bolor.ops@pinequest.mn',        'Bolor Tsetseg', 'Bolor Tsetseg', 'operations_associate','Operations',      1, 'leave',      '2023-08-14T00:00:00.000Z', 0, 2, '2026-03-12T09:00:00.000Z', '2026-03-16T00:00:00.000Z', '2026-03-16T00:00:00.000Z'),
  ('emp_sales_tselmeg',   'tselmeg.sales@pinequest.mn',    'Tselmeg Bat',   'Tselmeg Bat',   'sales_manager',       'Sales',           3, 'active',     '2021-09-01T00:00:00.000Z', 1, 1, '2026-03-12T09:00:00.000Z', '2026-03-16T00:00:00.000Z', '2026-03-16T00:00:00.000Z');

-- Contracts are intentionally left empty.
-- The user will upload real PDF contracts manually through the HR admin flow.

INSERT INTO benefits (
  id, name, category, subsidy_percent, vendor_name, requires_contract,
  active_contract_id, is_active, approval_policy
) VALUES
  ('gym_pulse',               'Gym Membership - Pulse 50%',       'wellness',    50,  'Pulse Fitness',        0, NULL, 1, 'hr'),
  ('private_insurance_plus',  'Private Insurance Plus',           'wellness',    50,  'SecureLife',           1, NULL, 1, 'hr'),
  ('digital_wellness',        'Digital Wellness Pass',            'wellness',   100,  NULL,                   0, NULL, 1, 'hr'),
  ('macbook_pro_lease',       'MacBook Pro Lease',                'equipment',   50,  'Apple Enterprise',     1, NULL, 1, 'hr'),
  ('people_ops_cert',         'People Ops Certification',         'career',     100,  'CIPD Academy',         0, NULL, 1, 'hr'),
  ('finance_cert',            'Finance Certification Fund',       'career',     100,  'ACCA Academy',         0, NULL, 1, 'hr'),
  ('leadership_coaching',     'Leadership Coaching',              'career',      70,  'ExecCoach',            0, NULL, 1, 'hr'),
  ('salary_advance',          'Salary Advance',                   'financial',    0,  NULL,                   0, NULL, 1, 'finance'),
  ('home_down_payment',       'Home Down Payment Support',        'financial',    0,  NULL,                   0, NULL, 1, 'finance'),
  ('travel_explorer',         'Travel Explorer 50%',              'flexibility', 50,  'Nomad Travel',         0, NULL, 1, 'dual'),
  ('remote_work',             'Remote Work Setup',                'flexibility',  0,  NULL,                   0, NULL, 1, 'hr');

INSERT INTO eligibility_rules (
  id, benefit_id, rule_type, operator, value, error_message, priority, is_active
) VALUES
  ('rule_gym_1',        'gym_pulse',              'employment_status',   'eq',  '"active"',                                        'Only active employees can use the gym subsidy.',                 0, 1),
  ('rule_gym_2',        'gym_pulse',              'okr_submitted',       'eq',  'true',                                            'Submit your current OKR before using this benefit.',            1, 1),
  ('rule_gym_3',        'gym_pulse',              'attendance',          'lt',  '4',                                               'Attendance threshold exceeded this month.',                     2, 1),

  ('rule_ins_1',        'private_insurance_plus', 'employment_status',   'eq',  '"active"',                                        'Private insurance is available only to active employees.',      0, 1),
  ('rule_ins_2',        'private_insurance_plus', 'tenure_days',         'gte', '90',                                              'Private insurance unlocks after 90 days.',                      1, 1),
  ('rule_ins_3',        'private_insurance_plus', 'okr_submitted',       'eq',  'true',                                            'Submit your OKR to activate private insurance.',                2, 1),

  ('rule_digital_1',    'digital_wellness',       'employment_status',   'neq', '"terminated"',                                    'Digital wellness is unavailable after termination.',            0, 1),

  ('rule_mac_1',        'macbook_pro_lease',      'employment_status',   'eq',  '"active"',                                        'MacBook lease requires active employment.',                     0, 1),
  ('rule_mac_2',        'macbook_pro_lease',      'tenure_days',         'gte', '180',                                             'MacBook lease unlocks after 6 months.',                         1, 1),
  ('rule_mac_3',        'macbook_pro_lease',      'okr_submitted',       'eq',  'true',                                            'Submit your OKR before requesting a MacBook.',                  2, 1),

  ('rule_people_1',     'people_ops_cert',        'role',                'in',  '["hr_manager","hr_specialist","hr_intern"]',       'This certification is only available to HR team members.',      0, 1),
  ('rule_people_2',     'people_ops_cert',        'employment_status',   'eq',  '"active"',                                        'Only active HR employees can request this certification.',      1, 1),

  ('rule_fin_1',        'finance_cert',           'role',                'in',  '["finance_manager","finance_analyst","finance_intern"]', 'This certification is only available to Finance team members.', 0, 1),
  ('rule_fin_2',        'finance_cert',           'employment_status',   'eq',  '"active"',                                        'Only active Finance employees can request this certification.', 1, 1),

  ('rule_coach_1',      'leadership_coaching',    'employment_status',   'eq',  '"active"',                                        'Leadership coaching requires active employment.',               0, 1),
  ('rule_coach_2',      'leadership_coaching',    'responsibility_level','gte', '3',                                               'Leadership coaching is reserved for manager-track roles.',      1, 1),

  ('rule_salary_1',     'salary_advance',         'employment_status',   'eq',  '"active"',                                        'Salary advance is available only to active employees.',         0, 1),
  ('rule_salary_2',     'salary_advance',         'tenure_days',         'gte', '90',                                              'Salary advance unlocks after 90 days.',                         1, 1),

  ('rule_home_1',       'home_down_payment',      'employment_status',   'eq',  '"active"',                                        'Home down payment requires active employment.',                 0, 1),
  ('rule_home_2',       'home_down_payment',      'tenure_days',         'gte', '730',                                             'Home down payment unlocks after 2 years.',                      1, 1),
  ('rule_home_3',       'home_down_payment',      'responsibility_level','gte', '2',                                               'Home down payment requires Level 2 or above.',                  2, 1),
  ('rule_home_4',       'home_down_payment',      'okr_submitted',       'eq',  'true',                                            'Submit your OKR before requesting a home down payment.',        3, 1),

  ('rule_travel_1',     'travel_explorer',        'employment_status',   'eq',  '"active"',                                        'Travel benefit requires active employment.',                    0, 1),
  ('rule_travel_2',     'travel_explorer',        'tenure_days',         'gte', '365',                                             'Travel benefit unlocks after 12 months.',                       1, 1),
  ('rule_travel_3',     'travel_explorer',        'responsibility_level','gte', '2',                                               'Travel benefit requires Level 2 or above.',                     2, 1),
  ('rule_travel_4',     'travel_explorer',        'okr_submitted',       'eq',  'true',                                            'Submit your OKR before requesting travel support.',             3, 1),

  ('rule_remote_1',     'remote_work',            'employment_status',   'eq',  '"active"',                                        'Remote work setup requires active employment.',                 0, 1),
  ('rule_remote_2',     'remote_work',            'okr_submitted',       'eq',  'true',                                            'Submit your OKR before requesting remote work setup.',          1, 1),
  ('rule_remote_3',     'remote_work',            'attendance',          'lt',  '3',                                               'Remote work setup is locked after repeated late arrivals.',     2, 1);

-- Keep snapshot rows minimal.
-- Most statuses are computed live from rules, requests, and enrollments.
-- Override row included to demonstrate HR manager vs HR intern difference.
INSERT INTO benefit_eligibility (
  employee_id, benefit_id, status, rule_evaluation_json, computed_at,
  override_by, override_reason, override_expires_at, override_status
) VALUES
  (
    'emp_hr_nomin',
    'leadership_coaching',
    'locked',
    '[{"ruleType":"employment_status","passed":true,"reason":"Active employment confirmed."},{"ruleType":"responsibility_level","passed":false,"reason":"Leadership coaching is reserved for manager-track roles."}]',
    '2026-03-16T00:00:00.000Z',
    'emp_hr_otgon',
    'Approved as a short-term shadowing exception for intern development.',
    '2026-04-30T23:59:59.000Z',
    'eligible'
  );

INSERT INTO benefit_requests (
  id, employee_id, benefit_id, status,
  contract_version_accepted, contract_accepted_at,
  reviewed_by, requested_amount, repayment_months, employee_approved_at,
  decline_reason, created_at, updated_at
) VALUES
  ('req_digital_ariunbat',    'emp_eng_ariunbat', 'digital_wellness',      'approved',                    NULL, NULL, 'emp_hr_oyuna',  NULL,     NULL, NULL, NULL, '2026-03-05T09:00:00.000Z', '2026-03-05T11:00:00.000Z'),
  ('req_remote_erdene',       'emp_eng_erdene',   'remote_work',           'approved',                    NULL, NULL, 'emp_hr_otgon',  NULL,     NULL, NULL, NULL, '2026-03-06T10:30:00.000Z', '2026-03-06T12:00:00.000Z'),
  ('req_fincert_anu',         'emp_fin_anu',      'finance_cert',          'approved',                    NULL, NULL, 'emp_hr_otgon',  NULL,     NULL, NULL, NULL, '2026-03-07T09:30:00.000Z', '2026-03-07T13:15:00.000Z'),

  ('req_peopleops_oyuna',     'emp_hr_oyuna',     'people_ops_cert',       'awaiting_hr_review',          NULL, NULL, NULL,           NULL,     NULL, NULL, NULL, '2026-03-12T09:00:00.000Z', '2026-03-12T09:00:00.000Z'),
  ('req_salary_ariunbat',     'emp_eng_ariunbat', 'salary_advance',        'awaiting_finance_review',     NULL, NULL, NULL,           2500000,  6,    '2026-03-12T08:45:00.000Z', NULL, '2026-03-12T08:30:00.000Z', '2026-03-12T08:45:00.000Z'),
  ('req_travel_naraa',        'emp_design_naraa', 'travel_explorer',       'hr_approved',                NULL, NULL, 'emp_hr_otgon',  NULL,     NULL, NULL, NULL, '2026-03-13T10:00:00.000Z', '2026-03-13T15:00:00.000Z'),
  ('req_macbook_naraa',       'emp_design_naraa', 'macbook_pro_lease',     'awaiting_contract_acceptance',NULL, NULL, NULL,           NULL,     NULL, NULL, NULL, '2026-03-14T11:30:00.000Z', '2026-03-14T11:30:00.000Z'),
  ('req_insurance_ariunbat',  'emp_eng_ariunbat', 'private_insurance_plus','awaiting_contract_acceptance',NULL, NULL, NULL,           NULL,     NULL, NULL, NULL, '2026-03-14T14:20:00.000Z', '2026-03-14T14:20:00.000Z'),

  ('req_home_erdene',         'emp_eng_erdene',   'home_down_payment',     'rejected',                    NULL, NULL, 'emp_fin_munkh', 18000000, 24,   '2026-03-09T09:20:00.000Z', 'Budget ceiling reached for this quarter.', '2026-03-09T09:00:00.000Z', '2026-03-09T16:10:00.000Z'),
  ('req_gym_bolor',           'emp_ops_bolor',    'gym_pulse',             'cancelled',                   NULL, NULL, NULL,           NULL,     NULL, NULL, NULL, '2026-03-08T08:30:00.000Z', '2026-03-08T09:05:00.000Z');

INSERT INTO employee_benefit_enrollments (
  id, employee_id, benefit_id, request_id, status,
  subsidy_percent_applied, employee_percent_applied, approved_by,
  started_at, ended_at, metadata_json, created_at, updated_at
) VALUES
  ('enroll_digital_ariunbat', 'emp_eng_ariunbat', 'digital_wellness', 'req_digital_ariunbat', 'active', 100, 0,   'emp_hr_oyuna', '2026-03-05T11:00:00.000Z', NULL, '{"source":"seed","note":"auto-approved universal wellness benefit"}', '2026-03-05T11:00:00.000Z', '2026-03-05T11:00:00.000Z'),
  ('enroll_remote_erdene',    'emp_eng_erdene',   'remote_work',      'req_remote_erdene',    'active',   0, 100, 'emp_hr_otgon', '2026-03-06T12:00:00.000Z', NULL, '{"source":"seed","note":"remote setup granted"}',                    '2026-03-06T12:00:00.000Z', '2026-03-06T12:00:00.000Z'),
  ('enroll_fincert_anu',      'emp_fin_anu',      'finance_cert',     'req_fincert_anu',      'active', 100, 0,   'emp_hr_otgon', '2026-03-07T13:15:00.000Z', NULL, '{"source":"seed","note":"finance analyst learning fund"}',             '2026-03-07T13:15:00.000Z', '2026-03-07T13:15:00.000Z');

INSERT INTO audit_logs (
  id, actor_employee_id, actor_role, action_type, entity_type, entity_id,
  target_employee_id, benefit_id, request_id, contract_id, reason,
  before_json, after_json, metadata_json, ip_address, created_at
) VALUES
  ('audit_req_digital_submit', 'emp_eng_ariunbat', 'employee',         'REQUEST_SUBMITTED',       'benefit_request', 'req_digital_ariunbat', 'emp_eng_ariunbat', 'digital_wellness', 'req_digital_ariunbat', NULL, NULL, NULL, '{"status":"approved"}', '{"approvalPolicy":"hr"}', NULL, '2026-03-05T09:00:00.000Z'),
  ('audit_req_digital_approve','emp_hr_oyuna',     'hr_admin',         'REQUEST_APPROVED',        'benefit_request', 'req_digital_ariunbat', 'emp_eng_ariunbat', 'digital_wellness', 'req_digital_ariunbat', NULL, NULL, '{"status":"awaiting_hr_review"}', '{"status":"approved"}', '{"queue":"hr"}', NULL, '2026-03-05T11:00:00.000Z'),
  ('audit_enroll_digital',     'emp_hr_oyuna',     'hr_admin',         'ENROLLMENT_CREATED',      'enrollment',      'enroll_digital_ariunbat', 'emp_eng_ariunbat', 'digital_wellness', 'req_digital_ariunbat', NULL, NULL, NULL, '{"status":"active"}', '{"requestId":"req_digital_ariunbat"}', NULL, '2026-03-05T11:00:00.000Z'),
  ('audit_salary_submit',      'emp_eng_ariunbat', 'employee',         'REQUEST_SUBMITTED',       'benefit_request', 'req_salary_ariunbat', 'emp_eng_ariunbat', 'salary_advance', 'req_salary_ariunbat', NULL, NULL, NULL, '{"status":"awaiting_finance_review"}', '{"approvalPolicy":"finance","requestedAmount":2500000}', NULL, '2026-03-12T08:30:00.000Z'),
  ('audit_travel_hr',          'emp_hr_otgon',     'hr_manager',       'REQUEST_HR_APPROVED',     'benefit_request', 'req_travel_naraa', 'emp_design_naraa', 'travel_explorer', 'req_travel_naraa', NULL, NULL, '{"status":"awaiting_hr_review"}', '{"status":"hr_approved"}', '{"approvalPolicy":"dual"}', NULL, '2026-03-13T15:00:00.000Z'),
  ('audit_home_reject',        'emp_fin_munkh',    'finance_manager',  'REQUEST_REJECTED',        'benefit_request', 'req_home_erdene', 'emp_eng_erdene', 'home_down_payment', 'req_home_erdene', NULL, 'Budget ceiling reached for this quarter.', '{"status":"awaiting_finance_review"}', '{"status":"rejected"}', '{"requestedAmount":18000000,"repaymentMonths":24}', NULL, '2026-03-09T16:10:00.000Z'),
  ('audit_override_hr_intern', 'emp_hr_otgon',     'hr_manager',       'ELIGIBILITY_OVERRIDE_SET','benefit_eligibility', 'emp_hr_nomin:leadership_coaching', 'emp_hr_nomin', 'leadership_coaching', NULL, NULL, 'Approved as a short-term shadowing exception for intern development.', '{"overrideStatus":null}', '{"overrideStatus":"eligible","expiresAt":"2026-04-30T23:59:59.000Z"}', '{"reason":"manager-track shadowing"}', NULL, '2026-03-10T13:00:00.000Z'),
('audit_rule_update_travel', 'emp_hr_otgon',     'hr_manager',       'ELIGIBILITY_RULE_UPDATED','eligibility_rule', 'rule_travel_3', NULL, 'travel_explorer', NULL, NULL, NULL, '{"value":"1"}', '{"value":"2"}', '{"note":"Travel benefit now reserved for Level 2+"}', NULL, '2026-03-11T17:30:00.000Z');
