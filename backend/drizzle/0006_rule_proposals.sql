CREATE TABLE `rule_proposals` (
	`id` text PRIMARY KEY NOT NULL,
	`benefit_id` text NOT NULL,
	`rule_id` text,
	`change_type` text NOT NULL,
	`proposed_data` text NOT NULL,
	`summary` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`proposed_by_employee_id` text NOT NULL,
	`reviewed_by_employee_id` text,
	`proposed_at` text NOT NULL,
	`reviewed_at` text,
	`reason` text
);
