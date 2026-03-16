CREATE TABLE `attendance_records` (
  `employee_id` text NOT NULL,
  `date` text NOT NULL,
  `check_in_time` text NOT NULL,
  `is_late` integer NOT NULL,
  `imported_at` text NOT NULL,
  PRIMARY KEY(`employee_id`, `date`)
);
