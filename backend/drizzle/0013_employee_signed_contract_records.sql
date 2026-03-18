CREATE TABLE `employee_signed_contracts` (
  `id` text PRIMARY KEY NOT NULL,
  `employee_id` text NOT NULL,
  `benefit_id` text NOT NULL,
  `request_id` text,
  `hr_contract_id` text,
  `hr_contract_version` text,
  `hr_contract_hash` text,
  `r2_object_key` text NOT NULL,
  `file_name` text,
  `mime_type` text,
  `status` text NOT NULL DEFAULT 'uploaded',
  `uploaded_at` text NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  `created_at` text NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  `updated_at` text NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
--> statement-breakpoint
CREATE INDEX `employee_signed_contracts_request_idx`
  ON `employee_signed_contracts` (`request_id`);
--> statement-breakpoint
CREATE INDEX `employee_signed_contracts_employee_benefit_idx`
  ON `employee_signed_contracts` (`employee_id`, `benefit_id`);
--> statement-breakpoint
CREATE INDEX `employee_signed_contracts_status_idx`
  ON `employee_signed_contracts` (`status`);
--> statement-breakpoint
INSERT INTO `employee_signed_contracts` (
  `id`,
  `employee_id`,
  `benefit_id`,
  `request_id`,
  `r2_object_key`,
  `file_name`,
  `status`,
  `uploaded_at`,
  `created_at`,
  `updated_at`
)
SELECT
  lower(hex(randomblob(16))) AS `id`,
  `employee_id`,
  `benefit_id`,
  `id` AS `request_id`,
  `employee_contract_key`,
  `employee_contract_key`,
  'attached_to_request' AS `status`,
  COALESCE(`contract_accepted_at`, `created_at`) AS `uploaded_at`,
  `created_at`,
  `updated_at`
FROM `benefit_requests`
WHERE `employee_contract_key` IS NOT NULL;
