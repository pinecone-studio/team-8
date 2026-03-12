"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Topbar from "../../../_components/layout/Topbar";

import Stepper from "../../../_components/benefits/Stepper";
import Sidebar from "@/app/employee-panel/_components/SideBar";
import {
  BenefitEligibilityStatus,
  BenefitFlowType,
  useGetMyBenefitsQuery,
  useRequestBenefitMutation,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/use-current-employee";

export default function BenefitRequestPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { employeeId, loading: employeeLoading } = useCurrentEmployee();
  const { data, loading } = useGetMyBenefitsQuery({
    variables: { employeeId: employeeId ?? "" },
    skip: !employeeId,
  });
  const [requestBenefit, { loading: submitting, error: submitError }] =
    useRequestBenefitMutation();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [accepted, setAccepted] = useState(false);

  const benefitEligibility = data?.myBenefits.find((b) => b.benefitId === id);
  const benefit = benefitEligibility?.benefit;
  const requiresContract = benefit?.requiresContract ?? false;
  const isSelfService = benefit?.flowType === BenefitFlowType.SelfService;

  if (employeeLoading || loading) {
    return (
      <div className="flex min-h-screen bg-[#f6f7f9]">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="p-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-500">
              Loading benefit...
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!benefitEligibility || !benefit) {
    return (
      <div className="flex min-h-screen bg-[#f6f7f9]">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="p-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-500">
              Benefit not found.
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (benefitEligibility.status !== BenefitEligibilityStatus.Eligible) {
    return (
      <div className="flex min-h-screen bg-[#f6f7f9]">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="p-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-500">
              This benefit is not eligible for request.
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isSelfService) {
    return (
      <div className="flex min-h-screen bg-[#f6f7f9]">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="p-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-500">
              This benefit is self-service and does not require a request.
            </div>
          </main>
        </div>
      </div>
    );
  }

  const submitRequest = async () => {
    if (!employeeId) return;

    await requestBenefit({
      variables: {
        input: {
          employeeId,
          benefitId: benefit.id,
          contractVersionAccepted: requiresContract ? "v2.1" : null,
          contractAcceptedAt: requiresContract ? new Date().toISOString() : null,
        },
      },
    });

    router.push("/employee-panel/requests?submitted=true");
  };

  return (
    <div className="flex min-h-screen bg-[#f6f7f9]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <Link
            href={`/employee-panel/benefits/${benefit.id}`}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Benefit
          </Link>

          <div className="mt-8">
            <Stepper currentStep={step} />
          </div>

          <div className="mt-8 max-w-5xl rounded-2xl border border-gray-200 bg-white p-8">
            {step === 1 && (
              <>
                <h1 className="text-3xl font-bold text-gray-900">
                  Confirm Eligibility
                </h1>
                <p className="mt-4 text-lg text-gray-500">
                  Please review your eligibility for {benefit.name} before
                  proceeding.
                </p>

                <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
                  <h2 className="text-2xl font-semibold text-green-800">
                    ✓ You are eligible for this benefit
                  </h2>
                  <p className="mt-3 text-base text-green-700">
                    All eligibility requirements have been met.
                  </p>
                </div>

                <div className="mt-8 space-y-6 text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Benefit Name</span>
                    <span className="font-medium text-gray-900">
                      {benefit.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vendor</span>
                    <span className="font-medium text-gray-900">
                      {benefit.vendorName ?? "Vendor"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subsidy</span>
                    <span className="font-medium text-gray-900">
                      {benefit.subsidyPercent}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setStep(requiresContract ? 2 : 3)}
                  className="mt-8 h-12 w-full rounded-xl bg-blue-600 text-base font-medium text-white hover:bg-blue-700"
                >
                  Continue
                </button>
              </>
            )}

            {step === 2 && requiresContract && (
              <>
                <h1 className="text-3xl font-bold text-gray-900">
                  Contract Acceptance
                </h1>
                <p className="mt-4 text-lg text-gray-500">
                  Please review and accept the contract terms for {benefit.name}
                  .
                </p>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
                  <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                    <div className="text-center text-gray-500">
                      <p className="text-lg font-medium">
                        Contract PDF Preview
                      </p>
                      <p className="mt-2 text-sm">
                        {benefit.vendorName ?? "Vendor"} - v2.1
                      </p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Contract Information
                    </h2>

                    <div className="mt-6 space-y-5 text-base">
                      <div>
                        <p className="text-gray-500">Vendor</p>
                        <p className="font-medium text-gray-900">
                          {benefit.vendorName ?? "Vendor"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Contract Version</p>
                        <p className="font-medium text-gray-900">v2.1</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Effective Date</p>
                        <p className="font-medium text-gray-900">2026-01-01</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Expiry Date</p>
                        <p className="font-medium text-gray-900">2026-12-31</p>
                      </div>
                    </div>

                    <label className="mt-8 flex items-center gap-3 text-base text-gray-700">
                      <input
                        type="checkbox"
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      I agree to the contract terms and conditions
                    </label>

                    <button
                      disabled={!accepted}
                      onClick={() => setStep(3)}
                      className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-base font-medium text-white hover:bg-blue-700 disabled:bg-gray-300"
                    >
                      Accept & Continue
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className="text-3xl font-bold text-gray-900">
                  Submit Request
                </h1>
                <p className="mt-4 text-lg text-gray-500">
                  Review your request details and submit for approval.
                </p>

                <div className="mt-8 rounded-2xl border border-blue-200 bg-green-50 p-6">
                  <h2 className="text-2xl font-semibold text-blue-800">
                    Request Summary
                  </h2>

                  <div className="mt-6 space-y-4 text-base">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Benefit</span>
                      <span className="font-medium text-gray-900">
                        {benefit.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Vendor</span>
                      <span className="font-medium text-gray-900">
                        {benefit.vendorName ?? "Vendor"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Subsidy</span>
                      <span className="font-medium text-gray-900">
                        {benefit.subsidyPercent}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Contract</span>
                      <span className="font-medium text-gray-900">
                        {requiresContract ? "Sent" : "Not required"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={submitRequest}
                  disabled={submitting || (requiresContract && !accepted)}
                  className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-base font-medium text-white hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>

                {submitError && (
                  <p className="mt-4 text-sm text-red-600">
                    {submitError.message}
                  </p>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
