ALTER TABLE `screen_time_programs`
  ADD COLUMN `winner_percent` integer NOT NULL DEFAULT 20;
--> statement-breakpoint
ALTER TABLE `screen_time_programs`
  ADD COLUMN `reward_amount_mnt` integer NOT NULL DEFAULT 100000;
--> statement-breakpoint
ALTER TABLE `screen_time_monthly_results`
  ADD COLUMN `competition_participant_count` integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `screen_time_monthly_results`
  ADD COLUMN `ranked_participant_count` integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `screen_time_monthly_results`
  ADD COLUMN `rank_position` integer;
--> statement-breakpoint
ALTER TABLE `screen_time_monthly_results`
  ADD COLUMN `winner_cutoff_rank` integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `screen_time_monthly_results`
  ADD COLUMN `is_winner` integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `screen_time_monthly_results`
  ADD COLUMN `reward_amount_mnt` integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `screen_time_monthly_results`
  ADD COLUMN `disqualification_reason` text;
