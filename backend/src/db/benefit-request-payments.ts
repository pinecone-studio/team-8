import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const benefitRequestPayments = sqliteTable(
  "benefit_request_payments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    requestId: text("request_id").notNull(),
    employeeId: text("employee_id").notNull(),
    benefitId: text("benefit_id").notNull(),
    provider: text("provider").notNull().default("bonum"),
    localTransactionId: text("local_transaction_id").notNull(),
    bonumInvoiceId: text("bonum_invoice_id"),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull().default("MNT"),
    status: text("status").notNull().default("creating"),
    checkoutUrl: text("checkout_url"),
    callbackUrl: text("callback_url"),
    expiresAt: text("expires_at"),
    paymentVendor: text("payment_vendor"),
    paidAt: text("paid_at"),
    failedAt: text("failed_at"),
    webhookReceivedAt: text("webhook_received_at"),
    rawCreateResponseJson: text("raw_create_response_json"),
    rawLastWebhookJson: text("raw_last_webhook_json"),
    createdByEmployeeId: text("created_by_employee_id"),
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updated_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => ({
    localTransactionUnique: uniqueIndex(
      "benefit_request_payments_local_transaction_idx",
    ).on(table.localTransactionId),
    bonumInvoiceUnique: uniqueIndex(
      "benefit_request_payments_bonum_invoice_idx",
    ).on(table.bonumInvoiceId),
  }),
);

export const benefitRequestPaymentEvents = sqliteTable(
  "benefit_request_payment_events",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    paymentId: text("payment_id"),
    provider: text("provider").notNull().default("bonum"),
    dedupeKey: text("dedupe_key").notNull(),
    bonumInvoiceId: text("bonum_invoice_id"),
    transactionId: text("transaction_id"),
    eventType: text("event_type"),
    eventStatus: text("event_status"),
    signatureValid: integer("signature_valid", { mode: "boolean" })
      .notNull()
      .default(false),
    processed: integer("processed", { mode: "boolean" })
      .notNull()
      .default(false),
    processError: text("process_error"),
    payloadJson: text("payload_json").notNull(),
    headersJson: text("headers_json"),
    processedAt: text("processed_at"),
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => ({
    dedupeUnique: uniqueIndex("benefit_request_payment_events_dedupe_idx").on(
      table.dedupeKey,
    ),
  }),
);

export type BenefitRequestPayment = typeof benefitRequestPayments.$inferSelect;
export type NewBenefitRequestPayment = typeof benefitRequestPayments.$inferInsert;
export type BenefitRequestPaymentEvent =
  typeof benefitRequestPaymentEvents.$inferSelect;
export type NewBenefitRequestPaymentEvent =
  typeof benefitRequestPaymentEvents.$inferInsert;
