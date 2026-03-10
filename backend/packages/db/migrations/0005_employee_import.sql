BEGIN TRANSACTION;

DELETE FROM audit_logs WHERE employee_id IN ('emp-demo-001', 'emp-demo-002', 'emp-demo-003', 'emp-demo-004', 'emp-demo-005', 'emp-demo-006', 'emp-demo-007', 'emp-demo-008', 'emp-demo-009', 'emp-demo-010', 'emp-demo-011', 'emp-demo-012', 'emp-demo-013', 'emp-demo-014', 'emp-demo-015', 'emp-demo-016', 'emp-demo-017', 'emp-demo-018', 'emp-demo-019', 'emp-demo-020', 'emp-demo-021', 'emp-demo-022', 'emp-demo-023', 'emp-demo-024') AND actor_id = 'system-import' AND action = 'eligibility_computed';

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-001',
  'EMP001',
  'employee.one@pinequest.mn',
  'Anujin Bat',
  'Anujin Bat',
  'engineer',
  'Engineering',
  2,
  'active',
  '2024-01-15T00:00:00.000Z',
  1,
  1
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-001',
  'benefit-gym-pinefit',
  'eligible',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.032Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-001',
  'benefit-private-insurance',
  'eligible',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.032Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-001',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.032Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-001',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":784,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.032Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-001',
  'benefit-extra-responsibility',
  'eligible',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.032Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-001',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.032Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-001',
  'benefit-down-payment',
  'eligible',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":784,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.032Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-001',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.032Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-001',
  'benefit-remote-work',
  'eligible',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.032Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-001',
  'benefit-travel',
  'eligible',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":784,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.032Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-001',
  'benefit-bonus-based-on-okr',
  'eligible',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.032Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'c031e7e1-ed29-496c-856d-5a16131d6d73',
  'emp-demo-001',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.032Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '02187763-0d69-4752-87da-a3a191e69200',
  'emp-demo-001',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.032Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '39bae77f-b74f-4766-966c-0331d6a49f83',
  'emp-demo-001',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.032Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '00fbcfb2-f6ea-4992-9332-d10dc0fa85f9',
  'emp-demo-001',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.032Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":784,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '0416edf9-23a6-403a-82f1-e34f93471547',
  'emp-demo-001',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.032Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'ca2a5c1c-adef-4806-996b-60cc57d63d9b',
  'emp-demo-001',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.032Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'd5f58676-141a-468d-9003-91417e38ae70',
  'emp-demo-001',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.032Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":784,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '8b8cdfcd-67ea-4525-9959-775180f91c92',
  'emp-demo-001',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.032Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'c086822c-9eb4-4a2b-8653-21d7aaa7ef80',
  'emp-demo-001',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.032Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'f4327c2a-e38e-48d0-be89-f226c9fcefce',
  'emp-demo-001',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.032Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":784,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'c42dbbc8-f542-4142-b273-590c1896e377',
  'emp-demo-001',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.032Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-002',
  'EMP002',
  'employee.two@pinequest.mn',
  'Temuulen Erdene',
  'Temuulen Erdene',
  'engineer',
  'Engineering',
  1,
  'active',
  '2025-01-20T00:00:00.000Z',
  1,
  0
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-002',
  'benefit-gym-pinefit',
  'eligible',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-002',
  'benefit-private-insurance',
  'eligible',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-002',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-002',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":413,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-002',
  'benefit-extra-responsibility',
  'locked',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-002',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-002',
  'benefit-down-payment',
  'locked',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":413,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-002',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-002',
  'benefit-remote-work',
  'eligible',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-002',
  'benefit-travel',
  'eligible',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":413,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-002',
  'benefit-bonus-based-on-okr',
  'eligible',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '0cdf9ddc-0332-4b2f-b67b-10cc8de755de',
  'emp-demo-002',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'a51ceeab-1354-4b13-b760-fc7df08dd5da',
  'emp-demo-002',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '2ac47ae4-3472-4afd-9e58-0fead8970064',
  'emp-demo-002',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '8464825a-10c5-40ff-9355-58836e0cefdf',
  'emp-demo-002',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":413,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'a3a617e7-c465-49e9-86dc-d73578f1ce4c',
  'emp-demo-002',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'cbcd0608-facb-45b7-a20c-036ad802b8da',
  'emp-demo-002',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'c1b940cd-7241-41ad-8e29-6e41ff3767d2',
  'emp-demo-002',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":413,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '75540d4f-f9b5-42bb-b05c-21b8dba6cb2d',
  'emp-demo-002',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '4ddd0647-08c1-4f5c-9355-d8272d879d9f',
  'emp-demo-002',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '5d7da69e-0add-45c0-8e38-0cffa5c3f30f',
  'emp-demo-002',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":413,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'f0cbbf4f-94fe-4111-85bb-2d6c958f4891',
  'emp-demo-002',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-003',
  'EMP003',
  'employee.three@pinequest.mn',
  'Bilguun Munkh',
  'Bilguun Munkh',
  'engineer',
  'Engineering',
  0,
  'probation',
  '2026-01-10T00:00:00.000Z',
  0,
  0
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-003',
  'benefit-gym-pinefit',
  'locked',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-003',
  'benefit-private-insurance',
  'locked',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-003',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"probation","errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-003',
  'benefit-macbook',
  'locked',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":false,"expected":180,"actual":58,"errorMessage":"Available after 6 months of employment."},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":false,"expected":1,"actual":0,"errorMessage":"Requires level 1 or above."}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-003',
  'benefit-extra-responsibility',
  'locked',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation."},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":0,"errorMessage":"Requires Senior level (Level 2+)."}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-003',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-003',
  'benefit-down-payment',
  'locked',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":58,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":0,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-003',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"probation","errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-003',
  'benefit-remote-work',
  'locked',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation."},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-003',
  'benefit-travel',
  'locked',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":false,"expected":365,"actual":58,"errorMessage":"Available after 12 months of employment."},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":false,"expected":1,"actual":0,"errorMessage":"Requires level 1 or above."},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-003',
  'benefit-bonus-based-on-okr',
  'locked',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'bb0e4390-2408-4f90-a55d-6b8130abc259',
  'emp-demo-003',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"locked","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'b114b3f6-1c54-4a0a-9856-e04a42eb8041',
  'emp-demo-003',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"locked","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '3956d0d4-ade4-4e3d-972b-7ed3a6564042',
  'emp-demo-003',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"probation","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '199c01e7-a91a-46dc-9f3d-e2a17ac0f56a',
  'emp-demo-003',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"locked","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":false,"expected":180,"actual":58,"errorMessage":"Available after 6 months of employment."},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":false,"expected":1,"actual":0,"errorMessage":"Requires level 1 or above."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '27340c39-5708-4466-a35c-376a744430a6',
  'emp-demo-003',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation."},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":0,"errorMessage":"Requires Senior level (Level 2+)."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '49ab79c3-53b2-4ff3-83d6-a71c7a531593',
  'emp-demo-003',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'feb16f42-cc05-4bd5-a1cf-06bf647749f6',
  'emp-demo-003',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":58,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":0,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '05c53320-bc38-45a7-9441-652a2331b1db',
  'emp-demo-003',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"probation","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'ce4987ce-1a08-4430-ba1f-a3449037047d',
  'emp-demo-003',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"locked","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation."},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'dcf12fa1-e136-458a-bf8a-07fb7b2d0360',
  'emp-demo-003',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"travel","benefitName":"Travel","status":"locked","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":false,"expected":365,"actual":58,"errorMessage":"Available after 12 months of employment."},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":false,"expected":1,"actual":0,"errorMessage":"Requires level 1 or above."},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'cdc00b14-ee02-41ba-a4ae-4cdcb33b7c00',
  'emp-demo-003',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"locked","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-004',
  'EMP004',
  'employee.four@pinequest.mn',
  'Saruul Enkh',
  'Saruul Enkh',
  'ux_engineer',
  'Design',
  2,
  'active',
  '2023-07-01T00:00:00.000Z',
  1,
  1
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-004',
  'benefit-gym-pinefit',
  'eligible',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-004',
  'benefit-private-insurance',
  'eligible',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-004',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-004',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":982,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-004',
  'benefit-extra-responsibility',
  'eligible',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-004',
  'benefit-ux-engineer-tools',
  'eligible',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":true,"expected":"ux_engineer","actual":"ux_engineer","errorMessage":null},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-004',
  'benefit-down-payment',
  'eligible',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":982,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-004',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-004',
  'benefit-remote-work',
  'eligible',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-004',
  'benefit-travel',
  'eligible',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":982,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-004',
  'benefit-bonus-based-on-okr',
  'eligible',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '4bf378c5-a333-4983-b61c-40f56381794e',
  'emp-demo-004',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '8b4aa032-ef45-4092-8527-6ba1cf260999',
  'emp-demo-004',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '1a73b2ee-15ef-4d3a-b227-77ccf51755b5',
  'emp-demo-004',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '87e8d7be-7554-4e6d-bda2-96dde07909d3',
  'emp-demo-004',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":982,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '8bfe34ee-86b5-4105-b502-b52965b5cb72',
  'emp-demo-004',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '2eca4d4e-c775-4773-be2f-d5fd10359eea',
  'emp-demo-004',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"eligible","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":true,"expected":"ux_engineer","actual":"ux_engineer","errorMessage":null},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '5539a1f0-6d62-499d-b20a-71c96f9a098a',
  'emp-demo-004',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":982,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'bee43fac-b43c-4c7a-92f5-9684250c7d3a',
  'emp-demo-004',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'efb5f38f-4a66-4c91-a803-e6f6d9e184d8',
  'emp-demo-004',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '6391e086-2700-4f5d-b089-6c5003d08c1d',
  'emp-demo-004',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":982,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '17b54ee3-6c21-4bfc-a5ac-55442ebd9d91',
  'emp-demo-004',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-005',
  'EMP005',
  'employee.five@pinequest.mn',
  'Nomin Tseren',
  'Nomin Tseren',
  'ux_engineer',
  'Design',
  1,
  'active',
  '2025-06-12T00:00:00.000Z',
  1,
  2
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-005',
  'benefit-gym-pinefit',
  'eligible',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-005',
  'benefit-private-insurance',
  'eligible',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-005',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-005',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":270,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-005',
  'benefit-extra-responsibility',
  'locked',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-005',
  'benefit-ux-engineer-tools',
  'eligible',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":true,"expected":"ux_engineer","actual":"ux_engineer","errorMessage":null},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-005',
  'benefit-down-payment',
  'locked',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":270,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-005',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-005',
  'benefit-remote-work',
  'eligible',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-005',
  'benefit-travel',
  'locked',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":false,"expected":365,"actual":270,"errorMessage":"Available after 12 months of employment."},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-005',
  'benefit-bonus-based-on-okr',
  'eligible',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.033Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '4ad696ee-c97f-4a90-bb53-4d9ae5da1fd5',
  'emp-demo-005',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '2699c7cb-54b1-4eb7-9784-3299a5ec8e35',
  'emp-demo-005',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '32872da9-f5a6-4c28-9aaf-9f1ed645e26e',
  'emp-demo-005',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '317d9dad-7c10-4f94-8595-90e049b394a5',
  'emp-demo-005',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":270,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'c4e54760-d970-471f-855b-582682201aa2',
  'emp-demo-005',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'feb5fe63-eac2-4113-815f-b59a40124738',
  'emp-demo-005',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"eligible","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":true,"expected":"ux_engineer","actual":"ux_engineer","errorMessage":null},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '62e81481-d163-49b9-bff6-9937276c91ea',
  'emp-demo-005',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":270,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '1259894f-021e-4f87-bb7b-5e69eb5ae9f5',
  'emp-demo-005',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'aa98ee80-3253-414e-b61a-4496f83fb6fc',
  'emp-demo-005',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'e320df71-4ca3-43cb-b2e6-b122a6cfd6ae',
  'emp-demo-005',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"travel","benefitName":"Travel","status":"locked","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":false,"expected":365,"actual":270,"errorMessage":"Available after 12 months of employment."},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '30dc2c78-2313-45fc-9051-52d3164954c7',
  'emp-demo-005',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.033Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-006',
  'EMP006',
  'employee.six@pinequest.mn',
  'Orgil Tamir',
  'Orgil Tamir',
  'designer',
  'Design',
  1,
  'active',
  '2024-05-03T00:00:00.000Z',
  0,
  1
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-006',
  'benefit-gym-pinefit',
  'locked',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-006',
  'benefit-private-insurance',
  'locked',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-006',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-006',
  'benefit-macbook',
  'locked',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":675,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-006',
  'benefit-extra-responsibility',
  'locked',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-006',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"designer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-006',
  'benefit-down-payment',
  'locked',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":675,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-006',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-006',
  'benefit-remote-work',
  'locked',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-006',
  'benefit-travel',
  'locked',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":675,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-006',
  'benefit-bonus-based-on-okr',
  'locked',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '1f47f6fd-2e4c-4a0c-8a6d-9def2982cb93',
  'emp-demo-006',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"locked","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'f178f248-8fda-4ee8-b014-d88d106a241d',
  'emp-demo-006',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"locked","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '704dafd3-b01b-4996-9b2b-7d0e992ded4f',
  'emp-demo-006',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'ffc92dd5-139a-461b-ab65-abfcecbfcc0e',
  'emp-demo-006',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"locked","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":675,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '6bb0845c-7495-4cb6-a458-d0c8a5552cf5',
  'emp-demo-006',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'd339376d-be22-4dd8-8c0d-c7e275b4f3c3',
  'emp-demo-006',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"designer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'ffd0b5b2-48a2-42a2-b9f7-100048cafa04',
  'emp-demo-006',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":675,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '360dc82b-2155-49ea-8624-b7d44454ec29',
  'emp-demo-006',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '9f67cc7b-5612-4679-9429-ca6586d1acc5',
  'emp-demo-006',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"locked","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'c48afea4-9772-4fa3-9008-69a76277d207',
  'emp-demo-006',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"travel","benefitName":"Travel","status":"locked","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":675,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '2f52aadb-7857-4fb7-b525-ecd3018d3d8f',
  'emp-demo-006',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"locked","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-007',
  'EMP007',
  'employee.seven@pinequest.mn',
  'Khulan Bayar',
  'Khulan Bayar',
  'manager',
  'Product',
  3,
  'active',
  '2022-09-05T00:00:00.000Z',
  1,
  0
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-007',
  'benefit-gym-pinefit',
  'eligible',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-007',
  'benefit-private-insurance',
  'eligible',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-007',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-007',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1281,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-007',
  'benefit-extra-responsibility',
  'eligible',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-007',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"manager","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-007',
  'benefit-down-payment',
  'eligible',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1281,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-007',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-007',
  'benefit-remote-work',
  'eligible',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-007',
  'benefit-travel',
  'eligible',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1281,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-007',
  'benefit-bonus-based-on-okr',
  'eligible',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '92df4625-d54c-42a3-bf71-ded65566ce4f',
  'emp-demo-007',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'ff0b80c6-fa05-492f-a54e-af51d69172d7',
  'emp-demo-007',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '9ea8e559-b1d7-45ed-a386-773feef65da0',
  'emp-demo-007',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'f9d15c26-de20-4154-b2bf-f976611d9335',
  'emp-demo-007',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1281,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '7885c7b1-ae79-4816-b987-e5965191cc42',
  'emp-demo-007',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'f9ad0bb5-f143-4f5e-a1e6-e6184caea764',
  'emp-demo-007',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"manager","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '7e4770da-a1b8-4c66-8dbe-62151ab6001c',
  'emp-demo-007',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1281,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '3700eb5b-5ea8-4791-9678-49ac00a48733',
  'emp-demo-007',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '9dcf9a2d-1998-4490-ad18-20d2dfea128b',
  'emp-demo-007',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '7dc5d8e3-2b49-44e7-a000-ae00da486ce1',
  'emp-demo-007',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1281,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'c7723d99-1e29-4bf9-ab71-fa403c873aa5',
  'emp-demo-007',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-008',
  'EMP008',
  'employee.eight@pinequest.mn',
  'Delgermaa Alt',
  'Delgermaa Alt',
  'manager',
  'HR',
  3,
  'active',
  '2022-04-11T00:00:00.000Z',
  1,
  0
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-008',
  'benefit-gym-pinefit',
  'eligible',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-008',
  'benefit-private-insurance',
  'eligible',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-008',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-008',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1428,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-008',
  'benefit-extra-responsibility',
  'eligible',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-008',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"manager","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-008',
  'benefit-down-payment',
  'eligible',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1428,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-008',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-008',
  'benefit-remote-work',
  'eligible',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-008',
  'benefit-travel',
  'eligible',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1428,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-008',
  'benefit-bonus-based-on-okr',
  'eligible',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '3d940bef-f48a-43d8-8d4e-9acb85422431',
  'emp-demo-008',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'f89c9297-f32e-4c84-a28a-f75111f379ce',
  'emp-demo-008',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '8911c62a-8174-41f0-9b83-9773836ceba2',
  'emp-demo-008',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'b3c68006-161c-4c3b-8b88-29cc83954c07',
  'emp-demo-008',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1428,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'baca7b79-f2fe-4621-9377-85124eb75115',
  'emp-demo-008',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '0c2b2979-cf5c-4e6b-a142-c134b23cda9e',
  'emp-demo-008',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"manager","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '8a7b1538-117f-42c1-9369-ec9dcb0b7aa4',
  'emp-demo-008',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1428,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '0c620a01-3223-4c17-98c6-9658ccfb3c55',
  'emp-demo-008',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'b19796d6-1851-4204-bbb0-dcb1e26fbb25',
  'emp-demo-008',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'b18795e2-790c-4ec1-b8da-a15e6e27627e',
  'emp-demo-008',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1428,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'eefec846-c2f5-4622-80e5-da0387e72bf1',
  'emp-demo-008',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-009',
  'EMP009',
  'employee.nine@pinequest.mn',
  'Ganbold Sukh',
  'Ganbold Sukh',
  'finance_manager',
  'Finance',
  3,
  'active',
  '2021-11-02T00:00:00.000Z',
  1,
  0
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-009',
  'benefit-gym-pinefit',
  'eligible',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-009',
  'benefit-private-insurance',
  'eligible',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-009',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-009',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1588,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-009',
  'benefit-extra-responsibility',
  'eligible',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-009',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"finance_manager","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-009',
  'benefit-down-payment',
  'eligible',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1588,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-009',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-009',
  'benefit-remote-work',
  'eligible',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-009',
  'benefit-travel',
  'eligible',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1588,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-009',
  'benefit-bonus-based-on-okr',
  'eligible',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '6edebcd5-537c-4b8a-9494-701837050570',
  'emp-demo-009',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '91feddfa-43aa-4337-8376-04757daef1be',
  'emp-demo-009',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '936ad779-5cac-4875-be3e-59a236b4089a',
  'emp-demo-009',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '886cf6f8-ce9b-4490-96d2-003815a51a42',
  'emp-demo-009',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1588,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '95f68b63-5c89-4d9b-abcc-d7e64e7f782a',
  'emp-demo-009',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'd41b8781-afa3-4c73-909a-57ac29a597a0',
  'emp-demo-009',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"finance_manager","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '7240981f-8cf8-4159-8644-ac15f646ef96',
  'emp-demo-009',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1588,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'fa21f307-db03-448d-8b74-639221cb6cb9',
  'emp-demo-009',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '07785fa8-ee33-48d7-9b95-178d6b481c4b',
  'emp-demo-009',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'ac7d352f-597b-435d-b7e9-c5d6d6d7e331',
  'emp-demo-009',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1588,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '9bd7a4bb-d019-42be-94ab-5ca79e11db5c',
  'emp-demo-009',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-010',
  'EMP010',
  'employee.ten@pinequest.mn',
  'Uyanga Saran',
  'Uyanga Saran',
  'engineer',
  'Engineering',
  2,
  'leave',
  '2023-03-14T00:00:00.000Z',
  1,
  0
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-010',
  'benefit-gym-pinefit',
  'locked',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Not available during probation or leave."},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-010',
  'benefit-private-insurance',
  'locked',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Not available during probation or leave."},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-010',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"leave","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-010',
  'benefit-macbook',
  'locked',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1091,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Not available during probation or leave."},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-010',
  'benefit-extra-responsibility',
  'locked',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Not available during probation."},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-010',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Active employment required."},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-010',
  'benefit-down-payment',
  'locked',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1091,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Active employment required."},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-010',
  'benefit-shit-happened-days',
  'locked',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":false,"expected":["probation","active"],"actual":"leave","errorMessage":"Probation allocation: 1 day maximum."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-010',
  'benefit-remote-work',
  'locked',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Not available during probation."},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-010',
  'benefit-travel',
  'eligible',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1091,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-010',
  'benefit-bonus-based-on-okr',
  'locked',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Active employment required."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'fab975b9-f989-42e8-8b0e-af429f633858',
  'emp-demo-010',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"locked","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Not available during probation or leave."},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '643e2c2f-eb3c-4cb3-a452-4a0eb49ad576',
  'emp-demo-010',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"locked","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Not available during probation or leave."},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'a40369ca-5eee-4936-8b55-156171cbac46',
  'emp-demo-010',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"leave","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '513e8aca-d03e-4dc1-ae5b-edf3ace68ffb',
  'emp-demo-010',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"locked","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1091,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Not available during probation or leave."},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '59d6e069-6b8f-43c3-b69e-2bbf68842397',
  'emp-demo-010',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Not available during probation."},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'd74eea46-7598-4b3f-947f-6a319617974c',
  'emp-demo-010',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Active employment required."},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '94207354-8153-4b1d-bd2f-c86d82cc21ff',
  'emp-demo-010',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1091,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Active employment required."},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '266e6bfd-e511-4fd7-b3af-bf68edc5727f',
  'emp-demo-010',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"locked","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":false,"expected":["probation","active"],"actual":"leave","errorMessage":"Probation allocation: 1 day maximum."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '181f89ad-3284-4cbd-a810-41c9ad7b6e28',
  'emp-demo-010',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"locked","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Not available during probation."},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'b99072be-216f-45a7-b71d-78aaa40b8f58',
  'emp-demo-010',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1091,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'fe241a81-d723-4fe0-82bc-5c3f4aae99c2',
  'emp-demo-010',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"locked","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Active employment required."}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-011',
  'EMP011',
  'employee.eleven@pinequest.mn',
  'Munkhjin Ariun',
  'Munkhjin Ariun',
  'engineer',
  'Engineering',
  2,
  'active',
  '2021-12-01T00:00:00.000Z',
  1,
  3
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-011',
  'benefit-gym-pinefit',
  'locked',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":false,"expected":2,"actual":3,"errorMessage":"Attendance threshold exceeded this month."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-011',
  'benefit-private-insurance',
  'locked',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":false,"expected":2,"actual":3,"errorMessage":"Attendance threshold exceeded this month."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-011',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-011',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1559,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-011',
  'benefit-extra-responsibility',
  'locked',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":false,"expected":2,"actual":3,"errorMessage":"Attendance threshold exceeded."},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-011',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-011',
  'benefit-down-payment',
  'eligible',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1559,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-011',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-011',
  'benefit-remote-work',
  'locked',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":false,"expected":2,"actual":3,"errorMessage":"Attendance threshold exceeded."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-011',
  'benefit-travel',
  'eligible',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1559,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-011',
  'benefit-bonus-based-on-okr',
  'locked',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":false,"expected":2,"actual":3,"errorMessage":"Attendance threshold exceeded."},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '72319d48-a17f-43d5-8d59-9a26a31722f3',
  'emp-demo-011',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"locked","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":false,"expected":2,"actual":3,"errorMessage":"Attendance threshold exceeded this month."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '0bd16c8e-a3b8-48d0-ae34-841ddab726f7',
  'emp-demo-011',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"locked","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":false,"expected":2,"actual":3,"errorMessage":"Attendance threshold exceeded this month."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '48e93aa1-9d35-412f-b35b-120c7822659b',
  'emp-demo-011',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '21d48877-3a5f-4bcd-8c0b-39aa61aa7f39',
  'emp-demo-011',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1559,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '97110b19-4c87-4c1f-8853-a62794eebcb3',
  'emp-demo-011',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":false,"expected":2,"actual":3,"errorMessage":"Attendance threshold exceeded."},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '83dace49-7b3e-4f03-a21c-bf41e99a2c5e',
  'emp-demo-011',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'c2eb05f5-549e-484d-9191-dd5ecd1ddb85',
  'emp-demo-011',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1559,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'df522645-d739-4c67-b66f-564289613cae',
  'emp-demo-011',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '96b65fb6-d196-4a6c-a122-9f2aa92c0524',
  'emp-demo-011',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"locked","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":false,"expected":2,"actual":3,"errorMessage":"Attendance threshold exceeded."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '0b1f9d1d-51ee-4829-b221-632585a54407',
  'emp-demo-011',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1559,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '8c0108b9-eb49-4f90-9d50-7c10e4a3fdc0',
  'emp-demo-011',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"locked","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":false,"expected":2,"actual":3,"errorMessage":"Attendance threshold exceeded."},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-012',
  'EMP012',
  'employee.twelve@pinequest.mn',
  'Enkhgerel Dorj',
  'Enkhgerel Dorj',
  'engineer',
  'Engineering',
  1,
  'active',
  '2025-11-01T00:00:00.000Z',
  0,
  1
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-012',
  'benefit-gym-pinefit',
  'locked',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-012',
  'benefit-private-insurance',
  'locked',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-012',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-012',
  'benefit-macbook',
  'locked',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":false,"expected":180,"actual":128,"errorMessage":"Available after 6 months of employment."},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-012',
  'benefit-extra-responsibility',
  'locked',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-012',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-012',
  'benefit-down-payment',
  'locked',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":128,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-012',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-012',
  'benefit-remote-work',
  'locked',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-012',
  'benefit-travel',
  'locked',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":false,"expected":365,"actual":128,"errorMessage":"Available after 12 months of employment."},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-012',
  'benefit-bonus-based-on-okr',
  'locked',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '70785bc4-d4ac-4685-a368-731d4d638392',
  'emp-demo-012',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"locked","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '86252c3b-8a82-4cd7-95c9-7126468ffcdf',
  'emp-demo-012',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"locked","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '63aa9e1f-68ee-45ec-b9e5-fbf44e13e752',
  'emp-demo-012',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'f0cf609b-37ab-4546-abd6-dd34d1ac7cd2',
  'emp-demo-012',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"locked","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":false,"expected":180,"actual":128,"errorMessage":"Available after 6 months of employment."},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '494658b3-6375-4dc2-9fe0-d4e2727189cd',
  'emp-demo-012',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '43e0943d-d795-4586-94ab-2d828a8acfbc',
  'emp-demo-012',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'bec28bc1-6c3f-4bad-af64-86e8c0cab4ca',
  'emp-demo-012',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":128,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'eb2256b8-999c-4f87-b013-f9616bcbf084',
  'emp-demo-012',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '6fc82b08-947d-41ff-aada-2c040cbdc6f1',
  'emp-demo-012',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"locked","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '390753a5-78e5-48e9-a3c7-aaf178ecc844',
  'emp-demo-012',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"travel","benefitName":"Travel","status":"locked","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":false,"expected":365,"actual":128,"errorMessage":"Available after 12 months of employment."},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'b5776fe5-a9d8-4645-88d8-5e7ca745ad8b',
  'emp-demo-012',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"locked","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-013',
  'EMP013',
  'employee.thirteen@pinequest.mn',
  'Tugsuu Namnan',
  'Tugsuu Namnan',
  'ux_engineer',
  'Design',
  2,
  'active',
  '2024-10-10T00:00:00.000Z',
  1,
  0
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-013',
  'benefit-gym-pinefit',
  'eligible',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-013',
  'benefit-private-insurance',
  'eligible',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-013',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-013',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":515,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-013',
  'benefit-extra-responsibility',
  'eligible',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-013',
  'benefit-ux-engineer-tools',
  'eligible',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":true,"expected":"ux_engineer","actual":"ux_engineer","errorMessage":null},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-013',
  'benefit-down-payment',
  'locked',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":515,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-013',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-013',
  'benefit-remote-work',
  'eligible',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-013',
  'benefit-travel',
  'eligible',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":515,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-013',
  'benefit-bonus-based-on-okr',
  'eligible',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '2decc092-6054-4217-a8d3-c6f36b355bc0',
  'emp-demo-013',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'a634ff2a-07c2-4e54-b0e4-09b2d7d6e1ab',
  'emp-demo-013',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '618cd096-6bcd-4a90-b4d9-bfbcdcab6c36',
  'emp-demo-013',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '2b978537-5778-4658-beee-e6ecab0d8c2a',
  'emp-demo-013',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":515,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '2897c5cf-c50a-484f-a82d-5cf670d93177',
  'emp-demo-013',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'b3091b72-5434-414a-85f6-28f10937013f',
  'emp-demo-013',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"eligible","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":true,"expected":"ux_engineer","actual":"ux_engineer","errorMessage":null},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'c21727fc-f294-4fae-b603-acb574c45e9e',
  'emp-demo-013',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":515,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'e19d3ca1-1650-4dbb-a84f-cdc70a262c55',
  'emp-demo-013',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'b7e26aa2-413f-44e6-bdaa-deec32f3830a',
  'emp-demo-013',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'a1fc6e70-006c-4b3a-9008-35626ff45a26',
  'emp-demo-013',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":515,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'bf6f6204-ce43-4aa9-88a0-f296540d79e5',
  'emp-demo-013',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-014',
  'EMP014',
  'employee.fourteen@pinequest.mn',
  'Maral Solongo',
  'Maral Solongo',
  'qa_engineer',
  'Engineering',
  1,
  'active',
  '2023-06-18T00:00:00.000Z',
  1,
  1
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-014',
  'benefit-gym-pinefit',
  'eligible',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-014',
  'benefit-private-insurance',
  'eligible',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-014',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-014',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":995,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-014',
  'benefit-extra-responsibility',
  'locked',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-014',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"qa_engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-014',
  'benefit-down-payment',
  'locked',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":995,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-014',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-014',
  'benefit-remote-work',
  'eligible',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-014',
  'benefit-travel',
  'eligible',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":995,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-014',
  'benefit-bonus-based-on-okr',
  'eligible',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '22e41eab-09e9-423b-8d86-ee75a35995d8',
  'emp-demo-014',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'c3d7df83-8b2e-450d-8972-02519b9ab2ca',
  'emp-demo-014',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '1cc3aed3-71d0-47b7-82b9-b0d7eab61ac4',
  'emp-demo-014',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '1b34f5a7-a862-462a-8bf2-1024f0d88542',
  'emp-demo-014',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":995,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '6ca94b65-7175-41d8-82e2-17cac27cc7fb',
  'emp-demo-014',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'ad2cd28d-e1b3-42fa-8cf7-df7775ec2350',
  'emp-demo-014',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"qa_engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '801603bc-e619-4564-a448-fe53e82cbd93',
  'emp-demo-014',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":995,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'a9592fd9-9bd1-47cf-a5f8-32ce69bf7fc5',
  'emp-demo-014',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '8c2b71ce-dba8-4fd4-8b4b-a5bf7d0ca1b3',
  'emp-demo-014',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '8569234b-b565-4df2-a37d-0ae7547df550',
  'emp-demo-014',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":995,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'e2267ac8-920b-4735-8026-2739114b0b1c',
  'emp-demo-014',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-015',
  'EMP015',
  'employee.fifteen@pinequest.mn',
  'Bilegt Khash',
  'Bilegt Khash',
  'engineer',
  'Engineering',
  2,
  'terminated',
  '2020-03-05T00:00:00.000Z',
  0,
  0
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-015',
  'benefit-gym-pinefit',
  'locked',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Not available during probation or leave."},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-015',
  'benefit-private-insurance',
  'locked',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Not available during probation or leave."},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-015',
  'benefit-digital-wellness',
  'locked',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":false,"expected":"terminated","actual":"terminated","errorMessage":"Not available after termination."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-015',
  'benefit-macbook',
  'locked',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":2195,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Not available during probation or leave."},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-015',
  'benefit-extra-responsibility',
  'locked',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Not available during probation."},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-015',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Active employment required."},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-015',
  'benefit-down-payment',
  'locked',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":2195,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Active employment required."},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-015',
  'benefit-shit-happened-days',
  'locked',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":false,"expected":["probation","active"],"actual":"terminated","errorMessage":"Probation allocation: 1 day maximum."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-015',
  'benefit-remote-work',
  'locked',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Not available during probation."},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-015',
  'benefit-travel',
  'locked',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":2195,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-015',
  'benefit-bonus-based-on-okr',
  'locked',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Active employment required."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '28d1497a-32f6-484b-9786-fab2db69c4cf',
  'emp-demo-015',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"locked","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Not available during probation or leave."},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '2332b2ba-f6f1-4d34-86d3-7a641824dd75',
  'emp-demo-015',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"locked","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Not available during probation or leave."},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '676a26a9-e94d-4d8e-b3fd-3a4078d9122f',
  'emp-demo-015',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"locked","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":false,"expected":"terminated","actual":"terminated","errorMessage":"Not available after termination."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '95ee9893-2043-43fa-87a7-6a81a11612ab',
  'emp-demo-015',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"locked","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":2195,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Not available during probation or leave."},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '5c979682-59d1-4e72-9ea4-1281f48b40ff',
  'emp-demo-015',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Not available during probation."},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '5e14e1e3-d82e-4f6c-b38b-2edebf45dee5',
  'emp-demo-015',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Active employment required."},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '4c5ea386-5158-4b12-bcf7-f3400442d404',
  'emp-demo-015',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":2195,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Active employment required."},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '8f0d38eb-03a5-4b0e-b6ba-b5535e6a0d5e',
  'emp-demo-015',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"locked","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":false,"expected":["probation","active"],"actual":"terminated","errorMessage":"Probation allocation: 1 day maximum."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'e30b0735-8752-49cb-a0b8-e4a4e297664f',
  'emp-demo-015',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"locked","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Not available during probation."},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '908432e3-60b0-49bb-83f0-9e048644a3c8',
  'emp-demo-015',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"travel","benefitName":"Travel","status":"locked","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":2195,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'ca03320f-60e4-4360-8ea8-0d0bfbaa5d5e',
  'emp-demo-015',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"locked","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Active employment required."}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-016',
  'EMP016',
  'employee.sixteen@pinequest.mn',
  'Tamir Sumiya',
  'Tamir Sumiya',
  'engineer',
  'Platform',
  4,
  'active',
  '2019-08-19T00:00:00.000Z',
  1,
  0
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-016',
  'benefit-gym-pinefit',
  'eligible',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-016',
  'benefit-private-insurance',
  'eligible',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-016',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-016',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":2394,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":4,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-016',
  'benefit-extra-responsibility',
  'eligible',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":4,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-016',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-016',
  'benefit-down-payment',
  'eligible',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":2394,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":4,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-016',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-016',
  'benefit-remote-work',
  'eligible',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-016',
  'benefit-travel',
  'eligible',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":2394,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":4,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-016',
  'benefit-bonus-based-on-okr',
  'eligible',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '81ec21aa-dd59-475b-8e89-4c9870a02ff2',
  'emp-demo-016',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '8f60a6a7-abd9-46d6-b9d0-d060ef67df5d',
  'emp-demo-016',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '56b4ea4b-f5c1-417f-ae06-8871f79ea078',
  'emp-demo-016',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '1463dcb6-3e28-406d-9ffb-a2c2984818f2',
  'emp-demo-016',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":2394,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":4,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'd30faf78-6bb9-4c9e-a0d5-85e94a964bb4',
  'emp-demo-016',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":4,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'bf73d5d3-daa2-4ffd-9099-d11c8dd58269',
  'emp-demo-016',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'e4750ad8-6d03-4f51-b2a5-d180c26fb3c5',
  'emp-demo-016',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":2394,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":4,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '606cb788-595d-4fc5-9593-786d422c1f3e',
  'emp-demo-016',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '3270885b-1bfa-4960-a9cd-5de9e90f3946',
  'emp-demo-016',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '3d3bab68-585b-4f7d-9dfa-72cd9f5a1dd8',
  'emp-demo-016',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":2394,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":4,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '46818b4b-16ee-4aee-ab10-bca04b954f85',
  'emp-demo-016',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-017',
  'EMP017',
  'employee.seventeen@pinequest.mn',
  'Ariuka Naraa',
  'Ariuka Naraa',
  'people_ops',
  'HR',
  2,
  'active',
  '2024-02-28T00:00:00.000Z',
  1,
  0
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-017',
  'benefit-gym-pinefit',
  'eligible',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-017',
  'benefit-private-insurance',
  'eligible',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-017',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-017',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":740,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-017',
  'benefit-extra-responsibility',
  'eligible',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-017',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"people_ops","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-017',
  'benefit-down-payment',
  'eligible',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":740,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-017',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-017',
  'benefit-remote-work',
  'eligible',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-017',
  'benefit-travel',
  'eligible',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":740,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-017',
  'benefit-bonus-based-on-okr',
  'eligible',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '994b314e-e819-4b57-acca-f92fb27e15f8',
  'emp-demo-017',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'dc0babb2-e469-4d70-bb12-e212ba904a5f',
  'emp-demo-017',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'ef3f5a17-0f57-46ac-bbc2-be077cf9e643',
  'emp-demo-017',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'b27805c1-2cf7-408d-b794-f114656e3160',
  'emp-demo-017',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":740,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'ed8a2fcb-1fd6-40e0-9d95-4ee9c63bc901',
  'emp-demo-017',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '0292da97-4189-4ed8-ba09-69c9f9d737a2',
  'emp-demo-017',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"people_ops","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '3bcbe88d-9a42-43fc-9e3b-8eaf53f355a6',
  'emp-demo-017',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":740,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '3a5abad1-5970-4dd9-b5fd-3e890e0bb848',
  'emp-demo-017',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '038f2dfc-f379-4567-9bad-94ab77f4a4c1',
  'emp-demo-017',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'aaa0bd1f-0332-4353-ae91-fd8d9f0209b3',
  'emp-demo-017',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":740,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'a8e0b2e4-ca65-4139-ace3-f3dd8c6b3583',
  'emp-demo-017',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-018',
  'EMP018',
  'employee.eighteen@pinequest.mn',
  'Chinguun Od',
  'Chinguun Od',
  'engineer',
  'Engineering',
  1,
  'active',
  '2024-09-09T00:00:00.000Z',
  1,
  2
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-018',
  'benefit-gym-pinefit',
  'eligible',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-018',
  'benefit-private-insurance',
  'eligible',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-018',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-018',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":546,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-018',
  'benefit-extra-responsibility',
  'locked',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-018',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-018',
  'benefit-down-payment',
  'locked',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":546,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-018',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-018',
  'benefit-remote-work',
  'eligible',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-018',
  'benefit-travel',
  'eligible',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":546,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-018',
  'benefit-bonus-based-on-okr',
  'eligible',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.034Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'ade81988-4231-4da9-beaf-cef462889098',
  'emp-demo-018',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '1d36f93d-0b42-47ff-b029-33920f464314',
  'emp-demo-018',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '8342ea7c-7105-4fce-97cf-5f66f4fe63da',
  'emp-demo-018',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '3e3b19e3-b78e-46c7-9be9-2f528aa339ad',
  'emp-demo-018',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":546,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '47efba54-8a21-4fab-b0ea-0206421f7609',
  'emp-demo-018',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'd17dcf87-67c9-4f6e-a7e0-9887ec7a5d6f',
  'emp-demo-018',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '421692e9-d895-4273-a886-bb9a423c50e2',
  'emp-demo-018',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":546,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '62a21fb5-c32f-400c-b954-848e8d8e5278',
  'emp-demo-018',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '88eb3b2d-f02c-4741-aec0-f46de658385d',
  'emp-demo-018',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'bab82c3f-bf1b-4a3d-801e-557cdd418ba5',
  'emp-demo-018',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":546,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '4190e1e9-9501-4754-9ba8-91a73ce6cf7c',
  'emp-demo-018',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.034Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-019',
  'EMP019',
  'employee.nineteen@pinequest.mn',
  'Nomunzul Khangai',
  'Nomunzul Khangai',
  'analyst',
  'Finance',
  1,
  'active',
  '2025-03-17T00:00:00.000Z',
  1,
  0
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-019',
  'benefit-gym-pinefit',
  'eligible',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-019',
  'benefit-private-insurance',
  'eligible',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-019',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-019',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":357,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-019',
  'benefit-extra-responsibility',
  'locked',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-019',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"analyst","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-019',
  'benefit-down-payment',
  'locked',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":357,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-019',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-019',
  'benefit-remote-work',
  'eligible',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-019',
  'benefit-travel',
  'locked',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":false,"expected":365,"actual":357,"errorMessage":"Available after 12 months of employment."},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-019',
  'benefit-bonus-based-on-okr',
  'eligible',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'c64a8558-6574-4dc3-a893-ae93e03e47d7',
  'emp-demo-019',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'bcebc5d0-b9fd-43cd-939f-fc27df9efb8b',
  'emp-demo-019',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '0ad3fe9b-fe2c-4876-8b87-88225fe73e87',
  'emp-demo-019',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'aea0988f-5ef0-4aea-b2c4-ee23c93bc9d7',
  'emp-demo-019',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":357,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'f04a5c53-0344-432a-9e49-4612e464a689',
  'emp-demo-019',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '99f11a3a-fcbe-4e98-b502-3ce0feef2407',
  'emp-demo-019',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"analyst","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '0a10d0b8-567f-433c-9861-b9a356b7870f',
  'emp-demo-019',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":357,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'af8b6851-c913-4f69-bdae-b5ecaaea84ad',
  'emp-demo-019',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '36fe2f29-07cd-43ed-bb57-71fb320e4e2e',
  'emp-demo-019',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'eb27b1e3-fb18-46bb-b63d-96d28ee3d4d5',
  'emp-demo-019',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"travel","benefitName":"Travel","status":"locked","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":false,"expected":365,"actual":357,"errorMessage":"Available after 12 months of employment."},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '5e63197e-a36b-4f3b-b33e-e0189d7a9094',
  'emp-demo-019',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-020',
  'EMP020',
  'employee.twenty@pinequest.mn',
  'Tselmeg Mergen',
  'Tselmeg Mergen',
  'engineer',
  'Data',
  2,
  'active',
  '2023-01-09T00:00:00.000Z',
  1,
  1
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-020',
  'benefit-gym-pinefit',
  'eligible',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-020',
  'benefit-private-insurance',
  'eligible',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-020',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-020',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1155,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-020',
  'benefit-extra-responsibility',
  'eligible',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-020',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-020',
  'benefit-down-payment',
  'eligible',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1155,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-020',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-020',
  'benefit-remote-work',
  'eligible',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-020',
  'benefit-travel',
  'eligible',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1155,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-020',
  'benefit-bonus-based-on-okr',
  'eligible',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '4a2757b0-bea1-4882-a025-d532ed833290',
  'emp-demo-020',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '47064a32-373b-4f94-80b6-e883f08308f5',
  'emp-demo-020',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '3763e8b3-bf46-41cd-9bee-ab2cc5d5b855',
  'emp-demo-020',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '5ea0c582-81bf-4ddf-9555-71da0eb2e684',
  'emp-demo-020',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1155,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '0ebf2ed1-ce58-4cb0-8bbc-a1eb51ad8fd5',
  'emp-demo-020',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '2f815d69-9221-4814-b53c-ded2b913d26d',
  'emp-demo-020',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'c68e835b-0c36-4e88-877d-544422a06fa4',
  'emp-demo-020',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1155,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '0bae7eb7-50af-419b-a378-4303d3d398e1',
  'emp-demo-020',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '743a8c8c-6e8b-4def-816a-769fdaa322d3',
  'emp-demo-020',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '45bde593-5d4d-4248-9130-34b1e379fec4',
  'emp-demo-020',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1155,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '2e62c89d-12e9-4fd2-bab5-d26324b63f10',
  'emp-demo-020',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-021',
  'EMP021',
  'employee.twentyone@pinequest.mn',
  'Selenge Ujin',
  'Selenge Ujin',
  'ux_engineer',
  'Design',
  3,
  'active',
  '2021-05-23T00:00:00.000Z',
  1,
  0
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-021',
  'benefit-gym-pinefit',
  'eligible',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-021',
  'benefit-private-insurance',
  'eligible',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-021',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-021',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1751,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-021',
  'benefit-extra-responsibility',
  'eligible',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-021',
  'benefit-ux-engineer-tools',
  'eligible',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":true,"expected":"ux_engineer","actual":"ux_engineer","errorMessage":null},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-021',
  'benefit-down-payment',
  'eligible',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1751,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-021',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-021',
  'benefit-remote-work',
  'eligible',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-021',
  'benefit-travel',
  'eligible',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1751,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-021',
  'benefit-bonus-based-on-okr',
  'eligible',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '4d0b0dc0-3865-4627-971f-a4fadc403ff9',
  'emp-demo-021',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'ff87d7ae-08a7-4f9c-8ff2-0262fe6943b3',
  'emp-demo-021',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '6a937476-1555-4418-9c9e-f40bf3b89781',
  'emp-demo-021',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '5e858119-5437-40a8-b403-7e8f6208f110',
  'emp-demo-021',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1751,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '2bd1b32c-6272-4829-b813-c126a21b6318',
  'emp-demo-021',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '973dba5b-6754-476e-8970-7837bb29c1ce',
  'emp-demo-021',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"eligible","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":true,"expected":"ux_engineer","actual":"ux_engineer","errorMessage":null},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '76592836-c89f-4bac-a70f-e920fa2a72a5',
  'emp-demo-021',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1751,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'f807f462-00c6-4577-8b39-0f6d36007e3c',
  'emp-demo-021',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'c014fb00-b68d-40af-9217-867d3ab942f0',
  'emp-demo-021',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '664f5557-0db5-4c12-8fa1-0a9112f62dde',
  'emp-demo-021',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1751,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'f314dbc7-8883-482e-97a6-b7e30930f231',
  'emp-demo-021',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-022',
  'EMP022',
  'employee.twentytwo@pinequest.mn',
  'Erkhes Khishig',
  'Erkhes Khishig',
  'engineer',
  'Engineering',
  1,
  'probation',
  '2026-02-01T00:00:00.000Z',
  0,
  0
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-022',
  'benefit-gym-pinefit',
  'locked',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-022',
  'benefit-private-insurance',
  'locked',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-022',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"probation","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-022',
  'benefit-macbook',
  'locked',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":false,"expected":180,"actual":36,"errorMessage":"Available after 6 months of employment."},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-022',
  'benefit-extra-responsibility',
  'locked',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation."},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-022',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-022',
  'benefit-down-payment',
  'locked',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":36,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-022',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"probation","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-022',
  'benefit-remote-work',
  'locked',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation."},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-022',
  'benefit-travel',
  'locked',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":false,"expected":365,"actual":36,"errorMessage":"Available after 12 months of employment."},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-022',
  'benefit-bonus-based-on-okr',
  'locked',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '3659c479-9085-4590-bc06-73d4f63252cb',
  'emp-demo-022',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"locked","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '7eae7860-8ac0-4011-983a-6945c19390aa',
  'emp-demo-022',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"locked","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '50ab3815-98f4-4739-96b5-3cf371566d08',
  'emp-demo-022',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"probation","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '2ab1cdd9-67b1-4cef-87cd-df6ef226e2b0',
  'emp-demo-022',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"locked","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":false,"expected":180,"actual":36,"errorMessage":"Available after 6 months of employment."},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '11bb625d-a594-4749-9096-d91eb9facc55',
  'emp-demo-022',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation."},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '4302e38e-8991-46f2-a9e8-5c40f68a8350',
  'emp-demo-022',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '5139dabd-87c9-4b2c-a4b6-8e91a47f31a6',
  'emp-demo-022',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":36,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '8bc3d478-e993-473d-a4df-8a7f602dc50a',
  'emp-demo-022',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"probation","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '767ba4d5-94b8-45f6-8d76-f8ae0e5d03a7',
  'emp-demo-022',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"locked","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation."},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'b6578633-0ae4-4b3e-af5c-1d69af7e38f0',
  'emp-demo-022',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"travel","benefitName":"Travel","status":"locked","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":false,"expected":365,"actual":36,"errorMessage":"Available after 12 months of employment."},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'a12e0dc6-c095-4a83-94fc-3d8b0d76e6a6',
  'emp-demo-022',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"locked","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-023',
  'EMP023',
  'employee.twentythree@pinequest.mn',
  'Batgerel Namuun',
  'Batgerel Namuun',
  'manager',
  'Operations',
  2,
  'active',
  '2022-12-12T00:00:00.000Z',
  1,
  1
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-023',
  'benefit-gym-pinefit',
  'eligible',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-023',
  'benefit-private-insurance',
  'eligible',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-023',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-023',
  'benefit-macbook',
  'eligible',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1183,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-023',
  'benefit-extra-responsibility',
  'eligible',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-023',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"manager","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-023',
  'benefit-down-payment',
  'eligible',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1183,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-023',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-023',
  'benefit-remote-work',
  'eligible',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-023',
  'benefit-travel',
  'eligible',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1183,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-023',
  'benefit-bonus-based-on-okr',
  'eligible',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '525efc4b-6799-49ec-a1a3-03f19784ca5d',
  'emp-demo-023',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '94e0737d-5dda-4a96-a178-38868b17dada',
  'emp-demo-023',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '892f07eb-7614-4a46-a2d1-86fc18ad3fc1',
  'emp-demo-023',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '39c659c5-90e6-49fe-8955-caf8771831af',
  'emp-demo-023',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1183,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'c98ac69a-d2e1-4ee2-a37a-01ef60c111c6',
  'emp-demo-023',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '53f0ae5c-c270-47b1-986d-15cc5f1198f5',
  'emp-demo-023',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"manager","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '0a64244a-2f01-45c5-966b-eb2ad77b1e67',
  'emp-demo-023',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1183,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '1e164857-c183-452f-8659-052899f9c505',
  'emp-demo-023',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '30cadb69-4742-4fdd-aa1e-e9a0894e6abf',
  'emp-demo-023',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '7eafebc0-672e-4144-845c-4986c8f6663d',
  'emp-demo-023',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1183,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '0133b121-c985-4c19-82bc-50a4a9391bbc',
  'emp-demo-023',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

