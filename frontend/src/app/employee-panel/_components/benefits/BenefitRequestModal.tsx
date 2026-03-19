"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  ExternalLink,
  FileText,
  CheckCircle,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Stepper from "./Stepper";
import PageLoading from "@/app/_components/PageLoading";
import {
  BenefitEligibilityStatus,
  BenefitFlowType,
  GetBenefitRequestsDocument,
  useGetMyBenefitsQuery,
  useGetBenefitRequestsQuery,
  useGetContractsForBenefitQuery,
  useRequestBenefitMutation,
  useConfirmBenefitRequestMutation,
} from "@/graphql/generated/graphql";
import { getContractProxyUrl } from "@/lib/contracts";

function getApiBase(): string {
  const base =
    typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GRAPHQL_URL
      ? process.env.NEXT_PUBLIC_GRAPHQL_URL
      : "https://team8-api.team8pinequest.workers.dev/";
  return base.replace(/\/$/, "");
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
  const { data, error, loading } = useGetMyBenefitsQuery();
  const { data: requestsData } = useGetBenefitRequestsQuery();
  const [requestBenefit, { loading: submitting }] = useRequestBenefitMutation();
  const [confirmBenefitRequest, { loading: confirming }] =
    useConfirmBenefitRequestMutation();

  const financeApprovedRequest = requestsData?.benefitRequests.find(
    (r) => r.benefitId === benefitId && r.status === "finance_approved"
  ) ?? null;

  const [step, setStep] = useState<1 | 2 | 3>(financeApprovedRequest ? 3 : 1);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(financeApprovedRequest?.id ?? null);
  const [requestedAmount, setRequestedAmount] = useState<string>("");
  const [repaymentMonths, setRepaymentMonths] = useState<string>("");
  const [employeeSignedContract, setEmployeeSignedContract] =
    useState<UploadedEmployeeSignedContract | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const benefitEligibility = data?.myBenefits.find(
    (item) => item.benefitId === benefitId,
  );
  const benefit = benefitEligibility?.benefit;
  const isFinanceBenefit = benefit?.flowType === BenefitFlowType.DownPayment;
  const requiresContract = !isFinanceBenefit && (benefit?.requiresContract ?? false);
  const isSelfService = benefit?.flowType === BenefitFlowType.SelfService;

  const { data: contractsData, loading: contractsLoading } =
    useGetContractsForBenefitQuery({
      variables: { benefitId },
      skip: (!requiresContract && !isFinanceBenefit) || !benefitId,
    });
  const activeContract =
    contractsData?.contracts.find((c) => c.isActive) ?? null;
  const contractUrl = getContractProxyUrl(activeContract?.viewUrl);
  const hasReviewableContract = Boolean(activeContract?.viewUrl);
  const contractStepBlocked =
    requiresContract && !contractsLoading && !hasReviewableContract;

  const isWorking = submitting || confirming || uploading;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // ── Auto-advance to step 3 when finance approves ─────────────────────────
  useEffect(() => {
    if (step === 2 && isFinanceBenefit) {
      const approved = requestsData?.benefitRequests.find(
        (r) => r.benefitId === benefitId && r.status === "finance_approved"
      );
      if (approved) {
        setCreatedRequestId(approved.id);
        setStep(3);
      }
    }
  }, [requestsData, step, isFinanceBenefit, benefitId]);

  // ── Employee contract upload ─────────────────────────────────────────────
  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setUploading(true);
    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("benefitId", benefitId);
      fd.append("file", file);
      const res = await fetch(`${getApiBase()}/api/contracts/employee-upload`, {
        method: "POST",
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error((err as { error?: string }).error ?? "Upload failed");
      }
      const json = (await res.json()) as UploadedEmployeeSignedContract;
      setEmployeeSignedContract(json);
      setUploadedFileName(json.fileName ?? file.name);
    } catch (e) {
      setUploadError(
        e instanceof Error ? e.message : "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  // ── Submit request ───────────────────────────────────────────────────────
  const submitRequest = async () => {
    if (!benefitEligibility || !benefit) return;
    setSubmitMessage(null);

    if (requiresContract && !employeeSignedContract?.id) {
      setStep(2);
      return;
    }

    if (isFinanceBenefit && !employeeSignedContract?.id) {
      setSubmitMessage("Please upload your signed agreement before submitting.");
      return;
    }

    try {
      // Finance step 3: confirm existing request with signed contract
      if (isFinanceBenefit && createdRequestId) {
        const confirmResult = await confirmBenefitRequest({
          variables: { requestId: createdRequestId, contractAccepted: true },
          refetchQueries: [{ query: GetBenefitRequestsDocument }],
        });
        if (confirmResult.errors?.length) {
          setSubmitMessage(confirmResult.errors[0].message ?? "Failed to submit.");
          return;
        }
        onSuccess();
        onClose();
        return;
      }

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

      if (createdRequest.status === "awaiting_contract_acceptance") {
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

  // ── Finance: submit loan request at step 2 ──────────────────────────────
  const submitLoanRequest = async () => {
    if (!benefit) return;
    setSubmitMessage(null);
    setStep(2);
    try {
      const result = await requestBenefit({
        variables: {
          input: {
            benefitId: benefit.id,
            requestedAmount: Number(requestedAmount),
            repaymentMonths: Number(repaymentMonths),
          },
        },
        refetchQueries: [{ query: GetBenefitRequestsDocument }],
      });
      const errs = result.errors;
      if (errs?.length) {
        setSubmitMessage(errs[0].message ?? "Failed to submit request.");
        return;
      }
      const req = result.data?.requestBenefit;
      if (!req) {
        setSubmitMessage("Failed to submit request.");
        return;
      }
      setCreatedRequestId(req.id);
    } catch (e) {
      setSubmitMessage(e instanceof Error ? e.message : "Failed to submit request.");
    }
  };

  // ── Guards ────────────────────────────────────────────────────────────────
  if (loading) {
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

  if (benefitEligibility.status !== BenefitEligibilityStatus.Eligible) {
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
            This benefit is not currently requestable.
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-2xl flex-col gap-6 rounded-2xl bg-gray-50 p-6 shadow-2xl ring-1 ring-black/5 max-h-[95vh] overflow-y-auto"
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

        <Stepper currentStep={step} requiresContract={requiresContract} isFinanceBenefit={isFinanceBenefit} />

        <div className="rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm">
          {/* ── Step 1: Contract Review ── */}
          {step === 1 && (
            <>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                {isFinanceBenefit ? "Loan Request" : "Contract Review"}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {isFinanceBenefit
                  ? "Fill in your loan details below. Finance and HR will review your request."
                  : "Review the benefit details and the contract provided by HR."}
              </p>

              {/* Eligibility banner */}
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    You are eligible for this benefit
                  </p>
                  <p className="mt-0.5 text-xs text-green-700">
                    All eligibility requirements have been met.
                  </p>
                </div>
              </div>

              {/* Benefit details */}
              <div className="mt-5 grid grid-cols-[1fr_auto] gap-x-8 gap-y-3 text-sm">
                <span className="text-gray-500">Benefit Name</span>
                <span className="font-medium text-gray-900 text-right">
                  {benefit.name}
                </span>
                <span className="text-gray-500">Vendor</span>
                <span className="font-medium text-gray-900 text-right">
                  {benefit.vendorName ?? "Internal Benefit"}
                </span>
                <span className="text-gray-500">Company Subsidy</span>
                <span className="font-medium text-emerald-700 text-right">
                  {benefit.subsidyPercent}%
                </span>
                <span className="text-gray-500">Employee Contribution</span>
                <span className="font-medium text-gray-900 text-right">
                  {benefit.employeePercent}%
                </span>
                <span className="text-gray-500">Approval Required</span>
                <span className="font-medium capitalize text-gray-900 text-right">
                  {benefit.approvalPolicy ?? "HR"}
                </span>
              </div>

              {/* Finance: Loan request fields */}
              {isFinanceBenefit && (
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
                    Enter the amount you wish to borrow and how many months you plan to repay it. Finance team will review and propose a repayment plan.
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Requested Amount (₮) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={requestedAmount}
                        onChange={(e) => setRequestedAmount(e.target.value)}
                        placeholder="e.g. 5,000,000"
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder-gray-300 transition focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Repayment Period (months) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={repaymentMonths}
                        onChange={(e) => setRepaymentMonths(e.target.value)}
                        placeholder="e.g. 12"
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder-gray-300 transition focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  {requestedAmount && repaymentMonths && Number(requestedAmount) > 0 && Number(repaymentMonths) > 0 && (
                    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Estimated Monthly Payment</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ₮{Math.ceil(Number(requestedAmount) / Number(repaymentMonths)).toLocaleString()}
                        <span className="ml-1 text-sm font-normal text-gray-400">/ month</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* HR Contract iframe */}
              {requiresContract && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
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
                  disabled={
                    isFinanceBenefit
                      ? (!requestedAmount || Number(requestedAmount) <= 0 || !repaymentMonths || Number(repaymentMonths) <= 0 || submitting)
                      : false
                  }
                  onClick={isFinanceBenefit ? submitLoanRequest : () => setStep(requiresContract ? 2 : 3)}
                  className="mt-6 h-12 w-full rounded-xl bg-gray-900 text-base font-medium text-white shadow-md transition hover:bg-gray-800 active:scale-[0.99] disabled:bg-gray-300 disabled:active:scale-100"
                >
                  {isFinanceBenefit ? (submitting ? "Илгээж байна…" : "Хүсэлт илгээх") : "Continue"}
                </button>
              )}
            </>
          )}

          {/* ── Step 2: Pending Finance Approval ── */}
          {step === 2 && isFinanceBenefit && (
            <>
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${submitting ? "bg-blue-50" : createdRequestId ? "bg-green-50" : "bg-red-50"}`}>
                  {submitting ? (
                    <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
                  ) : createdRequestId ? (
                    <CheckCircle2 className="h-9 w-9 text-green-500" />
                  ) : (
                    <X className="h-9 w-9 text-red-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {submitting ? "Илгээж байна…" : createdRequestId ? "Хүсэлт илгээгдлээ" : "Алдаа гарлаа"}
                  </h1>
                  <p className="mt-2 text-sm text-gray-500">
                    Таны зээлийн хүсэлтийг санхүүгийн баг хянаж байна. Батлагдсаны дараа танд мэдэгдэнэ.
                  </p>
                </div>
                <div className="w-full rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 text-left">
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-400 mb-3">Хүсэлтийн дэлгэрэнгүй</p>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Зээлийн дүн</dt>
                      <dd className="font-medium text-gray-900">₮{Number(requestedAmount).toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Эргэн төлөх хугацаа</dt>
                      <dd className="font-medium text-gray-900">{repaymentMonths} сар</dd>
                    </div>
                    <div className="flex justify-between border-t border-blue-100 pt-2">
                      <dt className="text-gray-500">Сарын төлбөрийн тооцоо</dt>
                      <dd className="font-semibold text-blue-700">₮{Math.ceil(Number(requestedAmount) / Number(repaymentMonths)).toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
                {submitMessage ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 w-full">
                    {submitMessage}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700 w-full">
                    <span>Санхүүгийн баг таны хүсэлтийг хянаж, батлах эсвэл буцаах болно.</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                disabled={!requestsData?.benefitRequests.find(
                  (r) => r.benefitId === benefitId && r.status === "finance_approved"
                )}
                onClick={() => setStep(3)}
                className="mt-2 h-12 w-full rounded-xl bg-gray-900 text-base font-medium text-white transition hover:bg-gray-800 active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </>
          )}

          {/* ── Step 2: Upload Contract ── */}
          {step === 2 && requiresContract && (
            <>
              <h1 className="text-xl font-semibold text-gray-900">
                Upload Your Signed Contract
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Sign the HR contract and upload it here before submitting your
                request.
              </p>

              {/* Upload area */}
              <div
                className={`mt-6 relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center transition ${
                  employeeSignedContract?.id
                    ? "border-emerald-300 bg-emerald-50"
                    : uploadError
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40 cursor-pointer"
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
                      handleFileUpload(file);
                    }
                    e.target.value = "";
                  }}
                />

                {uploading ? (
                  <>
                    <div className="h-10 w-10 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
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

          {/* ── Step 3: Submit ── */}
          {step === 3 && (
            <>
              <h1 className="text-xl font-semibold text-gray-900">Submit Request</h1>
              <p className="mt-1 text-sm text-gray-500">
                {isFinanceBenefit
                  ? "Upload your signed agreement and submit. Finance team will review first, then HR will give final approval."
                  : "Review and submit for approval."}
              </p>

              {/* Summary */}
              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/50 px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Summary</p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Benefit</dt>
                    <dd className="font-medium text-gray-900">
                      {benefit.name}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Vendor</dt>
                    <dd className="font-medium text-gray-900">
                      {benefit.vendorName ?? "Internal"}
                    </dd>
                  </div>
                  {isFinanceBenefit && requestedAmount && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Requested Amount</dt>
                      <dd className="font-medium text-gray-900">₮{Number(requestedAmount).toLocaleString()}</dd>
                    </div>
                  )}
                  {isFinanceBenefit && repaymentMonths && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Repayment Period</dt>
                      <dd className="font-medium text-gray-900">{repaymentMonths} months</dd>
                    </div>
                  )}
                  {isFinanceBenefit && requestedAmount && repaymentMonths && Number(requestedAmount) > 0 && Number(repaymentMonths) > 0 && (
                    <div className="flex justify-between border-t border-gray-100 pt-2">
                      <dt className="text-gray-500">Est. Monthly Payment</dt>
                      <dd className="font-semibold text-blue-700">₮{Math.ceil(Number(requestedAmount) / Number(repaymentMonths)).toLocaleString()}</dd>
                    </div>
                  )}
                  {!isFinanceBenefit && (
                    <>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Subsidy</dt>
                        <dd className="font-medium text-emerald-700">{benefit.subsidyPercent}%</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Approval</dt>
                        <dd className="font-medium capitalize text-gray-900">{benefit.approvalPolicy ?? "HR"}</dd>
                      </div>
                    </>
                  )}
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

              {/* Finance: upload signed contract */}
              {isFinanceBenefit && (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Upload Signed Agreement <span className="text-red-400">*</span></p>
                  <div
                    className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 text-center transition ${
                      employeeSignedContract?.id
                        ? "border-emerald-300 bg-emerald-50"
                        : uploadError
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40 cursor-pointer"
                    }`}
                    onClick={() => !employeeSignedContract?.id && !uploading && fileInputRef.current?.click()}
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
                          handleFileUpload(file);
                        }
                        e.target.value = "";
                      }}
                    />
                    {uploading ? (
                      <>
                        <div className="h-10 w-10 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
                        <p className="text-sm font-medium text-blue-700">Uploading…</p>
                      </>
                    ) : employeeSignedContract?.id ? (
                      <>
                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        <div>
                          <p className="text-sm font-semibold text-emerald-700">Signed agreement uploaded</p>
                          {uploadedFileName && <p className="mt-0.5 text-xs text-emerald-600">{uploadedFileName}</p>}
                        </div>
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
                      </>
                    ) : (
                      <>
                        <div className="rounded-full bg-gray-100 p-4">
                          <UploadCloud className="h-7 w-7 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Upload your signed agreement</p>
                          <p className="mt-1 text-xs text-gray-400">PDF, PNG, JPG supported</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                          <UploadCloud className="h-4 w-4" />
                          Select File
                        </button>
                      </>
                    )}
                  </div>
                  {uploadError && (
                    <div className="mt-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">{uploadError}</div>
                  )}
                </div>
              )}

              {/* HR Contract preview (non-finance only) */}
              {!isFinanceBenefit && contractUrl && (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">HR Contract</p>
                  <iframe
                    src={contractUrl}
                    className="h-[280px] w-full rounded-2xl border border-gray-200 bg-gray-50"
                    title={`${benefit.vendorName ?? benefit.name} Contract`}
                  />
                  <div className="mt-2 flex items-center gap-4">
                    <a href={contractUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
                      <ExternalLink className="h-3 w-3" />
                      Open in new tab
                    </a>
                    {activeContract?.version && <span className="text-xs text-gray-400">Version {activeContract.version}</span>}
                    {activeContract?.effectiveDate && <span className="text-xs text-gray-400">Effective {activeContract.effectiveDate}</span>}
                  </div>
                </div>
              )}

              {submitMessage && (
                <div className="mt-4 rounded-lg border border-red-100 bg-red-50/80 px-3 py-2 text-xs text-red-700">
                  {submitMessage}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(requiresContract || isFinanceBenefit ? 2 : 1)}
                  className="h-10 flex-1 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.99]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={submitRequest}
                  disabled={isWorking || (requiresContract && !employeeSignedContract?.id) || (isFinanceBenefit && !employeeSignedContract?.id)}
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
