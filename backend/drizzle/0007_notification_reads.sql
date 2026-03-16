CREATE TABLE `notification_reads` (
	`employee_id` text NOT NULL,
	`notification_key` text NOT NULL,
	`read_at` text NOT NULL,
	PRIMARY KEY(`employee_id`, `notification_key`)
);
