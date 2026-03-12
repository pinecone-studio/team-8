"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Topbar from "../../../_components/layout/Topbar";
import Stepper from "../../../_components/benefits/Stepper";
import Sidebar from "@/app/employee-panel/_components/SideBar";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import {
  useGetMyBenefitsQuery,
  useRequestBenefitMutation,
} from "@/graphql/generated/graphql";

export default function BenefitRequestPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { employee } = useCurrentEmployee();
  const { data, error, loading } = useGetMyBenefitsQuery({
    variables: { employeeId: employee?.id ?? "" },
    skip: !employee?.id,
  });
  const benefit = data?.myBenefits.find((item) => item.benefit.id === id);
  const [requestBenefit, { loading: requestLoading, error: requestError }] =
    useRequestBenefitMutation();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [accepted, setAccepted] = useState(false);

  const submitRequest = async () => {
    if (!employee?.id || !benefit) return;

    await requestBenefit({
      variables: {
        input: {
          employeeId: employee.id,
          benefitId: benefit.benefit.id,
          contractAcceptedAt: benefit.benefit.requiresContract
            ? new Date().toISOString()
            : null,
          contractVersionAccepted: benefit.benefit.requiresContract
            ? "accepted-from-ui"
            : null,
        },
      },
    });

    router.push("/employee-panel/requests?submitted=true");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f6f7f9]">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="p-8 text-gray-500">Loading request flow...</main>
        </div>
      </div>
    );
  }

  if (error || !benefit || benefit.status !== "ELIGIBLE") {
    return (
      <div className="flex min-h-screen bg-[#f6f7f9]">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="p-8">
            <Link
              href={`/employee-panel/benefits/${id}`}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Benefit
            </Link>
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
              This benefit is not currently requestable.
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f6f7f9]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <Link
            href={`/employee-panel/benefits/${benefit.benefit.id}`}
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
                  Please review your eligibility for {benefit.benefit.name} before
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
                      {benefit.benefit.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vendor</span>
                    <span className="font-medium text-gray-900">
                      {benefit.benefit.vendorName ?? "Internal Benefit"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subsidy</span>
                    <span className="font-medium text-gray-900">
                      {benefit.benefit.subsidyPercent}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="mt-8 h-12 w-full rounded-xl bg-blue-600 text-base font-medium text-white hover:bg-blue-700"
                >
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="text-3xl font-bold text-gray-900">
                  Contract Acceptance
                </h1>
                <p className="mt-4 text-lg text-gray-500">
                  Please review and accept the contract terms for {benefit.benefit.name}
                  .
                </p>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
                  <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                    <div className="text-center text-gray-500">
                      <p className="text-lg font-medium">
                        {benefit.benefit.requiresContract
                          ? "Contract Preview"
                          : "No Contract Required"}
                      </p>
                      <p className="mt-2 text-sm">
                        {benefit.benefit.vendorName ?? "Internal Benefit"}
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
                          {benefit.benefit.vendorName ?? "Internal Benefit"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Contract Version</p>
                        <p className="font-medium text-gray-900">
                          {benefit.benefit.requiresContract ? "Active version" : "Not required"}
                        </p>
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
                        checked={benefit.benefit.requiresContract ? accepted : true}
                        onChange={(e) => setAccepted(e.target.checked)}
                        disabled={!benefit.benefit.requiresContract}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      {benefit.benefit.requiresContract
                        ? "I agree to the contract terms and conditions"
                        : "This benefit can be requested without contract acceptance"}
                    </label>

                    <button
                      disabled={benefit.benefit.requiresContract && !accepted}
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
                        {benefit.benefit.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Vendor</span>
                      <span className="font-medium text-gray-900">
                        {benefit.benefit.vendorName ?? "Internal Benefit"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Subsidy</span>
                      <span className="font-medium text-gray-900">
                        {benefit.benefit.subsidyPercent}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Contract</span>
                      <span className="font-medium text-gray-900">
                        {benefit.benefit.requiresContract ? "Accepted" : "Not required"}
                      </span>
                    </div>
                  </div>
                </div>

                {requestError && (
                  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Failed to submit request.
                  </div>
                )}

                <button
                  onClick={submitRequest}
                  disabled={requestLoading}
                  className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-base font-medium text-white hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {requestLoading ? "Submitting..." : "Submit Request"}
                </button>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
