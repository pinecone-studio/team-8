"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Eye, ExternalLink, FileCheck, X } from "lucide-react";
import Sidebar from "../_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import {
  useGetBenefitRequestsQuery,
  useGetBenefitsQuery,
  useCancelBenefitRequestMutation,
  useConfirmBenefitRequestMutation,
  GetBenefitRequestsDocument,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/use-current-employee";

const CANCELLABLE_STATUSES = new Set([
  "pending",
  "awaiting_contract_acceptance",
  "awaiting_hr_review",
  "awaiting_finance_review",
]);

function getStatusTone(status: string): string {
  const s = status.toLowerCase();
  if (s === "approved") return "bg-green-50 text-green-700 border-green-200";
  if (s === "rejected" || s === "declined") return "bg-red-50 text-red-600 border-red-200";
  if (s === "cancelled") return "bg-gray-100 text-gray-500 border-gray-200";
  if (s === "hr_approved" || s === "finance_approved") return "bg-teal-50 text-teal-700 border-teal-200";
  if (s === "awaiting_contract_acceptance") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-orange-50 text-orange-600 border-orange-200";
}

function formatStatusLabel(status: string): string {
  switch (status.toLowerCase()) {
    case "awaiting_contract_acceptance": return "Contract Pending";
    case "awaiting_hr_review": return "HR Review";
    case "awaiting_finance_review": return "Finance Review";
    case "hr_approved": return "HR Approved";
    case "finance_approved": return "Finance Approved";
    case "approved": return "Approved";
    case "rejected": return "Rejected";
    case "cancelled": return "Cancelled";
    default: return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
  }
}

// ── Request Timeline ───────────────────────────────────────────────────────

type StepState = "done" | "active" | "waiting" | "failed";
type TimelineStep = { id: string; label: string; state: StepState };

function buildTimeline(
  status: string,
  policy: string | null | undefined,
  requiresContract: boolean | null | undefined,
): TimelineStep[] {
  const p = (policy ?? "hr").toLowerCase();
  const rc = requiresContract ?? false;
  const isRejected = status === "rejected";
  const isCancelled = status === "cancelled";
  const isTerminal = isRejected || isCancelled;

  const stepIds: string[] = ["submitted"];
  if (rc) stepIds.push("contract");
  if (p === "hr" || p === "dual") stepIds.push("hr_review");
  if (p === "finance" || p === "dual") stepIds.push("finance_review");
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
      activeIdx = p === "dual" ? stepIds.indexOf("finance_review") : stepIds.length;
      break;
    case "finance_approved":
      activeIdx = stepIds.length;
      break;
    case "approved":
    case "rejected":
    case "cancelled":
      activeIdx = stepIds.length;
      break;
    default:
      activeIdx = Math.max(1,
        stepIds.indexOf("hr_review") >= 0
          ? stepIds.indexOf("hr_review")
          : stepIds.indexOf("finance_review"),
      );
  }

  const LABELS: Record<string, string> = {
    submitted: "Submitted",
    contract: "Contract",
    hr_review: "HR Review",
    finance_review: "Finance",
    done: isRejected ? "Rejected" : isCancelled ? "Cancelled" : "Approved",
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
  if (state === "done")
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white text-[10px] font-bold shrink-0">
        ✓
      </span>
    );
  if (state === "active")
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 ring-2 ring-blue-200 shrink-0">
        <span className="h-2 w-2 rounded-full bg-white" />
      </span>
    );
  if (state === "failed")
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-400 text-white text-[10px] font-bold shrink-0">
        ✕
      </span>
    );
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-200 bg-white shrink-0" />
  );
}

