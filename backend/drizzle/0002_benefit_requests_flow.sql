-- Benefit request flow: Down Payment (requestedAmount, repaymentMonths, employeeApprovedAt), HR decline reason
ALTER TABLE benefit_requests ADD COLUMN requested_amount integer;
--> statement-breakpoint
ALTER TABLE benefit_requests ADD COLUMN repayment_months integer;
--> statement-breakpoint
ALTER TABLE benefit_requests ADD COLUMN employee_approved_at text;
--> statement-breakpoint
ALTER TABLE benefit_requests ADD COLUMN decline_reason text;
