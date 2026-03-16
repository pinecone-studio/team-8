"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ExternalLink, FileText } from "lucide-react";
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

export default function BenefitRequestPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { loading: employeeLoading } = useCurrentEmployee();
  const { data, error, loading } = useGetMyBenefitsQuery();
  const [requestBenefit, { loading: submitting }] = useRequestBenefitMutation();
  const [confirmBenefitRequest, { loading: confirming }] = useConfirmBenefitRequestMutation();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [accepted, setAccepted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const benefitEligibility = data?.myBenefits.find((item) => item.benefitId === id);
  const benefit = benefitEligibility?.benefit;
  const requiresContract = benefit?.requiresContract ?? false;
  const isSelfService = benefit?.flowType === BenefitFlowType.SelfService;

  // Load active contract for preview in step 2
  const { data: contractsData, loading: contractsLoading } = useGetContractsForBenefitQuery({
    variables: { benefitId: id },
    skip: !requiresContract || !id,
  });
  const activeContract = contractsData?.contracts.find((c) => c.isActive) ?? null;
  const hasReviewableContract = Boolean(activeContract?.viewUrl);
  const contractStepBlocked = requiresContract && !contractsLoading && !hasReviewableContract;

  const isWorking = submitting || confirming;

  const submitRequest = async () => {
    if (!benefitEligibility || !benefit) return;
    setSubmitMessage(null);

    if (requiresContract && !hasReviewableContract) {
      setSubmitMessage(
        "This benefit requires an active contract before you can submit. Please contact HR.",
      );
      setStep(2);
      return;
    }

    if (requiresContract && !accepted) {
      setSubmitMessage("Please review and accept the contract before submitting.");
      setStep(2);
      return;
    }

    try {
      const result = await requestBenefit({
        variables: { input: { benefitId: benefit.id } },
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
        accepted &&
        createdRequest.status === "awaiting_contract_acceptance"
      ) {
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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl p-8">
          <Link href={`/employee-panel/benefits/${benefit.id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground active:opacity-80">
            ← Back to Benefit
          </Link>

          <div className="mt-8">
            <Stepper currentStep={step} />
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8">
            {/* ── Step 1: Confirm Eligibility ── */}
            {step === 1 && (
              <>
                <h1 className="text-xl font-semibold text-gray-900">Confirm Eligibility</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Please review your eligibility for {benefit.name} before proceeding.
                </p>

                <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
                  <h2 className="text-lg font-semibold text-green-800">✓ You are eligible for this benefit</h2>
                  <p className="mt-2 text-sm text-green-700">All eligibility requirements have been met.</p>
                </div>

                <div className="mt-8 space-y-6 text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Benefit Name</span>
                    <span className="font-medium text-gray-900">{benefit.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vendor</span>
                    <span className="font-medium text-gray-900">{benefit.vendorName ?? "Internal Benefit"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subsidy</span>
                    <span className="font-medium text-gray-900">{benefit.subsidyPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Approval Required</span>
                    <span className="font-medium text-gray-900 capitalize">{benefit.approvalPolicy ?? "HR"}</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep(requiresContract ? 2 : 3)}
                  className="mt-8 h-12 w-full rounded-xl bg-blue-600 text-base font-medium text-white transition hover:bg-blue-700 active:scale-[0.99] active:bg-blue-800"
                >
                  Continue
                </button>
              </>
            )}

            {/* ── Step 2: Contract Acceptance ── */}
            {step === 2 && requiresContract && (
              <>
                <h1 className="text-xl font-semibold text-gray-900">Contract Acceptance</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Please review and accept the contract terms for {benefit.name}.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
                  {/* Left: Contract document viewer */}
                  <div className="flex flex-col">
                    {contractsLoading ? (
                      <div className="flex h-[420px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                        <PageLoading inline message="Loading contract…" />
                      </div>
                    ) : activeContract?.viewUrl ? (
                      <>
                        <iframe
                          src={activeContract.viewUrl}
                          className="h-[420px] w-full rounded-2xl border border-gray-200 bg-gray-50"
                          title={`${benefit.vendorName ?? benefit.name} Contract`}
                        />
                        <a
                          href={activeContract.viewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 self-start text-xs text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open in new tab
                        </a>
                      </>
                    ) : (
                      <div className="flex h-[420px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 text-center">
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

                  {/* Right: Contract info + accept */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Contract Information</h2>

                    <div className="mt-6 space-y-5 text-sm">
                      <div>
                        <p className="text-gray-500">Vendor</p>
                        <p className="font-medium text-gray-900">{benefit.vendorName ?? "Internal Benefit"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Contract Version</p>
                        <p className="font-medium text-gray-900">
                          {activeContract?.version ?? "Active version"}
                        </p>
                      </div>
                      {activeContract?.effectiveDate && (
                        <div>
                          <p className="text-gray-500">Effective</p>
                          <p className="font-medium text-gray-900">{activeContract.effectiveDate}</p>
                        </div>
                      )}
                      {activeContract?.expiryDate && (
                        <div>
                          <p className="text-gray-500">Expires</p>
                          <p className="font-medium text-gray-900">{activeContract.expiryDate}</p>
                        </div>
                      )}
                    </div>

                    {contractStepBlocked ? (
                      <>
                        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                          {activeContract
                            ? "An active contract exists, but it cannot be previewed right now. Please contact HR before continuing."
                            : "No active contract has been uploaded for this benefit yet. Please contact HR before continuing."}
                        </div>

                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="mt-5 h-12 w-full rounded-xl border border-gray-200 bg-white text-base font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.99]"
                        >
                          Back
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="mt-8 rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs text-amber-700">
                          By accepting, you confirm you have read and understood all contract terms. This acceptance is legally recorded.
                        </div>

                        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-blue-600"
                          />
                          I have read and agree to the contract terms and conditions
                        </label>

                        <button
                          disabled={!accepted}
                          onClick={() => setStep(3)}
                          className="mt-5 h-12 w-full rounded-xl bg-blue-600 text-base font-medium text-white transition hover:bg-blue-700 active:scale-[0.99] active:bg-blue-800 disabled:bg-gray-300 disabled:active:scale-100"
                        >
                          Accept & Continue
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── Step 3: Submit ── */}
            {step === 3 && (
              <>
                <h1 className="text-xl font-semibold text-gray-900">Submit Request</h1>
                <p className="mt-1 text-sm text-gray-500">Review and submit for approval.</p>

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
                      <dt className="text-gray-500">Subsidy</dt>
                      <dd className="font-medium text-gray-900">{benefit.subsidyPercent}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Approval</dt>
                      <dd className="font-medium text-gray-900 capitalize">{benefit.approvalPolicy ?? "HR"}</dd>
                    </div>
                    {requiresContract && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Contract</dt>
                        <dd className={`font-medium ${accepted ? "text-green-700" : "text-orange-600"}`}>
                          {accepted ? "✓ Accepted" : "Pending acceptance"}
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

                <button
                  onClick={submitRequest}
                  disabled={isWorking || (requiresContract && (!accepted || !hasReviewableContract))}
                  className="mt-6 h-10 w-full rounded-lg bg-gray-900 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.99] disabled:bg-gray-300 disabled:active:scale-100"
                >
                  {isWorking ? "Submitting…" : "Submit Request"}
                </button>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
