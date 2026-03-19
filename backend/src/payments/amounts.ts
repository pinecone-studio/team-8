type BenefitPaymentLike = {
  amount?: number | null;
  flowType?: string | null;
  subsidyPercent?: number | null;
};

const EMPLOYEE_PAYMENT_FLOW_TYPES = new Set(["contract", "normal"]);

export function calculateCompanyPaymentAmount(
  benefit: BenefitPaymentLike,
): number {
  const totalAmount = benefit.amount ?? 0;
  const subsidyPercent = benefit.subsidyPercent ?? 0;
  if (!Number.isFinite(totalAmount) || totalAmount <= 0) return 0;
  return Math.max(0, Math.round((totalAmount * subsidyPercent) / 100));
}

export function calculateEmployeePaymentAmount(
  benefit: BenefitPaymentLike,
): number {
  const totalAmount = benefit.amount ?? 0;
  if (!Number.isFinite(totalAmount) || totalAmount <= 0) return 0;
  return Math.max(0, totalAmount - calculateCompanyPaymentAmount(benefit));
}

export function requiresEmployeePaymentForBenefit(
  benefit: BenefitPaymentLike | null | undefined,
): boolean {
  if (!benefit) return false;
  return (
    EMPLOYEE_PAYMENT_FLOW_TYPES.has((benefit.flowType ?? "").trim()) &&
    calculateEmployeePaymentAmount(benefit) > 0
  );
}
