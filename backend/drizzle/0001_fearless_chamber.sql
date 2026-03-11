CREATE TABLE `benefits` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`subsidy_percent` integer NOT NULL,
	`vendor_name` text,
	`requires_contract` integer DEFAULT false NOT NULL,
	`active_contract_id` text,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contracts` (
	`id` text PRIMARY KEY NOT NULL,
	`benefit_id` text NOT NULL,
	`vendor_name` text NOT NULL,
	`version` text NOT NULL,
	`r2_object_key` text NOT NULL,
	`sha256_hash` text NOT NULL,
	`effective_date` text NOT NULL,
	`expiry_date` text NOT NULL,
	`is_active` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `eligibility_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`benefit_id` text NOT NULL,
	`rule_type` text NOT NULL,
	`operator` text NOT NULL,
	`value` text NOT NULL,
	`error_message` text NOT NULL,
	`priority` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `benefit_eligibility` (
	`employee_id` text NOT NULL,
	`benefit_id` text NOT NULL,
	`status` text NOT NULL,
	`rule_evaluation_json` text NOT NULL,
	`computed_at` text NOT NULL,
	`override_by` text,
	`override_reason` text,
	`override_expires_at` text,
	PRIMARY KEY(`employee_id`, `benefit_id`)
);
--> statement-breakpoint
CREATE TABLE `benefit_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`benefit_id` text NOT NULL,
	`status` text NOT NULL,
	`contract_version_accepted` text,
	`contract_accepted_at` text,
	`reviewed_by` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
