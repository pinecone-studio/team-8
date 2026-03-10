ALTER TABLE `employees` ADD COLUMN `okr_score` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
CREATE TABLE `benefits` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`subsidy_percent` integer DEFAULT 0 NOT NULL,
	`is_core` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `benefit_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`benefit_id` text NOT NULL,
	`rule_type` text NOT NULL,
	`condition_json` text NOT NULL,
	`blocking_message` text,
	`priority` integer DEFAULT 0 NOT NULL,
	`is_blocking` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `benefit_rules_benefit_id_idx` ON `benefit_rules` (`benefit_id`);
--> statement-breakpoint
CREATE TABLE `benefit_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`benefit_id` text NOT NULL,
	`employee_id` text NOT NULL,
	`requested_units` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`status_reason` text,
	`manager_approved` integer DEFAULT 0 NOT NULL,
	`finance_approved` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `benefit_requests_employee_id_idx` ON `benefit_requests` (`employee_id`);
--> statement-breakpoint
CREATE TABLE `benefit_contract_acceptances` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`vendor` text NOT NULL,
	`accepted_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `benefit_contract_acceptances_employee_vendor_unique` ON `benefit_contract_acceptances` (`employee_id`,`vendor`);
