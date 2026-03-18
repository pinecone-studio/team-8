-- Migration: add employee_contract_key to benefit_requests
-- Stores the R2 object key for the employee-uploaded signed contract

ALTER TABLE benefit_requests ADD COLUMN employee_contract_key TEXT;