INSERT INTO employees (
  id,
  employee_code,
  email,
  name,
  name_eng,
  role,
  department,
  responsibility_level,
  employment_status,
  hire_date,
  okr_submitted,
  late_arrival_count
) VALUES (
  'emp-demo-024',
  'EMP024',
  'employee.twentyfour@pinequest.mn',
  'Yesui Oyun',
  'Yesui Oyun',
  'engineer',
  'Engineering',
  2,
  'active',
  '2024-04-30T00:00:00.000Z',
  0,
  2
)
ON CONFLICT(id) DO UPDATE SET
  employee_code = excluded.employee_code,
  email = excluded.email,
  name = excluded.name,
  name_eng = excluded.name_eng,
  role = excluded.role,
  department = excluded.department,
  responsibility_level = excluded.responsibility_level,
  employment_status = excluded.employment_status,
  hire_date = excluded.hire_date,
  okr_submitted = excluded.okr_submitted,
  late_arrival_count = excluded.late_arrival_count,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-024',
  'benefit-gym-pinefit',
  'locked',
  '[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-024',
  'benefit-private-insurance',
  'locked',
  '[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-024',
  'benefit-digital-wellness',
  'eligible',
  '[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-024',
  'benefit-macbook',
  'locked',
  '[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":678,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-024',
  'benefit-extra-responsibility',
  'locked',
  '[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-024',
  'benefit-ux-engineer-tools',
  'locked',
  '[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-024',
  'benefit-down-payment',
  'locked',
  '[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":678,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-024',
  'benefit-shit-happened-days',
  'eligible',
  '[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-024',
  'benefit-remote-work',
  'locked',
  '[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-024',
  'benefit-travel',
  'locked',
  '[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":678,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO benefit_eligibility (
  employee_id,
  benefit_id,
  status,
  rule_evaluation_json,
  computed_at,
  override_by,
  override_reason,
  override_expires_at
) VALUES (
  'emp-demo-024',
  'benefit-bonus-based-on-okr',
  'locked',
  '[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]',
  '2026-03-09T15:39:24.035Z',
  NULL,
  NULL,
  NULL
)
ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
  status = excluded.status,
  rule_evaluation_json = excluded.rule_evaluation_json,
  computed_at = excluded.computed_at,
  override_by = excluded.override_by,
  override_reason = excluded.override_reason,
  override_expires_at = excluded.override_expires_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '3ee367e2-74c6-413e-8037-ec6872f84731',
  'emp-demo-024',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"locked","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'b1d0756e-2358-45e7-8f33-18adaada5105',
  'emp-demo-024',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"locked","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'bc5a32ad-a447-4616-99d9-b8e0a9451e6d',
  'emp-demo-024',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '052deaa0-b2fa-45af-a279-e857f2984cd6',
  'emp-demo-024',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"locked","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":678,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'a399b301-927a-4f23-9534-e1dd6c6c6439',
  'emp-demo-024',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '18ab11af-1e5b-4048-a840-9bd5f62a91db',
  'emp-demo-024',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '2a934c6d-f6bf-4e5a-825c-74290f4f7a0c',
  'emp-demo-024',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":678,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '900798f4-266e-4a16-b71b-2718b8f9fa2e',
  'emp-demo-024',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'afc6fb50-c136-4d48-83eb-83d2d07e71de',
  'emp-demo-024',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"locked","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '451d03da-8427-4eaa-8f56-267787d19c3d',
  'emp-demo-024',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"travel","benefitName":"Travel","status":"locked","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":678,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
);

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '92c3fbdd-64c1-43ed-ab5e-2526a36b6fca',
  'emp-demo-024',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T15:39:24.035Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"locked","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);

COMMIT;
