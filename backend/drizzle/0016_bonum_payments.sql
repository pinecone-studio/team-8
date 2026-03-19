CREATE TABLE bonum_auth_tokens (
  terminal_id TEXT PRIMARY KEY,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_type TEXT,
  expires_in_seconds INTEGER NOT NULL DEFAULT 1800,
  refresh_expires_seconds INTEGER,
  access_token_expires_at TEXT NOT NULL,
  refresh_token_expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE benefit_request_payments (
  id TEXT PRIMARY KEY NOT NULL,
  request_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  benefit_id TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'bonum',
  local_transaction_id TEXT NOT NULL UNIQUE,
  bonum_invoice_id TEXT UNIQUE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MNT',
  status TEXT NOT NULL DEFAULT 'creating',
  checkout_url TEXT,
  callback_url TEXT,
  expires_at TEXT,
  payment_vendor TEXT,
  paid_at TEXT,
  failed_at TEXT,
  webhook_received_at TEXT,
  raw_create_response_json TEXT,
  raw_last_webhook_json TEXT,
  created_by_employee_id TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX benefit_request_payments_request_created_idx
  ON benefit_request_payments(request_id, created_at);

CREATE INDEX benefit_request_payments_employee_status_idx
  ON benefit_request_payments(employee_id, status, created_at);

CREATE TABLE benefit_request_payment_events (
  id TEXT PRIMARY KEY NOT NULL,
  payment_id TEXT,
  provider TEXT NOT NULL DEFAULT 'bonum',
  dedupe_key TEXT NOT NULL UNIQUE,
  bonum_invoice_id TEXT,
  transaction_id TEXT,
  event_type TEXT,
  event_status TEXT,
  signature_valid INTEGER NOT NULL DEFAULT 0,
  processed INTEGER NOT NULL DEFAULT 0,
  process_error TEXT,
  payload_json TEXT NOT NULL,
  headers_json TEXT,
  processed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX benefit_request_payment_events_payment_idx
  ON benefit_request_payment_events(payment_id, created_at);

CREATE INDEX benefit_request_payment_events_invoice_idx
  ON benefit_request_payment_events(bonum_invoice_id);

CREATE INDEX benefit_request_payment_events_transaction_idx
  ON benefit_request_payment_events(transaction_id);
