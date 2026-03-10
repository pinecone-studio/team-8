BEGIN TRANSACTION;

UPDATE contracts
SET is_active = 0,
    updated_at = CURRENT_TIMESTAMP
WHERE benefit_id = 'benefit-gym-pinefit';

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
) VALUES (
  'contract-gym-v2026-1',
  'benefit-gym-pinefit',
  'PineFit',
  '2026.1',
  'contracts/gym-pinefit/2026.1/contract-gym-v2026-1.pdf',
  '99fb6eeab7e55821631c90ec986a2d4e20f51a1ad8d2c28590911c4675215f48',
  '2026-01-01T00:00:00.000Z',
  '2026-12-31T23:59:59.000Z',
  1
)
ON CONFLICT(id) DO UPDATE SET
  benefit_id = excluded.benefit_id,
  vendor_name = excluded.vendor_name,
  version = excluded.version,
  r2_object_key = excluded.r2_object_key,
  sha256_hash = excluded.sha256_hash,
  effective_date = excluded.effective_date,
  expiry_date = excluded.expiry_date,
  is_active = excluded.is_active,
  updated_at = CURRENT_TIMESTAMP;

UPDATE benefits
SET active_contract_id = 'contract-gym-v2026-1',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'benefit-gym-pinefit';

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'cacb483a-5936-484e-9b95-9d225e16c64d',
  NULL,
  'benefit-gym-pinefit',
  'system-import',
  'system',
  'contract_uploaded',
  'contract',
  'contract-gym-v2026-1',
  'Imported contract version 2026.1',
  '{"benefitId":"benefit-gym-pinefit","benefitSlug":"gym-pinefit","version":"2026.1","vendorName":"PineFit","objectKey":"contracts/gym-pinefit/2026.1/contract-gym-v2026-1.pdf","sha256Hash":"99fb6eeab7e55821631c90ec986a2d4e20f51a1ad8d2c28590911c4675215f48","effectiveDate":"2026-01-01T00:00:00.000Z","expiryDate":"2026-12-31T23:59:59.000Z"}'
);

UPDATE contracts
SET is_active = 0,
    updated_at = CURRENT_TIMESTAMP
WHERE benefit_id = 'benefit-private-insurance';

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
) VALUES (
  'contract-insurance-v2026-1',
  'benefit-private-insurance',
  'Insurance Partner',
  '2026.1',
  'contracts/private-insurance/2026.1/contract-insurance-v2026-1.pdf',
  '99fb6eeab7e55821631c90ec986a2d4e20f51a1ad8d2c28590911c4675215f48',
  '2026-01-01T00:00:00.000Z',
  '2026-12-31T23:59:59.000Z',
  1
)
ON CONFLICT(id) DO UPDATE SET
  benefit_id = excluded.benefit_id,
  vendor_name = excluded.vendor_name,
  version = excluded.version,
  r2_object_key = excluded.r2_object_key,
  sha256_hash = excluded.sha256_hash,
  effective_date = excluded.effective_date,
  expiry_date = excluded.expiry_date,
  is_active = excluded.is_active,
  updated_at = CURRENT_TIMESTAMP;

UPDATE benefits
SET active_contract_id = 'contract-insurance-v2026-1',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'benefit-private-insurance';

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'fb67c2a3-a713-4d7c-940a-702d63dc877c',
  NULL,
  'benefit-private-insurance',
  'system-import',
  'system',
  'contract_uploaded',
  'contract',
  'contract-insurance-v2026-1',
  'Imported contract version 2026.1',
  '{"benefitId":"benefit-private-insurance","benefitSlug":"private-insurance","version":"2026.1","vendorName":"Insurance Partner","objectKey":"contracts/private-insurance/2026.1/contract-insurance-v2026-1.pdf","sha256Hash":"99fb6eeab7e55821631c90ec986a2d4e20f51a1ad8d2c28590911c4675215f48","effectiveDate":"2026-01-01T00:00:00.000Z","expiryDate":"2026-12-31T23:59:59.000Z"}'
);

