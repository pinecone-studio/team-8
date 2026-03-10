BEGIN TRANSACTION;

DELETE FROM contract_acceptance_logs WHERE request_id IN (
  SELECT id FROM benefit_requests WHERE employee_id IN ('emp-demo-001', 'hr-demo-001', 'fin-demo-001')
);
DELETE FROM benefit_requests WHERE employee_id IN ('emp-demo-001', 'hr-demo-001', 'fin-demo-001');
DELETE FROM benefit_eligibility WHERE employee_id IN ('emp-demo-001', 'hr-demo-001', 'fin-demo-001');
DELETE FROM audit_logs WHERE employee_id IN ('emp-demo-001', 'hr-demo-001', 'fin-demo-001');
DELETE FROM contracts WHERE id IN ('contract-gym-v1', 'contract-travel-v1');
DELETE FROM employees WHERE id IN ('emp-demo-001', 'hr-demo-001', 'fin-demo-001');

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
) VALUES
(
  'emp-demo-001',
  'EMP001',
  'employee.demo@pinequest.mn',
  'Demo Employee',
  'Demo Employee',
  'engineer',
  'Engineering',
  2,
  'active',
  '2024-01-15T00:00:00.000Z',
  1,
  1
),
(
  'hr-demo-001',
  'HR001',
  'hr.demo@pinequest.mn',
  'Demo HR Admin',
  'Demo HR Admin',
  'manager',
  'HR',
  3,
  'active',
  '2023-01-15T00:00:00.000Z',
  1,
  0
),
(
  'fin-demo-001',
  'FIN001',
  'finance.demo@pinequest.mn',
  'Demo Finance Manager',
  'Demo Finance Manager',
  'manager',
  'Finance',
  3,
  'active',
  '2023-01-15T00:00:00.000Z',
  1,
  0
);

INSERT INTO contracts (
  id,
  benefit_id,
  vendor_name,
  version,
  r2_object_key,
  sha256_hash,
  effective_date,
  expiry_date,
  is_active
) VALUES
(
  'contract-gym-v1',
  'benefit-gym-pinefit',
  'PineFit',
  '2026.1',
  'contracts/gym-pinefit/2026.1/contract.pdf',
  'demo-hash-gym-2026-1',
  '2026-01-01T00:00:00.000Z',
  '2026-12-31T00:00:00.000Z',
  1
),
(
  'contract-travel-v1',
  'benefit-travel',
  'Travel Partner',
  '2026.1',
  'contracts/travel/2026.1/contract.pdf',
  'demo-hash-travel-2026-1',
  '2026-01-01T00:00:00.000Z',
  '2026-12-31T00:00:00.000Z',
  1
);

UPDATE benefits
SET active_contract_id = CASE id
  WHEN 'benefit-gym-pinefit' THEN 'contract-gym-v1'
  WHEN 'benefit-travel' THEN 'contract-travel-v1'
  ELSE active_contract_id
END
WHERE id IN ('benefit-gym-pinefit', 'benefit-travel');

COMMIT;

