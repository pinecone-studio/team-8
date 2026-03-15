-- Migration 0005: backfill approval_policy, migrate legacy statuses, seed enrollments
-- Safe to run multiple times (idempotent via OR IGNORE / WHERE conditions)

--> statement-breakpoint
-- Step 1: Backfill approval_policy from category
-- Financial benefits → finance approval
UPDATE benefits SET approval_policy = 'finance' WHERE category = 'financial' AND approval_policy = 'hr';

--> statement-breakpoint
-- Step 2: Migrate legacy pending requests to explicit status values
-- Order matters: most-specific conditions first

-- Contract required but not yet accepted → awaiting_contract_acceptance
UPDATE benefit_requests
SET status = 'awaiting_contract_acceptance'
WHERE status = 'pending'
  AND benefit_id IN (SELECT id FROM benefits WHERE requires_contract = 1)
  AND (contract_version_accepted IS NULL OR contract_version_accepted = '');

--> statement-breakpoint
-- Finance-policy benefits → awaiting_finance_review
UPDATE benefit_requests
SET status = 'awaiting_finance_review'
WHERE status = 'pending'
  AND benefit_id IN (SELECT id FROM benefits WHERE approval_policy = 'finance');

--> statement-breakpoint
-- Dual-policy benefits (contract already accepted or no contract) → awaiting_hr_review
UPDATE benefit_requests
SET status = 'awaiting_hr_review'
WHERE status = 'pending'
  AND benefit_id IN (SELECT id FROM benefits WHERE approval_policy = 'dual');

--> statement-breakpoint
-- Remaining legacy pending (hr-policy, no-contract) → awaiting_hr_review
UPDATE benefit_requests
SET status = 'awaiting_hr_review'
WHERE status = 'pending';

--> statement-breakpoint
-- Step 3: Backfill employee_benefit_enrollments from already-approved requests
-- Idempotent: INSERT OR IGNORE + NOT EXISTS guard prevents duplicates
INSERT OR IGNORE INTO employee_benefit_enrollments (
  id,
  employee_id,
  benefit_id,
  request_id,
  status,
  subsidy_percent_applied,
  employee_percent_applied,
  approved_by,
  started_at,
  created_at,
  updated_at
)
SELECT
  'enroll_backfill_' || r.id,
  r.employee_id,
  r.benefit_id,
  r.id,
  'active',
  b.subsidy_percent,
  100 - b.subsidy_percent,
  r.reviewed_by,
  COALESCE(r.updated_at, r.created_at),
  COALESCE(r.updated_at, r.created_at),
  COALESCE(r.updated_at, r.created_at)
FROM benefit_requests r
JOIN benefits b ON r.benefit_id = b.id
WHERE r.status = 'approved'
  AND NOT EXISTS (
    SELECT 1 FROM employee_benefit_enrollments e
    WHERE e.employee_id = r.employee_id
      AND e.benefit_id = r.benefit_id
      AND e.status = 'active'
  );
