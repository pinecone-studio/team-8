"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Building2, Check, Copy, CreditCard, Eye, ExternalLink, FileCheck, X } from "lucide-react";
import Sidebar from "../_components/SideBar";
import {
  useGetBenefitRequestsQuery,
  useGetBenefitsQuery,
  useCancelBenefitRequestMutation,
  useConfirmBenefitRequestMutation,
  GetBenefitRequestsDocument,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/use-current-employee";
import { getContractProxyUrl } from "@/lib/contracts";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";

// ── Constants ──────────────────────────────────────────────────────────────

const CANCELLABLE_STATUSES = new Set([
  "pending",
  "awaiting_contract_acceptance",
  "awaiting_hr_review",
  "awaiting_finance_review",
  "awaiting_payment",
  "awaiting_payment_review",
]);

function getApiBase(): string {
  const base =
    typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GRAPHQL_URL
      ? process.env.NEXT_PUBLIC_GRAPHQL_URL
      : "https://team8-api.team8pinequest.workers.dev/";
  return base.replace(/\/$/, "");
}

const PAYMENT_ACCOUNT_DETAILS = {
  bankName: "PineQuest Corporate Account",
  accountNumber: "0000 0000 0000",
  accountHolder: "PineQuest LLC",
} as const;

function formatMoney(amount: number): string {
  return `${amount.toLocaleString("mn-MN")}₮`;
}

// ── Status helpers ─────────────────────────────────────────────────────────

function normalizeRequestStatus(status: string): string {
  return status.toLowerCase().trim();
}

type StatusBadgeConfig = {
  label: string;
  className: string;
};

function getStatusBadgeConfig(status: string): StatusBadgeConfig {
  const s = normalizeRequestStatus(status);
  switch (s) {
    case "approved":
      return { label: "Approved", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" };
    case "rejected":
      return { label: "Rejected", className: "bg-red-50 text-red-600 border border-red-200" };
    case "declined":
      return { label: "Declined", className: "bg-red-50 text-red-600 border border-red-200" };
    case "cancelled":
      return { label: "Cancelled", className: "bg-gray-100 text-gray-500 border border-gray-200" };
    case "hr_approved":
      return { label: "HR Approved", className: "bg-teal-50 text-teal-700 border border-teal-200" };
    case "finance_approved":
      return { label: "Finance Approved", className: "bg-teal-50 text-teal-700 border border-teal-200" };
    case "awaiting_payment":
      return { label: "Payment Required", className: "bg-blue-50 text-blue-700 border border-blue-200" };
    case "awaiting_payment_review":
      return { label: "Payment Review", className: "bg-indigo-50 text-indigo-700 border border-indigo-200" };
    case "awaiting_contract_acceptance":
      return { label: "Contract Pending", className: "bg-amber-50 text-amber-700 border border-amber-200" };
    case "awaiting_hr_review":
      return { label: "HR Review", className: "bg-amber-50 text-amber-700 border border-amber-200" };
    case "awaiting_finance_review":
      return { label: "Finance Review", className: "bg-amber-50 text-amber-700 border border-amber-200" };
    case "pending":
      return { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-200" };
    default:
      return {
        label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " "),
        className: "bg-gray-50 text-gray-600 border border-gray-200",
      };
  }
}

function getCardAccentClass(status: string): string {
  const s = normalizeRequestStatus(status);
  if (s === "approved" || s === "finance_approved") return "border-l-emerald-400";
  if (s === "rejected" || s === "declined" || s === "cancelled") return "border-l-red-300";
  if (s === "hr_approved") return "border-l-teal-400";
  if (s === "awaiting_payment") return "border-l-blue-400";
  if (s === "awaiting_payment_review") return "border-l-indigo-400";
  if (s === "awaiting_contract_acceptance") return "border-l-amber-400";
  return "border-l-amber-400";
}

function canCancelRequest(status: string): boolean {
  return CANCELLABLE_STATUSES.has(normalizeRequestStatus(status));
}

function getStatusTooltip(status: string): string | null {
  switch (normalizeRequestStatus(status)) {
    case "awaiting_hr_review":
      return "Your request is in the HR review queue. The HR team will process it shortly — no action needed from you.";
    case "awaiting_finance_review":
      return "Your request is in the Finance review queue. The Finance team will process it — no action needed from you.";
    case "hr_approved":
      return "HR has approved its review step. If Finance approval is still required, the request continues there.";
    case "finance_approved":
      return "Finance approved its review step. If payment is required, you can complete the transfer next.";
    case "awaiting_payment":
      return "Your request is approved for payment. Open the benefit details, pay your share, then mark it as paid.";
    case "awaiting_payment_review":
      return "You marked the payment as sent. HR is verifying the transfer before activation.";
    case "cancelled":
      return "This request was cancelled.";
    default:
      return null;
  }
}

// ── Timeline ───────────────────────────────────────────────────────────────

type StepState = "done" | "active" | "waiting" | "failed";
type TimelineStep = { id: string; label: string; state: StepState };

function buildTimeline(
  status: string,
  policy: string | null | undefined,
  requiresContract: boolean | null | undefined,
  hasPayment: boolean,
): TimelineStep[] {
  const p = (policy ?? "hr").toLowerCase();
  const rc = requiresContract ?? false;
  const isRejected = status === "rejected";
  const isDeclined = status === "declined";
  const isCancelled = status === "cancelled";
  const isTerminal = isRejected || isDeclined || isCancelled;

  const stepIds: string[] = ["submitted"];
  if (rc) stepIds.push("contract");
  if (p === "hr" || p === "dual") stepIds.push("hr_review");
  if (p === "finance" || p === "dual") stepIds.push("finance_review");
  if (hasPayment) stepIds.push("payment");
  stepIds.push("done");

  let activeIdx: number;
  switch (status) {
    case "awaiting_contract_acceptance":
      activeIdx = stepIds.indexOf("contract");
      break;
    case "awaiting_hr_review":
      activeIdx = stepIds.indexOf("hr_review");
      break;
    case "awaiting_finance_review":
      activeIdx = stepIds.indexOf("finance_review");
      break;
    case "hr_approved":
      activeIdx = p === "dual"
        ? stepIds.indexOf("finance_review")
        : hasPayment
          ? stepIds.indexOf("payment")
          : stepIds.length;
      break;
    case "finance_approved":
      activeIdx = hasPayment ? stepIds.indexOf("payment") : stepIds.length;
      break;
    case "awaiting_payment":
    case "awaiting_payment_review":
      activeIdx = stepIds.indexOf("payment");
      break;
    case "approved":
    case "rejected":
    case "declined":
    case "cancelled":
      activeIdx = stepIds.length;
      break;
    default:
      activeIdx = Math.max(
        1,
        stepIds.indexOf("hr_review") >= 0
          ? stepIds.indexOf("hr_review")
          : stepIds.indexOf("finance_review"),
      );
  }

  const doneLabel = isRejected
    ? "Rejected"
    : isDeclined
      ? "Declined"
      : isCancelled
        ? "Cancelled"
        : "Approved";

  const LABELS: Record<string, string> = {
    submitted: "Submitted",
    contract: "Contract",
    hr_review: "HR Review",
    finance_review: "Finance",
    payment: "Payment",
    done: doneLabel,
  };

  return stepIds.map((id, idx): TimelineStep => {
    let state: StepState;
    if (status === "approved") {
      state = "done";
    } else if (isTerminal && id === "done") {
      state = "failed";
    } else if (idx < activeIdx) {
      state = "done";
    } else if (idx === activeIdx) {
      state = "active";
    } else {
      state = "waiting";
    }
    return { id, label: LABELS[id] ?? id, state };
  });
}

function TimelineDot({ state }: { state: StepState }) {
  if (state === "done") {
    return (
      <span
        aria-hidden="true"
        className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shrink-0"
      >
        <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
      </span>
    );
  }
  if (state === "active") {
    return (
      <span
        aria-hidden="true"
        className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 ring-4 ring-amber-100/70 shrink-0"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      </span>
    );
  }
  if (state === "failed") {
    return (
      <span
        aria-hidden="true"
        className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500 shrink-0"
      >
        <X className="h-2.5 w-2.5" strokeWidth={2.5} />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-200 bg-white shrink-0"
    />
  );
}

function RequestTimeline({
  status,
  policy,
  requiresContract,
  hasPayment,
}: {
  status: string;
  policy: string | null | undefined;
  requiresContract: boolean | null | undefined;
  hasPayment: boolean;
}) {
  const steps = useMemo(
    () => buildTimeline(status, policy, requiresContract, hasPayment),
    [status, policy, requiresContract, hasPayment],
  );

  return (
    <div className="flex items-start">
      {steps.map((step, i) => (
        <Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1 shrink-0">
            <TimelineDot state={step.state} />
            <span
              className={`text-[10px] font-medium whitespace-nowrap leading-tight text-center ${
                step.state === "active"
                  ? "text-amber-600"
                  : step.state === "done"
                    ? "text-emerald-500"
                    : step.state === "failed"
                      ? "text-red-500"
                      : "text-gray-300"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              aria-hidden="true"
              className={`flex-1 h-px mt-2.5 mx-2 rounded-full ${
                step.state === "done" ? "bg-emerald-200" : "bg-gray-200"
              }`}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}

// ── Request Card Skeleton ──────────────────────────────────────────────────

function RequestCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 border-l-4 border-l-slate-200 bg-white shadow-sm">
      {/* Top section: title · status badge · reviewer · date */}
      <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3">
        <div className="flex-1 space-y-1.5">
          {/* Benefit title — wide bar */}
          <div className="h-4 w-3/5 rounded-full bg-slate-200/80 animate-pulse" />
          {/* Status badge pill */}
          <div className="flex items-center gap-2 pt-0.5">
            <div className="h-5 w-24 rounded-full bg-slate-200/80 animate-pulse" />
          </div>
          {/* Reviewer sub-row: dot + "Reviewed by …" */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200/80 animate-pulse shrink-0" />
            <div className="h-2.5 w-32 rounded-full bg-slate-200/80 animate-pulse" />
          </div>
        </div>
        {/* Date block — right-aligned: date value + "submitted" label */}
        <div className="shrink-0 space-y-1.5 text-right">
          <div className="h-3 w-20 rounded-full bg-slate-200/80 animate-pulse ml-auto" />
          <div className="h-2 w-14 rounded-full bg-slate-200/80 animate-pulse ml-auto" />
        </div>
      </div>

      {/* Bottom row: timeline + action buttons */}
      <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 px-5 py-3.5">
        {/* Timeline: circle dot + label text under each step */}
        <div className="flex-1 min-w-[160px] flex items-start gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Fragment key={i}>
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="h-5 w-5 rounded-full bg-slate-200/80 animate-pulse" />
                <div className="h-2 w-10 rounded-full bg-slate-200/80 animate-pulse" />
              </div>
              {i < 3 && <div className="flex-1 h-px bg-slate-200/80 animate-pulse mt-2.5" />}
            </Fragment>
          ))}
        </div>
        {/* Buttons: Cancel Request + View Benefit */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-1.5">
            <div className="h-3 w-24 rounded-full bg-slate-200/80 animate-pulse" />
          </div>
          <div className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-1.5">
            <div className="h-3 w-3 rounded-sm bg-slate-200/80 animate-pulse shrink-0" />
            <div className="h-3 w-16 rounded-full bg-slate-200/80 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Contract Accept Modal ──────────────────────────────────────────────────

type ContractModalState = {
  requestId: string;
  benefitLabel: string;
  viewContractUrl: string | null | undefined;
  requiresContract: boolean;
};

type PaymentModalState = {
  requestId: string;
  benefitName: string;
  requestStatus: string;
  totalAmount: number;
  companyPays: number;
  employeePays: number;
  companyPercent: number;
  employeeName: string;
};

function ContractAcceptModal({
  state,
  onClose,
  onConfirm,
  confirming,
}: {
  state: ContractModalState;
  onClose: () => void;
  onConfirm: () => void;
  confirming: boolean;
}) {
  const [accepted, setAccepted] = useState(false);
  const contractUrl = getContractProxyUrl(state.viewContractUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-2xl flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Review & Accept Contract</h2>
            <p className="mt-0.5 text-sm text-gray-500">{state.benefitLabel}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {contractUrl ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            <iframe
              src={contractUrl}
              className="flex-1 min-h-[400px] border-none bg-gray-50"
              title="Contract"
            />
            <div className="px-6 py-2 border-t border-gray-100">
              <a
                href={contractUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Open in new tab
              </a>
            </div>
          </div>
        ) : state.requiresContract ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 bg-red-50 border-b border-red-100">
            <div className="rounded-full bg-red-100 p-4">
              <X className="h-7 w-7 text-red-400" />
            </div>
            <p className="text-sm font-medium text-red-700 text-center">No contract available</p>
            <p className="text-xs text-red-600 text-center max-w-xs">
              This benefit requires a vendor contract, but no active contract has been uploaded yet.
              Please contact HR to resolve this before you can proceed.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 bg-gray-50 border-b border-gray-100">
            <div className="rounded-full bg-gray-100 p-4">
              <FileCheck className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 text-center max-w-xs">
              Please confirm below to proceed with your benefit request.
            </p>
          </div>
        )}

        {!state.requiresContract || state.viewContractUrl ? (
          <div className="border-t border-gray-100 px-6 py-4 bg-white">
            <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-blue-600"
              />
              <span>
                I have read and agree to the contract terms and conditions. This acceptance will be
                legally recorded.
              </span>
            </label>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!accepted || confirming}
                onClick={onConfirm}
                className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {confirming ? "Confirming…" : "Accept & Submit"}
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-100 px-6 py-4 bg-white flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentDetailsModal({
  state,
  onClose,
  onSubmit,
  submitting,
  error,
}: {
  state: PaymentModalState;
  onClose: () => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const waitingForReview = normalizeRequestStatus(state.requestStatus) === "awaiting_payment_review";
  const reference = `${state.benefitName} - ${state.employeeName}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <CreditCard className="h-3.5 w-3.5" />
          Payment Details
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">{state.benefitName}</h2>
        <p className="mt-1 text-sm text-gray-500">Review the payment details for this request.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">Total</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{formatMoney(state.totalAmount)}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-500">Company Pays</p>
            <p className="mt-2 text-lg font-semibold text-emerald-700">{formatMoney(state.companyPays)}</p>
            <p className="mt-1 text-xs text-emerald-600">{state.companyPercent}% covered</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-xs uppercase tracking-wide text-amber-500">Your Payment</p>
            <p className="mt-2 text-lg font-semibold text-amber-700">{formatMoney(state.employeePays)}</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Building2 className="h-4 w-4 text-gray-400" />
            Company Bank Account
          </div>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>{PAYMENT_ACCOUNT_DETAILS.bankName}</p>
            <p>{PAYMENT_ACCOUNT_DETAILS.accountHolder}</p>
            <p className="font-medium">{PAYMENT_ACCOUNT_DETAILS.accountNumber}</p>
            <p className="text-xs text-blue-700">
              <Copy className="mr-1 inline h-3.5 w-3.5" />
              Reference: {reference}
            </p>
          </div>
        </div>

        {waitingForReview && (
          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
            HR is checking your payment now.
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {error}
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
            onClick={onSubmit}
            disabled={submitting || waitingForReview}
            className={`inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition ${
              waitingForReview
                ? "cursor-not-allowed bg-gray-300"
                : "bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            }`}
          >
            {waitingForReview ? "Төлбөр илгээгдсэн" : submitting ? "Submitting..." : "Төлбөр төлсөн — Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

function RequestsContent() {
  const searchParams = useSearchParams();
  const submitted = searchParams.get("submitted") === "true";
  const { getToken } = useAuth();
  const { employee, loading: employeeLoading } = useCurrentEmployee();
  const {
    data: requestsData,
    loading: requestsLoading,
    previousData: requestsPreviousData,
    refetch: refetchRequests,
  } = useGetBenefitRequestsQuery({
    fetchPolicy: submitted ? "network-only" : "cache-first",
  });
  const { data: benefitsData } = useGetBenefitsQuery();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [submittingPaymentId, setSubmittingPaymentId] = useState<string | null>(null);
  const [contractModal, setContractModal] = useState<ContractModalState | null>(null);
  const [paymentModal, setPaymentModal] = useState<PaymentModalState | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [cancelRequest] = useCancelBenefitRequestMutation({
    refetchQueries: [{ query: GetBenefitRequestsDocument }],
    onCompleted: () => {
      setCancellingId(null);
      setFeedback({ type: "success", message: "Request cancelled." });
      setTimeout(() => setFeedback(null), 4000);
    },
    onError: () => {
      setCancellingId(null);
      setFeedback({ type: "error", message: "Failed to cancel. Please try again." });
      setTimeout(() => setFeedback(null), 5000);
    },
  });

  const [confirmContract, { loading: confirming }] = useConfirmBenefitRequestMutation({
    refetchQueries: [{ query: GetBenefitRequestsDocument }],
    onCompleted: () => {
      setContractModal(null);
      setFeedback({
        type: "success",
        message: "Contract accepted. Your request is now under review.",
      });
      setTimeout(() => setFeedback(null), 5000);
    },
    onError: (err) => {
      setContractModal(null);
      setFeedback({
        type: "error",
        message: err.message ?? "Failed to accept contract. Please try again.",
      });
      setTimeout(() => setFeedback(null), 6000);
    },
  });

  const benefitsById = new Map((benefitsData?.benefits ?? []).map((b) => [b.id, b]));

  const REQUEST_STATUS_ORDER: Record<string, number> = {
    awaiting_hr_review: 0,
    awaiting_finance_review: 0,
    awaiting_contract_acceptance: 0,
    hr_approved: 0,
    finance_approved: 0,
    awaiting_payment: 0,
    awaiting_payment_review: 0,
    pending: 0,
    cancelled: 1,
    rejected: 1,
    declined: 1,
    approved: 2,
  };

  const requests = (requestsData?.benefitRequests ?? [])
    .map((req) => {
      const benefit = benefitsById.get(req.benefitId);
      const name = benefit?.name ?? req.benefitId;
      const vendor = benefit?.vendorName ?? "";

      // Contract-based benefits always pass through the payment step.
      let paymentInfo: {
        total: string;
        companyPays: string;
        employeePays: string;
        subsidyPercent: number;
      } | null = null;
      if (
        benefit?.flowType === "contract" &&
        benefit?.amount &&
        benefit.subsidyPercent !== undefined &&
        benefit.employeePercent !== undefined
      ) {
        const unitPrice = benefit.amount;
        const subsidyPercent = benefit.subsidyPercent;
        const companyAmount = Math.round(unitPrice * subsidyPercent / 100);
        const employeeAmount = unitPrice - companyAmount;
        const fmt = (n: number) => n.toLocaleString("mn-MN") + "₮";
        paymentInfo = {
          total: fmt(unitPrice),
          companyPays: fmt(companyAmount),
          employeePays: fmt(employeeAmount),
          subsidyPercent,
        };
      }

      return {
        id: req.id,
        benefitId: req.benefitId,
        benefitLabel: vendor ? `${name} · ${vendor}` : name,
        status: req.status,
        requestDate: req.createdAt?.split("T")[0] ?? "—",
        updatedDate: req.updatedAt?.split("T")[0] ?? null,
        reviewer: req.reviewedBy,
        declineReason: req.declineReason,
        viewContractUrl: req.viewContractUrl,
        employeeSignedContractViewUrl: req.employeeSignedContract?.viewUrl,
        employeeSignedContractFileName:
          req.employeeSignedContract?.fileName ?? null,
        approvalPolicy: benefit?.approvalPolicy ?? "hr",
        requiresContract: benefit?.requiresContract ?? false,
        paymentInfo,
        hasPayment: benefit?.flowType === "contract" && benefit?.amount != null,
      };
    })
    .sort(
      (a, b) =>
        (REQUEST_STATUS_ORDER[a.status] ?? 1) - (REQUEST_STATUS_ORDER[b.status] ?? 1),
    );

  const loading = employeeLoading || requestsLoading;

  const submitPayment = async (requestId: string) => {
    setSubmittingPaymentId(requestId);
    try {
      const token = await getToken();
      const res = await fetch(`${getApiBase()}/api/benefit-requests/payment-submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ requestId }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: "Failed to submit payment." }));
        throw new Error((json as { error?: string }).error ?? "Failed to submit payment.");
      }
      await refetchRequests();
      setFeedback({ type: "success", message: "Payment submitted for HR verification." });
      setTimeout(() => setFeedback(null), 5000);
      setPaymentModal((current) =>
        current ? { ...current, requestStatus: "awaiting_payment_review" } : current,
      );
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to submit payment.",
      });
      setTimeout(() => setFeedback(null), 6000);
    } finally {
      setSubmittingPaymentId(null);
    }
  };

  return (
    <>
      {paymentModal && (
        <PaymentDetailsModal
          state={paymentModal}
          onClose={() => setPaymentModal(null)}
          onSubmit={() => submitPayment(paymentModal.requestId)}
          submitting={submittingPaymentId === paymentModal.requestId}
          error={feedback?.type === "error" ? feedback.message : null}
        />
      )}
      {contractModal && (
        <ContractAcceptModal
          state={contractModal}
          onClose={() => setContractModal(null)}
          onConfirm={() => {
            confirmContract({
              variables: { requestId: contractModal.requestId, contractAccepted: true },
            });
          }}
          confirming={confirming}
        />
      )}

      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 flex-col items-center">
          <main className="w-full max-w-5xl p-8">
            {loading ? (
              <div>
                <div className="h-6 w-40 rounded-full bg-white/30 animate-pulse" />
                <div className="mt-2 h-3.5 w-56 rounded-full bg-white/20 animate-pulse" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <EmployeeAvatar
                    name={employee?.name ?? "Employee"}
                    imageUrl={employee?.avatarUrl ?? null}
                    className="h-10 w-10"
                  />
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-foreground">
                      My Requests
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                      Track the status of your benefit requests
                    </p>
                  </div>
                </div>
              </>
            )}

            {submitted && (
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
                ✓ Request submitted successfully.
              </div>
            )}

            {feedback && (
              <div
                className={`mt-4 rounded-lg border px-4 py-2.5 text-sm ${
                  feedback.type === "success"
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="mt-6 space-y-4">
              {loading ? (
                <>
                  {Array.from({
                    length:
                      requestsData?.benefitRequests?.length ??
                      requestsPreviousData?.benefitRequests?.length ??
                      3,
                  }).map((_, i) => (
                    <RequestCardSkeleton key={i} />
                  ))}
                </>
              ) : requests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
                  <p className="text-sm font-medium text-gray-600">No requests yet</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Once you request a benefit, it will appear here.
                  </p>
                  <Link
                    href="/employee-panel/mybenefits"
                    className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
                  >
                    Browse available benefits →
                  </Link>
                </div>
              ) : (
                requests.map((req) => {
                  const isCancellable = canCancelRequest(req.status);
                  const isContractPending =
                    normalizeRequestStatus(req.status) === "awaiting_contract_acceptance";
                  const isDeclined =
                    req.status === "rejected" || req.status === "declined";
                  const badge = getStatusBadgeConfig(req.status);
                  const accentClass = getCardAccentClass(req.status);
                  const tooltip = getStatusTooltip(req.status);

                  return (
                    <div
                      key={req.id}
                      className={`overflow-hidden rounded-2xl border border-gray-200 border-l-4 ${accentClass} bg-white shadow-sm hover:shadow-md transition-shadow`}
                    >
                      {/* Top row: title · status badge · reviewer · date */}
                      <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-[15px] font-semibold text-gray-900 leading-snug">
                              {req.benefitLabel}
                            </h2>
                            <div className="relative group">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold cursor-default ${badge.className}`}
                              >
                                {badge.label}
                              </span>
                              {tooltip && (
                                <div className="absolute left-0 top-full mt-1.5 z-10 hidden group-hover:block w-64 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 shadow-lg">
                                  {tooltip}
                                </div>
                              )}
                            </div>
                          </div>
                          {req.reviewer && (
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
                              <span className="h-1 w-1 rounded-full bg-gray-300" aria-hidden="true" />
                              Reviewed by{" "}
                              <span className="font-medium text-gray-500">{req.reviewer}</span>
                            </p>
                          )}
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-[11px] font-medium tabular-nums text-gray-700 whitespace-nowrap">
                            {req.requestDate}
                          </p>
                          <p className="text-[10px] text-gray-400 whitespace-nowrap">submitted</p>
                        </div>
                      </div>

                      {/* Decline reason */}
                      {isDeclined && req.declineReason && (
                        <div className="mx-5 mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                          <span className="font-medium">Reason: </span>
                          {req.declineReason}
                        </div>
                      )}

                      {/* Payment confirmation — employee must pay before activation */}
                      {normalizeRequestStatus(req.status) === "awaiting_payment" && req.hasPayment && req.paymentInfo && (
                        <div className="mx-5 mb-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600">Payment Required</p>
                          <dl className="space-y-1.5 text-xs mb-3">
                            <div className="flex justify-between">
                              <dt className="text-blue-700">Total Amount</dt>
                              <dd className="font-semibold text-blue-900">{req.paymentInfo.total}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-blue-700">Company Pays ({req.paymentInfo.subsidyPercent}%)</dt>
                              <dd className="font-semibold text-emerald-700">{req.paymentInfo.companyPays}</dd>
                            </div>
                            <div className="flex justify-between border-t border-blue-100 pt-1.5">
                              <dt className="font-medium text-blue-800">Your Payment</dt>
                              <dd className="font-bold text-blue-900">{req.paymentInfo.employeePays}</dd>
                            </div>
                          </dl>
                          <div className="flex flex-wrap justify-end gap-2">
                            <Link
                              href={`/employee-panel/benefits/${req.benefitId}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Open Payment Dialog
                            </Link>
                            <button
                              type="button"
                              disabled={submittingPaymentId === req.id}
                              onClick={() => submitPayment(req.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                            >
                              <FileCheck className="h-3.5 w-3.5" />
                              {submittingPaymentId === req.id ? "Submitting..." : "I Paid"}
                            </button>
                          </div>
                        </div>
                      )}

                      {normalizeRequestStatus(req.status) === "awaiting_payment_review" && req.hasPayment && req.paymentInfo && (
                        <div className="mx-5 mb-3 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">Payment Under Review</p>
                          <p className="text-xs text-indigo-700">
                            You already marked this payment as sent. HR is verifying the transfer before activating the benefit.
                          </p>
                        </div>
                      )}

                      {/* Payment info — shown after approved */}
                      {normalizeRequestStatus(req.status) === "approved" && req.paymentInfo && (
                        <div className="mx-5 mb-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-2">Payment</p>
                          <dl className="space-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <dt className="text-blue-700">Total Amount</dt>
                              <dd className="font-semibold text-blue-900">{req.paymentInfo.total}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-blue-700">Company Pays ({req.paymentInfo.subsidyPercent}%)</dt>
                              <dd className="font-semibold text-emerald-700">{req.paymentInfo.companyPays}</dd>
                            </div>
                            <div className="flex justify-between border-t border-blue-100 pt-1.5">
                              <dt className="font-medium text-blue-800">Your Payment</dt>
                              <dd className="font-bold text-blue-900">{req.paymentInfo.employeePays}</dd>
                            </div>
                          </dl>
                        </div>
                      )}

                      {/* Contract action callout */}
                      {isContractPending && (
                        <div className="mx-5 mb-3 flex items-center justify-between gap-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
                          <p className="text-xs text-amber-700">
                            Action required — please review and accept the vendor contract to
                            continue.
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setContractModal({
                                requestId: req.id,
                                benefitLabel: req.benefitLabel,
                                viewContractUrl: req.viewContractUrl,
                                requiresContract: req.requiresContract,
                              })
                            }
                            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-700"
                          >
                            <FileCheck className="h-3.5 w-3.5" aria-hidden="true" />
                            Review & Accept
                          </button>
                        </div>
                      )}

                      {req.employeeSignedContractViewUrl && (
                        <div className="mx-5 mb-3 flex items-center justify-between gap-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
                          <p className="text-xs text-blue-700">
                            Your signed contract copy is stored with this request.
                          </p>
                          <a
                            href={
                              getContractProxyUrl(req.employeeSignedContractViewUrl) ??
                              req.employeeSignedContractViewUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                          >
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            {req.employeeSignedContractFileName
                              ? "Open signed copy"
                              : "Open uploaded copy"}
                          </a>
                        </div>
                      )}

                      {/* Timeline + actions — single row */}
                      <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 px-4 py-3">
                        <div className="flex-1 min-w-[160px]">
                          <RequestTimeline
                            status={req.status}
                            policy={req.approvalPolicy}
                            requiresContract={req.requiresContract}
                            hasPayment={req.hasPayment}
                          />
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isCancellable && (
                            <button
                              type="button"
                              onClick={() => {
                                if (!window.confirm("Cancel this benefit request?")) return;
                                setCancellingId(req.id);
                                cancelRequest({ variables: { requestId: req.id } });
                              }}
                              disabled={cancellingId === req.id}
                              className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-4 py-1.5 text-xs font-medium text-red-600 shadow-sm transition hover:bg-red-50 hover:border-red-300 disabled:opacity-50 whitespace-nowrap"
                            >
                              {cancellingId === req.id ? "Cancelling…" : "Cancel Request"}
                            </button>
                          )}
                          <Link
                            href={`/employee-panel/benefits/${req.benefitId}`}
                            className="hidden"
                          />
                          {(normalizeRequestStatus(req.status) === "awaiting_payment" ||
                            normalizeRequestStatus(req.status) === "awaiting_payment_review") &&
                          req.paymentInfo ? (
                            <button
                              type="button"
                              onClick={() => {
                                const paymentInfo = req.paymentInfo!;
                                return (
                                setPaymentModal({
                                  requestId: req.id,
                                  benefitName: req.benefitLabel,
                                  requestStatus: req.status,
                                  totalAmount: Number(paymentInfo.total.replace(/[^\d]/g, "")),
                                  companyPays: Number(paymentInfo.companyPays.replace(/[^\d]/g, "")),
                                  employeePays: Number(paymentInfo.employeePays.replace(/[^\d]/g, "")),
                                  companyPercent: paymentInfo.subsidyPercent,
                                  employeeName: employee?.name ?? "Employee",
                                })
                              );
                              }}
                              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:border-gray-300 whitespace-nowrap"
                            >
                              <Eye className="h-3 w-3" aria-hidden="true" />
                              View Benefit
                            </button>
                          ) : (
                            <Link
                              href={`/employee-panel/benefits/${req.benefitId}`}
                              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:border-gray-300 whitespace-nowrap"
                            >
                              <Eye className="h-3 w-3" aria-hidden="true" />
                              View Benefit
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default function RequestsPage() {
  return (
    <Suspense fallback={null}>
      <RequestsContent />
    </Suspense>
  );
}
