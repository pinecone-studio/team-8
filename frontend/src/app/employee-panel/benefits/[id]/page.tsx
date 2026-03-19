"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ArrowRight, Building2, CheckCircle2, Clock, Copy, CreditCard, DollarSign, ExternalLink, FileText, Lock, MapPin, ShieldCheck, Users, X, XCircle } from "lucide-react";
import StatusBadge from "../../_components/benefits/StatusBadge";
import Sidebar from "../../_components/SideBar";
import BenefitRequestModal from "../../_components/benefits/BenefitRequestModal";
import PageLoading from "@/app/_components/PageLoading";
import {
  BenefitEligibilityStatus,
  BenefitFlowType,
  useGetMyBenefitsFullQuery,
  useGetBenefitRequestsQuery,
  useGetContractsForBenefitQuery,
} from "@/graphql/generated/graphql";
import {
  benefitRequiresEmployeePayment,
  type BenefitPaymentRecord,
  getBenefitPaymentDisplayStatus,
  openBenefitPaymentCheckout,
  startBenefitBonumPayment,
} from "@/lib/benefit-payments";
import { useCurrentEmployee } from "@/lib/use-current-employee";
import { getContractProxyUrl } from "@/lib/contracts";

function formatRuleLabel(value: string) {
  return value
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function ApprovalPolicyBadge({ policy }: { policy: string | null | undefined }) {
  const p = (policy ?? "hr").toLowerCase();
  if (p === "dual") {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
        <Users className="h-4 w-4" />
        HR + Finance Approval (Dual)
      </div>
    );
  }
  if (p === "finance") {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg border border-teal-100 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700">
        <ShieldCheck className="h-4 w-4" />
        Finance Approval
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
      <ShieldCheck className="h-4 w-4" />
      HR Approval
    </div>
  );
}

