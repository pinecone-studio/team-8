ALTER TABLE benefit_requests ADD COLUMN finance_proposed_amount INTEGER;
ALTER TABLE benefit_requests ADD COLUMN finance_proposed_repayment_months INTEGER;
ALTER TABLE benefit_requests ADD COLUMN finance_proposal_note TEXT;
ALTER TABLE benefit_requests ADD COLUMN finance_proposed_by TEXT;
ALTER TABLE benefit_requests ADD COLUMN finance_proposed_at TEXT;
ALTER TABLE benefit_requests ADD COLUMN finance_contract_key TEXT;
ALTER TABLE benefit_requests ADD COLUMN finance_contract_file_name TEXT;
ALTER TABLE benefit_requests ADD COLUMN finance_contract_mime_type TEXT;
ALTER TABLE benefit_requests ADD COLUMN finance_contract_uploaded_at TEXT;
ALTER TABLE benefit_requests ADD COLUMN employee_decision_at TEXT;
ALTER TABLE benefit_requests ADD COLUMN final_approved_by TEXT;
ALTER TABLE benefit_requests ADD COLUMN final_approved_at TEXT;

UPDATE benefits
SET approval_policy = 'finance',
    subsidy_percent = 0,
    amount = NULL,
    requires_contract = 1
WHERE flow_type = 'down_payment';

UPDATE benefits
SET is_active = 0
WHERE flow_type = 'down_payment'
  AND is_active = 1
  AND rowid NOT IN (
    SELECT rowid
    FROM benefits
    WHERE flow_type = 'down_payment' AND is_active = 1
    ORDER BY rowid DESC
    LIMIT 1
  );

CREATE UNIQUE INDEX benefits_single_active_finance_benefit
  ON benefits (is_active)
  WHERE flow_type = 'down_payment' AND is_active = 1;
