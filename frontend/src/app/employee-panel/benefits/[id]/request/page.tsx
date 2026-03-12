"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import Topbar from "../../../_components/layout/Topbar";

import Stepper from "../../../_components/benefits/Stepper";
import { benefits } from "@/lib/  mock-data";
import Sidebar from "@/app/employee-panel/_components/SideBar";

export default function BenefitRequestPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const benefit = benefits.find((b) => b.id === id);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [accepted, setAccepted] = useState(false);

  if (!benefit) return notFound();
  if (benefit.status !== "ELIGIBLE") return notFound();

  const submitRequest = () => {
    router.push("/employee-panel/Requests?submitted=true");
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
                      {benefit.vendor}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subsidy</span>
                    <span className="font-medium text-gray-900">
                      {benefit.subsidy}
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
                  Please review and accept the contract terms for {benefit.name}
                  .
                </p>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
                  <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                    <div className="text-center text-gray-500">
                      <p className="text-lg font-medium">
                        Contract PDF Preview
                      </p>
                      <p className="mt-2 text-sm">{benefit.vendor} - v2.1</p>
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
                          {benefit.vendor}
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
                        {benefit.vendor}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Subsidy</span>
                      <span className="font-medium text-gray-900">
                        {benefit.subsidy}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Contract</span>
                      <span className="font-medium text-gray-900">Sent</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={submitRequest}
                  className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-base font-medium text-white hover:bg-blue-700"
                >
                  Submit Request
                </button>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
