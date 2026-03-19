ALTER TABLE `benefits` ADD COLUMN `flow_type` text NOT NULL DEFAULT 'normal';
--> statement-breakpoint
UPDATE `benefits`
SET `flow_type` = CASE
  WHEN `id` IN ('gym_pinefit', 'private_insurance', 'macbook', 'travel') THEN 'contract'
  WHEN `id` IN ('digital_wellness', 'shit_happened_days', 'remote_work', 'bonus_okr') THEN 'self_service'
  WHEN `id` = 'down_payment' THEN 'down_payment'
  WHEN `id` = 'screen_time_salary_uplift' THEN 'screen_time'
  WHEN `requires_contract` = 1 THEN 'contract'
  ELSE 'normal'
END;
--> statement-breakpoint
CREATE TABLE `screen_time_programs` (
  `benefit_id` text PRIMARY KEY NOT NULL,
  `auto_accept_confidence` integer NOT NULL DEFAULT 90,
  `screenshot_retention_days` integer NOT NULL DEFAULT 30,
  `is_active` integer NOT NULL DEFAULT 1,
  `created_at` text NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  `updated_at` text NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
--> statement-breakpoint
CREATE TABLE `screen_time_program_tiers` (
  `id` text PRIMARY KEY NOT NULL,
  `benefit_id` text NOT NULL,
  `label` text NOT NULL,
  `max_daily_minutes` integer NOT NULL,
  `salary_uplift_percent` integer NOT NULL,
  `display_order` integer NOT NULL DEFAULT 0,
  `created_at` text NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  `updated_at` text NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
--> statement-breakpoint
CREATE INDEX `screen_time_program_tiers_benefit_idx`
  ON `screen_time_program_tiers` (`benefit_id`, `display_order`);
--> statement-breakpoint
CREATE TABLE `screen_time_submissions` (
  `id` text PRIMARY KEY NOT NULL,
  `benefit_id` text NOT NULL,
  `employee_id` text NOT NULL,
  `month_key` text NOT NULL,
  `slot_date` text NOT NULL,
  `screenshot_r2_key` text,
  `file_name` text,
  `mime_type` text,
  `screenshot_sha256` text,
  `avg_daily_minutes` integer,
  `confidence_score` integer,
  `platform` text,
  `period_type` text,
  `extraction_status` text NOT NULL DEFAULT 'pending',
  `review_status` text NOT NULL DEFAULT 'pending',
  `review_note` text,
  `raw_extraction_json` text,
  `submitted_at` text NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  `reviewed_at` text,
  `reviewed_by_employee_id` text,
  `created_at` text NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  `updated_at` text NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `screen_time_submissions_employee_slot_idx`
  ON `screen_time_submissions` (`benefit_id`, `employee_id`, `slot_date`);
--> statement-breakpoint
CREATE INDEX `screen_time_submissions_month_idx`
  ON `screen_time_submissions` (`benefit_id`, `month_key`);
--> statement-breakpoint
CREATE TABLE `screen_time_monthly_results` (
  `id` text PRIMARY KEY NOT NULL,
  `benefit_id` text NOT NULL,
  `employee_id` text NOT NULL,
  `month_key` text NOT NULL,
  `required_slot_count` integer NOT NULL DEFAULT 0,
  `submitted_slot_count` integer NOT NULL DEFAULT 0,
  `approved_slot_count` integer NOT NULL DEFAULT 0,
  `missing_due_slot_dates_json` text NOT NULL DEFAULT '[]',
  `monthly_avg_daily_minutes` integer,
  `awarded_salary_uplift_percent` integer NOT NULL DEFAULT 0,
  `status` text NOT NULL DEFAULT 'in_progress',
  `approved_by_employee_id` text,
  `approved_at` text,
  `decision_note` text,
  `created_at` text NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  `updated_at` text NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `screen_time_monthly_results_employee_month_idx`
  ON `screen_time_monthly_results` (`benefit_id`, `employee_id`, `month_key`);
