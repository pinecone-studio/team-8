"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ExternalLink, FileText, UploadCloud, CheckCircle2, X } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Stepper from "../../../_components/benefits/Stepper";
import Sidebar from "@/app/employee-panel/_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import {
  BenefitEligibilityStatus,
  BenefitFlowType,
  GetBenefitRequestsDocument,
  useGetMyBenefitsQuery,
  useGetContractsForBenefitQuery,
  useRequestBenefitMutation,
  useConfirmBenefitRequestMutation,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/use-current-employee";
import { getContractProxyUrl } from "@/lib/contracts";

function getApiBase(): string {
  const base =
    typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GRAPHQL_URL
      ? process.env.NEXT_PUBLIC_GRAPHQL_URL
      : "https://team8-api.team8pinequest.workers.dev/";
  return base.replace(/\/$/, "");
}

function formatPrice(amount: number | null | undefined): string {
  if (!amount) return "—";
  return amount.toLocaleString("mn-MN") + "₮";
}

type UploadedEmployeeSignedContract = {
  id: string;
  key: string;
  fileName?: string | null;
  uploadedAt?: string | null;
  viewUrl?: string | null;
};

export default function BenefitRequestPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { getToken } = useAuth();
  const { loading: employeeLoading } = useCurrentEmployee();
  const { data, error, loading } = useGetMyBenefitsQuery();
  const [requestBenefit, { loading: submitting }] = useRequestBenefitMutation();
  const [confirmBenefitRequest, { loading: confirming }] = useConfirmBenefitRequestMutation();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [employeeSignedContract, setEmployeeSignedContract] =
    useState<UploadedEmployeeSignedContract | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const benefitEligibility = data?.myBenefits.find((item) => item.benefitId === id);
  const benefit = benefitEligibility?.benefit;
  const requiresContract = benefit?.requiresContract ?? false;
  const isSelfService = benefit?.flowType === BenefitFlowType.SelfService;

  const { data: contractsData, loading: contractsLoading } = useGetContractsForBenefitQuery({
    variables: { benefitId: id },
    skip: !requiresContract || !id,
  });
  const activeContract = contractsData?.contracts.find((c) => c.isActive) ?? null;
  const contractUrl = getContractProxyUrl(activeContract?.viewUrl);
  const hasReviewableContract = Boolean(activeContract?.viewUrl);
  const contractStepBlocked = requiresContract && !contractsLoading && !hasReviewableContract;

  const isWorking = submitting || confirming || uploading;

  // ── Employee contract upload ─────────────────────────────────────────────
  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setUploading(true);
    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("benefitId", id);
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
      setUploadError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ── Submit request ───────────────────────────────────────────────────────
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

      if (requiresContract && createdRequest.status === "awaiting_contract_acceptance") {
        const confirmResult = await confirmBenefitRequest({
          variables: { requestId: createdRequest.id, contractAccepted: true },
          refetchQueries: [{ query: GetBenefitRequestsDocument }],
        });
        if (confirmResult.errors?.length) {
          setSubmitMessage(confirmResult.errors[0].message ?? "Contract acceptance failed.");
          return;
        }
      }

      router.push("/employee-panel/requests?submitted=true");
    } catch (e) {
      setSubmitMessage(e instanceof Error ? e.message : "Failed to submit request.");
    }
  };

  // ── Guards ────────────────────────────────────────────────────────────────
  if (employeeLoading || loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col items-center">
          <main className="flex w-full max-w-7xl items-center justify-center p-8">
            <PageLoading message="Loading request flow..." />
          </main>
        </div>
      </div>
    );
  }

  if (error || !benefitEligibility || !benefit) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col items-center">
          <main className="w-full max-w-7xl p-8">
            <Link href={`/employee-panel/benefits/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground active:opacity-80">
              ← Back to Benefit
            </Link>
            <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-destructive">
              This benefit could not be loaded.
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (benefitEligibility.status !== BenefitEligibilityStatus.Eligible) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col items-center">
          <main className="w-full max-w-7xl p-8">
            <Link href={`/employee-panel/benefits/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground active:opacity-80">
              ← Back to Benefit
            </Link>
            <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-destructive">
              This benefit is not currently requestable.
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isSelfService) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col items-center">
          <main className="w-full max-w-7xl p-8">
            <Link href={`/employee-panel/benefits/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground active:opacity-80">
              ← Back to Benefit
            </Link>
            <div className="mt-6 rounded-2xl border border-border bg-card p-8 text-muted-foreground">
              This benefit is self-service and does not require a request.
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ── Derived pricing ───────────────────────────────────────────────────────
  const unitPrice = (benefit as { unitPrice?: number | null }).unitPrice;
  const companyPays = unitPrice ? Math.round(unitPrice * benefit.subsidyPercent / 100) : null;
  const employeePays = unitPrice ? unitPrice - (companyPays ?? 0) : null;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl p-8">
          <Link href={`/employee-panel/benefits/${benefit.id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground active:opacity-80">
            ← Back to Benefit
          </Link>

          <div className="mt-8">
            <Stepper currentStep={step} requiresContract={requiresContract} />
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8">

            {/* ── Step 1: Contract Review ── */}
            {step === 1 && (
              <>
                <h1 className="text-xl font-semibold text-gray-900">Contract Review</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Review the benefit details and the contract provided by HR before proceeding.
                </p>

                {/* Benefit details */}
                <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/60 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">Benefit Information</p>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs text-gray-500">Benefit Name</dt>
                      <dd className="mt-0.5 text-sm font-medium text-gray-900">{benefit.name}</dd>
                    </div>
                    {benefit.vendorName && (
                      <div>
                        <dt className="text-xs text-gray-500">Vendor</dt>
                        <dd className="mt-0.5 text-sm font-medium text-gray-900">{benefit.vendorName}</dd>
                      </div>
                    )}
                    {benefit.description && (
                      <div className="sm:col-span-2">
                        <dt className="text-xs text-gray-500">Description</dt>
                        <dd className="mt-0.5 text-sm text-gray-700">{benefit.description}</dd>
                      </div>
                    )}
                    {benefit.subsidyPercent !== undefined && (
                      <div>
                        <dt className="text-xs text-gray-500">Company Subsidy</dt>
                        <dd className="mt-0.5 text-sm font-medium text-emerald-700">{benefit.subsidyPercent}%</dd>
                      </div>
                    )}
                    {benefit.employeePercent !== undefined && (
                      <div>
                        <dt className="text-xs text-gray-500">Employee Contribution</dt>
                        <dd className="mt-0.5 text-sm font-medium text-gray-900">{benefit.employeePercent}%</dd>
                      </div>
                    )}
                    {unitPrice && (
                      <div>
                        <dt className="text-xs text-gray-500">Total Price</dt>
                        <dd className="mt-0.5 text-sm font-medium text-gray-900">{formatPrice(unitPrice)}</dd>
                      </div>
                    )}
                    {companyPays && (
                      <div>
                        <dt className="text-xs text-gray-500">Company Pays</dt>
                        <dd className="mt-0.5 text-sm font-medium text-emerald-700">{formatPrice(companyPays)}</dd>
                      </div>
                    )}
                    {employeePays !== null && employeePays > 0 && (
                      <div>
                        <dt className="text-xs text-gray-500">You Pay</dt>
                        <dd className="mt-0.5 text-sm font-medium text-blue-700">{formatPrice(employeePays)}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-xs text-gray-500">Approval Required</dt>
                      <dd className="mt-0.5 text-sm font-medium text-gray-900 capitalize">{benefit.approvalPolicy ?? "HR"}</dd>
                    </div>
                  </dl>
                </div>

                {/* HR Contract preview */}
                {requiresContract && (
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">HR Contract</p>
                    {contractsLoading ? (
                      <div className="flex h-[380px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                        <PageLoading inline message="Loading contract…" />
                      </div>
                    ) : contractUrl ? (
                      <>
                        <iframe
                          src={contractUrl}
                          className="h-[380px] w-full rounded-2xl border border-gray-200 bg-gray-50"
                          title={`${benefit.vendorName ?? benefit.name} Contract`}
                        />
                        <a
                          href={contractUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open in new tab
                        </a>
                        {activeContract && (
                          <div className="mt-2 flex gap-4 text-xs text-gray-400">
                            {activeContract.version && <span>Version {activeContract.version}</span>}
                            {activeContract.effectiveDate && <span>Effective {activeContract.effectiveDate}</span>}
                            {activeContract.expiryDate && <span>Expires {activeContract.expiryDate}</span>}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 text-center">
                        <div className="rounded-full bg-gray-100 p-4">
                          <FileText className="h-7 w-7 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {activeContract ? "Preview Unavailable" : "No Active Contract Found"}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {activeContract
                              ? `Version ${activeContract.version} · ${benefit.vendorName ?? "Vendor"}`
                              : "Contact your HR team for contract details"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {contractStepBlocked ? (
                  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                    No active contract has been uploaded for this benefit yet. Please contact HR before continuing.
                  </div>
                ) : (
                  <button
                    onClick={() => setStep(requiresContract ? 2 : 3)}
                    className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-base font-medium text-white transition hover:bg-blue-700 active:scale-[0.99] active:bg-blue-800"
                  >
                    Continue
                  </button>
                )}
              </>
            )}

            {/* ── Step 2: Upload Contract ── */}
            {step === 2 && requiresContract && (
              <>
                <h1 className="text-xl font-semibold text-gray-900">Upload Your Signed Contract</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Please sign the contract and upload it here before submitting your request.
                </p>

                <div className="mt-8">
                  {/* Upload area */}
                  <div
                    className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 text-center transition ${
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
                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                        <div>
                          <p className="text-sm font-semibold text-emerald-700">Contract uploaded successfully</p>
                          {uploadedFileName && (
                            <p className="mt-1 text-xs text-emerald-600">{uploadedFileName}</p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {employeeSignedContract.viewUrl && (
                            <a
                              href={getContractProxyUrl(employeeSignedContract.viewUrl) ?? employeeSignedContract.viewUrl}
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
                            <X className="h-3 w-3" />
                            Replace file
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="rounded-full bg-gray-100 p-4">
                          <UploadCloud className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Click to upload your signed contract</p>
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
                    <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                      {uploadError}
                    </div>
                  )}

                  <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
                    Make sure your signed contract matches the HR contract shown in the previous step.
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="h-12 flex-1 rounded-xl border border-gray-200 bg-white text-base font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.99]"
                  >
                    Back
                  </button>
                  <button
                    disabled={!employeeSignedContract?.id || uploading}
                    onClick={() => setStep(3)}
                    className="h-12 flex-[2] rounded-xl bg-blue-600 text-base font-medium text-white transition hover:bg-blue-700 active:scale-[0.99] active:bg-blue-800 disabled:bg-gray-300 disabled:active:scale-100"
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
                <p className="mt-1 text-sm text-gray-500">Review and submit your benefit request for approval.</p>

                <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/50 px-5 py-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Summary</p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Benefit</dt>
                      <dd className="font-medium text-gray-900">{benefit.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Vendor</dt>
                      <dd className="font-medium text-gray-900">{benefit.vendorName ?? "Internal"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Company Subsidy</dt>
                      <dd className="font-medium text-emerald-700">{benefit.subsidyPercent}%</dd>
                    </div>
                    {unitPrice && (
                      <>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Total Price</dt>
                          <dd className="font-medium text-gray-900">{formatPrice(unitPrice)}</dd>
                        </div>
                        {companyPays && (
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Company Pays</dt>
                            <dd className="font-medium text-emerald-700">{formatPrice(companyPays)}</dd>
                          </div>
                        )}
                        {employeePays !== null && employeePays > 0 && (
                          <div className="flex justify-between">
                            <dt className="text-gray-500">You Pay</dt>
                            <dd className="font-medium text-blue-700">{formatPrice(employeePays)}</dd>
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Approval</dt>
                      <dd className="font-medium text-gray-900 capitalize">{benefit.approvalPolicy ?? "HR"}</dd>
                    </div>
                    {requiresContract && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Your Contract</dt>
                        <dd className={`font-medium ${employeeSignedContract?.id ? "text-emerald-700" : "text-orange-600"}`}>
                          {employeeSignedContract?.id ? `✓ Uploaded${uploadedFileName ? ` (${uploadedFileName})` : ""}` : "Not uploaded"}
                        </dd>
                      </div>
                    )}
                  </dl>
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
                    onClick={submitRequest}
                    disabled={isWorking || (requiresContract && !employeeSignedContract?.id)}
                    className="h-10 flex-[2] rounded-lg bg-gray-900 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.99] disabled:bg-gray-300 disabled:active:scale-100"
                  >
                    {isWorking ? "Submitting…" : "Submit Request"}
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
