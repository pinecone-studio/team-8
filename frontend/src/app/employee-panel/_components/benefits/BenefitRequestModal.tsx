"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  ExternalLink,
  FileText,
  CheckCircle,
  UploadCloud,
  CheckCircle2,
  Download,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Stepper from "./Stepper";
import PageLoading from "@/app/_components/PageLoading";
import {
  BenefitEligibilityStatus,
  BenefitFlowType,
  GetBenefitRequestsDocument,
  GetMyBenefitsDocument,
  useGetMyBenefitsQuery,
  useGetBenefitRequestsQuery,
  useGetContractsForBenefitQuery,
  useRequestBenefitMutation,
  useConfirmBenefitRequestMutation,
  useRespondToFinanceBenefitOfferMutation,
} from "@/graphql/generated/graphql";
import { getContractProxyUrl } from "@/lib/contracts";

function getApiBase(): string {
  const base =
    typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GRAPHQL_URL
      ? process.env.NEXT_PUBLIC_GRAPHQL_URL
      : "https://team8-api.team8pinequest.workers.dev/";
  return base.replace(/\/$/, "");
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatMnDate(date: Date): string {
  return date.toLocaleDateString("mn-MN");
}

type UploadedEmployeeSignedContract = {
  id: string;
  key: string;
  fileName?: string | null;
  uploadedAt?: string | null;
  viewUrl?: string | null;
};

type Props = {
  benefitId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function BenefitRequestModal({
  benefitId,
  onClose,
  onSuccess,
}: Props) {
  const { getToken } = useAuth();
  const { data, error, loading, refetch: refetchMyBenefits } =
    useGetMyBenefitsQuery();
  const [requestBenefit, { loading: submitting }] = useRequestBenefitMutation();
  const [confirmBenefitRequest, { loading: confirming }] =
    useConfirmBenefitRequestMutation();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [employeeSignedContract, setEmployeeSignedContract] =
    useState<UploadedEmployeeSignedContract | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loanAmount, setLoanAmount] = useState("");
  const [repaymentMonths, setRepaymentMonths] = useState("");

  const benefitEligibility = data?.myBenefits.find(
    (item) => item.benefitId === benefitId,
  );
  const benefit = benefitEligibility?.benefit;
  const requiresContract = benefit?.requiresContract ?? false;
  const isSelfService = benefit?.flowType === BenefitFlowType.SelfService;
  const isFinanceFlow = benefit?.flowType === BenefitFlowType.DownPayment;

  const {
    data: requestsData,
    loading: requestsLoading,
    refetch: refetchBenefitRequests,
  } =
    useGetBenefitRequestsQuery({
      skip: !isFinanceFlow,
      fetchPolicy: "cache-and-network",
    });
  const [respondToFinanceOffer, { loading: respondingToOffer }] =
    useRespondToFinanceBenefitOfferMutation();

  const latestFinanceRequest = useMemo(() => {
    if (!requestsData?.benefitRequests?.length) return null;
    const rows = requestsData.benefitRequests.filter(
      (r) => r.benefitId === benefitId,
    );
    if (!rows.length) return null;
    // Important: use newest-first so `[0]` is truly the latest request.
    return [...rows].sort((a, b) => {
      const aTime = new Date(a.updatedAt ?? a.createdAt).getTime();
      const bTime = new Date(b.updatedAt ?? b.createdAt).getTime();
      return bTime - aTime;
    })[0];
  }, [requestsData, benefitId]);

  const activeApprovedDownPaymentLoan = useMemo(() => {
    const all = requestsData?.benefitRequests ?? [];
    if (!all.length) return null;

    // Down payment/loan repaid-at is time-based:
    // repaidAt = employeeApprovedAt + repaymentMonths
    // (same logic as backend requestBenefit.ts previous-loan validation).
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
  }, [requestsData]);

  const hasActiveApprovedDownPaymentLoan = Boolean(
    activeApprovedDownPaymentLoan,
  );

  const latestApprovedDownPaymentLoan = useMemo(() => {
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
  }, [requestsData]);

  const now = new Date();
  const approvalDone =
    latestFinanceRequest?.status === "awaiting_employee_decision" ||
    latestFinanceRequest?.status === "awaiting_employee_signed_contract" ||
    latestFinanceRequest?.status === "awaiting_final_finance_approval" ||
    latestFinanceRequest?.status === "approved";
  const repaymentStarted = Boolean(latestApprovedDownPaymentLoan);
  const repaymentDone = repaymentStarted
    ? (latestApprovedDownPaymentLoan?.repaidAt as Date).getTime() <= now.getTime()
    : false;
  const repaymentActive = repaymentStarted && !repaymentDone;

  const { data: contractsData, loading: contractsLoading } =
    useGetContractsForBenefitQuery({
      variables: { benefitId },
      skip: !requiresContract || !benefitId || isFinanceFlow,
    });
  const activeContract =
    contractsData?.contracts.find((c) => c.isActive) ?? null;
  const contractUrl = getContractProxyUrl(activeContract?.viewUrl);
  const hasReviewableContract = Boolean(activeContract?.viewUrl);
  const contractStepBlocked =
    requiresContract && !contractsLoading && !hasReviewableContract;

  const isWorking =
    submitting || confirming || uploading || respondingToOffer;

  useEffect(() => {
    if (!isFinanceFlow) return;
    const status = latestFinanceRequest?.status;
    if (status === "awaiting_employee_decision") {
      setStep(2);
      return;
    }
    if (
      status === "awaiting_employee_signed_contract" ||
      status === "awaiting_final_finance_approval"
    ) {
      setStep(3);
      return;
    }
    setStep(1);
  }, [isFinanceFlow, latestFinanceRequest?.status, benefitId]);

  useEffect(() => {
    setSubmitMessage(null);
  }, [benefitId, step, isFinanceFlow]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleFileUpload = async (
    file: File,
    options?: { financeRequestId?: string },
  ) => {
    setUploadError(null);
    setUploading(true);
    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("benefitId", benefitId);
      fd.append("file", file);
      if (options?.financeRequestId) {
        fd.append("requestId", options.financeRequestId);
      }
      const res = await fetch(`${getApiBase()}/api/contracts/employee-upload`, {
        method: "POST",
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error((err as { error?: string }).error ?? "Upload failed");
      }
      const json = (await res.json()) as UploadedEmployeeSignedContract & {
        completedEnrollment?: boolean;
      };
      setEmployeeSignedContract(json);
      setUploadedFileName(json.fileName ?? file.name);
      if (options?.financeRequestId) {
        await Promise.all([refetchBenefitRequests(), refetchMyBenefits()]);
      }
      if (json.completedEnrollment) {
        onSuccess();
        onClose();
      }
    } catch (e) {
      setUploadError(
        e instanceof Error ? e.message : "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  const submitRequest = async () => {
    if (!benefitEligibility || !benefit) return;
    setSubmitMessage(null);

    if (requiresContract && !employeeSignedContract?.id) {
      setSubmitMessage("Please upload your signed contract before submitting.");
      setStep(2);
      return;
    }

    try {
      const result = await requestBenefit({
        variables: {
          input: {
            benefitId: benefit.id,
            employeeSignedContractId: employeeSignedContract?.id ?? undefined,
          },
        },
        refetchQueries: [{ query: GetBenefitRequestsDocument }],
      });

      const errs = result.errors;
      if (errs?.length) {
        setSubmitMessage(errs[0].message ?? "Failed to submit request.");
        return;
      }

      const createdRequest = result.data?.requestBenefit;
      if (!createdRequest) {
        setSubmitMessage("Failed to submit request.");
        return;
      }

      if (
        requiresContract &&
        createdRequest.status === "awaiting_contract_acceptance"
      ) {
        const confirmResult = await confirmBenefitRequest({
          variables: { requestId: createdRequest.id, contractAccepted: true },
          refetchQueries: [{ query: GetBenefitRequestsDocument }],
        });
        if (confirmResult.errors?.length) {
          setSubmitMessage(
            confirmResult.errors[0].message ?? "Contract acceptance failed.",
          );
          return;
        }
      }

      onSuccess();
      onClose();
    } catch (e) {
      setSubmitMessage(
        e instanceof Error ? e.message : "Failed to submit request.",
      );
    }
  };

  const submitFinanceRequest = async () => {
    if (!benefitEligibility || !benefit) return;
    setSubmitMessage(null);
    const amt = Number(loanAmount.replace(/,/g, "").trim());
    const months = Number(repaymentMonths.trim());
    if (!Number.isFinite(amt) || amt <= 0) {
      setSubmitMessage("Enter a valid loan amount.");
      return;
    }
    if (!Number.isFinite(months) || months <= 0) {
      setSubmitMessage("Enter how many months you will repay (1 or more).");
      return;
    }

    try {
      const result = await requestBenefit({
        variables: {
          input: {
            benefitId: benefit.id,
            requestedAmount: Math.round(amt),
            repaymentMonths: Math.round(months),
          },
        },
        refetchQueries: [
          { query: GetBenefitRequestsDocument },
          { query: GetMyBenefitsDocument },
        ],
      });
      if (result.errors?.length) {
        setSubmitMessage(result.errors[0].message ?? "Failed to submit.");
        return;
      }
      if (!result.data?.requestBenefit) {
        setSubmitMessage("Failed to submit request.");
        return;
      }
      onSuccess();
      onClose();
    } catch (e) {
      setSubmitMessage(
        e instanceof Error ? e.message : "Failed to submit request.",
      );
    }
  };

  const respondToOffer = async (accepted: boolean) => {
    if (!latestFinanceRequest?.id) return;
    setSubmitMessage(null);
    try {
      const result = await respondToFinanceOffer({
        variables: {
          input: {
            requestId: latestFinanceRequest.id,
            accept: accepted,
            note: accepted
              ? undefined
              : "Employee declined the proposed finance offer.",
          },
        },
        refetchQueries: [
          { query: GetBenefitRequestsDocument },
          { query: GetMyBenefitsDocument },
        ],
      });

      if (result.errors?.length) {
        setSubmitMessage(result.errors[0].message ?? "Failed to update offer.");
        return;
      }

      await Promise.all([refetchBenefitRequests(), refetchMyBenefits()]);

      if (accepted) {
        setStep(3);
        setSubmitMessage(
          "Offer accepted. Upload your signed contract to continue.",
        );
        return;
      }

      onSuccess();
      onClose();
    } catch (error) {
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : "Failed to update your finance offer decision.",
      );
    }
  };

  if (loading || (isFinanceFlow && requestsLoading)) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <div
          className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <PageLoading message="Loading..." />
        </div>
      </div>
    );
  }

  if (error || !benefitEligibility || !benefit) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:bg-accent hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-destructive">
            This benefit could not be loaded.
          </div>
        </div>
      </div>
    );
  }

  const financeContinuationStatuses = new Set([
    "awaiting_employee_decision",
    "awaiting_employee_signed_contract",
    "awaiting_final_finance_approval",
  ]);
  const allowFinanceContinuation =
    isFinanceFlow &&
    latestFinanceRequest?.status != null &&
    financeContinuationStatuses.has(latestFinanceRequest.status);

  const canOpenFinanceStep1 =
    isFinanceFlow &&
    !hasActiveApprovedDownPaymentLoan &&
    (benefitEligibility.status === BenefitEligibilityStatus.Eligible ||
      benefitEligibility.status === BenefitEligibilityStatus.Active);

  if (
    isFinanceFlow &&
    !allowFinanceContinuation &&
    !canOpenFinanceStep1
  ) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:bg-accent hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-destructive">
            {hasActiveApprovedDownPaymentLoan
              ? `You can request this loan again after ${formatMnDate(
                  activeApprovedDownPaymentLoan?.repaidAt as Date,
                )}.`
              : "This benefit is not currently requestable."}
          </div>
        </div>
      </div>
    );
  }

  if (isSelfService) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:bg-accent hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
            This benefit is self-service and does not require a request.
          </div>
        </div>
      </div>
    );
  }

  // ── Finance Benefit (down_payment): 3-step flow ─────────────────────────
  if (isFinanceFlow) {
    const reqId = latestFinanceRequest?.id;
    const financeOfferContractUrl = getContractProxyUrl(
      latestFinanceRequest?.financeContractViewUrl,
    );
    const awaitingFinanceOffer =
      latestFinanceRequest?.status === "awaiting_finance_review";
    const financeOfferReady =
      latestFinanceRequest?.status === "awaiting_employee_decision";
    const awaitingSignedContract =
      latestFinanceRequest?.status === "awaiting_employee_signed_contract";
    const awaitingFinalFinanceApproval =
      latestFinanceRequest?.status === "awaiting_final_finance_approval";

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <div
          className="relative flex max-h-[95vh] w-full max-w-2xl flex-col gap-6 overflow-y-auto rounded-2xl bg-gray-50 p-6 shadow-2xl ring-1 ring-black/5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute right-4 top-4 z-20 rounded-full border border-white/80 bg-white/95 p-2 text-gray-400 shadow-sm transition hover:bg-white hover:text-gray-600 hover:shadow-md"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <Stepper currentStep={step} variant="finance" />

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-800">
              Loan cycle
            </p>
            <div className="mt-3 space-y-2 text-sm">
              {(() => {
                const requestDone = Boolean(latestFinanceRequest);
                const eligibilityDone =
                  benefitEligibility.status ===
                    BenefitEligibilityStatus.Eligible ||
                  benefitEligibility.status ===
                    BenefitEligibilityStatus.Active;
                const approvalState: "done" | "active" | "waiting" =
                  approvalDone
                    ? "done"
                    : latestFinanceRequest
                      ? "active"
                      : "waiting";
                const requestState: "done" | "active" | "waiting" = requestDone
                  ? "done"
                  : step === 1
                    ? "active"
                    : "waiting";
                const eligibilityState: "done" | "active" | "waiting" =
                  eligibilityDone ? "done" : "waiting";
                const repaymentState: "done" | "active" | "waiting" =
                  repaymentDone
                    ? "done"
                    : repaymentActive
                      ? "active"
                      : "waiting";

                const pillClass = (s: "done" | "active" | "waiting") =>
                  s === "done"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : s === "active"
                      ? "bg-amber-50 text-amber-800 border border-amber-200"
                      : "bg-gray-50 text-gray-500 border border-gray-200";

                const pillText = (
                  s: "done" | "active" | "waiting",
                  label: string,
                ) => (s === "done" ? `✓ ${label}` : s === "active" ? label : `Waiting: ${label}`);

                return (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-700">Хүсэлт</span>
                      <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${pillClass(requestState)}`}>
                        {pillText(requestState, "Submitted")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-700">Шалгуур</span>
                      <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${pillClass(eligibilityState)}`}>
                        {pillText(eligibilityState, "Eligible")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-700">Батлах</span>
                      <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${pillClass(approvalState)}`}>
                        {pillText(approvalState, "Approved")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-700">Эргэн төлөлт</span>
                      <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${pillClass(repaymentState)}`}>
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

          <div className="rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm">
            {step === 1 && (
              <>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">
                  Loan request
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Enter the amount you need and how many months you will repay.
                  Finance reviews the request, prepares the final offer, and
                  sends you a request-specific contract if the request is
                  feasible.
                </p>

                <div className="mt-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      {benefitEligibility.status ===
                      BenefitEligibilityStatus.Active
                        ? "Your previous loan cycle is complete"
                        : "You are eligible for this loan request"}
                    </p>
                    <p className="mt-0.5 text-xs text-green-700">
                      {benefitEligibility.status ===
                      BenefitEligibilityStatus.Active
                        ? "You can submit a new loan request now."
                        : "All eligibility requirements have been met."}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Requested amount (₮) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="e.g. 3500000"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder-gray-300 focus:border-gray-400 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Repayment period (months){" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={repaymentMonths}
                      onChange={(e) => setRepaymentMonths(e.target.value)}
                      placeholder="e.g. 24"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder-gray-300 focus:border-gray-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-[1fr_auto] gap-x-8 gap-y-2 text-sm">
                  <span className="text-gray-500">Benefit</span>
                  <span className="text-right font-medium text-gray-900">
                    {benefit.name}
                  </span>
                  <span className="text-gray-500">Approval</span>
                  <span className="text-right font-medium capitalize text-gray-900">
                    {benefit.approvalPolicy ?? "HR"}
                  </span>
                </div>

                {awaitingFinanceOffer && (
                  <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
                    Your request has been submitted and is currently under
                    Finance review.
                  </div>
                )}

                {submitMessage && (
                  <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {submitMessage}
                  </div>
                )}

                <button
                  type="button"
                  onClick={submitFinanceRequest}
                  disabled={isWorking || !canOpenFinanceStep1}
                  className="mt-6 h-12 w-full rounded-xl bg-gray-900 text-base font-medium text-white shadow-md transition hover:bg-gray-800 active:scale-[0.99] disabled:opacity-40"
                >
                  {submitting ? "Submitting…" : "Request"}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="text-xl font-bold text-gray-900">
                  Review finance offer
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Finance prepared the final loan terms and attached your
                  request-specific contract. Review the offer carefully before
                  you accept it.
                </p>

                <div className="mt-6 flex items-start gap-3 rounded-xl border border-cyan-200 bg-cyan-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-cyan-600" />
                  <div>
                    <p className="text-sm font-semibold text-cyan-800">
                      Finance offer ready
                    </p>
                    {latestFinanceRequest?.financeProposedAmount != null && (
                      <p className="mt-1 text-xs text-cyan-700">
                        Offer:{" "}
                        {Number(
                          latestFinanceRequest.financeProposedAmount,
                        ).toLocaleString()}
                        ₮
                        {latestFinanceRequest.financeProposedRepaymentMonths !=
                          null &&
                          ` · ${latestFinanceRequest.financeProposedRepaymentMonths} months`}
                      </p>
                    )}
                  </div>
                </div>

                {latestFinanceRequest?.financeProposalNote && (
                  <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                    {latestFinanceRequest.financeProposalNote}
                  </div>
                )}

                <div className="mt-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Finance contract
                  </p>
                  {financeOfferContractUrl ? (
                    <>
                      <iframe
                        src={financeOfferContractUrl}
                        className="h-[220px] w-full rounded-2xl border border-gray-200 bg-gray-50"
                        title="Finance contract"
                      />
                      <a
                        href={financeOfferContractUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4" />
                        Download / open contract
                      </a>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500">
                      Finance has not attached the contract yet.
                    </div>
                  )}
                </div>

                {submitMessage && (
                  <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {submitMessage}
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => void respondToOffer(false)}
                    disabled={isWorking || !financeOfferReady}
                    className="h-12 flex-1 rounded-xl border border-red-200 bg-white text-base font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                  >
                    {respondingToOffer ? "Saving…" : "Decline Offer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void respondToOffer(true)}
                    disabled={
                      isWorking ||
                      !financeOfferReady ||
                      !financeOfferContractUrl
                    }
                    className="h-12 flex-1 rounded-xl bg-blue-600 text-base font-medium text-white shadow-md transition hover:bg-blue-700 disabled:opacity-40"
                  >
                    {respondingToOffer ? "Saving…" : "Accept Offer"}
                  </button>
                </div>
              </>
            )}

            {step === 3 && reqId && (
              <>
                <h1 className="text-xl font-bold text-gray-900">
                  Signed contract
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Download the finance contract, sign it, then upload a scan or
                  photo. The benefit activates only after final finance-manager
                  approval.
                </p>

                <div className="mt-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Finance contract
                  </p>
                  {financeOfferContractUrl ? (
                    <>
                      <iframe
                        src={financeOfferContractUrl}
                        className="h-[220px] w-full rounded-2xl border border-gray-200 bg-gray-50"
                        title="Finance contract"
                      />
                      <a
                        href={financeOfferContractUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4" />
                        Download / open contract
                      </a>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Finance has not attached the contract yet. Please check
                        back later.
                      </p>
                    </div>
                  )}
                </div>

                {awaitingFinalFinanceApproval ? (
                  <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 text-sm text-indigo-800">
                    Your signed contract has been uploaded. We are waiting for a
                    finance manager to give the final approval.
                  </div>
                ) : (
                  <div
                    className={`relative mt-6 flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center transition ${
                      employeeSignedContract?.id
                        ? "border-emerald-300 bg-emerald-50"
                        : uploadError
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40"
                    }`}
                    onClick={() =>
                      !employeeSignedContract?.id &&
                      !uploading &&
                      awaitingSignedContract &&
                      fileInputRef.current?.click()
                    }
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setEmployeeSignedContract(null);
                          setUploadedFileName(null);
                          void handleFileUpload(file, { financeRequestId: reqId });
                        }
                        e.target.value = "";
                      }}
                    />
                    {uploading ? (
                      <>
                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                        <p className="text-sm font-medium text-blue-700">
                          Uploading…
                        </p>
                      </>
                    ) : employeeSignedContract?.id ? (
                      <>
                        <CheckCircle2 className="h-11 w-11 text-emerald-500" />
                        <p className="text-sm font-semibold text-emerald-700">
                          Signed contract uploaded
                        </p>
                        {uploadedFileName && (
                          <p className="text-xs text-emerald-600">
                            {uploadedFileName}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-8 w-8 text-gray-400" />
                        <p className="text-sm font-semibold text-gray-700">
                          Click to upload signed contract
                        </p>
                        <p className="text-xs text-gray-400">
                          PDF, PNG, or JPG — max 10MB
                        </p>
                      </>
                    )}
                  </div>
                )}

                {uploadError && (
                  <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {uploadError}
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (financeOfferReady) {
                        setStep(2);
                        return;
                      }
                      onClose();
                    }}
                    className="h-10 flex-1 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {financeOfferReady ? "Back" : "Close"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Default: contract / normal flow ───────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[95vh] w-full max-w-2xl flex-col gap-6 overflow-y-auto rounded-2xl bg-gray-50 p-6 shadow-2xl ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-4 top-4 z-20 rounded-full border border-white/80 bg-white/95 p-2 text-gray-400 shadow-sm transition hover:bg-white hover:text-gray-600 hover:shadow-md"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <Stepper currentStep={step} requiresContract={requiresContract} />

        <div className="rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm">
          {step === 1 && (
            <>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Contract Review
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Review the benefit details and the contract provided by HR.
              </p>

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    You are eligible for this benefit
                  </p>
                  <p className="mt-0.5 text-xs text-green-700">
                    All eligibility requirements have been met.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-[1fr_auto] gap-x-8 gap-y-3 text-sm">
                <span className="text-gray-500">Benefit Name</span>
                <span className="text-right font-medium text-gray-900">
                  {benefit.name}
                </span>
                <span className="text-gray-500">Vendor</span>
                <span className="text-right font-medium text-gray-900">
                  {benefit.vendorName ?? "Internal Benefit"}
                </span>
                <span className="text-gray-500">Company Subsidy</span>
                <span className="text-right font-medium text-emerald-700">
                  {benefit.subsidyPercent}%
                </span>
                <span className="text-gray-500">Employee Contribution</span>
                <span className="text-right font-medium text-gray-900">
                  {benefit.employeePercent}%
                </span>
                <span className="text-gray-500">Approval Required</span>
                <span className="text-right font-medium capitalize text-gray-900">
                  {benefit.approvalPolicy ?? "HR"}
                </span>
              </div>

              {requiresContract && (
                <div className="mt-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    HR Contract
                  </p>
                  {contractsLoading ? (
                    <div className="flex h-[280px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                      <PageLoading inline message="Loading contract…" />
                    </div>
                  ) : contractUrl ? (
                    <>
                      <iframe
                        src={contractUrl}
                        className="h-[280px] w-full rounded-2xl border border-gray-200 bg-gray-50"
                        title={`${benefit.vendorName ?? benefit.name} Contract`}
                      />
                      <div className="mt-2 flex items-center gap-4">
                        <a
                          href={contractUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open in new tab
                        </a>
                        {activeContract?.version && (
                          <span className="text-xs text-gray-400">
                            Version {activeContract.version}
                          </span>
                        )}
                        {activeContract?.effectiveDate && (
                          <span className="text-xs text-gray-400">
                            Effective {activeContract.effectiveDate}
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex h-[160px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 text-center">
                      <div className="rounded-full bg-gray-100 p-3">
                        <FileText className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {activeContract
                            ? "Preview Unavailable"
                            : "No Active Contract Found"}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          Contact your HR team for contract details
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {contractStepBlocked ? (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                  No active contract has been uploaded for this benefit yet.
                  Please contact HR before continuing.
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep(requiresContract ? 2 : 3)}
                  className="mt-6 h-12 w-full rounded-xl bg-gray-900 text-base font-medium text-white shadow-md transition hover:bg-gray-800 active:scale-[0.99]"
                >
                  Continue
                </button>
              )}
            </>
          )}

          {step === 2 && requiresContract && (
            <>
              <h1 className="text-xl font-semibold text-gray-900">
                Upload Your Signed Contract
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Sign the HR contract and upload it here before submitting your
                request.
              </p>

              <div
                className={`relative mt-6 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center transition ${
                  employeeSignedContract?.id
                    ? "border-emerald-300 bg-emerald-50"
                    : uploadError
                      ? "border-red-300 bg-red-50"
                      : "cursor-pointer border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40"
                }`}
                onClick={() =>
                  !employeeSignedContract?.id &&
                  !uploading &&
                  fileInputRef.current?.click()
                }
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEmployeeSignedContract(null);
                      setUploadedFileName(null);
                      void handleFileUpload(file);
                    }
                    e.target.value = "";
                  }}
                />

                {uploading ? (
                  <>
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                    <p className="text-sm font-medium text-blue-700">
                      Uploading…
                    </p>
                  </>
                ) : employeeSignedContract?.id ? (
                  <>
                    <CheckCircle2 className="h-11 w-11 text-emerald-500" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-700">
                        Contract uploaded successfully
                      </p>
                      {uploadedFileName && (
                        <p className="mt-0.5 text-xs text-emerald-600">
                          {uploadedFileName}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {employeeSignedContract.viewUrl && (
                        <a
                          href={
                            getContractProxyUrl(
                              employeeSignedContract.viewUrl,
                            ) ?? employeeSignedContract.viewUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open uploaded copy
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEmployeeSignedContract(null);
                          setUploadedFileName(null);
                          fileInputRef.current?.click();
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50"
                      >
                        Replace file
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-full bg-gray-100 p-4">
                      <UploadCloud className="h-7 w-7 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Click to upload your signed contract
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        PDF, PNG, JPG supported
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      <UploadCloud className="h-4 w-4" />
                      Select File
                    </button>
                  </>
                )}
              </div>

              {uploadError && (
                <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {uploadError}
                </div>
              )}

              <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
                Make sure your signed contract matches the HR contract shown in
                the previous step.
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="h-12 flex-1 rounded-xl border border-gray-200 bg-white text-base font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.99]"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!employeeSignedContract?.id || uploading}
                  onClick={() => setStep(3)}
                  className="h-12 flex-[2] rounded-xl bg-blue-600 text-base font-medium text-white transition hover:bg-blue-700 active:scale-[0.99] disabled:bg-gray-300 disabled:active:scale-100"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-xl font-semibold text-gray-900">
                Submit Request
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Review and submit for approval.
              </p>

              <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/50 px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Summary
                </p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Benefit</dt>
                    <dd className="font-medium text-gray-900">{benefit.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Vendor</dt>
                    <dd className="font-medium text-gray-900">
                      {benefit.vendorName ?? "Internal"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Subsidy</dt>
                    <dd className="font-medium text-emerald-700">
                      {benefit.subsidyPercent}%
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Approval</dt>
                    <dd className="font-medium capitalize text-gray-900">
                      {benefit.approvalPolicy ?? "HR"}
                    </dd>
                  </div>
                  {requiresContract && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Your Contract</dt>
                      <dd
                        className={`font-medium ${employeeSignedContract?.id ? "text-emerald-700" : "text-orange-600"}`}
                      >
                        {employeeSignedContract?.id
                          ? `✓ Uploaded${uploadedFileName ? ` (${uploadedFileName})` : ""}`
                          : "Not uploaded"}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                <p className="text-sm font-medium text-blue-900">
                  What happens next?
                </p>
                <p className="mt-1 text-xs leading-5 text-blue-700">
                  After this request is submitted and HR approves it, you will
                  continue to
                  <span className="font-semibold"> Step 4: Payment</span>, then
                  finish with
                  <span className="font-semibold">
                    {" "}
                    Step 5: Submit Payment
                  </span>{" "}
                  so HR can verify your transfer before activation.
                </p>
              </div>

              {submitMessage && (
                <div className="mt-4 rounded-lg border border-red-100 bg-red-50/80 px-3 py-2 text-xs text-red-700">
                  {submitMessage}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(requiresContract ? 2 : 1)}
                  className="h-10 flex-1 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.99]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={submitRequest}
                  disabled={
                    isWorking ||
                    (requiresContract && !employeeSignedContract?.id)
                  }
                  className="h-10 flex-[2] rounded-lg bg-gray-900 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.99] disabled:bg-gray-300 disabled:active:scale-100"
                >
                  {isWorking ? "Submitting…" : "Submit Request"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
