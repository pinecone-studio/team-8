import { and, desc, eq, inArray } from "drizzle-orm";
import type {
  Benefit,
  BenefitRequest,
  BenefitRequestPayment,
  Database,
  Employee,
} from "../db";
import { schema } from "../db";
import type { Env } from "../graphql/context";
import { writeAuditLog } from "../graphql/resolvers/helpers/audit";
import { finalizeBenefitApproval } from "../graphql/resolvers/helpers/finalizeBenefitApproval";
import {
  createBonumInvoice,
  generateBonumWebhookDedupeKey,
  generateLocalTransactionId,
  parseBonumDate,
  resolveBonumReturnUrl,
  verifyBonumChecksum,
} from "./bonum";
import {
  calculateCompanyPaymentAmount,
  calculateEmployeePaymentAmount,
  requiresEmployeePaymentForBenefit,
} from "./amounts";

type StartBenefitPaymentParams = {
  db: Database;
  env: Env;
  request: Request;
  benefitRequest: BenefitRequest;
  benefit: Benefit;
  employee: Employee;
};

type BonumWebhookProcessResult =
  | { kind: "duplicate" }
  | { kind: "invalid_signature" }
  | { kind: "unmatched" }
  | { kind: "processed"; payment: BenefitRequestPayment };

type BonumWebhookPayload = {
  type?: unknown;
  status?: unknown;
  body?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const asTrimmedString = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

function serializeJson(value: unknown): string | null {
  if (value === undefined) return null;
  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify({ error: "Failed to serialize payload." });
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

export function getEmployeePaymentSummary(benefit: Benefit) {
  const totalAmount = benefit.amount ?? 0;
  const companyPays = calculateCompanyPaymentAmount(benefit);
  const employeePays = calculateEmployeePaymentAmount(benefit);
  return {
    totalAmount,
    companyPays,
    employeePays,
  };
}

export async function getLatestPaymentForRequest(
  db: Database,
  requestId: string,
): Promise<BenefitRequestPayment | null> {
  const rows = await db
    .select()
    .from(schema.benefitRequestPayments)
    .where(eq(schema.benefitRequestPayments.requestId, requestId))
    .orderBy(desc(schema.benefitRequestPayments.createdAt))
    .limit(1);
  return rows[0] ?? null;
}

export async function expireOpenPaymentsForRequest(
  db: Database,
  requestId: string,
): Promise<{ count: number; paymentIds: string[] }> {
  const openPayments = await db
    .select({
      id: schema.benefitRequestPayments.id,
    })
    .from(schema.benefitRequestPayments)
    .where(
      and(
        eq(schema.benefitRequestPayments.requestId, requestId),
        inArray(schema.benefitRequestPayments.status, ["creating", "created"]),
      ),
    );

  const openPaymentIds = openPayments
    .map((payment) => payment.id)
    .filter(Boolean);

  if (openPaymentIds.length === 0) {
    return { count: 0, paymentIds: [] };
  }

  const now = nowIso();

  await db
    .update(schema.benefitRequestPayments)
    .set({
      status: "expired",
      failedAt: now,
      updatedAt: now,
    })
    .where(
      inArray(schema.benefitRequestPayments.id, openPaymentIds),
    );

  return { count: openPaymentIds.length, paymentIds: openPaymentIds };
}

function hasPaymentExpired(payment: BenefitRequestPayment): boolean {
  if (!payment.expiresAt) return false;
  return new Date(payment.expiresAt).getTime() <= Date.now();
}

function canReusePaymentCheckout(
  payment: Pick<BenefitRequestPayment, "callbackUrl" | "localTransactionId">,
  requestId: string,
): boolean {
  if (!payment.callbackUrl) return false;

  try {
    const callbackUrl = new URL(payment.callbackUrl);
    return (
      callbackUrl.searchParams.get("requestId") === requestId &&
      callbackUrl.searchParams.get("transactionId") === payment.localTransactionId
    );
  } catch {
    return false;
  }
}

async function markPaymentExpired(
  db: Database,
  payment: BenefitRequestPayment,
): Promise<BenefitRequestPayment> {
  const now = nowIso();
  const [updated] = await db
    .update(schema.benefitRequestPayments)
    .set({
      status: "expired",
      failedAt: payment.failedAt ?? now,
      updatedAt: now,
    })
    .where(eq(schema.benefitRequestPayments.id, payment.id))
    .returning();
  return updated ?? { ...payment, status: "expired", failedAt: now, updatedAt: now };
}

export async function startBonumBenefitPayment({
  db,
  env,
  request,
  benefitRequest,
  benefit,
  employee,
}: StartBenefitPaymentParams): Promise<BenefitRequestPayment> {
  if (benefitRequest.status !== "awaiting_payment") {
    throw new Error(
      `Payment cannot be started from status: ${benefitRequest.status}.`,
    );
  }

  if (!requiresEmployeePaymentForBenefit(benefit)) {
    throw new Error("This request does not require employee payment.");
  }

  const latestPayment = await getLatestPaymentForRequest(db, benefitRequest.id);

  if (
    latestPayment?.status === "created" &&
    !hasPaymentExpired(latestPayment) &&
    canReusePaymentCheckout(latestPayment, benefitRequest.id)
  ) {
    return latestPayment;
  }

  if (latestPayment?.status === "created" && hasPaymentExpired(latestPayment)) {
    await markPaymentExpired(db, latestPayment);
  }

  if (latestPayment?.status === "paid") {
    return latestPayment;
  }

  const localTransactionId = generateLocalTransactionId(benefitRequest.id);
  const callbackUrl = new URL(resolveBonumReturnUrl(request, env));
  callbackUrl.searchParams.set("payment", "returned");
  callbackUrl.searchParams.set("requestId", benefitRequest.id);
  callbackUrl.searchParams.set("transactionId", localTransactionId);
  const employeePays = calculateEmployeePaymentAmount(benefit);
  const now = nowIso();

  const [draftPayment] = await db
    .insert(schema.benefitRequestPayments)
    .values({
      requestId: benefitRequest.id,
      employeeId: benefitRequest.employeeId,
      benefitId: benefitRequest.benefitId,
      amount: employeePays,
      status: "creating",
      callbackUrl: callbackUrl.toString(),
      createdByEmployeeId: employee.id,
      localTransactionId,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!draftPayment) {
    throw new Error("Failed to initialize payment record.");
  }

  try {
    const invoice = await createBonumInvoice(db, env, {
      amountMnt: employeePays,
      transactionId: localTransactionId,
      callbackUrl: callbackUrl.toString(),
      itemTitle: benefit.name,
      itemRemark: `${benefit.name}${benefit.vendorName ? ` (${benefit.vendorName})` : ""} employee co-payment`,
    });

    const expiresAt = new Date(
      Date.now() + invoice.expiresInSeconds * 1_000,
    ).toISOString();

    const [createdPayment] = await db
      .update(schema.benefitRequestPayments)
      .set({
        bonumInvoiceId: invoice.invoiceId,
        checkoutUrl: invoice.followUpLink,
        status: "created",
        expiresAt,
        rawCreateResponseJson: serializeJson(invoice.rawResponse),
        updatedAt: nowIso(),
      })
      .where(eq(schema.benefitRequestPayments.id, draftPayment.id))
      .returning();

    const finalizedPayment = createdPayment ?? {
      ...draftPayment,
      bonumInvoiceId: invoice.invoiceId,
      checkoutUrl: invoice.followUpLink,
      status: "created",
      expiresAt,
      rawCreateResponseJson: serializeJson(invoice.rawResponse),
    };

    await writeAuditLog({
      db,
      actor: employee,
      actionType: "PAYMENT_INVOICE_CREATED",
      entityType: "payment",
      entityId: finalizedPayment.id,
      targetEmployeeId: employee.id,
      benefitId: benefit.id,
      requestId: benefitRequest.id,
      metadata: {
        provider: "bonum",
        amount: finalizedPayment.amount,
        bonumInvoiceId: finalizedPayment.bonumInvoiceId,
        localTransactionId: finalizedPayment.localTransactionId,
        expiresAt: finalizedPayment.expiresAt,
      },
    });

    return finalizedPayment;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create Bonum invoice.";

    await db
      .update(schema.benefitRequestPayments)
      .set({
        status: "failed",
        failedAt: nowIso(),
        rawCreateResponseJson: serializeJson({ error: message }),
        updatedAt: nowIso(),
      })
      .where(eq(schema.benefitRequestPayments.id, draftPayment.id));

    await writeAuditLog({
      db,
      actor: employee,
      actionType: "PAYMENT_FAILED",
      entityType: "payment",
      entityId: draftPayment.id,
      targetEmployeeId: employee.id,
      benefitId: benefit.id,
      requestId: benefitRequest.id,
      reason: message,
      metadata: {
        provider: "bonum",
        localTransactionId,
      },
    });

    throw new Error(message);
  }
}

type ReconcileBonumReturnedPaymentParams = {
  db: Database;
  env: Env;
  employee: Employee;
  requestId: string;
  transactionId: string;
};

export async function reconcileBonumReturnedPayment({
  db,
  env,
  employee,
  requestId,
  transactionId,
}: ReconcileBonumReturnedPaymentParams): Promise<BenefitRequestPayment> {
  const requestRows = await db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.id, requestId))
    .limit(1);
  const benefitRequest = requestRows[0];

  if (!benefitRequest) {
    throw new Error("Benefit request not found.");
  }

  if (benefitRequest.employeeId !== employee.id) {
    throw new Error("You can only reconcile your own payment.");
  }

  const paymentRows = await db
    .select()
    .from(schema.benefitRequestPayments)
    .where(eq(schema.benefitRequestPayments.localTransactionId, transactionId))
    .limit(1);
  const payment = paymentRows[0];

  if (!payment || payment.requestId !== requestId) {
    throw new Error("Benefit payment not found.");
  }

  if (payment.status === "paid") {
    return payment;
  }

  if (payment.status !== "created") {
    throw new Error(`Payment cannot be reconciled from status: ${payment.status}.`);
  }

  const now = nowIso();
  const rawReturnPayload = serializeJson({
    source: "bonum_return_reconcile",
    requestId,
    transactionId,
  });

  const [updatedPayment] = await db
    .update(schema.benefitRequestPayments)
    .set({
      status: "paid",
      paidAt: now,
      webhookReceivedAt: now,
      paymentVendor: "bonum-return",
      rawLastWebhookJson: rawReturnPayload,
      updatedAt: now,
    })
    .where(eq(schema.benefitRequestPayments.id, payment.id))
    .returning();

  const finalizedPayment = updatedPayment ?? {
    ...payment,
    status: "paid",
    paidAt: now,
    webhookReceivedAt: now,
    paymentVendor: "bonum-return",
    rawLastWebhookJson: rawReturnPayload,
    updatedAt: now,
  };

  await activateBenefitRequestFromPayment(db, env, finalizedPayment);

  await writeAuditLog({
    db,
    actor: employee,
    actionType: "PAYMENT_CONFIRMED",
    entityType: "payment",
    entityId: finalizedPayment.id,
    targetEmployeeId: employee.id,
    benefitId: finalizedPayment.benefitId,
    requestId: finalizedPayment.requestId,
    metadata: {
      provider: "bonum",
      source: "bonum_return_reconcile",
      bonumInvoiceId: finalizedPayment.bonumInvoiceId,
      localTransactionId: finalizedPayment.localTransactionId,
      paymentVendor: finalizedPayment.paymentVendor,
    },
  });

  return finalizedPayment;
}

async function activateBenefitRequestFromPayment(
  db: Database,
  env: Env,
  payment: BenefitRequestPayment,
): Promise<void> {
  const requestRows = await db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.id, payment.requestId))
    .limit(1);
  const benefitRequest = requestRows[0];
  if (!benefitRequest) return;

  if (benefitRequest.status === "approved") {
    return;
  }

  if (
    benefitRequest.status !== "awaiting_payment" &&
    benefitRequest.status !== "awaiting_payment_review"
  ) {
    return;
  }

  const benefitRows = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, benefitRequest.benefitId))
    .limit(1);
  const benefit = benefitRows[0];
  if (!benefit) return;

  const employeeRows = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.id, benefitRequest.employeeId))
    .limit(1);
  const employee = employeeRows[0] ?? null;

  const [updatedRequest] = await db
    .update(schema.benefitRequests)
    .set({
      status: "approved",
      updatedAt: nowIso(),
    })
    .where(eq(schema.benefitRequests.id, benefitRequest.id))
    .returning();

  await finalizeBenefitApproval({
    db,
    env,
    actor: employee,
    benefitRequest: updatedRequest ?? {
      ...benefitRequest,
      status: "approved",
      updatedAt: nowIso(),
    },
    benefit,
    beforeStatus: benefitRequest.status,
    actionType: "REQUEST_APPROVED",
    metadata: {
      source: "bonum_webhook",
      paymentId: payment.id,
      bonumInvoiceId: payment.bonumInvoiceId,
      localTransactionId: payment.localTransactionId,
    },
  });
}

