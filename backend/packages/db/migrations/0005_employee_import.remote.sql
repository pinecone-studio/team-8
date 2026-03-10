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
  '2026-03-09T13:19:07.515Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.515Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.515Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.515Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.515Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.515Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.515Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.515Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.515Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.515Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.515Z',
  NULL,
  NULL,
  NULL
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
  '3ee91865-38f6-4d6d-8899-fc8122230982',
  'emp-demo-001',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.515Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  '66cca99e-2646-4925-a3b9-734b505ce886',
  'emp-demo-001',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.515Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  'd8763775-d0ad-475a-85c2-7b7a5292f678',
  'emp-demo-001',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.515Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  'cc6b9bba-c9e8-468a-abf9-25d113037ebc',
  'emp-demo-001',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.515Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":784,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
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
  'f924946b-160d-4734-8a8d-d54c53a71425',
  'emp-demo-001',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.515Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  '39bcd19f-a42d-4b70-9626-ee0fba7d2966',
  'emp-demo-001',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.515Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'e699d099-d55f-4b98-b8fa-334b4d1005df',
  'emp-demo-001',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.515Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":784,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'e55cbdc9-5e77-43ec-97f3-ea04a8ccc9ad',
  'emp-demo-001',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.515Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  '51cca67e-a60b-4dad-81e7-f3ba4d6e5cf6',
  'emp-demo-001',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.515Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  'a9a051f1-bac8-404b-97cc-b0c679853cbf',
  'emp-demo-001',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.515Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":784,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '96ece329-8669-40e0-8b03-01e4b138e2e0',
  'emp-demo-001',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-001:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.515Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '8564eb3b-985e-4301-9d15-ab66c495b5fe',
  'emp-demo-002',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  'fefa30bd-8e33-41a8-ae6e-91dd318feffa',
  'emp-demo-002',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '7a8e9323-8d40-458a-9fa5-efbcd227612d',
  'emp-demo-002',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  '05e70e81-928d-40fd-bc49-25193a56b99c',
  'emp-demo-002',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":413,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]}'
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
  'b59b8531-f5f1-419b-8ba1-207b7325d14a',
  'emp-demo-002',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]}'
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
  '3caefe3d-b99b-45b1-af06-f505817abbcc',
  'emp-demo-002',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '8d182ce7-e41c-4e74-933e-d8b6e65d2a67',
  'emp-demo-002',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":413,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'bfff74fa-96d9-43b2-9afb-b937ef998235',
  'emp-demo-002',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  'ba883ea6-3952-4086-a3cc-b200296c7748',
  'emp-demo-002',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  'bdeeb0e4-4578-492c-9a6a-3bf3cf7ce5be',
  'emp-demo-002',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":413,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'fa730200-12e0-42cb-b2ff-672d12e34f76',
  'emp-demo-002',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-002:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  'c07bb829-bcb8-41e1-b603-7de08c8456aa',
  'emp-demo-003',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"locked","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '78e03154-4fa1-43ca-82de-96db450b7f77',
  'emp-demo-003',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"locked","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  'e0292daa-9ceb-4718-aa77-8f32fed61217',
  'emp-demo-003',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"probation","errorMessage":null}]}'
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
  '15329421-373a-4232-a14e-3648abd4d60b',
  'emp-demo-003',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"locked","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":false,"expected":180,"actual":58,"errorMessage":"Available after 6 months of employment."},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":false,"expected":1,"actual":0,"errorMessage":"Requires level 1 or above."}]}'
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
  '8c9f0f24-9176-4bf2-a394-c95595582991',
  'emp-demo-003',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation."},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":0,"errorMessage":"Requires Senior level (Level 2+)."}]}'
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
  '1354fdfd-f3ad-4674-97a5-d0a47ee4cdb0',
  'emp-demo-003',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  'faf083c2-e1f3-4a5d-9e53-c7345eeabca4',
  'emp-demo-003',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":58,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":0,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  '1d9249f6-77a9-4f0a-bd32-1cde51fe853b',
  'emp-demo-003',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"probation","errorMessage":null}]}'
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
  '5f64205b-c212-4965-8aeb-44f3247f228b',
  'emp-demo-003',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"locked","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation."},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '9e35b53d-833f-4f9a-8ee8-617db584d08d',
  'emp-demo-003',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"travel","benefitName":"Travel","status":"locked","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":false,"expected":365,"actual":58,"errorMessage":"Available after 12 months of employment."},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":false,"expected":1,"actual":0,"errorMessage":"Requires level 1 or above."},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  '4fd3cc70-b4e6-4a87-958c-44be0fc115b0',
  'emp-demo-003',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-003:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"locked","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."}]}'
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  'dd1ebfaa-b87f-41a0-b409-a8b87891ab1a',
  'emp-demo-004',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  '910876cf-599f-43a8-80e6-cd417b734c54',
  'emp-demo-004',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  '1fb702e5-e1e9-4bc2-b46a-6ce6eeb62d84',
  'emp-demo-004',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  'af8f2626-d890-4291-a521-5eff90ccc2d5',
  'emp-demo-004',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":982,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
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
  '52f50edf-5d22-484b-a92a-304dd3251729',
  'emp-demo-004',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  '31270cae-7d25-43bc-8485-6bc7dc5043a9',
  'emp-demo-004',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"eligible","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":true,"expected":"ux_engineer","actual":"ux_engineer","errorMessage":null},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'ed278001-38d8-4ec7-8c66-f9f8b1fc0b18',
  'emp-demo-004',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":982,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'd2782f93-61fa-40a9-b675-39224807376d',
  'emp-demo-004',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  '13e27867-3977-493a-81ee-8d0ff0580eae',
  'emp-demo-004',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  'bf76fc74-8e06-4e7a-b3f0-bdd250b84620',
  'emp-demo-004',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":982,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '5432712f-47b7-4b8d-bd6c-16e27ff052cb',
  'emp-demo-004',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-004:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '6fe84cb6-473a-4cbd-b3a2-f2c20ee16ef3',
  'emp-demo-005',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  '5f8a2877-0033-4d85-a929-11113a29ce83',
  'emp-demo-005',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  '8b979b90-491c-464a-9ba8-889a6881bf11',
  'emp-demo-005',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  '85048301-020e-44fa-aa33-22c5f2a5177d',
  'emp-demo-005',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":270,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]}'
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
  'cd7808f9-50be-41af-8f41-df1860fccde4',
  'emp-demo-005',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]}'
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
  '717b3724-1c36-4a42-bb48-f0659179938a',
  'emp-demo-005',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"eligible","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":true,"expected":"ux_engineer","actual":"ux_engineer","errorMessage":null},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'a6ba1756-6fa4-4a9f-af05-4c91adbf8b9e',
  'emp-demo-005',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":270,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '59ab719c-4a53-4201-8fde-b9bc4b46ed19',
  'emp-demo-005',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  'db350abd-9587-445f-a563-bb8e3bf67aad',
  'emp-demo-005',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  '9de69349-505a-4e4a-94fe-c5c75fb97850',
  'emp-demo-005',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"travel","benefitName":"Travel","status":"locked","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":false,"expected":365,"actual":270,"errorMessage":"Available after 12 months of employment."},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '4abf2d5c-029d-4b93-83dd-bb62b1ebc3a8',
  'emp-demo-005',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-005:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  'b5501603-476c-4ea0-96b5-60583b53b492',
  'emp-demo-006',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"locked","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  'b96dfbd8-4292-4e23-a8d9-47fd32c7b010',
  'emp-demo-006',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"locked","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  'd1d18de1-c9d4-4ee3-bd28-f7e35fbb41cd',
  'emp-demo-006',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  'f532b0f0-9255-4566-b222-3026dace04e2',
  'emp-demo-006',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"locked","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":675,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]}'
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
  '3e3a2521-4f73-40d0-8a6d-54fe401b5e34',
  'emp-demo-006',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]}'
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
  '99918a3f-b41c-4d34-88c0-0a5850d81ed7',
  'emp-demo-006',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"designer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  'd3c5d393-8726-4902-9cca-00fe61bc0200',
  'emp-demo-006',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":675,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  '6f22a282-ff14-4f80-8f90-f58626d91cc3',
  'emp-demo-006',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  'c2bf14f9-50b5-4e09-acc5-3246e31beb16',
  'emp-demo-006',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"locked","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  'd4937a24-ed2c-49a8-8db8-2f8c59e8322e',
  'emp-demo-006',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"travel","benefitName":"Travel","status":"locked","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":675,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  'c5fe5474-4209-47f0-9d84-a4a65810b093',
  'emp-demo-006',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-006:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"locked","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  'd06b1878-2091-469e-8ce4-b36f8515c2a0',
  'emp-demo-007',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '34827f07-8165-4d13-affe-0b9cf6ec8cbe',
  'emp-demo-007',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  'fe338052-0d6c-4327-a3c5-deb9933272ac',
  'emp-demo-007',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  '00c7583c-5510-4ccf-8593-edf5257e4578',
  'emp-demo-007',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1281,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null}]}'
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
  'abde9363-5808-4dbf-916f-70d064900e6a',
  'emp-demo-007',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null}]}'
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
  'f0dee740-edb6-4cc2-9fd4-7f5bbab825ba',
  'emp-demo-007',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"manager","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'd30bfb8f-c79b-4e08-959c-ca1289bfb059',
  'emp-demo-007',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1281,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '88ff2668-3f2b-4852-b53a-d7c0f62ec572',
  'emp-demo-007',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  '3673ba41-42eb-4c48-8f39-f87786b2dbfb',
  'emp-demo-007',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  'cb4b3b9a-f1a2-4d18-8238-e1d26bcec9e6',
  'emp-demo-007',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1281,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'fdcddd49-ac03-4a3f-aa45-0269c5744ad1',
  'emp-demo-007',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-007:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  'e8c87836-cabc-4722-956b-4f8f48d0f864',
  'emp-demo-008',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '9a4ba76f-00ad-43d2-9263-bd14fdb773b7',
  'emp-demo-008',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '03bf5851-e1f1-411a-96c5-cec7ad3a2ce3',
  'emp-demo-008',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  '41195d65-0929-41b5-a771-c3df4c1a4f90',
  'emp-demo-008',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1428,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null}]}'
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
  '338c6fe4-5bc8-4ef1-97bc-d40c290aee5f',
  'emp-demo-008',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null}]}'
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
  '3a138672-a5e5-439e-a851-5ebd3ad0cb52',
  'emp-demo-008',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"manager","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'cbaf64f4-ced2-410d-bc0d-14b26c0e737f',
  'emp-demo-008',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1428,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '5eab423b-c486-4bf1-ab85-d90f5aec9996',
  'emp-demo-008',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  'd3241c07-c986-422d-b44e-13d685a7a6f9',
  'emp-demo-008',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '9be227b4-6b18-4f52-b978-24036310b44a',
  'emp-demo-008',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1428,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '4529fe72-8ac6-49f2-8ecf-ccfc98c7f0ad',
  'emp-demo-008',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-008:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '1d5e89a9-fd5a-4735-986c-f83033f2e761',
  'emp-demo-009',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '7684f035-cfef-4768-81c3-0d75d3b9f294',
  'emp-demo-009',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  'ba59ce4d-9367-47f3-a146-2720c7d14a8a',
  'emp-demo-009',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  '72c02c05-dc08-4afa-ba18-18b2c0eec090',
  'emp-demo-009',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1588,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null}]}'
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
  '9f279ab9-2960-4595-88be-e75ea44544a4',
  'emp-demo-009',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null}]}'
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
  '21f90f3d-6ac2-4621-89b3-a1c4493d1f95',
  'emp-demo-009',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"finance_manager","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '2657e386-43ac-4536-8edc-c33ecf9d7801',
  'emp-demo-009',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1588,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '99830124-646a-46e5-a36e-e213ef3774c2',
  'emp-demo-009',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  '70f73bd2-b966-4059-b328-81fbb0444be6',
  'emp-demo-009',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '44637ec1-cb82-487a-bf8b-dd2fec3711e8',
  'emp-demo-009',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1588,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '40799bdf-2550-4893-a8f5-ebfcbd05c9b4',
  'emp-demo-009',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-009:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '5e3960b8-ed71-4991-b0de-0a6c3d4e51ea',
  'emp-demo-010',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"locked","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Not available during probation or leave."},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '63172b90-5e66-4a86-9f65-69f0aaba16bc',
  'emp-demo-010',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"locked","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Not available during probation or leave."},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '237a687e-3caf-4d2a-847b-5c48eec2a36a',
  'emp-demo-010',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"leave","errorMessage":null}]}'
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
  'fd773975-8c89-42c0-9c6f-c8a4e82f057e',
  'emp-demo-010',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"locked","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1091,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Not available during probation or leave."},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
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
  'aa33f86a-f155-4c6a-9688-8b27136c47ef',
  'emp-demo-010',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Not available during probation."},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  'dc76ee5d-eb1b-482e-a035-de35432e2b47',
  'emp-demo-010',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Active employment required."},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'e6879c71-49ec-4434-b3db-0d352a8f805e',
  'emp-demo-010',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1091,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Active employment required."},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'e2c3c546-f9a0-43c7-a14e-68f455d64eb4',
  'emp-demo-010',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"locked","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":false,"expected":["probation","active"],"actual":"leave","errorMessage":"Probation allocation: 1 day maximum."}]}'
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
  'f05e2c9a-ce98-48fa-a361-28a59956f462',
  'emp-demo-010',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"locked","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Not available during probation."},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  'd8538e5d-e35f-4f01-94b8-94f95e9e204f',
  'emp-demo-010',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1091,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'cd52efcf-5434-4811-88a6-46b35568d906',
  'emp-demo-010',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-010:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"locked","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"leave","errorMessage":"Active employment required."}]}'
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '10180295-3971-49dd-8e19-6593f4b98759',
  'emp-demo-011',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"locked","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":false,"expected":2,"actual":3,"errorMessage":"Attendance threshold exceeded this month."}]}'
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
  'feb5e021-1791-405d-89e9-0e62f2a85108',
  'emp-demo-011',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"locked","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":false,"expected":2,"actual":3,"errorMessage":"Attendance threshold exceeded this month."}]}'
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
  '7958cb50-cffa-4910-a2e4-4e3a26a2aad7',
  'emp-demo-011',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  '2a76e2a9-1012-4425-8f68-aa89116b0be6',
  'emp-demo-011',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1559,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
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
  'd8751c55-f118-4557-aad4-cbc436f39f1a',
  'emp-demo-011',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":false,"expected":2,"actual":3,"errorMessage":"Attendance threshold exceeded."},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  '3bbd626a-d865-4263-a849-d79822035a3c',
  'emp-demo-011',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '7c0442ec-1525-4ebb-9168-d6e840df43bf',
  'emp-demo-011',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1559,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'c0fb8542-6f48-4e8f-8661-bc76d758e937',
  'emp-demo-011',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  '937e1873-f0bf-4450-8e46-d40bdd781ca9',
  'emp-demo-011',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"locked","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":false,"expected":2,"actual":3,"errorMessage":"Attendance threshold exceeded."}]}'
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
  'a546a959-a6ba-437c-92b7-ce5500d40063',
  'emp-demo-011',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1559,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '72648a05-3d23-497a-b8bc-775af4af934e',
  'emp-demo-011',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-011:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"locked","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":false,"expected":2,"actual":3,"errorMessage":"Attendance threshold exceeded."},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '63c222bc-26b8-4094-af16-40b7ca853ca6',
  'emp-demo-012',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"locked","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  'd31358ee-d600-4931-a481-96c50e2cb92d',
  'emp-demo-012',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"locked","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  'c29dd49f-7c4a-46bd-b80f-5c432977c105',
  'emp-demo-012',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  'e3e6f53e-a0cb-4578-92b6-ecbd7ec90a59',
  'emp-demo-012',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"locked","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":false,"expected":180,"actual":128,"errorMessage":"Available after 6 months of employment."},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]}'
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
  '9a393085-5c90-4c3e-952a-e0577d22ac79',
  'emp-demo-012',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]}'
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
  '638217cf-3b71-4ff1-9a73-b2a2c97e7b2d',
  'emp-demo-012',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  'e6cbe73d-3a54-43a5-a0ae-9abc2377edd2',
  'emp-demo-012',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":128,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  '625a48a4-7ea6-4965-bfe4-bc497a1345df',
  'emp-demo-012',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  '6465cf00-8063-4d45-ae71-b77c30930748',
  'emp-demo-012',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"locked","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  '43950174-7d38-4940-9f01-ba7a744a2331',
  'emp-demo-012',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"travel","benefitName":"Travel","status":"locked","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":false,"expected":365,"actual":128,"errorMessage":"Available after 12 months of employment."},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  'bac54214-44ea-4607-8833-db3faea242b6',
  'emp-demo-012',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-012:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"locked","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '0de9779a-1667-4c5f-bcbe-f9ba3082c02e',
  'emp-demo-013',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '7e241e6a-98c3-4c61-82a1-100996055b1d',
  'emp-demo-013',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '8243d55d-a4d8-4bd0-b870-49eb18f8ff57',
  'emp-demo-013',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  '35d0d24a-830b-48a6-b66f-b010449548c6',
  'emp-demo-013',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":515,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
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
  '18a5b967-54ad-4369-aeb7-6946caa67b4f',
  'emp-demo-013',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  '2312da72-ae63-45c9-8a78-613585cae8db',
  'emp-demo-013',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"eligible","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":true,"expected":"ux_engineer","actual":"ux_engineer","errorMessage":null},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'c9c3268a-9fe2-466e-848f-d32db5ebb399',
  'emp-demo-013',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":515,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '3af9ec99-efc4-4e59-be8b-224ef53b2eee',
  'emp-demo-013',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  '9a4f08cf-182e-41ad-9c34-82ddfa931f78',
  'emp-demo-013',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  'e4035c4c-ee67-4ccc-af29-9b7253b2fd1f',
  'emp-demo-013',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":515,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'cb4f7b53-20f5-41e3-9759-b9e1afb3ed33',
  'emp-demo-013',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-013:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  'cd06b338-1235-4521-be4e-6c4fbe62913b',
  'emp-demo-014',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  '12b56eb9-e2ee-47e6-83c1-0685d556a17a',
  'emp-demo-014',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  '91be37c5-e28e-4b91-ae2e-9457e98d8470',
  'emp-demo-014',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  '142e4e04-ec91-4a42-945e-53676d01fd21',
  'emp-demo-014',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":995,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]}'
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
  '3508003f-518e-4d08-80b7-c4ab048a701f',
  'emp-demo-014',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]}'
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
  'a77e31f8-1f10-4310-8bb6-7e49d0b28005',
  'emp-demo-014',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"qa_engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '495923b8-96c9-4ef4-b232-2440209f0ef6',
  'emp-demo-014',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":995,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '93720d95-d2da-4f46-9eb4-62e22f593e5c',
  'emp-demo-014',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  'f2a7316b-7ddd-4a42-9470-cfce2a8d69b4',
  'emp-demo-014',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  'e1cf5d72-cf00-47e4-bf0f-a412da7bfded',
  'emp-demo-014',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":995,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '15019298-fdd2-4109-b72e-7d56a58cadd0',
  'emp-demo-014',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-014:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '36797652-9272-4163-a3b7-266360200767',
  'emp-demo-015',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"locked","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Not available during probation or leave."},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '4cc8dbf3-3912-4a7a-8a35-61ffaa3ba95b',
  'emp-demo-015',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"locked","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Not available during probation or leave."},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '630f54de-061f-4a04-baf9-3cb2f2208c35',
  'emp-demo-015',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"locked","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":false,"expected":"terminated","actual":"terminated","errorMessage":"Not available after termination."}]}'
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
  '77f0a176-5a1c-4eb6-af54-18cba17a7ede',
  'emp-demo-015',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"locked","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":2195,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Not available during probation or leave."},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
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
  '5da4d5b9-7954-4be3-a858-062bd2f734f5',
  'emp-demo-015',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Not available during probation."},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  'e5a4791d-e2a8-4a10-8002-6e54a642ac1b',
  'emp-demo-015',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Active employment required."},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  '461c3942-96e3-4d72-9315-580338644556',
  'emp-demo-015',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":2195,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Active employment required."},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  '69e812f9-1d7c-41d5-b634-4d0736f6c4a0',
  'emp-demo-015',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"locked","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":false,"expected":["probation","active"],"actual":"terminated","errorMessage":"Probation allocation: 1 day maximum."}]}'
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
  '1dbe18f1-812c-4326-9087-a4728a46615c',
  'emp-demo-015',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"locked","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Not available during probation."},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '1216ee42-c101-4513-88e6-6773f1b4c9ad',
  'emp-demo-015',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"travel","benefitName":"Travel","status":"locked","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":2195,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  '061f9ee1-86db-4641-9512-f6207cf76fb3',
  'emp-demo-015',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-015:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"locked","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"terminated","errorMessage":"Active employment required."}]}'
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.517Z',
  NULL,
  NULL,
  NULL
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
  '2fd3cc2d-1da3-4e8a-a377-149b1b2f01fa',
  'emp-demo-016',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '836a4c42-fb78-4697-a583-13f783dca033',
  'emp-demo-016',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '9c7f3719-11b1-477f-b2bf-3caab2f4a0b6',
  'emp-demo-016',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  '56266f79-e82e-43b0-99f5-d18c0e88ab4e',
  'emp-demo-016',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":2394,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":4,"errorMessage":null}]}'
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
  '7c740436-2b1a-4e0c-8ac6-ab308d97c4e9',
  'emp-demo-016',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":4,"errorMessage":null}]}'
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
  'ac53d9fb-dd22-4323-8dd6-cb8348521ce8',
  'emp-demo-016',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '56fa557c-e9b7-4398-8350-36bc0a784510',
  'emp-demo-016',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":2394,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":4,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '20c82b2d-4229-439f-b2f6-26dc9a215d82',
  'emp-demo-016',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  'cd1c2833-5cd0-4cb2-a637-731ebf13016f',
  'emp-demo-016',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  'c2ace2a2-3c72-4fd2-a9b2-7292e4d5641b',
  'emp-demo-016',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":2394,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":4,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'c60b11e0-b6de-4f6f-8450-801547b1661e',
  'emp-demo-016',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-016:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.517Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '4ae9d06f-92e4-407e-9ea5-61c467f0403d',
  'emp-demo-017',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '4a727966-ffb8-4eaa-904b-6e7a452ddafc',
  'emp-demo-017',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '07210209-a900-4deb-9448-c935633ebb20',
  'emp-demo-017',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  '190ccff7-6517-48ee-b308-41c2cff3f0f7',
  'emp-demo-017',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":740,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
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
  '21a9432a-69b8-4940-8a4c-783992476085',
  'emp-demo-017',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  'dac50d56-4813-44bd-be75-9306a6d5ec69',
  'emp-demo-017',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"people_ops","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '1cef46a3-bbb6-4cee-b23b-0f5de201d2fb',
  'emp-demo-017',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":740,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '176ec089-095b-4f2c-a762-a932792d02ba',
  'emp-demo-017',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  'fceffe84-4998-4adf-a98c-55879e88f0f2',
  'emp-demo-017',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  'e6aefe5d-b4a4-402b-98aa-c08f05979292',
  'emp-demo-017',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":740,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '97532eca-5099-414d-85ff-e65a4151698b',
  'emp-demo-017',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-017:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '0ecd4d4a-8586-437c-81a2-f4368d2f981e',
  'emp-demo-018',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  'eeebcdaf-4a6e-4204-954d-69bf297f3890',
  'emp-demo-018',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  '0eb95614-9fae-4e5f-8e2d-03c50f0df1ca',
  'emp-demo-018',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  '23fa64eb-6023-4826-931f-a0cdf7812c18',
  'emp-demo-018',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":546,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]}'
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
  'c4c55580-0982-4e5b-bc42-ab03287505ac',
  'emp-demo-018',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]}'
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
  'f644c59b-b6af-4161-bc57-d591630b60bd',
  'emp-demo-018',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '68725bfc-bceb-48a6-a421-a7a19d6560c2',
  'emp-demo-018',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":546,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '6dfa0b14-a2a4-485e-9979-a2e6b51da5f1',
  'emp-demo-018',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  '0d8d902d-53d0-4b8d-98e1-058698bb506f',
  'emp-demo-018',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  '76b8e600-6dd7-480f-adb5-d3655104a1ee',
  'emp-demo-018',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":546,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '7f6dcd93-668e-4fb9-875a-dd9553e5b653',
  'emp-demo-018',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-018:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  'a081f108-5abf-41ff-8d9e-a593b6bd6d8d',
  'emp-demo-019',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  'b729a214-aab5-4382-b296-b0c25a7c50c9',
  'emp-demo-019',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '87617bf8-5397-46c9-a86b-5226a7744e39',
  'emp-demo-019',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  'fa62a7f6-27a7-494c-afe2-c1a46b9913cf',
  'emp-demo-019',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":357,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]}'
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
  '6680e50a-a9ed-45f2-b952-c2185e627cc8',
  'emp-demo-019',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]}'
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
  'b9a0afb8-32db-4005-b578-6bf788ed5b05',
  'emp-demo-019',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"analyst","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'a6f4bfae-eddb-497d-90aa-b9fdab4a1ea9',
  'emp-demo-019',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":357,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '5a7cc183-1af6-488c-aed5-6921027b6fcb',
  'emp-demo-019',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  'afe31928-316c-441c-a7c5-65f955465732',
  'emp-demo-019',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '260168e7-527f-49cb-bb73-6ca883f43bf1',
  'emp-demo-019',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"travel","benefitName":"Travel","status":"locked","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":false,"expected":365,"actual":357,"errorMessage":"Available after 12 months of employment."},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'e8c7acff-12d0-4cdf-bd1a-9a5561238bf1',
  'emp-demo-019',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-019:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  'e57ca13f-1db9-4698-a351-627782f32743',
  'emp-demo-020',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  '13b567f3-d3b9-4047-a901-f889fdf0260f',
  'emp-demo-020',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  '7d74b6c5-9ae5-4b22-b587-440f0f75e280',
  'emp-demo-020',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  'a3df8854-668a-48d7-b354-687e5c3a6569',
  'emp-demo-020',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1155,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
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
  '09b0df66-74f8-47ab-85db-b271046e77e7',
  'emp-demo-020',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  'c9436bb8-a21d-4248-81cd-2c429bad4a91',
  'emp-demo-020',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'f41495aa-de37-458c-aece-d756817a1a99',
  'emp-demo-020',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1155,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'd779e934-91fd-4998-af37-ed6c9085dfd1',
  'emp-demo-020',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  'f5c7459c-ace6-4c74-ac31-2a37021fe5d1',
  'emp-demo-020',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  'b15e79f9-a5ce-4f48-8e52-8ca9216c9555',
  'emp-demo-020',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1155,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'd4b19e02-ae35-4ee3-86fc-caf0f8008516',
  'emp-demo-020',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-020:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '96dc1798-40f9-46a3-8825-e21105e37747',
  'emp-demo-021',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  'cad00cb8-b229-4278-8111-2b53bb7f47a5',
  'emp-demo-021',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '1414cc3e-7c51-4596-8b61-2b7b0153e17c',
  'emp-demo-021',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  'bb28ca05-cab1-40ba-b215-0705d8be940a',
  'emp-demo-021',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1751,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null}]}'
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
  '074da136-767c-4726-ba24-b500ca36211f',
  'emp-demo-021',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null}]}'
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
  'ac037a14-d8ed-48c2-b58f-566f91c841ba',
  'emp-demo-021',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"eligible","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":true,"expected":"ux_engineer","actual":"ux_engineer","errorMessage":null},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'cf508f94-8275-4bba-ad98-a82820914452',
  'emp-demo-021',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1751,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":3,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '644644c8-6487-4318-8a4b-1eb60ef1254f',
  'emp-demo-021',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  '5cbcc00d-b1ba-4f6c-b511-05631890b53c',
  'emp-demo-021',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  'afe95c3c-b797-410f-86a2-7cde999413fb',
  'emp-demo-021',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1751,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":3,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'f9c26970-1811-48c3-8b11-635b2d35ba92',
  'emp-demo-021',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-021:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '95b43c25-b95a-4dcb-8892-c4460221074b',
  'emp-demo-022',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"locked","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  '8bf6c86b-4776-4336-9511-ac24b6fab6f1',
  'emp-demo-022',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"locked","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  'a05f05fd-db38-481d-8cc0-0cd5f35080e6',
  'emp-demo-022',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"probation","errorMessage":null}]}'
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
  '3df9d4ff-1792-45d0-be6e-7c6acc131419',
  'emp-demo-022',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"locked","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":false,"expected":180,"actual":36,"errorMessage":"Available after 6 months of employment."},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation or leave."},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null}]}'
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
  '16bad07c-0fd6-4f71-b236-ce4c3ebc2906',
  'emp-demo-022',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation."},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."}]}'
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
  '4d0cfc30-8604-432d-8a8a-c70b41d517bb',
  'emp-demo-022',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  '11b73c33-33fd-4c9b-b016-79cedf02c7a0',
  'emp-demo-022',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":36,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":false,"expected":2,"actual":1,"errorMessage":"Requires Senior level (Level 2+)."},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  '26537d4a-a1d4-446c-b6e9-5169e6a47d7e',
  'emp-demo-022',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"probation","errorMessage":null}]}'
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
  '680d16a2-774c-41bc-b7b8-19ffc7169e23',
  'emp-demo-022',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"locked","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Not available during probation."},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null}]}'
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
  'ebb88e9c-7867-47d1-b352-d2dbb3fc5267',
  'emp-demo-022',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"travel","benefitName":"Travel","status":"locked","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":false,"expected":365,"actual":36,"errorMessage":"Available after 12 months of employment."},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":1,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  '46fbfa2a-fc44-4acf-8c85-8ec1ed990580',
  'emp-demo-022',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-022:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"locked","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":0,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":false,"expected":"active","actual":"probation","errorMessage":"Active employment required."}]}'
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '079316ae-cb7c-4080-bd10-67ad5efdf248',
  'emp-demo-023',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"eligible","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  '3fff1a16-fc2c-485f-9a2d-f726f2f942c6',
  'emp-demo-023',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"eligible","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  'd4381bcf-d097-4337-830b-e6ca6823d7a1',
  'emp-demo-023',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  '22a0b46e-cc5c-43a2-8478-e007d04d260a',
  'emp-demo-023',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"eligible","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":1183,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
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
  '70c29f52-d4ee-4015-9f93-d6e5a94436df',
  'emp-demo-023',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"eligible","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  'c1c2887a-6ee2-4e3a-b873-e338d56b912f',
  'emp-demo-023',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"manager","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  'e174b248-6219-4c54-8a1a-c0f428823d1f',
  'emp-demo-023',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"eligible","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":true,"expected":730,"actual":1183,"errorMessage":null},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '6c385cf4-6651-4663-91f5-acfb1b7c9c61',
  'emp-demo-023',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  '75bf8239-e2a7-4485-a426-7769dd3e2f32',
  'emp-demo-023',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"eligible","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null}]}'
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
  '0b86a11d-f192-42c9-bc30-328619598454',
  'emp-demo-023',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"travel","benefitName":"Travel","status":"eligible","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":1183,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null}]}'
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
  '50fd1191-9671-45b0-8d6a-32bfae3d995a',
  'emp-demo-023',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-023:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"eligible","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":true,"expected":true,"actual":true,"errorMessage":null},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":1,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '2026-03-09T13:19:07.518Z',
  NULL,
  NULL,
  NULL
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
  '08b08c03-dac4-4e96-bac2-c07a6456b728',
  'emp-demo-024',
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-gym-pinefit',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit","status":"locked","evaluations":[{"ruleId":"gym-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"gym-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"gym-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  'e4809120-568d-46bd-add5-1dcda085ba9f',
  'emp-demo-024',
  'benefit-private-insurance',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-private-insurance',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"private-insurance","benefitName":"Private Insurance","status":"locked","evaluations":[{"ruleId":"insurance-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"insurance-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"insurance-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  '68c257a5-e380-416b-8155-d1e6a2ba9c08',
  'emp-demo-024',
  'benefit-digital-wellness',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-digital-wellness',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"digital-wellness","benefitName":"Digital Wellness","status":"eligible","evaluations":[{"ruleId":"digital-wellness-status","ruleType":"employment_status","passed":true,"expected":"terminated","actual":"active","errorMessage":null}]}'
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
  'ab893d5b-693e-43a3-8943-105c05e681f8',
  'emp-demo-024',
  'benefit-macbook',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-macbook',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"macbook","benefitName":"MacBook Subsidy","status":"locked","evaluations":[{"ruleId":"macbook-tenure","ruleType":"tenure_days","passed":true,"expected":180,"actual":678,"errorMessage":null},{"ruleId":"macbook-employment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"macbook-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"Submit your current OKR to unlock this benefit."},{"ruleId":"macbook-responsibility","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null}]}'
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
  'ce1a6e82-4b5b-4f52-a27d-62aced394d7f',
  'emp-demo-024',
  'benefit-extra-responsibility',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-extra-responsibility',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"extra-responsibility","benefitName":"Extra Responsibility","status":"locked","evaluations":[{"ruleId":"extra-responsibility-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"extra-responsibility-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"extra-responsibility-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"extra-responsibility-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  '353abe53-144c-4e02-9ff1-b2670badb2cb',
  'emp-demo-024',
  'benefit-ux-engineer-tools',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-ux-engineer-tools',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"ux-engineer-tools","benefitName":"UX Engineer Tools","status":"locked","evaluations":[{"ruleId":"ux-tools-role","ruleType":"role","passed":false,"expected":"ux_engineer","actual":"engineer","errorMessage":"Available to UX/Design role only."},{"ruleId":"ux-tools-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"ux-tools-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  '3016d787-c12e-43b4-974e-0e6448b86a8b',
  'emp-demo-024',
  'benefit-down-payment',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-down-payment',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"down-payment","benefitName":"Down Payment Assistance","status":"locked","evaluations":[{"ruleId":"down-payment-tenure","ruleType":"tenure_days","passed":false,"expected":730,"actual":678,"errorMessage":"Available after 2 years of employment."},{"ruleId":"down-payment-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"down-payment-level","ruleType":"responsibility_level","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"down-payment-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  '7f63c631-cf3f-4cda-920b-051df272d05f',
  'emp-demo-024',
  'benefit-shit-happened-days',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-shit-happened-days',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"shit-happened-days","benefitName":"Shit Happened Days","status":"eligible","evaluations":[{"ruleId":"shd-status","ruleType":"employment_status","passed":true,"expected":["probation","active"],"actual":"active","errorMessage":null}]}'
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
  'a1e93052-4c74-4750-adee-5820b97f90f7',
  'emp-demo-024',
  'benefit-remote-work',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-remote-work',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"remote-work","benefitName":"Remote Work","status":"locked","evaluations":[{"ruleId":"remote-work-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null},{"ruleId":"remote-work-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."},{"ruleId":"remote-work-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null}]}'
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
  'aa05dcd4-9af4-45d7-bc20-b82c62376828',
  'emp-demo-024',
  'benefit-travel',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-travel',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"travel","benefitName":"Travel","status":"locked","evaluations":[{"ruleId":"travel-tenure","ruleType":"tenure_days","passed":true,"expected":365,"actual":678,"errorMessage":null},{"ruleId":"travel-level","ruleType":"responsibility_level","passed":true,"expected":1,"actual":2,"errorMessage":null},{"ruleId":"travel-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR submission required."}]}'
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
  '0d83b365-5b0b-4fae-8899-74097e02a207',
  'emp-demo-024',
  'benefit-bonus-based-on-okr',
  'system-import',
  'system',
  'eligibility_computed',
  'benefit_eligibility',
  'emp-demo-024:benefit-bonus-based-on-okr',
  'Eligibility recomputed from data_import',
  '{"trigger":"data_import","computedAt":"2026-03-09T13:19:07.518Z","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR","status":"locked","evaluations":[{"ruleId":"bonus-okr","ruleType":"okr_submitted","passed":false,"expected":true,"actual":false,"errorMessage":"OKR not submitted or score below threshold."},{"ruleId":"bonus-attendance","ruleType":"attendance","passed":true,"expected":2,"actual":2,"errorMessage":null},{"ruleId":"bonus-status","ruleType":"employment_status","passed":true,"expected":"active","actual":"active","errorMessage":null}]}'
);