UPDATE contracts
SET is_active = 0,
    updated_at = CURRENT_TIMESTAMP
WHERE benefit_id = 'benefit-macbook';

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
) VALUES (
  'contract-macbook-v2026-1',
  'benefit-macbook',
  'Apple Reseller',
  '2026.1',
  'contracts/macbook/2026.1/contract-macbook-v2026-1.pdf',
  '99fb6eeab7e55821631c90ec986a2d4e20f51a1ad8d2c28590911c4675215f48',
  '2026-01-01T00:00:00.000Z',
  '2026-12-31T23:59:59.000Z',
  1
)
ON CONFLICT(id) DO UPDATE SET
  benefit_id = excluded.benefit_id,
  vendor_name = excluded.vendor_name,
  version = excluded.version,
  r2_object_key = excluded.r2_object_key,
  sha256_hash = excluded.sha256_hash,
  effective_date = excluded.effective_date,
  expiry_date = excluded.expiry_date,
  is_active = excluded.is_active,
  updated_at = CURRENT_TIMESTAMP;

UPDATE benefits
SET active_contract_id = 'contract-macbook-v2026-1',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'benefit-macbook';

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  '4adee8f6-0e87-4c68-88e0-20f150825038',
  NULL,
  'benefit-macbook',
  'system-import',
  'system',
  'contract_uploaded',
  'contract',
  'contract-macbook-v2026-1',
  'Imported contract version 2026.1',
  '{"benefitId":"benefit-macbook","benefitSlug":"macbook","version":"2026.1","vendorName":"Apple Reseller","objectKey":"contracts/macbook/2026.1/contract-macbook-v2026-1.pdf","sha256Hash":"99fb6eeab7e55821631c90ec986a2d4e20f51a1ad8d2c28590911c4675215f48","effectiveDate":"2026-01-01T00:00:00.000Z","expiryDate":"2026-12-31T23:59:59.000Z"}'
);

UPDATE contracts
SET is_active = 0,
    updated_at = CURRENT_TIMESTAMP
WHERE benefit_id = 'benefit-travel';

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
) VALUES (
  'contract-travel-v2026-1',
  'benefit-travel',
  'Travel Partner',
  '2026.1',
  'contracts/travel/2026.1/contract-travel-v2026-1.pdf',
  '99fb6eeab7e55821631c90ec986a2d4e20f51a1ad8d2c28590911c4675215f48',
  '2026-01-01T00:00:00.000Z',
  '2026-12-31T23:59:59.000Z',
  1
)
ON CONFLICT(id) DO UPDATE SET
  benefit_id = excluded.benefit_id,
  vendor_name = excluded.vendor_name,
  version = excluded.version,
  r2_object_key = excluded.r2_object_key,
  sha256_hash = excluded.sha256_hash,
  effective_date = excluded.effective_date,
  expiry_date = excluded.expiry_date,
  is_active = excluded.is_active,
  updated_at = CURRENT_TIMESTAMP;

UPDATE benefits
SET active_contract_id = 'contract-travel-v2026-1',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'benefit-travel';

INSERT INTO audit_logs (
  id,
  employee_id,
  benefit_id,
  actor_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  reason,
  payload_json
) VALUES (
  'c1310175-fa92-4d4e-91a9-005fbbc06ac1',
  NULL,
  'benefit-travel',
  'system-import',
  'system',
  'contract_uploaded',
  'contract',
  'contract-travel-v2026-1',
  'Imported contract version 2026.1',
  '{"benefitId":"benefit-travel","benefitSlug":"travel","version":"2026.1","vendorName":"Travel Partner","objectKey":"contracts/travel/2026.1/contract-travel-v2026-1.pdf","sha256Hash":"99fb6eeab7e55821631c90ec986a2d4e20f51a1ad8d2c28590911c4675215f48","effectiveDate":"2026-01-01T00:00:00.000Z","expiryDate":"2026-12-31T23:59:59.000Z"}'
);

COMMIT;
