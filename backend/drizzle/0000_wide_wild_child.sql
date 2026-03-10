CREATE TABLE `employees` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`name_eng` text,
	`role` text NOT NULL,
	`department` text NOT NULL,
	`responsibility_level` integer DEFAULT 1 NOT NULL,
	`employment_status` text DEFAULT 'active' NOT NULL,
	`hire_date` text NOT NULL,
	`okr_submitted` integer DEFAULT 0 NOT NULL,
	`late_arrival_count` integer DEFAULT 0 NOT NULL,
	`late_arrival_updated_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employees_email_unique` ON `employees` (`email`);