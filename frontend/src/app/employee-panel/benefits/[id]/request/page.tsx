"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Stepper from "../../../_components/benefits/Stepper";
import Sidebar from "@/app/employee-panel/_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import {
  BenefitEligibilityStatus,
  BenefitFlowType,
  GetBenefitRequestsDocument,
  useGetMyBenefitsQuery,
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

  const isWorking = submitting || confirming;

  const submitRequest = async () => {
    if (!benefitEligibility || !benefit) return;
    setSubmitMessage(null);

    try {
      // Step 1: Create the request (no contract acceptance fields)
      const result = await requestBenefit({
        variables: {
          input: {
            benefitId: benefit.id,
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

      // Step 2: If contract was accepted in step 2 and request is awaiting contract acceptance,
      // call confirmBenefitRequest to properly record the acceptance
      if (
        requiresContract &&
        accepted &&
        createdRequest.status === "awaiting_contract_acceptance"
      ) {
        const confirmResult = await confirmBenefitRequest({
          variables: {
            requestId: createdRequest.id,
            contractAccepted: true,
          },
          refetchQueries: [{ query: GetBenefitRequestsDocument }],
        });

        if (confirmResult.errors?.length) {
          setSubmitMessage(
            confirmResult.errors[0].message ?? "Contract acceptance failed."
          );
          return;
        }
      }

      router.push("/employee-panel/requests?submitted=true");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to submit request.";
      setSubmitMessage(msg);
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
            <Link
              href={`/employee-panel/benefits/${id}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground active:opacity-80"
            >
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
            <Link
              href={`/employee-panel/benefits/${id}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground active:opacity-80"
            >
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
            <Link
              href={`/employee-panel/benefits/${id}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground active:opacity-80"
            >
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
          <Link
            href={`/employee-panel/benefits/${benefit.id}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground active:opacity-80"
          >
            ← Back to Benefit
          </Link>

          <div className="mt-8">
            <Stepper currentStep={step} />
          </div>

          <div className="mt-8 max-w-7xl rounded-2xl border border-gray-200 bg-white p-8">
            {step === 1 && (
              <>
                <h1 className="text-xl font-semibold text-gray-900">
                  Confirm Eligibility
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Please review your eligibility for {benefit.name} before proceeding.
                </p>

                <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
                  <h2 className="text-lg font-semibold text-green-800">
                    ✓ You are eligible for this benefit
                  </h2>
                  <p className="mt-2 text-sm text-green-700">
                    All eligibility requirements have been met.
                  </p>
                </div>

                <div className="mt-8 space-y-6 text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Benefit Name</span>
                    <span className="font-medium text-gray-900">{benefit.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vendor</span>
                    <span className="font-medium text-gray-900">
                      {benefit.vendorName ?? "Internal Benefit"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subsidy</span>
                    <span className="font-medium text-gray-900">{benefit.subsidyPercent}%</span>
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

            {step === 2 && requiresContract && (
              <>
                <h1 className="text-xl font-semibold text-gray-900">
                  Contract Acceptance
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Please review and accept the contract terms for {benefit.name}.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
                  <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                    <div className="text-center text-gray-500">
                      <p className="text-lg font-medium">Contract Preview</p>
                      <p className="mt-2 text-sm">{benefit.vendorName ?? "Internal Benefit"}</p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Contract Information</h2>

                    <div className="mt-6 space-y-5 text-base">
                      <div>
                        <p className="text-gray-500">Vendor</p>
                        <p className="font-medium text-gray-900">
                          {benefit.vendorName ?? "Internal Benefit"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Contract Version</p>
                        <p className="font-medium text-gray-900">Active version</p>
                      </div>
                    </div>

                    <label className="mt-8 flex items-center gap-3 text-base text-gray-700">
                      <input
                        type="checkbox"
                        checked={accepted}
                        onChange={(event) => setAccepted(event.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      I agree to the contract terms and conditions
                    </label>

                    <button
                      disabled={!accepted}
                      onClick={() => setStep(3)}
                      className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-base font-medium text-white transition hover:bg-blue-700 active:scale-[0.99] active:bg-blue-800 disabled:bg-gray-300 disabled:active:scale-100"
                    >
                      Accept & Continue
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className="text-xl font-semibold text-gray-900">Submit Request</h1>
                <p className="mt-1 text-sm text-gray-500">Review and submit for approval.</p>

                <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50/50 py-4 px-5">
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
                      <dt className="text-gray-500">Contract</dt>
                      <dd className="font-medium text-gray-900">
                        {requiresContract ? (accepted ? "Accepted" : "Pending") : "—"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {submitMessage && (
                  <div className="mt-4 rounded-lg border border-red-100 bg-red-50/80 px-3 py-2 text-xs text-red-700">
                    {submitMessage}
                  </div>
                )}

                <button
                  onClick={submitRequest}
                  disabled={isWorking}
                  className="mt-6 h-10 w-full rounded-lg bg-gray-900 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.99] disabled:bg-gray-300 disabled:active:scale-100"
                >
                  {isWorking ? "Submitting..." : "Submit Request"}
                </button>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
