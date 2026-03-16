CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_employee_id` text,
	`actor_role` text NOT NULL,
	`action_type` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`target_employee_id` text,
	`benefit_id` text,
	`request_id` text,
	`contract_id` text,
	`reason` text,
	`before_json` text,
	`after_json` text,
	`metadata_json` text,
	`ip_address` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contract_acceptances` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`benefit_id` text NOT NULL,
	`contract_id` text NOT NULL,
	`contract_version` text NOT NULL,
	`contract_hash` text NOT NULL,
	`accepted_at` text NOT NULL,
	`ip_address` text,
	`request_id` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employee_benefit_enrollments` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`benefit_id` text NOT NULL,
	`request_id` text,
	`status` text DEFAULT 'active' NOT NULL,
	`subsidy_percent_applied` integer,
	`employee_percent_applied` integer,
	`approved_by` text,
	`started_at` text NOT NULL,
	`ended_at` text,
	`metadata_json` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `benefits` ADD `approval_policy` text DEFAULT 'hr' NOT NULL;--> statement-breakpoint
ALTER TABLE `benefit_eligibility` ADD `override_status` text;--> statement-breakpoint