function formatMoney(amount: number): string {
  return `${amount.toLocaleString()}₮`;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatMnDate(date: Date): string {
  return date.toLocaleDateString("mn-MN");
}

function PaymentDetailsDialog({
  open,
  onClose,
  requestStatus,
  payment,
  benefitName,
  totalAmount,
  companyPercent,
  employeePercent,
  onSubmitPayment,
  submittingPayment,
  submitError,
}: {
  open: boolean;
  onClose: () => void;
  requestStatus: string | null;
  payment: BenefitPaymentRecord | null;
  benefitName: string;
  totalAmount: number;
  companyPercent: number;
  employeePercent: number;
  onSubmitPayment?: () => Promise<void> | void;
  submittingPayment?: boolean;
  submitError?: string | null;
}) {
  if (!open) return null;

  const companyPays = Math.round((totalAmount * companyPercent) / 100);
  const employeePays = Math.round((totalAmount * employeePercent) / 100);
  const canSubmitPayment = requestStatus === "awaiting_payment";
  const waitingForReview = requestStatus === "awaiting_payment_review";
  const paymentStatus = getBenefitPaymentDisplayStatus(payment);

  let statusTitle = "Bonum checkout";
  let statusCopy =
    "We will open a Bonum checkout page for your remaining payment amount.";
  let statusTone = "text-blue-700";

  if (paymentStatus === "created") {
    statusTitle = "Checkout ready";
    statusCopy = "Your Bonum invoice is ready. Open checkout to complete payment.";
  } else if (paymentStatus === "expired") {
    statusTitle = "Invoice expired";
    statusCopy =
      "Your previous Bonum invoice expired. Generate a fresh checkout to continue.";
    statusTone = "text-amber-700";
  } else if (paymentStatus === "failed") {
    statusTitle = "Payment failed";
    statusCopy =
      "Bonum reported a failed payment. You can retry by opening a fresh checkout.";
    statusTone = "text-red-700";
  } else if (paymentStatus === "paid") {
    statusTitle = "Payment received";
    statusCopy =
      "Your payment is already marked as paid. The benefit should activate automatically.";
    statusTone = "text-emerald-700";
  } else if (waitingForReview) {
    statusTitle = "Legacy payment review";
    statusCopy =
      "This request is waiting for HR review from the earlier manual payment flow.";
    statusTone = "text-amber-700";
  }

  const buttonLabel =
    paymentStatus === "created"
      ? "Open Bonum Checkout"
      : paymentStatus === "expired"
        ? "Create New Bonum Checkout"
        : paymentStatus === "failed"
          ? "Retry with Bonum"
          : paymentStatus === "paid"
            ? "Payment Received"
            : waitingForReview
              ? "Payment Submitted"
              : submittingPayment
                ? "Opening..."
                : "Pay with Bonum";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="pr-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <CreditCard className="h-3.5 w-3.5" />
            Bonum Payment
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">{benefitName}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Review the payment breakdown and complete your co-payment through Bonum.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Total Amount</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{formatMoney(totalAmount)}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-500">Company Pays</p>
            <p className="mt-2 text-lg font-semibold text-emerald-700">
              {formatMoney(companyPays)}
            </p>
            <p className="mt-1 text-xs text-emerald-600">{companyPercent}% covered</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-500">Your Payment</p>
            <p className="mt-2 text-lg font-semibold text-amber-700">
              {formatMoney(employeePays)}
            </p>
            <p className="mt-1 text-xs text-amber-600">{employeePercent}% to transfer</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Building2 className="h-4 w-4 text-gray-400" />
            {statusTitle}
          </div>
          <p className={`mt-3 text-sm ${statusTone}`}>{statusCopy}</p>
          {payment?.expiresAt && paymentStatus === "created" && (
            <p className="mt-2 text-xs text-gray-500">
              Expires at {new Date(payment.expiresAt).toLocaleString("mn-MN")}
            </p>
          )}
        </div>

        {waitingForReview && (
          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">Payment submitted</p>
            <p className="mt-1 text-xs text-amber-700">
              HR is now checking your transfer. Your benefit will become active only after they approve the payment.
            </p>
          </div>
        )}

        {submitError && (
          <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onSubmitPayment}
            disabled={!canSubmitPayment || submittingPayment || waitingForReview || paymentStatus === "paid"}
            className={`inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition ${
              waitingForReview || !canSubmitPayment || paymentStatus === "paid"
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            }`}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function getActiveStep(status: string): string {
  switch (status) {
    case "awaiting_contract_acceptance": return "Contract";
    case "awaiting_hr_review": return "HR Review";
    case "awaiting_finance_review": return "Finance Review";
    case "awaiting_employee_decision": return "Employee Review";
    case "hr_approved": return "Finance Review";
    case "finance_approved": return "Payment";
    case "awaiting_payment":
    case "awaiting_payment_review": return "Payment";
    case "awaiting_employee_signed_contract":
      return "Signed Contract";
    case "awaiting_final_finance_approval":
      return "Final Approval";
    case "approved": return "Approved";
    default: return "Submitted";
  }
}

function ApprovalFlow({
  policy,
  requiresContract,
  hasPayment,
  requestStatus,
  flowType,
}: {
  policy: string | null | undefined;
  requiresContract: boolean;
  hasPayment: boolean;
  requestStatus?: string | null;
  flowType?: BenefitFlowType | null;
}) {
  const p = (policy ?? "hr").toLowerCase();
  const steps = ["Submitted"];
  if (flowType === BenefitFlowType.DownPayment) {
    const financeSteps = [
      "Submitted",
      "Finance Review",
      "Employee Review",
      "Signed Contract",
      "Final Approval",
      "Approved",
    ];
    const activeStep = requestStatus ? getActiveStep(requestStatus) : null;
    const isTerminal =
      requestStatus === "approved" ||
      requestStatus === "rejected" ||
      requestStatus === "cancelled";
    const doneSteps = new Set<string>();
    if (requestStatus && !isTerminal) {
      for (const step of financeSteps) {
        if (step === activeStep) break;
        doneSteps.add(step);
      }
    }
    if (requestStatus === "approved") financeSteps.forEach((s) => doneSteps.add(s));

    return (
      <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
        <p className="mb-2 text-sm font-semibold text-gray-800">Approval Flow</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {financeSteps.map((step, i) => {
            const isActive = step === activeStep && !isTerminal;
            const isDone = doneSteps.has(step);
            return (
              <div key={step} className="flex items-center gap-1.5">
                {i > 0 && <ArrowRight className="h-3 w-3 text-gray-300 shrink-0" />}
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : isDone
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Down payment finance flow: employee accepts/signs contract only after approvals.
  if (requiresContract) {
    steps.push("Contract");
  }
  if (p === "hr" || p === "dual") steps.push("HR Review");
  if (p === "finance" || p === "dual") steps.push("Finance Review");
  if (hasPayment) steps.push("Payment");
  steps.push("Approved");

  const activeStep = requestStatus ? getActiveStep(requestStatus) : null;
  const isTerminal = requestStatus === "approved" || requestStatus === "rejected" || requestStatus === "cancelled";

  const doneSteps = new Set<string>();
  if (requestStatus && !isTerminal) {
    for (const step of steps) {
      if (step === activeStep) break;
      doneSteps.add(step);
    }
  }
  if (requestStatus === "approved") steps.forEach((s) => doneSteps.add(s));

  return (
    <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <p className="mb-2 text-sm font-semibold text-gray-800">Approval Flow</p>
      <div className="flex flex-wrap items-center gap-1.5">
        {steps.map((step, i) => {
          const isActive = step === activeStep && !isTerminal;
          const isDone = doneSteps.has(step);
          return (
            <div key={step} className="flex items-center gap-1.5">
              {i > 0 && <ArrowRight className="h-3 w-3 text-gray-300 shrink-0" />}
              <span
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : isDone
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NextStepsBox({
  status,
  benefitId,
  failedRuleError,
  approvalPolicy,
  requiresContract,
  flowType,
  requestStatus,
  awaitingContract,
  onRequestBenefit,
  onOpenPayment,
}: {
  status: string;
  benefitId: string;
  failedRuleError?: string | null;
  approvalPolicy?: string | null;
  requiresContract: boolean;
  flowType?: BenefitFlowType | null;
  requestStatus?: string | null;
  awaitingContract?: boolean;
  onRequestBenefit?: () => void;
  onOpenPayment?: () => void;
}) {
  const p = (approvalPolicy ?? "hr").toLowerCase();
  const isSelfService = flowType === BenefitFlowType.SelfService;
  const isScreenTime = flowType === BenefitFlowType.ScreenTime;

  // Pending sub-state: employee must accept a contract before review can proceed
  if (
    status === "PENDING" &&
    awaitingContract &&
    flowType !== BenefitFlowType.DownPayment
  ) {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <FileText className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Contract acceptance required</p>
            <p className="mt-0.5 text-amber-700">
              Your request is waiting for you to review and accept the vendor contract before it can proceed.
            </p>
          </div>
        </div>
        <Link
          href="/employee-panel/requests"
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-amber-600 text-sm font-semibold text-white transition hover:bg-amber-700 active:scale-[0.98]"
        >
          Review &amp; Accept Contract →
        </Link>
      </div>
    );
  }

  if (status === "ELIGIBLE") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-500">
          You meet all eligibility requirements.{" "}
          {isScreenTime
            ? "Open the monthly tracker and upload your 7-day average screenshot on each Monday slot."
            : flowType === BenefitFlowType.DownPayment
              ? "Enter your loan amount and repayment months. After HR and Finance approve, you will download, sign, and upload the contract."
              : requiresContract
                ? "You will be asked to accept a vendor contract as part of the request."
                : "Your request will go through an approval process."}
        </p>
        {isScreenTime ? (
          <Link
            href={`/employee-panel/screen-time/${benefitId}`}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-fuchsia-600 text-sm font-semibold text-white transition hover:bg-fuchsia-700 active:scale-[0.98]"
          >
            Open Monthly Tracker
          </Link>
        ) : onRequestBenefit ? (
          <button
            type="button"
            onClick={onRequestBenefit}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Request Benefit
          </button>
        ) : (
          <Link
            href={`/employee-panel/benefits/${benefitId}/request`}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Request Benefit
          </Link>
        )}
      </div>
    );
  }

  if (status === "LOCKED") {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Eligibility requirements not met</p>
            {failedRuleError && <p className="mt-1 text-red-600">{failedRuleError}</p>}
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Contact HR if you believe this is incorrect or if circumstances have changed.
        </p>
      </div>
    );
  }

  if (status === "ACTIVE") {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-medium">Benefit is active</p>
          <p className="mt-0.5 text-green-600">
            {isSelfService
              ? "You meet the requirements, so this benefit is visible automatically."
              : "You are currently enrolled in this benefit."}
          </p>
        </div>
      </div>
    );
  }

  if (status === "PENDING") {
    if (
      flowType === BenefitFlowType.DownPayment &&
      requestStatus === "awaiting_employee_signed_contract" &&
      onRequestBenefit
    ) {
      return (
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <div>
              <p className="font-medium">HR and Finance approved your request</p>
              <p className="mt-0.5 text-emerald-700">
                Continue to download the contract, sign it, and upload your signed copy to finish enrollment.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRequestBenefit}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
          >
            Sign &amp; upload contract
          </button>
        </div>
      );
    }

    if (requestStatus === "awaiting_payment" && onOpenPayment) {
      return (
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
            <CreditCard className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">Payment required</p>
              <p className="mt-0.5 text-blue-700">
                HR approved your request. Complete your Bonum payment and the benefit will activate automatically.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenPayment}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Open Payment Details
          </button>
        </div>
      );
    }

    if (requestStatus === "awaiting_payment_review") {
      return (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">
            <Clock className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">Waiting for payment verification</p>
              <p className="mt-0.5 text-amber-600">
                This request is still in the legacy manual-payment review flow.
              </p>
            </div>
          </div>
        );
    }

    const waiting =
      p === "hr" ? "HR team" : p === "finance" ? "Finance team" : "HR and Finance teams";
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-700">
        <Clock className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-medium">Awaiting approval</p>
          <p className="mt-0.5 text-orange-600">
            Your request is being reviewed by the {waiting}. No action needed from you right now.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export default function BenefitDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getToken } = useAuth();
  const id = params.id as string;
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentSubmitError, setPaymentSubmitError] = useState<string | null>(null);
  const { employee, loading: employeeLoading } = useCurrentEmployee();
  const { data, error, loading, refetch: refetchBenefits } = useGetMyBenefitsFullQuery({
    fetchPolicy: "cache-and-network",
  });
  const { data: requestsData, refetch: refetchRequests } = useGetBenefitRequestsQuery({
    fetchPolicy: "cache-and-network",
  });
  const { data: contractsData } = useGetContractsForBenefitQuery({ variables: { benefitId: id } });

  const benefitEligibility = data?.myBenefits.find((item: { benefitId: string }) => item.benefitId === id);

  // Find the latest request for this benefit to detect sub-states (e.g. awaiting_contract_acceptance)
  const latestRequest = requestsData?.benefitRequests
    .filter((r) => r.benefitId === id)
    .sort((a, b) =>
      new Date(b.updatedAt ?? b.createdAt).getTime() -
      new Date(a.updatedAt ?? a.createdAt).getTime(),
    )[0];
  const awaitingContract = latestRequest?.status === "awaiting_contract_acceptance";

  // If HR/Finance approved while the page is open, the latest request status
  // can take a moment to reflect on this screen. Poll only for the
  // down_payment flow while the request is still in-flight.
  useEffect(() => {
    if (benefitEligibility?.benefit?.flowType !== BenefitFlowType.DownPayment)
      return;
    if (benefitEligibility.status !== BenefitEligibilityStatus.Pending) return;
    const status = latestRequest?.status;
    if (!status) return;
    if (["approved", "rejected", "cancelled"].includes(status)) return;

    const intervalId = window.setInterval(() => {
      void refetchRequests();
      void refetchBenefits();
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [
    benefitEligibility?.benefit?.flowType,
    benefitEligibility?.status,
    latestRequest?.status,
    refetchRequests,
    refetchBenefits,
  ]);

  if (employeeLoading || loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 flex-col items-center">
          <main className="flex w-full max-w-7xl items-center justify-center p-8">
            <PageLoading message="Loading benefit details…" />
          </main>
        </div>
      </div>
    );
  }

  if (error || !benefitEligibility) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 flex-col items-center">
          <main className="w-full max-w-7xl p-8">
            <Link href="/employee-panel/mybenefits" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              ← Back to Benefits
            </Link>
            <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-destructive">
              Benefit data could not be loaded.
            </div>
          </main>
        </div>
      </div>
    );
  }

  const benefit = benefitEligibility.benefit;
  const vendor = benefit.vendorName ?? "Internal Benefit";
  const policy = benefit.approvalPolicy ?? "hr";
  const hasPayment = benefitRequiresEmployeePayment(benefit);
  const latestRequestStatus = latestRequest?.status?.toLowerCase() ?? null;
  const latestPayment = latestRequest?.payment ?? null;

  // Down payment/loan "eligibility" includes repayment-time logic:
  // you can request a new loan only after all previously approved down_payment
  // loans are fully repaid (repayment end = employeeApprovedAt + repaymentMonths).
  const activeApprovedDownPaymentLoan = (() => {
    const all = requestsData?.benefitRequests ?? [];
    const approvedLoans = all
      .filter(
        (r) =>
          r.status === "approved" &&
          Boolean(r.employeeApprovedAt) &&
          r.repaymentMonths != null &&
          Number(r.repaymentMonths) > 0,
      )
      .map((r) => {
        const start = new Date(r.employeeApprovedAt as string);
        const termMonths = Number(r.repaymentMonths);
        return { ...r, repaidAt: addMonths(start, termMonths) };
      });

    if (!approvedLoans.length) return null;

    const now = new Date();
    const notFullyRepaid = approvedLoans
      .filter((r) => r.repaidAt.getTime() > now.getTime())
      .sort((a, b) => a.repaidAt.getTime() - b.repaidAt.getTime());

    return notFullyRepaid[0] ?? null;
  })();

  const hasActiveDownPaymentLoan = Boolean(activeApprovedDownPaymentLoan);

  const latestApprovedDownPaymentLoan = (() => {
    const all = requestsData?.benefitRequests ?? [];
    const approvedLoans = all
      .filter(
        (r) =>
          r.status === "approved" &&
          Boolean(r.employeeApprovedAt) &&
          r.repaymentMonths != null &&
          Number(r.repaymentMonths) > 0,
      )
      .map((r) => {
        const start = new Date(r.employeeApprovedAt as string);
        const termMonths = Number(r.repaymentMonths);
        return { ...r, repaidAt: addMonths(start, termMonths) };
      })
      .sort((a, b) => {
        const aStart = new Date(a.employeeApprovedAt as string).getTime();
        const bStart = new Date(b.employeeApprovedAt as string).getTime();
        return bStart - aStart;
      });

    return approvedLoans[0] ?? null;
  })();

  const nowForRepayment = new Date();
  const repaymentStarted = Boolean(latestApprovedDownPaymentLoan);
  const repaymentDone = repaymentStarted
    ? (latestApprovedDownPaymentLoan?.repaidAt as Date).getTime() <=
      nowForRepayment.getTime()
    : false;
  const repaymentActive = repaymentStarted && !repaymentDone;
  const canRequestDownPayment =
    benefit.flowType === BenefitFlowType.DownPayment &&
    !hasActiveDownPaymentLoan &&
    (benefitEligibility.status === "ELIGIBLE" ||
      benefitEligibility.status === "ACTIVE");

  const canOpenFinanceContractFlow =
    benefit.flowType === BenefitFlowType.DownPayment &&
    benefitEligibility.status === BenefitEligibilityStatus.Pending &&
    [
      "awaiting_employee_decision",
      "awaiting_employee_signed_contract",
      "awaiting_final_finance_approval",
    ].includes(latestRequest?.status ?? "");
  const shouldShowPaymentDialogTrigger =
    hasPayment &&
    (latestRequestStatus === "awaiting_payment" || latestRequestStatus === "awaiting_payment_review");

  const handleSubmitPayment = async () => {
    if (!latestRequest?.id) return;
    setSubmittingPayment(true);
    setPaymentSubmitError(null);
    try {
      const payment = await startBenefitBonumPayment(latestRequest.id, getToken);
      await Promise.all([refetchRequests(), refetchBenefits()]);
      setPaymentDialogOpen(false);
      if (payment.checkoutUrl) {
        openBenefitPaymentCheckout(payment.checkoutUrl);
      } else {
        throw new Error("Bonum checkout URL was not returned.");
      }
    } catch (err) {
      setPaymentSubmitError(err instanceof Error ? err.message : "Failed to start Bonum payment.");
    } finally {
      setSubmittingPayment(false);
    }
  };
  const isSelfService = benefit.flowType === "self_service";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-5xl p-8">
          <Link
            href="/employee-panel/requests"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back
          </Link>

          {benefit.amount == null ? (
            /* ── Simple layout for non-payment benefits ── */
            <div className="mt-6 max-w-2xl rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{benefit.name}</h1>
                  <p className="mt-0.5 text-sm text-gray-500">{vendor}</p>
                </div>
                <StatusBadge status={benefitEligibility.status} />
              </div>

              {benefit.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}/api/benefits/image?key=${encodeURIComponent(benefit.imageUrl)}`}
                  alt={benefit.name}
                  className="mt-4 h-44 w-full rounded-xl object-cover"
                />
              )}

              {(benefit.description ?? benefit.optionsDescription) && (
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  {benefit.description ?? benefit.optionsDescription}
                </p>
              )}

              {benefit.location && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                  <span className="text-sm text-gray-700">{benefit.location}</span>
                </div>
              )}

              {/* Eligibility / status indicator */}
              <div className="mt-5">
                {benefit.flowType === BenefitFlowType.DownPayment ? (
                  hasActiveDownPaymentLoan ? (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                        <p className="text-sm font-medium text-red-700">
                          Loan repayment in progress
                        </p>
                      </div>
                      <p className="mt-2 text-xs text-red-400">
                        You can request again after{" "}
                        {activeApprovedDownPaymentLoan?.repaidAt
                          ? formatMnDate(
                              activeApprovedDownPaymentLoan.repaidAt,
                            )
                          : "the repayment ends"}.
                      </p>
                    </div>
                  ) : benefitEligibility.status === "ACTIVE" ? (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      <p className="text-sm font-medium text-emerald-800">
                        Your previous loan is fully repaid. You can request
                        a new loan now.
                      </p>
                    </div>
                  ) : benefitEligibility.status === "LOCKED" ? (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                        <p className="text-sm font-medium text-red-700">
                          {benefitEligibility.failedRule?.errorMessage ??
                            "You do not meet the eligibility requirements for this benefit."}
                        </p>
                      </div>
                      <p className="mt-2 text-xs text-red-400">
                        Contact HR if you believe this is incorrect.
                      </p>
                    </div>
                  ) : benefitEligibility.status === "PENDING" ? (
                    latestRequestStatus === "awaiting_employee_decision" ? (
                      <div className="rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-600" />
                          <p className="text-sm font-medium text-cyan-800">
                            Finance offer ready for your review
                          </p>
                        </div>
                        <p className="mt-2 text-xs text-cyan-700">
                          Review the offer terms and the attached contract, then accept or decline.
                        </p>
                      </div>
                    ) : latestRequestStatus ===
                        "awaiting_employee_signed_contract" ? (
                      <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 shrink-0 text-violet-600" />
                          <p className="text-sm font-medium text-violet-800">
                            Upload your signed contract
                          </p>
                        </div>
                        <p className="mt-2 text-xs text-violet-700">
                          You accepted the finance offer. Upload the signed contract to continue.
                        </p>
                      </div>
                    ) : latestRequestStatus ===
                        "awaiting_final_finance_approval" ? (
                      <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 shrink-0 text-indigo-600" />
                          <p className="text-sm font-medium text-indigo-800">
                            Waiting for final finance approval
                          </p>
                        </div>
                        <p className="mt-2 text-xs text-indigo-700">
                          Your signed contract was uploaded. A finance manager will activate the benefit after the final review.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                        <Clock className="h-4 w-4 shrink-0 text-amber-600" />
                        <p className="text-sm font-medium text-amber-800">
                          Your request is being reviewed by Finance.
                        </p>
                      </div>
                    )
                  ) : null
                ) : benefitEligibility.status === "LOCKED" ? (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                      <p className="text-sm font-medium text-red-700">
                        {benefitEligibility.failedRule?.errorMessage ??
                          "You do not meet the eligibility requirements for this benefit."}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-red-400">
                      Contact HR if you believe this is incorrect.
                    </p>
                  </div>
                ) : benefitEligibility.status === "PENDING" ? (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                    <Clock className="h-4 w-4 shrink-0 text-amber-600" />
                    <p className="text-sm font-medium text-amber-800">
                      Your request is being reviewed.
                    </p>
                  </div>
                ) : benefitEligibility.status === "ACTIVE" ? (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <p className="text-sm font-medium text-emerald-800">
                      {isSelfService
                        ? "This benefit is active for you automatically."
                        : "You are currently enrolled in this benefit."}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Loan cycle (request → eligibility → approval → repayment) */}
              {benefit.flowType === BenefitFlowType.DownPayment && (
                <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-gray-800">
                    Loan cycle
                  </p>
                  <div className="mt-3 space-y-2 text-sm">
                    {(() => {
                      const latestRequestExists = Boolean(latestRequest);
                      const requestState: "done" | "active" | "waiting" =
                        latestRequestExists
                          ? "done"
                          : canRequestDownPayment
                            ? "active"
                            : "waiting";
                      const eligibilityState: "done" | "active" | "waiting" =
                        benefitEligibility.status === "ELIGIBLE" ||
                        benefitEligibility.status === "ACTIVE"
                          ? "done"
                          : "waiting";
                      const approvalDone =
                        latestRequestStatus ===
                          "awaiting_employee_decision" ||
                        latestRequestStatus ===
                          "awaiting_employee_signed_contract" ||
                        latestRequestStatus ===
                          "awaiting_final_finance_approval" ||
                        latestRequestStatus === "approved";
                      const approvalState: "done" | "active" | "waiting" =
                        approvalDone
                          ? "done"
                          : latestRequestExists
                            ? "active"
                            : "waiting";
                      const repaymentState: "done" | "active" | "waiting" =
                        repaymentDone ? "done" : repaymentActive ? "active" : "waiting";

                      const pillClass = (s: "done" | "active" | "waiting") =>
                        s === "done"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : s === "active"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-gray-50 text-gray-500 border border-gray-200";

                      const pillText = (
                        s: "done" | "active" | "waiting",
                        label: string,
                      ) =>
                        s === "done"
                          ? `✓ ${label}`
                          : s === "active"
                            ? label
                            : `Waiting: ${label}`;

                      return (
                        <>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-700">Хүсэлт</span>
                            <span
                              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${pillClass(requestState)}`}
                            >
                              {pillText(requestState, "Submitted")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-700">Шалгуур</span>
                            <span
                              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${pillClass(eligibilityState)}`}
                            >
                              {pillText(eligibilityState, "Eligible")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-700">Батлах</span>
                            <span
                              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${pillClass(approvalState)}`}
                            >
                              {pillText(approvalState, "Approved")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-700">Эргэн төлөлт</span>
                            <span
                              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${pillClass(repaymentState)}`}
                            >
                              {pillText(
                                repaymentState,
                                repaymentActive ? "In progress" : "Done",
                              )}
                            </span>
                          </div>

                          {repaymentActive &&
                            latestApprovedDownPaymentLoan?.repaidAt && (
                              <div className="text-xs text-amber-800 pt-1">
                                Repayment ends on{" "}
                                <span className="font-semibold">
                                  {formatMnDate(
                                    latestApprovedDownPaymentLoan.repaidAt as Date,
                                  )}
                                </span>
                                .
                              </div>
                            )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Request button */}
              {!isSelfService &&
                (benefit.flowType === BenefitFlowType.DownPayment ? (
                  canRequestDownPayment || canOpenFinanceContractFlow ? (
                    <button
                      type="button"
                      onClick={() => setRequestModalOpen(true)}
                      className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                    >
                      {latestRequestStatus === "awaiting_employee_decision"
                        ? "Review Finance Offer"
                        : latestRequestStatus ===
                            "awaiting_employee_signed_contract"
                          ? "Upload Signed Contract"
                          : latestRequestStatus ===
                              "awaiting_final_finance_approval"
                            ? "View Finance Status"
                            : "Request Benefit"}
                    </button>
                  ) : null
                ) : benefitEligibility.status === "ELIGIBLE" ? (
                  <button
                    type="button"
                    onClick={() => setRequestModalOpen(true)}
                    className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                  >
                    Request Benefit
                  </button>
                ) : null)}
            </div>
          ) : (
            /* ── Full layout for payment benefits ── */
            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
              {/* Left: benefit info */}
              <div className="space-y-5">
                {/* Header card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">{benefit.name}</h1>
                      <p className="mt-0.5 text-sm text-gray-500">{vendor}</p>
                    </div>
                    <StatusBadge status={benefitEligibility.status} />
                  </div>

                  {benefit.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}/api/benefits/image?key=${encodeURIComponent(benefit.imageUrl)}`}
                      alt={benefit.name}
                      className="mt-4 h-44 w-full rounded-xl object-cover"
                    />
                  )}

                  {(benefit.description ?? benefit.optionsDescription) && (
                    <p className="mt-4 text-sm leading-relaxed text-gray-600">
                      {benefit.description ?? benefit.optionsDescription}
                    </p>
                  )}

                  {/* Contribution split */}
                  <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Total Price</p>
                      <div className="mt-1 flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <p className="text-2xl font-bold text-gray-800">{benefit.amount!.toLocaleString()}₮</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Company covers</p>
                      <p className="mt-1 text-2xl font-bold text-emerald-600">{benefit.subsidyPercent}%</p>
                      <p className="text-xs text-emerald-600">
                        {Math.round(benefit.amount! * benefit.subsidyPercent / 100).toLocaleString()}₮
                      </p>
                    </div>
                  </div>

                  {benefit.location && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                      <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="text-sm text-gray-700">{benefit.location}</span>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-3">
                    <ApprovalPolicyBadge policy={policy} />
                    {benefit.requiresContract && (
                      <div className="inline-flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
                        <FileText className="h-4 w-4" />
                        Contract Required
                      </div>
                    )}
                  </div>

                  <ApprovalFlow
                    policy={policy}
                    requiresContract={benefit.requiresContract}
                    hasPayment={hasPayment}
                    requestStatus={latestRequest?.status}
                    flowType={benefit.flowType}
                  />
                </div>
              </div>

              <div className="space-y-5 self-start">
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h2 className="text-base font-semibold text-gray-900">Eligibility Status</h2>
                  <div className="mt-4">
                    {benefitEligibility.status === "ELIGIBLE" ? (
                      <div className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <p className="text-sm font-medium text-emerald-800">You are eligible for this benefit</p>
                      </div>
                    ) : benefitEligibility.status === "ACTIVE" ? (
                      <div className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <p className="text-sm font-medium text-emerald-800">This benefit is already active for you</p>
                      </div>
                    ) : benefitEligibility.status === "LOCKED" ? (
                      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4">
                        <p className="mb-3 text-sm font-semibold text-red-700">The following requirements were not met:</p>
                        <div className="space-y-2">
                          {benefitEligibility.ruleEvaluation
                            .filter((r: { passed: boolean }) => !r.passed)
                            .map((item: { ruleType: string; reason: string }) => (
                              <div key={item.ruleType} className="flex items-start gap-2.5">
                                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                                <div>
                                  <p className="text-sm font-medium text-red-800">{formatRuleLabel(item.ruleType)}</p>
                                  <p className="text-xs text-red-600">{item.reason}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                        {benefitEligibility.failedRule?.errorMessage && (
                          <p className="mt-3 rounded-lg bg-red-100 px-3 py-2 text-xs text-red-600">
                            {benefitEligibility.failedRule.errorMessage}
                          </p>
                        )}
                        <p className="mt-3 text-xs text-red-400">
                          Contact HR if you believe this is incorrect or if circumstances have changed.
                        </p>
                      </div>
                    ) : benefitEligibility.ruleEvaluation.length === 0 ? (
                      <p className="text-sm text-gray-400">No eligibility rules configured for this benefit.</p>
                    ) : (
                      <div className="flex items-center gap-2.5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                        <Clock className="h-4 w-4 shrink-0 text-amber-600" />
                        <p className="text-sm font-medium text-amber-800">Your request is currently being reviewed.</p>
                      </div>
                    )}
                  </div>
                </div>

                {benefit.requiresContract && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h2 className="text-base font-semibold text-gray-900">Contract</h2>
                    {contractsData?.contracts && contractsData.contracts.length > 0 ? (
                      <div className="mt-3 space-y-2">
                        {contractsData.contracts.map((c) => (
                          <div key={c.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                            <FileText className="h-4 w-4 shrink-0 text-gray-500" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800">
                                {c.vendorName} — v{c.version}
                                {c.isActive && (
                                  <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">Active</span>
                                )}
                              </p>
                              <p className="text-xs text-gray-400">{c.effectiveDate} – {c.expiryDate}</p>
                            </div>
                            {c.viewUrl && (
                              <a
                                href={getContractProxyUrl(c.viewUrl) ?? c.viewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
                              >
                                View <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                        <FileText className="h-4 w-4 shrink-0 text-amber-600" />
                        <p className="text-sm text-amber-800">
                          Contract has not been uploaded yet. You will be able to review it when you submit a request.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h2 className="text-base font-semibold text-gray-900">Next Steps</h2>
                  <div className="mt-4">
                    <NextStepsBox
                      status={benefitEligibility.status}
                      benefitId={benefitEligibility.benefitId}
                      failedRuleError={benefitEligibility.failedRule?.errorMessage}
                      approvalPolicy={policy}
                      requiresContract={benefit.requiresContract}
                      flowType={benefit.flowType}
                      requestStatus={latestRequestStatus}
                      awaitingContract={awaitingContract}
                      onRequestBenefit={() => setRequestModalOpen(true)}
                      onOpenPayment={() => {
                        setPaymentSubmitError(null);
                        setPaymentDialogOpen(true);
                      }}
                    />
                  </div>
                  {shouldShowPaymentDialogTrigger && (
                    <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <p className="text-sm font-semibold text-blue-900">
                        {latestRequestStatus === "awaiting_payment_review" ? "Payment Submitted" : "Payment Ready"}
                      </p>
                      <p className="mt-1 text-xs text-blue-700">
                        {latestRequestStatus === "awaiting_payment_review"
                          ? "HR is checking your payment now. You can still reopen the details if you need them."
                          : "Your request passed approval. Open Bonum checkout and your benefit will activate automatically once the payment succeeds."}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentSubmitError(null);
                          setPaymentDialogOpen(true);
                        }}
                        className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        {latestRequestStatus === "awaiting_payment_review" ? "Төлбөрийн мэдээлэл харах" : "Төлбөр төлөх"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      {requestModalOpen &&
        benefit.flowType !== BenefitFlowType.ScreenTime &&
        (benefitEligibility.status === BenefitEligibilityStatus.Eligible ||
          canRequestDownPayment ||
          canOpenFinanceContractFlow) && (
        <BenefitRequestModal
          benefitId={id}
          onClose={() => setRequestModalOpen(false)}
          onSuccess={() => {
            setRequestModalOpen(false);
            router.push("/employee-panel/requests?submitted=true");
          }}
        />
      )}
      {benefit.amount != null && (
        <PaymentDetailsDialog
          open={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          requestStatus={latestRequestStatus}
          payment={latestPayment}
          benefitName={benefit.name}
          totalAmount={benefit.amount}
          companyPercent={benefit.subsidyPercent}
          employeePercent={benefit.employeePercent}
          onSubmitPayment={handleSubmitPayment}
          submittingPayment={submittingPayment}
          submitError={paymentSubmitError}
        />
      )}
    </div>
  );
}
