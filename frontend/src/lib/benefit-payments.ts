"use client";

type TokenGetter = () => Promise<string | null>;

export type BenefitPaymentRecord = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  checkoutUrl?: string | null;
  expiresAt?: string | null;
  paidAt?: string | null;
  failedAt?: string | null;
  paymentVendor?: string | null;
  localTransactionId: string;
  bonumInvoiceId?: string | null;
  createdAt: string;
  updatedAt: string;
  requestId?: string;
  employeeId?: string;
  benefitId?: string;
  provider?: string;
};

export function getBenefitPaymentApiBase(): string {
  const base =
    typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GRAPHQL_URL
      ? process.env.NEXT_PUBLIC_GRAPHQL_URL
      : "https://team8-api.team8pinequest.workers.dev/";
  return base.replace(/\/$/, "");
}

export function hasBenefitPaymentExpired(
  payment: Pick<BenefitPaymentRecord, "status" | "expiresAt"> | null | undefined,
): boolean {
  if (!payment?.expiresAt) return false;
  if (payment.status !== "created") return false;
  return new Date(payment.expiresAt).getTime() <= Date.now();
}

export function getBenefitPaymentDisplayStatus(
  payment: Pick<BenefitPaymentRecord, "status" | "expiresAt"> | null | undefined,
): string {
  if (!payment) return "not_started";
  if (hasBenefitPaymentExpired(payment)) return "expired";
  return payment.status;
}

export async function startBenefitBonumPayment(
  requestId: string,
  getToken: TokenGetter,
): Promise<BenefitPaymentRecord> {
  const token = await getToken();
  const response = await fetch(
    `${getBenefitPaymentApiBase()}/api/benefit-requests/payment-start`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ requestId }),
    },
  );

  if (!response.ok) {
    const payload = await response
      .json()
      .catch(() => ({ error: "Failed to start Bonum payment." }));
    throw new Error(
      (payload as { error?: string }).error ?? "Failed to start Bonum payment.",
    );
  }

  return (await response.json()) as BenefitPaymentRecord;
}

export async function reconcileReturnedBenefitPayment(
  requestId: string,
  transactionId: string,
  getToken: TokenGetter,
): Promise<BenefitPaymentRecord> {
  const token = await getToken();
  const response = await fetch(
    `${getBenefitPaymentApiBase()}/api/benefit-requests/payment-reconcile`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ requestId, transactionId }),
    },
  );

  if (!response.ok) {
    const payload = await response
      .json()
      .catch(() => ({ error: "Failed to reconcile Bonum payment." }));
    throw new Error(
      (payload as { error?: string }).error ?? "Failed to reconcile Bonum payment.",
    );
  }

  return (await response.json()) as BenefitPaymentRecord;
}

export function openBenefitPaymentCheckout(checkoutUrl: string) {
  if (typeof window === "undefined") return;
  const popup = window.open(checkoutUrl, "_blank", "noopener,noreferrer");
  if (!popup) {
    window.location.assign(checkoutUrl);
  }
}

type BenefitPaymentRequirementLike = {
  flowType?: string | null;
  amount?: number | null;
  subsidyPercent?: number | null;
  employeePercent?: number | null;
};

export function benefitRequiresEmployeePayment(
  benefit: BenefitPaymentRequirementLike | null | undefined,
): boolean {
  if (!benefit) return false;
  const flowType = (benefit.flowType ?? "").trim();
  if (!["contract", "normal"].includes(flowType)) return false;
  const amount = benefit.amount ?? 0;
  if (!Number.isFinite(amount) || amount <= 0) return false;
  const employeePercent =
    benefit.employeePercent ??
    Math.max(0, 100 - (benefit.subsidyPercent ?? 0));
  return employeePercent > 0;
}
