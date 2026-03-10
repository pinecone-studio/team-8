INSERT INTO benefit_requests (
  id,
  employee_id,
  benefit_id,
  status,
  contract_version_accepted,
  contract_accepted_at,
  reviewed_by,
  created_at,
  updated_at
) VALUES (
  'req-demo-001',
  'emp-demo-001',
  'benefit-gym-pinefit',
  'approved',
  '2026.1',
  '2026-03-01T09:00:00.000Z',
  'emp-demo-008',
  '2026-03-01T09:00:00.000Z',
  '2026-03-01T12:00:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  status = excluded.status,
  contract_version_accepted = excluded.contract_version_accepted,
  contract_accepted_at = excluded.contract_accepted_at,
  reviewed_by = excluded.reviewed_by,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO contract_acceptance_logs (
  id,
  employee_id,
  contract_id,
  contract_version,
  contract_hash,
  accepted_at,
  ip_address,
  request_id,
  created_at
) VALUES (
  'cal-req-demo-001',
  'emp-demo-001',
  'contract-gym-v2026-1',
  '2026.1',
  '99fb6eeab7e55821631c90ec986a2d4e20f51a1ad8d2c28590911c4675215f48',
  '2026-03-01T09:00:00.000Z',
  '103.57.92.10',
  'req-demo-001',
  '2026-03-01T09:00:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  contract_id = excluded.contract_id,
  contract_version = excluded.contract_version,
  contract_hash = excluded.contract_hash,
  accepted_at = excluded.accepted_at,
  ip_address = excluded.ip_address,
  request_id = excluded.request_id,
  created_at = excluded.created_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-requested-req-demo-001',
  'emp-demo-001',
  'benefit-gym-pinefit',
  'emp-demo-001',
  'employee',
  'benefit_requested',
  'benefit_request',
  'req-demo-001',
  'Employee submitted benefit request',
  '{"requestId":"req-demo-001","benefitId":"benefit-gym-pinefit","requiresContract":true,"contractId":"contract-gym-v2026-1"}',
  '2026-03-01T09:00:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;

INSERT INTO notification_events (
  id,
  event_type,
  audience,
  recipient_employee_id,
  recipient_email,
  status,
  source_entity_type,
  source_entity_id,
  payload_json,
  dispatched_at,
  failed_at,
  last_error,
  created_at,
  updated_at
) VALUES (
  'notif-submitted-req-demo-001',
  'benefit_request_submitted',
  'hr_admins',
  NULL,
  NULL,
  'sent',
  'benefit_request',
  'req-demo-001',
  '{"requestId":"req-demo-001","employeeId":"emp-demo-001","employeeEmail":"employee.one@pinequest.mn","benefitId":"benefit-gym-pinefit","benefitSlug":"gym-pinefit","benefitName":"Gym - PineFit"}',
  '2026-03-01T12:00:00.000Z',
  NULL,
  NULL,
  '2026-03-01T09:00:00.000Z',
  '2026-03-01T12:00:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  audience = excluded.audience,
  recipient_employee_id = excluded.recipient_employee_id,
  recipient_email = excluded.recipient_email,
  status = excluded.status,
  source_entity_type = excluded.source_entity_type,
  source_entity_id = excluded.source_entity_id,
  payload_json = excluded.payload_json,
  dispatched_at = excluded.dispatched_at,
  failed_at = excluded.failed_at,
  last_error = excluded.last_error,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-reviewed-req-demo-001',
  'emp-demo-001',
  'benefit-gym-pinefit',
  'emp-demo-008',
  'hr_admin',
  'benefit_request_reviewed',
  'benefit_request',
  'req-demo-001',
  'Wellness request approved for Q1.',
  '{"requestId":"req-demo-001","previousStatus":"pending","nextStatus":"approved","reviewedAt":"2026-03-01T12:00:00.000Z"}',
  '2026-03-01T12:00:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;

INSERT INTO notification_events (
  id,
  event_type,
  audience,
  recipient_employee_id,
  recipient_email,
  status,
  source_entity_type,
  source_entity_id,
  payload_json,
  dispatched_at,
  failed_at,
  last_error,
  created_at,
  updated_at
) VALUES (
  'notif-reviewed-req-demo-001',
  'benefit_request_reviewed',
  'employee',
  'emp-demo-001',
  'employee.one@pinequest.mn',
  'sent',
  'benefit_request',
  'req-demo-001',
  '{"requestId":"req-demo-001","employeeId":"emp-demo-001","benefitId":"benefit-gym-pinefit","status":"approved","reason":"Wellness request approved for Q1.","reviewedBy":"emp-demo-008","reviewerRole":"hr_admin"}',
  '2026-03-01T12:00:00.000Z',
  NULL,
  NULL,
  '2026-03-01T12:00:00.000Z',
  '2026-03-01T12:00:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  audience = excluded.audience,
  recipient_employee_id = excluded.recipient_employee_id,
  recipient_email = excluded.recipient_email,
  status = excluded.status,
  source_entity_type = excluded.source_entity_type,
  source_entity_id = excluded.source_entity_id,
  payload_json = excluded.payload_json,
  dispatched_at = excluded.dispatched_at,
  failed_at = excluded.failed_at,
  last_error = excluded.last_error,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO benefit_requests (
  id,
  employee_id,
  benefit_id,
  status,
  contract_version_accepted,
  contract_accepted_at,
  reviewed_by,
  created_at,
  updated_at
) VALUES (
  'req-demo-002',
  'emp-demo-004',
  'benefit-private-insurance',
  'pending',
  '2026.1',
  '2026-03-02T08:45:00.000Z',
  NULL,
  '2026-03-02T08:45:00.000Z',
  '2026-03-02T08:45:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  status = excluded.status,
  contract_version_accepted = excluded.contract_version_accepted,
  contract_accepted_at = excluded.contract_accepted_at,
  reviewed_by = excluded.reviewed_by,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO contract_acceptance_logs (
  id,
  employee_id,
  contract_id,
  contract_version,
  contract_hash,
  accepted_at,
  ip_address,
  request_id,
  created_at
) VALUES (
  'cal-req-demo-002',
  'emp-demo-004',
  'contract-insurance-v2026-1',
  '2026.1',
  '99fb6eeab7e55821631c90ec986a2d4e20f51a1ad8d2c28590911c4675215f48',
  '2026-03-02T08:45:00.000Z',
  '103.57.92.11',
  'req-demo-002',
  '2026-03-02T08:45:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  contract_id = excluded.contract_id,
  contract_version = excluded.contract_version,
  contract_hash = excluded.contract_hash,
  accepted_at = excluded.accepted_at,
  ip_address = excluded.ip_address,
  request_id = excluded.request_id,
  created_at = excluded.created_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-requested-req-demo-002',
  'emp-demo-004',
  'benefit-private-insurance',
  'emp-demo-004',
  'employee',
  'benefit_requested',
  'benefit_request',
  'req-demo-002',
  'Employee submitted benefit request',
  '{"requestId":"req-demo-002","benefitId":"benefit-private-insurance","requiresContract":true,"contractId":"contract-insurance-v2026-1"}',
  '2026-03-02T08:45:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;

INSERT INTO notification_events (
  id,
  event_type,
  audience,
  recipient_employee_id,
  recipient_email,
  status,
  source_entity_type,
  source_entity_id,
  payload_json,
  dispatched_at,
  failed_at,
  last_error,
  created_at,
  updated_at
) VALUES (
  'notif-submitted-req-demo-002',
  'benefit_request_submitted',
  'hr_admins',
  NULL,
  NULL,
  'pending',
  'benefit_request',
  'req-demo-002',
  '{"requestId":"req-demo-002","employeeId":"emp-demo-004","employeeEmail":"employee.four@pinequest.mn","benefitId":"benefit-private-insurance","benefitSlug":"private-insurance","benefitName":"Private Insurance"}',
  NULL,
  NULL,
  NULL,
  '2026-03-02T08:45:00.000Z',
  '2026-03-02T08:45:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  audience = excluded.audience,
  recipient_employee_id = excluded.recipient_employee_id,
  recipient_email = excluded.recipient_email,
  status = excluded.status,
  source_entity_type = excluded.source_entity_type,
  source_entity_id = excluded.source_entity_id,
  payload_json = excluded.payload_json,
  dispatched_at = excluded.dispatched_at,
  failed_at = excluded.failed_at,
  last_error = excluded.last_error,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO benefit_requests (
  id,
  employee_id,
  benefit_id,
  status,
  contract_version_accepted,
  contract_accepted_at,
  reviewed_by,
  created_at,
  updated_at
) VALUES (
  'req-demo-003',
  'emp-demo-016',
  'benefit-travel',
  'pending',
  '2026.1',
  '2026-03-02T14:30:00.000Z',
  NULL,
  '2026-03-02T14:30:00.000Z',
  '2026-03-02T14:30:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  status = excluded.status,
  contract_version_accepted = excluded.contract_version_accepted,
  contract_accepted_at = excluded.contract_accepted_at,
  reviewed_by = excluded.reviewed_by,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO contract_acceptance_logs (
  id,
  employee_id,
  contract_id,
  contract_version,
  contract_hash,
  accepted_at,
  ip_address,
  request_id,
  created_at
) VALUES (
  'cal-req-demo-003',
  'emp-demo-016',
  'contract-travel-v2026-1',
  '2026.1',
  '99fb6eeab7e55821631c90ec986a2d4e20f51a1ad8d2c28590911c4675215f48',
  '2026-03-02T14:30:00.000Z',
  '103.57.92.12',
  'req-demo-003',
  '2026-03-02T14:30:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  contract_id = excluded.contract_id,
  contract_version = excluded.contract_version,
  contract_hash = excluded.contract_hash,
  accepted_at = excluded.accepted_at,
  ip_address = excluded.ip_address,
  request_id = excluded.request_id,
  created_at = excluded.created_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-requested-req-demo-003',
  'emp-demo-016',
  'benefit-travel',
  'emp-demo-016',
  'employee',
  'benefit_requested',
  'benefit_request',
  'req-demo-003',
  'Employee submitted benefit request',
  '{"requestId":"req-demo-003","benefitId":"benefit-travel","requiresContract":true,"contractId":"contract-travel-v2026-1"}',
  '2026-03-02T14:30:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;

INSERT INTO notification_events (
  id,
  event_type,
  audience,
  recipient_employee_id,
  recipient_email,
  status,
  source_entity_type,
  source_entity_id,
  payload_json,
  dispatched_at,
  failed_at,
  last_error,
  created_at,
  updated_at
) VALUES (
  'notif-submitted-req-demo-003',
  'benefit_request_submitted',
  'hr_admins',
  NULL,
  NULL,
  'pending',
  'benefit_request',
  'req-demo-003',
  '{"requestId":"req-demo-003","employeeId":"emp-demo-016","employeeEmail":"employee.sixteen@pinequest.mn","benefitId":"benefit-travel","benefitSlug":"travel","benefitName":"Travel"}',
  NULL,
  NULL,
  NULL,
  '2026-03-02T14:30:00.000Z',
  '2026-03-02T14:30:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  audience = excluded.audience,
  recipient_employee_id = excluded.recipient_employee_id,
  recipient_email = excluded.recipient_email,
  status = excluded.status,
  source_entity_type = excluded.source_entity_type,
  source_entity_id = excluded.source_entity_id,
  payload_json = excluded.payload_json,
  dispatched_at = excluded.dispatched_at,
  failed_at = excluded.failed_at,
  last_error = excluded.last_error,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO notification_events (
  id,
  event_type,
  audience,
  recipient_employee_id,
  recipient_email,
  status,
  source_entity_type,
  source_entity_id,
  payload_json,
  dispatched_at,
  failed_at,
  last_error,
  created_at,
  updated_at
) VALUES (
  'notif-manager-req-demo-003',
  'benefit_request_manager_review_required',
  'managers',
  NULL,
  NULL,
  'pending',
  'benefit_request',
  'req-demo-003',
  '{"requestId":"req-demo-003","employeeId":"emp-demo-016","employeeEmail":"employee.sixteen@pinequest.mn","benefitId":"benefit-travel","benefitSlug":"travel","benefitName":"Travel"}',
  NULL,
  NULL,
  NULL,
  '2026-03-02T14:30:00.000Z',
  '2026-03-02T14:30:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  audience = excluded.audience,
  recipient_employee_id = excluded.recipient_employee_id,
  recipient_email = excluded.recipient_email,
  status = excluded.status,
  source_entity_type = excluded.source_entity_type,
  source_entity_id = excluded.source_entity_id,
  payload_json = excluded.payload_json,
  dispatched_at = excluded.dispatched_at,
  failed_at = excluded.failed_at,
  last_error = excluded.last_error,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO benefit_requests (
  id,
  employee_id,
  benefit_id,
  status,
  contract_version_accepted,
  contract_accepted_at,
  reviewed_by,
  created_at,
  updated_at
) VALUES (
  'req-demo-004',
  'emp-demo-007',
  'benefit-down-payment',
  'pending',
  NULL,
  NULL,
  NULL,
  '2026-03-03T10:20:00.000Z',
  '2026-03-03T10:20:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  status = excluded.status,
  contract_version_accepted = excluded.contract_version_accepted,
  contract_accepted_at = excluded.contract_accepted_at,
  reviewed_by = excluded.reviewed_by,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-requested-req-demo-004',
  'emp-demo-007',
  'benefit-down-payment',
  'emp-demo-007',
  'employee',
  'benefit_requested',
  'benefit_request',
  'req-demo-004',
  'Employee submitted benefit request',
  '{"requestId":"req-demo-004","benefitId":"benefit-down-payment","requiresContract":false,"contractId":null}',
  '2026-03-03T10:20:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;

INSERT INTO notification_events (
  id,
  event_type,
  audience,
  recipient_employee_id,
  recipient_email,
  status,
  source_entity_type,
  source_entity_id,
  payload_json,
  dispatched_at,
  failed_at,
  last_error,
  created_at,
  updated_at
) VALUES (
  'notif-submitted-req-demo-004',
  'benefit_request_submitted',
  'hr_admins',
  NULL,
  NULL,
  'pending',
  'benefit_request',
  'req-demo-004',
  '{"requestId":"req-demo-004","employeeId":"emp-demo-007","employeeEmail":"employee.seven@pinequest.mn","benefitId":"benefit-down-payment","benefitSlug":"down-payment","benefitName":"Down Payment Assistance"}',
  NULL,
  NULL,
  NULL,
  '2026-03-03T10:20:00.000Z',
  '2026-03-03T10:20:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  audience = excluded.audience,
  recipient_employee_id = excluded.recipient_employee_id,
  recipient_email = excluded.recipient_email,
  status = excluded.status,
  source_entity_type = excluded.source_entity_type,
  source_entity_id = excluded.source_entity_id,
  payload_json = excluded.payload_json,
  dispatched_at = excluded.dispatched_at,
  failed_at = excluded.failed_at,
  last_error = excluded.last_error,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO notification_events (
  id,
  event_type,
  audience,
  recipient_employee_id,
  recipient_email,
  status,
  source_entity_type,
  source_entity_id,
  payload_json,
  dispatched_at,
  failed_at,
  last_error,
  created_at,
  updated_at
) VALUES (
  'notif-finance-req-demo-004',
  'benefit_request_finance_review_required',
  'finance_managers',
  NULL,
  NULL,
  'pending',
  'benefit_request',
  'req-demo-004',
  '{"requestId":"req-demo-004","employeeId":"emp-demo-007","employeeEmail":"employee.seven@pinequest.mn","benefitId":"benefit-down-payment","benefitSlug":"down-payment","benefitName":"Down Payment Assistance"}',
  NULL,
  NULL,
  NULL,
  '2026-03-03T10:20:00.000Z',
  '2026-03-03T10:20:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  audience = excluded.audience,
  recipient_employee_id = excluded.recipient_employee_id,
  recipient_email = excluded.recipient_email,
  status = excluded.status,
  source_entity_type = excluded.source_entity_type,
  source_entity_id = excluded.source_entity_id,
  payload_json = excluded.payload_json,
  dispatched_at = excluded.dispatched_at,
  failed_at = excluded.failed_at,
  last_error = excluded.last_error,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO benefit_requests (
  id,
  employee_id,
  benefit_id,
  status,
  contract_version_accepted,
  contract_accepted_at,
  reviewed_by,
  created_at,
  updated_at
) VALUES (
  'req-demo-005',
  'emp-demo-021',
  'benefit-bonus-based-on-okr',
  'rejected',
  NULL,
  NULL,
  'emp-demo-009',
  '2026-03-03T15:15:00.000Z',
  '2026-03-04T09:10:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  status = excluded.status,
  contract_version_accepted = excluded.contract_version_accepted,
  contract_accepted_at = excluded.contract_accepted_at,
  reviewed_by = excluded.reviewed_by,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-requested-req-demo-005',
  'emp-demo-021',
  'benefit-bonus-based-on-okr',
  'emp-demo-021',
  'employee',
  'benefit_requested',
  'benefit_request',
  'req-demo-005',
  'Employee submitted benefit request',
  '{"requestId":"req-demo-005","benefitId":"benefit-bonus-based-on-okr","requiresContract":false,"contractId":null}',
  '2026-03-03T15:15:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;

INSERT INTO notification_events (
  id,
  event_type,
  audience,
  recipient_employee_id,
  recipient_email,
  status,
  source_entity_type,
  source_entity_id,
  payload_json,
  dispatched_at,
  failed_at,
  last_error,
  created_at,
  updated_at
) VALUES (
  'notif-submitted-req-demo-005',
  'benefit_request_submitted',
  'hr_admins',
  NULL,
  NULL,
  'sent',
  'benefit_request',
  'req-demo-005',
  '{"requestId":"req-demo-005","employeeId":"emp-demo-021","employeeEmail":"employee.twentyone@pinequest.mn","benefitId":"benefit-bonus-based-on-okr","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR"}',
  '2026-03-04T09:10:00.000Z',
  NULL,
  NULL,
  '2026-03-03T15:15:00.000Z',
  '2026-03-04T09:10:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  audience = excluded.audience,
  recipient_employee_id = excluded.recipient_employee_id,
  recipient_email = excluded.recipient_email,
  status = excluded.status,
  source_entity_type = excluded.source_entity_type,
  source_entity_id = excluded.source_entity_id,
  payload_json = excluded.payload_json,
  dispatched_at = excluded.dispatched_at,
  failed_at = excluded.failed_at,
  last_error = excluded.last_error,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO notification_events (
  id,
  event_type,
  audience,
  recipient_employee_id,
  recipient_email,
  status,
  source_entity_type,
  source_entity_id,
  payload_json,
  dispatched_at,
  failed_at,
  last_error,
  created_at,
  updated_at
) VALUES (
  'notif-finance-req-demo-005',
  'benefit_request_finance_review_required',
  'finance_managers',
  NULL,
  NULL,
  'sent',
  'benefit_request',
  'req-demo-005',
  '{"requestId":"req-demo-005","employeeId":"emp-demo-021","employeeEmail":"employee.twentyone@pinequest.mn","benefitId":"benefit-bonus-based-on-okr","benefitSlug":"bonus-based-on-okr","benefitName":"Bonus Based on OKR"}',
  '2026-03-04T09:10:00.000Z',
  NULL,
  NULL,
  '2026-03-03T15:15:00.000Z',
  '2026-03-04T09:10:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  audience = excluded.audience,
  recipient_employee_id = excluded.recipient_employee_id,
  recipient_email = excluded.recipient_email,
  status = excluded.status,
  source_entity_type = excluded.source_entity_type,
  source_entity_id = excluded.source_entity_id,
  payload_json = excluded.payload_json,
  dispatched_at = excluded.dispatched_at,
  failed_at = excluded.failed_at,
  last_error = excluded.last_error,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-reviewed-req-demo-005',
  'emp-demo-021',
  'benefit-bonus-based-on-okr',
  'emp-demo-009',
  'finance_manager',
  'benefit_request_reviewed',
  'benefit_request',
  'req-demo-005',
  'Bonus budget cap reached for this cycle.',
  '{"requestId":"req-demo-005","previousStatus":"pending","nextStatus":"rejected","reviewedAt":"2026-03-04T09:10:00.000Z"}',
  '2026-03-04T09:10:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;

INSERT INTO notification_events (
  id,
  event_type,
  audience,
  recipient_employee_id,
  recipient_email,
  status,
  source_entity_type,
  source_entity_id,
  payload_json,
  dispatched_at,
  failed_at,
  last_error,
  created_at,
  updated_at
) VALUES (
  'notif-reviewed-req-demo-005',
  'benefit_request_reviewed',
  'employee',
  'emp-demo-021',
  'employee.twentyone@pinequest.mn',
  'sent',
  'benefit_request',
  'req-demo-005',
  '{"requestId":"req-demo-005","employeeId":"emp-demo-021","benefitId":"benefit-bonus-based-on-okr","status":"rejected","reason":"Bonus budget cap reached for this cycle.","reviewedBy":"emp-demo-009","reviewerRole":"finance_manager"}',
  '2026-03-04T09:10:00.000Z',
  NULL,
  NULL,
  '2026-03-04T09:10:00.000Z',
  '2026-03-04T09:10:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  audience = excluded.audience,
  recipient_employee_id = excluded.recipient_employee_id,
  recipient_email = excluded.recipient_email,
  status = excluded.status,
  source_entity_type = excluded.source_entity_type,
  source_entity_id = excluded.source_entity_id,
  payload_json = excluded.payload_json,
  dispatched_at = excluded.dispatched_at,
  failed_at = excluded.failed_at,
  last_error = excluded.last_error,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO benefit_requests (
  id,
  employee_id,
  benefit_id,
  status,
  contract_version_accepted,
  contract_accepted_at,
  reviewed_by,
  created_at,
  updated_at
) VALUES (
  'req-demo-006',
  'emp-demo-020',
  'benefit-macbook',
  'approved',
  '2026.1',
  '2026-03-04T11:00:00.000Z',
  'emp-demo-008',
  '2026-03-04T11:00:00.000Z',
  '2026-03-04T13:20:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  status = excluded.status,
  contract_version_accepted = excluded.contract_version_accepted,
  contract_accepted_at = excluded.contract_accepted_at,
  reviewed_by = excluded.reviewed_by,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO contract_acceptance_logs (
  id,
  employee_id,
  contract_id,
  contract_version,
  contract_hash,
  accepted_at,
  ip_address,
  request_id,
  created_at
) VALUES (
  'cal-req-demo-006',
  'emp-demo-020',
  'contract-macbook-v2026-1',
  '2026.1',
  '99fb6eeab7e55821631c90ec986a2d4e20f51a1ad8d2c28590911c4675215f48',
  '2026-03-04T11:00:00.000Z',
  '103.57.92.15',
  'req-demo-006',
  '2026-03-04T11:00:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  contract_id = excluded.contract_id,
  contract_version = excluded.contract_version,
  contract_hash = excluded.contract_hash,
  accepted_at = excluded.accepted_at,
  ip_address = excluded.ip_address,
  request_id = excluded.request_id,
  created_at = excluded.created_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-requested-req-demo-006',
  'emp-demo-020',
  'benefit-macbook',
  'emp-demo-020',
  'employee',
  'benefit_requested',
  'benefit_request',
  'req-demo-006',
  'Employee submitted benefit request',
  '{"requestId":"req-demo-006","benefitId":"benefit-macbook","requiresContract":true,"contractId":"contract-macbook-v2026-1"}',
  '2026-03-04T11:00:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;

INSERT INTO notification_events (
  id,
  event_type,
  audience,
  recipient_employee_id,
  recipient_email,
  status,
  source_entity_type,
  source_entity_id,
  payload_json,
  dispatched_at,
  failed_at,
  last_error,
  created_at,
  updated_at
) VALUES (
  'notif-submitted-req-demo-006',
  'benefit_request_submitted',
  'hr_admins',
  NULL,
  NULL,
  'sent',
  'benefit_request',
  'req-demo-006',
  '{"requestId":"req-demo-006","employeeId":"emp-demo-020","employeeEmail":"employee.twenty@pinequest.mn","benefitId":"benefit-macbook","benefitSlug":"macbook","benefitName":"MacBook Subsidy"}',
  '2026-03-04T13:20:00.000Z',
  NULL,
  NULL,
  '2026-03-04T11:00:00.000Z',
  '2026-03-04T13:20:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  audience = excluded.audience,
  recipient_employee_id = excluded.recipient_employee_id,
  recipient_email = excluded.recipient_email,
  status = excluded.status,
  source_entity_type = excluded.source_entity_type,
  source_entity_id = excluded.source_entity_id,
  payload_json = excluded.payload_json,
  dispatched_at = excluded.dispatched_at,
  failed_at = excluded.failed_at,
  last_error = excluded.last_error,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-reviewed-req-demo-006',
  'emp-demo-020',
  'benefit-macbook',
  'emp-demo-008',
  'hr_admin',
  'benefit_request_reviewed',
  'benefit_request',
  'req-demo-006',
  'Device refresh approved.',
  '{"requestId":"req-demo-006","previousStatus":"pending","nextStatus":"approved","reviewedAt":"2026-03-04T13:20:00.000Z"}',
  '2026-03-04T13:20:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;

INSERT INTO notification_events (
  id,
  event_type,
  audience,
  recipient_employee_id,
  recipient_email,
  status,
  source_entity_type,
  source_entity_id,
  payload_json,
  dispatched_at,
  failed_at,
  last_error,
  created_at,
  updated_at
) VALUES (
  'notif-reviewed-req-demo-006',
  'benefit_request_reviewed',
  'employee',
  'emp-demo-020',
  'employee.twenty@pinequest.mn',
  'sent',
  'benefit_request',
  'req-demo-006',
  '{"requestId":"req-demo-006","employeeId":"emp-demo-020","benefitId":"benefit-macbook","status":"approved","reason":"Device refresh approved.","reviewedBy":"emp-demo-008","reviewerRole":"hr_admin"}',
  '2026-03-04T13:20:00.000Z',
  NULL,
  NULL,
  '2026-03-04T13:20:00.000Z',
  '2026-03-04T13:20:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  audience = excluded.audience,
  recipient_employee_id = excluded.recipient_employee_id,
  recipient_email = excluded.recipient_email,
  status = excluded.status,
  source_entity_type = excluded.source_entity_type,
  source_entity_id = excluded.source_entity_id,
  payload_json = excluded.payload_json,
  dispatched_at = excluded.dispatched_at,
  failed_at = excluded.failed_at,
  last_error = excluded.last_error,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO benefit_requests (
  id,
  employee_id,
  benefit_id,
  status,
  contract_version_accepted,
  contract_accepted_at,
  reviewed_by,
  created_at,
  updated_at
) VALUES (
  'req-demo-007',
  'emp-demo-018',
  'benefit-remote-work',
  'cancelled',
  NULL,
  NULL,
  'emp-demo-008',
  '2026-03-05T09:25:00.000Z',
  '2026-03-05T10:40:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  status = excluded.status,
  contract_version_accepted = excluded.contract_version_accepted,
  contract_accepted_at = excluded.contract_accepted_at,
  reviewed_by = excluded.reviewed_by,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-requested-req-demo-007',
  'emp-demo-018',
  'benefit-remote-work',
  'emp-demo-018',
  'employee',
  'benefit_requested',
  'benefit_request',
  'req-demo-007',
  'Employee submitted benefit request',
  '{"requestId":"req-demo-007","benefitId":"benefit-remote-work","requiresContract":false,"contractId":null}',
  '2026-03-05T09:25:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;

INSERT INTO notification_events (
  id,
  event_type,
  audience,
  recipient_employee_id,
  recipient_email,
  status,
  source_entity_type,
  source_entity_id,
  payload_json,
  dispatched_at,
  failed_at,
  last_error,
  created_at,
  updated_at
) VALUES (
  'notif-submitted-req-demo-007',
  'benefit_request_submitted',
  'hr_admins',
  NULL,
  NULL,
  'sent',
  'benefit_request',
  'req-demo-007',
  '{"requestId":"req-demo-007","employeeId":"emp-demo-018","employeeEmail":"employee.eighteen@pinequest.mn","benefitId":"benefit-remote-work","benefitSlug":"remote-work","benefitName":"Remote Work"}',
  '2026-03-05T10:40:00.000Z',
  NULL,
  NULL,
  '2026-03-05T09:25:00.000Z',
  '2026-03-05T10:40:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  audience = excluded.audience,
  recipient_employee_id = excluded.recipient_employee_id,
  recipient_email = excluded.recipient_email,
  status = excluded.status,
  source_entity_type = excluded.source_entity_type,
  source_entity_id = excluded.source_entity_id,
  payload_json = excluded.payload_json,
  dispatched_at = excluded.dispatched_at,
  failed_at = excluded.failed_at,
  last_error = excluded.last_error,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-reviewed-req-demo-007',
  'emp-demo-018',
  'benefit-remote-work',
  'emp-demo-008',
  'hr_admin',
  'benefit_request_reviewed',
  'benefit_request',
  'req-demo-007',
  'Request cancelled after schedule change.',
  '{"requestId":"req-demo-007","previousStatus":"pending","nextStatus":"cancelled","reviewedAt":"2026-03-05T10:40:00.000Z"}',
  '2026-03-05T10:40:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;

INSERT INTO notification_events (
  id,
  event_type,
  audience,
  recipient_employee_id,
  recipient_email,
  status,
  source_entity_type,
  source_entity_id,
  payload_json,
  dispatched_at,
  failed_at,
  last_error,
  created_at,
  updated_at
) VALUES (
  'notif-reviewed-req-demo-007',
  'benefit_request_reviewed',
  'employee',
  'emp-demo-018',
  'employee.eighteen@pinequest.mn',
  'sent',
  'benefit_request',
  'req-demo-007',
  '{"requestId":"req-demo-007","employeeId":"emp-demo-018","benefitId":"benefit-remote-work","status":"cancelled","reason":"Request cancelled after schedule change.","reviewedBy":"emp-demo-008","reviewerRole":"hr_admin"}',
  '2026-03-05T10:40:00.000Z',
  NULL,
  NULL,
  '2026-03-05T10:40:00.000Z',
  '2026-03-05T10:40:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  audience = excluded.audience,
  recipient_employee_id = excluded.recipient_employee_id,
  recipient_email = excluded.recipient_email,
  status = excluded.status,
  source_entity_type = excluded.source_entity_type,
  source_entity_id = excluded.source_entity_id,
  payload_json = excluded.payload_json,
  dispatched_at = excluded.dispatched_at,
  failed_at = excluded.failed_at,
  last_error = excluded.last_error,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO benefit_requests (
  id,
  employee_id,
  benefit_id,
  status,
  contract_version_accepted,
  contract_accepted_at,
  reviewed_by,
  created_at,
  updated_at
) VALUES (
  'req-demo-008',
  'emp-demo-013',
  'benefit-digital-wellness',
  'approved',
  NULL,
  NULL,
  'emp-demo-008',
  '2026-03-05T16:10:00.000Z',
  '2026-03-05T16:55:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  status = excluded.status,
  contract_version_accepted = excluded.contract_version_accepted,
  contract_accepted_at = excluded.contract_accepted_at,
  reviewed_by = excluded.reviewed_by,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-requested-req-demo-008',
  'emp-demo-013',
  'benefit-digital-wellness',
  'emp-demo-013',
  'employee',
  'benefit_requested',
  'benefit_request',
  'req-demo-008',
  'Employee submitted benefit request',
  '{"requestId":"req-demo-008","benefitId":"benefit-digital-wellness","requiresContract":false,"contractId":null}',
  '2026-03-05T16:10:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;

INSERT INTO notification_events (
  id,
  event_type,
  audience,
  recipient_employee_id,
  recipient_email,
  status,
  source_entity_type,
  source_entity_id,
  payload_json,
  dispatched_at,
  failed_at,
  last_error,
  created_at,
  updated_at
) VALUES (
  'notif-submitted-req-demo-008',
  'benefit_request_submitted',
  'hr_admins',
  NULL,
  NULL,
  'sent',
  'benefit_request',
  'req-demo-008',
  '{"requestId":"req-demo-008","employeeId":"emp-demo-013","employeeEmail":"employee.thirteen@pinequest.mn","benefitId":"benefit-digital-wellness","benefitSlug":"digital-wellness","benefitName":"Digital Wellness"}',
  '2026-03-05T16:55:00.000Z',
  NULL,
  NULL,
  '2026-03-05T16:10:00.000Z',
  '2026-03-05T16:55:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  audience = excluded.audience,
  recipient_employee_id = excluded.recipient_employee_id,
  recipient_email = excluded.recipient_email,
  status = excluded.status,
  source_entity_type = excluded.source_entity_type,
  source_entity_id = excluded.source_entity_id,
  payload_json = excluded.payload_json,
  dispatched_at = excluded.dispatched_at,
  failed_at = excluded.failed_at,
  last_error = excluded.last_error,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-reviewed-req-demo-008',
  'emp-demo-013',
  'benefit-digital-wellness',
  'emp-demo-008',
  'hr_admin',
  'benefit_request_reviewed',
  'benefit_request',
  'req-demo-008',
  'Core wellness access enabled.',
  '{"requestId":"req-demo-008","previousStatus":"pending","nextStatus":"approved","reviewedAt":"2026-03-05T16:55:00.000Z"}',
  '2026-03-05T16:55:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;

INSERT INTO notification_events (
  id,
  event_type,
  audience,
  recipient_employee_id,
  recipient_email,
  status,
  source_entity_type,
  source_entity_id,
  payload_json,
  dispatched_at,
  failed_at,
  last_error,
  created_at,
  updated_at
) VALUES (
  'notif-reviewed-req-demo-008',
  'benefit_request_reviewed',
  'employee',
  'emp-demo-013',
  'employee.thirteen@pinequest.mn',
  'sent',
  'benefit_request',
  'req-demo-008',
  '{"requestId":"req-demo-008","employeeId":"emp-demo-013","benefitId":"benefit-digital-wellness","status":"approved","reason":"Core wellness access enabled.","reviewedBy":"emp-demo-008","reviewerRole":"hr_admin"}',
  '2026-03-05T16:55:00.000Z',
  NULL,
  NULL,
  '2026-03-05T16:55:00.000Z',
  '2026-03-05T16:55:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  audience = excluded.audience,
  recipient_employee_id = excluded.recipient_employee_id,
  recipient_email = excluded.recipient_email,
  status = excluded.status,
  source_entity_type = excluded.source_entity_type,
  source_entity_id = excluded.source_entity_id,
  payload_json = excluded.payload_json,
  dispatched_at = excluded.dispatched_at,
  failed_at = excluded.failed_at,
  last_error = excluded.last_error,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO sync_runs (
  id,
  sync_type,
  source,
  status,
  record_count,
  initiated_by,
  payload_json,
  summary_json,
  started_at,
  finished_at,
  created_at,
  updated_at
) VALUES (
  'sync-demo-okr-001',
  'okr',
  'workday-demo-feed',
  'completed',
  24,
  'emp-demo-017',
  '{"recordCount":24,"source":"workday-demo-feed"}',
  '{"updated":24,"recomputed":24,"missing":0,"errors":0}',
  '2026-03-02T07:00:00.000Z',
  '2026-03-02T07:04:00.000Z',
  '2026-03-02T07:00:00.000Z',
  '2026-03-02T07:04:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  sync_type = excluded.sync_type,
  source = excluded.source,
  status = excluded.status,
  record_count = excluded.record_count,
  initiated_by = excluded.initiated_by,
  payload_json = excluded.payload_json,
  summary_json = excluded.summary_json,
  started_at = excluded.started_at,
  finished_at = excluded.finished_at,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-sync-demo-okr-001',
  NULL,
  NULL,
  'emp-demo-017',
  'hr_admin',
  'okr_sync_ingested',
  'sync_run',
  'sync-demo-okr-001',
  'okr sync completed',
  '{"updated":24,"recomputed":24,"missing":0,"errors":0}',
  '2026-03-02T07:04:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;

INSERT INTO sync_runs (
  id,
  sync_type,
  source,
  status,
  record_count,
  initiated_by,
  payload_json,
  summary_json,
  started_at,
  finished_at,
  created_at,
  updated_at
) VALUES (
  'sync-demo-attendance-001',
  'attendance',
  'kiosk-demo-feed',
  'completed',
  24,
  'emp-demo-009',
  '{"recordCount":24,"source":"kiosk-demo-feed"}',
  '{"updated":24,"recomputed":24,"missing":0,"errors":0}',
  '2026-03-02T07:10:00.000Z',
  '2026-03-02T07:14:00.000Z',
  '2026-03-02T07:10:00.000Z',
  '2026-03-02T07:14:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  sync_type = excluded.sync_type,
  source = excluded.source,
  status = excluded.status,
  record_count = excluded.record_count,
  initiated_by = excluded.initiated_by,
  payload_json = excluded.payload_json,
  summary_json = excluded.summary_json,
  started_at = excluded.started_at,
  finished_at = excluded.finished_at,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-sync-demo-attendance-001',
  NULL,
  NULL,
  'emp-demo-009',
  'finance_manager',
  'attendance_sync_ingested',
  'sync_run',
  'sync-demo-attendance-001',
  'attendance sync completed',
  '{"updated":24,"recomputed":24,"missing":0,"errors":0}',
  '2026-03-02T07:14:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;

INSERT INTO sync_runs (
  id,
  sync_type,
  source,
  status,
  record_count,
  initiated_by,
  payload_json,
  summary_json,
  started_at,
  finished_at,
  created_at,
  updated_at
) VALUES (
  'sync-demo-okr-002',
  'okr',
  'manual-reconciliation',
  'partial',
  6,
  'emp-demo-008',
  '{"recordCount":6,"source":"manual-reconciliation"}',
  '{"updated":4,"recomputed":4,"missing":2,"errors":0}',
  '2026-03-06T08:00:00.000Z',
  '2026-03-06T08:03:00.000Z',
  '2026-03-06T08:00:00.000Z',
  '2026-03-06T08:03:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  sync_type = excluded.sync_type,
  source = excluded.source,
  status = excluded.status,
  record_count = excluded.record_count,
  initiated_by = excluded.initiated_by,
  payload_json = excluded.payload_json,
  summary_json = excluded.summary_json,
  started_at = excluded.started_at,
  finished_at = excluded.finished_at,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-sync-demo-okr-002',
  NULL,
  NULL,
  'emp-demo-008',
  'hr_admin',
  'okr_sync_ingested',
  'sync_run',
  'sync-demo-okr-002',
  'okr sync partial',
  '{"updated":4,"recomputed":4,"missing":2,"errors":0}',
  '2026-03-06T08:03:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;

INSERT INTO sync_runs (
  id,
  sync_type,
  source,
  status,
  record_count,
  initiated_by,
  payload_json,
  summary_json,
  started_at,
  finished_at,
  created_at,
  updated_at
) VALUES (
  'sync-demo-attendance-002',
  'attendance',
  'manual-correction',
  'completed',
  3,
  'emp-demo-009',
  '{"recordCount":3,"source":"manual-correction"}',
  '{"updated":3,"recomputed":3,"missing":0,"errors":0}',
  '2026-03-06T08:15:00.000Z',
  '2026-03-06T08:18:00.000Z',
  '2026-03-06T08:15:00.000Z',
  '2026-03-06T08:18:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  sync_type = excluded.sync_type,
  source = excluded.source,
  status = excluded.status,
  record_count = excluded.record_count,
  initiated_by = excluded.initiated_by,
  payload_json = excluded.payload_json,
  summary_json = excluded.summary_json,
  started_at = excluded.started_at,
  finished_at = excluded.finished_at,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json,
  created_at
) VALUES (
  'audit-sync-demo-attendance-002',
  NULL,
  NULL,
  'emp-demo-009',
  'finance_manager',
  'attendance_sync_ingested',
  'sync_run',
  'sync-demo-attendance-002',
  'attendance sync completed',
  '{"updated":3,"recomputed":3,"missing":0,"errors":0}',
  '2026-03-06T08:18:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  employee_id = excluded.employee_id,
  benefit_id = excluded.benefit_id,
  actor_id = excluded.actor_id,
  actor_role = excluded.actor_role,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  reason = excluded.reason,
  payload_json = excluded.payload_json,
  created_at = excluded.created_at;