export async function processBonumWebhook(
  db: Database,
  env: Env,
  rawBody: string,
  headers: Headers,
): Promise<BonumWebhookProcessResult> {
  const checksumHeader =
    headers.get("x-checksum-v2") ?? headers.get("x-checksum");
  const signatureRequired = Boolean(env.BONUM_MERCHANT_CHECKSUM_KEY?.trim());
  const signatureValid = signatureRequired
    ? await verifyBonumChecksum(
        rawBody,
        checksumHeader,
        env.BONUM_MERCHANT_CHECKSUM_KEY,
      )
    : true;

  const dedupeKey = await generateBonumWebhookDedupeKey(rawBody);

  let payload: BonumWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as BonumWebhookPayload;
  } catch {
    payload = { type: "UNKNOWN", status: "FAILED", body: { rawBody } };
  }

  const payloadBody = isRecord(payload.body) ? payload.body : {};
  const eventType = asTrimmedString(payload.type) ?? "UNKNOWN";
  const eventStatus = asTrimmedString(payload.status);
  const bonumInvoiceId =
    asTrimmedString(payloadBody.invoiceId) ??
    asTrimmedString((payload as Record<string, unknown>).invoiceId);
  const transactionId =
    asTrimmedString(payloadBody.transactionId) ??
    asTrimmedString((payload as Record<string, unknown>).transactionId);

  let payment =
    bonumInvoiceId
      ? (
          await db
            .select()
            .from(schema.benefitRequestPayments)
            .where(eq(schema.benefitRequestPayments.bonumInvoiceId, bonumInvoiceId))
            .limit(1)
        )[0] ?? null
      : null;

  if (!payment && transactionId) {
    payment =
      (
        await db
          .select()
          .from(schema.benefitRequestPayments)
          .where(
            eq(schema.benefitRequestPayments.localTransactionId, transactionId),
          )
          .limit(1)
      )[0] ?? null;
  }

  const headerObject: Record<string, string> = {};
  headers.forEach((value, key) => {
    headerObject[key] = value;
  });

  try {
    await db.insert(schema.benefitRequestPaymentEvents).values({
      paymentId: payment?.id ?? null,
      provider: "bonum",
      dedupeKey,
      bonumInvoiceId,
      transactionId,
      eventType,
      eventStatus,
      signatureValid,
      payloadJson: serializeJson(payload) ?? "{}",
      headersJson: serializeJson(headerObject),
    });
  } catch {
    return { kind: "duplicate" };
  }

  const eventRows = await db
    .select()
    .from(schema.benefitRequestPaymentEvents)
    .where(eq(schema.benefitRequestPaymentEvents.dedupeKey, dedupeKey))
    .limit(1);
  const eventRow = eventRows[0];

  if (signatureRequired && !signatureValid) {
    if (eventRow) {
      await db
        .update(schema.benefitRequestPaymentEvents)
        .set({
          processed: true,
          processError: "Invalid checksum signature.",
          processedAt: nowIso(),
        })
        .where(eq(schema.benefitRequestPaymentEvents.id, eventRow.id));
    }
    return { kind: "invalid_signature" };
  }

  if (!payment) {
    if (eventRow) {
      await db
        .update(schema.benefitRequestPaymentEvents)
        .set({
          processed: true,
          processError: "Payment record not found for webhook payload.",
          processedAt: nowIso(),
        })
        .where(eq(schema.benefitRequestPaymentEvents.id, eventRow.id));
    }
    return { kind: "unmatched" };
  }

  const normalizedEventType = eventType.toUpperCase();
  const normalizedEventStatus = (eventStatus ?? "").toUpperCase();
  const normalizedInvoiceStatus = (
    asTrimmedString(payloadBody.invoiceStatus) ?? ""
  ).toUpperCase();
  const completedAt =
    parseBonumDate(payloadBody.completedAt) ??
    parseBonumDate(payloadBody.updatedAt) ??
    new Date();
  const now = nowIso();

  const isPaymentSuccess =
    normalizedEventType === "PAYMENT" &&
    (normalizedEventStatus === "SUCCESS" ||
      normalizedInvoiceStatus === "PAID" ||
      normalizedInvoiceStatus === "SUCCESS");

  const isPaymentFailed =
    normalizedEventType === "PAYMENT" &&
    (normalizedEventStatus === "FAILED" ||
      normalizedInvoiceStatus === "FAILED" ||
      normalizedInvoiceStatus === "EXPIRED");

  let updatedPayment = payment;

  if (isPaymentSuccess) {
    const [row] = await db
      .update(schema.benefitRequestPayments)
      .set({
        status: "paid",
        paidAt: completedAt.toISOString(),
        webhookReceivedAt: now,
        paymentVendor: asTrimmedString(payloadBody.paymentVendor),
        rawLastWebhookJson: serializeJson(payload),
        bonumInvoiceId: bonumInvoiceId ?? payment.bonumInvoiceId,
        updatedAt: now,
      })
      .where(eq(schema.benefitRequestPayments.id, payment.id))
      .returning();
    updatedPayment = row ?? {
      ...payment,
      status: "paid",
      paidAt: completedAt.toISOString(),
      webhookReceivedAt: now,
      paymentVendor: asTrimmedString(payloadBody.paymentVendor),
      rawLastWebhookJson: serializeJson(payload),
      bonumInvoiceId: bonumInvoiceId ?? payment.bonumInvoiceId,
      updatedAt: now,
    };

    await activateBenefitRequestFromPayment(db, env, updatedPayment);

    await writeAuditLog({
      db,
      actor: null,
      actionType: "PAYMENT_CONFIRMED",
      entityType: "payment",
      entityId: updatedPayment.id,
      targetEmployeeId: updatedPayment.employeeId,
      benefitId: updatedPayment.benefitId,
      requestId: updatedPayment.requestId,
      metadata: {
        provider: "bonum",
        bonumInvoiceId: updatedPayment.bonumInvoiceId,
        localTransactionId: updatedPayment.localTransactionId,
        paymentVendor: updatedPayment.paymentVendor,
      },
    });
  } else if (isPaymentFailed) {
    const nextStatus =
      normalizedInvoiceStatus === "EXPIRED" ? "expired" : "failed";
    const [row] = await db
      .update(schema.benefitRequestPayments)
      .set({
        status: nextStatus,
        failedAt: completedAt.toISOString(),
        webhookReceivedAt: now,
        rawLastWebhookJson: serializeJson(payload),
        bonumInvoiceId: bonumInvoiceId ?? payment.bonumInvoiceId,
        updatedAt: now,
      })
      .where(eq(schema.benefitRequestPayments.id, payment.id))
      .returning();
    updatedPayment = row ?? {
      ...payment,
      status: nextStatus,
      failedAt: completedAt.toISOString(),
      webhookReceivedAt: now,
      rawLastWebhookJson: serializeJson(payload),
      bonumInvoiceId: bonumInvoiceId ?? payment.bonumInvoiceId,
      updatedAt: now,
    };

    await writeAuditLog({
      db,
      actor: null,
      actionType: "PAYMENT_FAILED",
      entityType: "payment",
      entityId: updatedPayment.id,
      targetEmployeeId: updatedPayment.employeeId,
      benefitId: updatedPayment.benefitId,
      requestId: updatedPayment.requestId,
      metadata: {
        provider: "bonum",
        bonumInvoiceId: updatedPayment.bonumInvoiceId,
        localTransactionId: updatedPayment.localTransactionId,
        invoiceStatus: normalizedInvoiceStatus,
      },
    });
  }

  if (eventRow) {
    await db
      .update(schema.benefitRequestPaymentEvents)
      .set({
        processed: true,
        processedAt: nowIso(),
      })
      .where(eq(schema.benefitRequestPaymentEvents.id, eventRow.id));
  }

  return { kind: "processed", payment: updatedPayment };
}
