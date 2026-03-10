CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY NOT NULL,
  employee_code TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_eng TEXT,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  responsibility_level INTEGER NOT NULL,
  employment_status TEXT NOT NULL,
  hire_date TEXT NOT NULL,
  okr_submitted INTEGER NOT NULL DEFAULT 0,
  late_arrival_count INTEGER NOT NULL DEFAULT 0,
  late_arrival_updated_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS benefits (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subsidy_percent INTEGER NOT NULL,
  vendor_name TEXT,
  requires_contract INTEGER NOT NULL DEFAULT 0,
  requires_finance_approval INTEGER NOT NULL DEFAULT 0,
  requires_manager_approval INTEGER NOT NULL DEFAULT 0,
  is_core_benefit INTEGER NOT NULL DEFAULT 0,
  active_contract_id TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eligibility_rules (
  id TEXT PRIMARY KEY NOT NULL,
  benefit_id TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  operator TEXT NOT NULL,
  value TEXT NOT NULL,
  error_message TEXT NOT NULL,
  priority INTEGER NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (benefit_id) REFERENCES benefits(id)
);

CREATE TABLE IF NOT EXISTS benefit_eligibility (
  employee_id TEXT NOT NULL,
  benefit_id TEXT NOT NULL,
  status TEXT NOT NULL,
  rule_evaluation_json TEXT NOT NULL,
  computed_at TEXT NOT NULL,
  override_by TEXT,
  override_reason TEXT,
  override_expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (employee_id, benefit_id),
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (benefit_id) REFERENCES benefits(id)
);

CREATE TABLE IF NOT EXISTS benefit_requests (
  id TEXT PRIMARY KEY NOT NULL,
  employee_id TEXT NOT NULL,
  benefit_id TEXT NOT NULL,
  status TEXT NOT NULL,
  contract_version_accepted TEXT,
  contract_accepted_at TEXT,
  reviewed_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (benefit_id) REFERENCES benefits(id)
);

CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY NOT NULL,
  benefit_id TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  version TEXT NOT NULL,
  r2_object_key TEXT NOT NULL,
  sha256_hash TEXT NOT NULL,
  effective_date TEXT NOT NULL,
  expiry_date TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (benefit_id) REFERENCES benefits(id)
);

CREATE TABLE IF NOT EXISTS contract_acceptance_logs (
  id TEXT PRIMARY KEY NOT NULL,
  employee_id TEXT NOT NULL,
  contract_id TEXT NOT NULL,
  contract_version TEXT NOT NULL,
  contract_hash TEXT NOT NULL,
  accepted_at TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  request_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (contract_id) REFERENCES contracts(id),
  FOREIGN KEY (request_id) REFERENCES benefit_requests(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY NOT NULL,
  employee_id TEXT,
  benefit_id TEXT,
  actor_id TEXT,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  reason TEXT,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (benefit_id) REFERENCES benefits(id)
);

CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(employment_status);
CREATE INDEX IF NOT EXISTS idx_rules_benefit_id ON eligibility_rules(benefit_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_status ON benefit_eligibility(status);
CREATE INDEX IF NOT EXISTS idx_requests_employee_id ON benefit_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_contracts_benefit_id ON contracts(benefit_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_employee_id ON audit_logs(employee_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_benefit_id ON audit_logs(benefit_id);