function RequestTimeline({
  status,
  policy,
  requiresContract,
}: {
  status: string;
  policy: string | null | undefined;
  requiresContract: boolean | null | undefined;
}) {
  const steps = useMemo(
    () => buildTimeline(status, policy, requiresContract),
    [status, policy, requiresContract],
  );

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-1">
          <div className="flex items-center gap-1.5">
            <TimelineDot state={step.state} />
            <span
              className={`text-xs font-medium whitespace-nowrap ${
                step.state === "done"
                  ? "text-green-700"
                  : step.state === "active"
                    ? "text-blue-700"
                    : step.state === "failed"
                      ? "text-red-600"
                      : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight className="h-3 w-3 text-gray-300 shrink-0" />
          )}
        </div>
      ))}
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="flex w-full max-w-2xl flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
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

        {state.viewContractUrl ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            <iframe
              src={state.viewContractUrl}
              className="flex-1 min-h-[400px] border-none bg-gray-50"
              title="Contract"
            />
            <div className="px-6 py-2 border-t border-gray-100">
              <a
                href={state.viewContractUrl}
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
          /* Benefit requires a contract but none is active — block acceptance */
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

        {/* Only show acceptance controls when a contract can actually be reviewed */}
        {(!state.requiresContract || state.viewContractUrl) ? (
          <div className="border-t border-gray-100 px-6 py-4 bg-white">
            <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-blue-600"
              />
              <span>I have read and agree to the contract terms and conditions. This acceptance will be legally recorded.</span>
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

// ── Main Page ──────────────────────────────────────────────────────────────

function RequestsContent() {
  const searchParams = useSearchParams();
  const submitted = searchParams.get("submitted") === "true";
  const { loading: employeeLoading } = useCurrentEmployee();
  const { data: requestsData, loading: requestsLoading } = useGetBenefitRequestsQuery({
    fetchPolicy: submitted ? "network-only" : "cache-first",
  });
  const { data: benefitsData } = useGetBenefitsQuery();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [contractModal, setContractModal] = useState<ContractModalState | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

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
      setFeedback({ type: "success", message: "Contract accepted. Your request is now under review." });
      setTimeout(() => setFeedback(null), 5000);
    },
    onError: (err) => {
      setContractModal(null);
      setFeedback({ type: "error", message: err.message ?? "Failed to accept contract. Please try again." });
      setTimeout(() => setFeedback(null), 6000);
    },
  });

  const benefitsById = new Map(
    (benefitsData?.benefits ?? []).map((b) => [b.id, b]),
  );

  const requests = (requestsData?.benefitRequests ?? []).map((req) => {
    const benefit = benefitsById.get(req.benefitId);
    const name = benefit?.name ?? req.benefitId;
    const vendor = benefit?.vendorName ?? "";
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
      approvalPolicy: benefit?.approvalPolicy ?? "hr",
      requiresContract: benefit?.requiresContract ?? false,
    };
  });

  const loading = employeeLoading || requestsLoading;

  return (
    <>
      {contractModal && (
        <ContractAcceptModal
          state={contractModal}
          onClose={() => setContractModal(null)}
          onConfirm={() => {
            confirmContract({ variables: { requestId: contractModal.requestId, contractAccepted: true } });
          }}
          confirming={confirming}
        />
      )}

      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col items-center">
          <main className="w-full max-w-5xl p-8">
            <h1 className="text-xl font-semibold text-gray-900">My Requests</h1>
            <p className="mt-1 text-sm text-gray-500">Track the status of your benefit requests</p>

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

            <div className="mt-6 space-y-3">
              {loading ? (
                <div className="rounded-xl border border-gray-100 bg-white px-6 py-12 text-center">
                  <PageLoading inline message="Loading your requests…" />
                </div>
              ) : requests.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
                  <p className="text-sm font-medium text-gray-600">No requests yet</p>
                  <p className="mt-1 text-xs text-gray-400">Once you request a benefit, it will appear here.</p>
                  <Link
                    href="/employee-panel/mybenefits"
                    className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
                  >
                    Browse available benefits →
                  </Link>
                </div>
              ) : (
                requests.map((req) => {
                  const isCancellable = CANCELLABLE_STATUSES.has(req.status.toLowerCase());
                  const isContractPending = req.status.toLowerCase() === "awaiting_contract_acceptance";
                  const isDeclined = req.status === "rejected" || req.status === "declined";

                  return (
                    <div
                      key={req.id}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-300 hover:shadow-sm"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{req.benefitLabel}</p>
                          <p className="mt-0.5 text-xs text-gray-400">
                            Submitted {req.requestDate}
                            {req.updatedDate && req.updatedDate !== req.requestDate && (
                              <span className="ml-2 text-gray-300">· Updated {req.updatedDate}</span>
                            )}
                          </p>
                        </div>
                        <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium shrink-0 ${getStatusTone(req.status)}`}>
                          {formatStatusLabel(req.status)}
                        </span>
                      </div>

                      {/* Timeline */}
                      <div className="border-t border-gray-50 px-5 py-3">
                        <RequestTimeline
                          status={req.status}
                          policy={req.approvalPolicy}
                          requiresContract={req.requiresContract}
                        />
                      </div>

                      {/* In-progress status context */}
                      {req.status === "awaiting_hr_review" && (
                        <div className="mx-5 mb-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                          Your request is in the <span className="font-medium">HR review queue</span>. The HR team will process it shortly — no action needed from you.
                        </div>
                      )}
                      {req.status === "awaiting_finance_review" && (
                        <div className="mx-5 mb-3 rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-xs text-teal-700">
                          Your request is in the <span className="font-medium">Finance review queue</span>. The Finance team will process it — no action needed from you.
                        </div>
                      )}
                      {req.status === "hr_approved" && (
                        <div className="mx-5 mb-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                          HR has approved your request. It is now awaiting <span className="font-medium">Finance review</span>.
                        </div>
                      )}
                      {req.status === "finance_approved" && (
                        <div className="mx-5 mb-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                          Finance has approved your request. It is being <span className="font-medium">finalised</span>.
                        </div>
                      )}
                      {req.status === "cancelled" && (
                        <div className="mx-5 mb-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-500">
                          This request was cancelled. You can submit a new request at any time.
                        </div>
                      )}

                      {/* Decline reason */}
                      {isDeclined && req.declineReason && (
                        <div className="mx-5 mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                          <span className="font-medium">Reason: </span>{req.declineReason}
                        </div>
                      )}

                      {/* Contract action callout */}
                      {isContractPending && (
                        <div className="mx-5 mb-3 flex items-center justify-between gap-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
                          <p className="text-xs text-amber-700">
                            Action required — please review and accept the vendor contract to continue.
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
                            <FileCheck className="h-3.5 w-3.5" />
                            Review & Accept
                          </button>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center gap-2 border-t border-gray-50 px-5 py-2.5">
                        <Link
                          href={`/employee-panel/benefits/${req.benefitId}`}
                          className="inline-flex items-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Benefit
                        </Link>
                        {req.reviewer && (
                          <>
                            <span className="text-xs text-gray-200">·</span>
                            <span className="text-xs text-gray-400">Reviewed by {req.reviewer}</span>
                          </>
                        )}
                        <div className="flex-1" />
                        {isCancellable && (
                          <button
                            type="button"
                            onClick={() => {
                              if (!window.confirm("Cancel this benefit request?")) return;
                              setCancellingId(req.id);
                              cancelRequest({ variables: { requestId: req.id } });
                            }}
                            disabled={cancellingId === req.id}
                            className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                          >
                            <X className="h-3.5 w-3.5" />
                            {cancellingId === req.id ? "Cancelling…" : "Cancel Request"}
                          </button>
                        )}
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
    <Suspense fallback={<PageLoading message="Loading…" />}>
      <RequestsContent />
    </Suspense>
  );
}
