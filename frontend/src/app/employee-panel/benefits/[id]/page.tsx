"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Topbar from "../../_components/layout/Topbar";
import StatusBadge from "../../_components/benefits/StatusBadge";
import Sidebar from "../../_components/SideBar";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { useGetMyBenefitsQuery } from "@/graphql/generated/graphql";

function buildBenefitDescription(input: {
  employeePercent: number;
  failedRuleError?: string | null;
  optionsDescription?: string | null;
  requiresContract: boolean;
  subsidyPercent: number;
}) {
  if (input.failedRuleError) return input.failedRuleError;
  if (input.optionsDescription) return input.optionsDescription;
  if (input.requiresContract) {
    return `Requires contract acceptance. Employee share ${input.employeePercent}%.`;
  }

  return `Company covers ${input.subsidyPercent}%. Employee share ${input.employeePercent}%.`;
}

function formatRuleLabel(value: string) {
  return value
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function BenefitDetailPage() {
  const params = useParams<{ id: string }>();
  const { employee } = useCurrentEmployee();
  const { data, error, loading } = useGetMyBenefitsQuery({
    variables: { employeeId: employee?.id ?? "" },
    skip: !employee?.id,
  });
  const benefit = data?.myBenefits.find((item) => item.benefit.id === params.id);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f6f7f9]">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="p-8 text-gray-500">Loading benefit details...</main>
        </div>
      </div>
    );
  }

  if (error || !benefit) {
    return (
      <div className="flex min-h-screen bg-[#f6f7f9]">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="p-8">
            <Link
              href="/employee-panel/dashboard"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Benefits
            </Link>
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
              Benefit data could not be loaded.
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
            href="/employee-panel/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Benefits
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    {benefit.benefit.name}
                  </h1>
                  <p className="mt-2 text-2xl text-gray-500">
                    {benefit.benefit.vendorName ?? "Internal Benefit"}
                  </p>
                </div>

                <StatusBadge status={benefit.status} />
              </div>

              <p className="mt-6 text-xl leading-8 text-gray-600">
                {buildBenefitDescription({
                  employeePercent: benefit.benefit.employeePercent,
                  failedRuleError: benefit.failedRule?.errorMessage,
                  optionsDescription: benefit.benefit.optionsDescription,
                  requiresContract: benefit.benefit.requiresContract,
                  subsidyPercent: benefit.benefit.subsidyPercent,
                })}
              </p>

              <div className="my-8 h-px bg-gray-200" />

              <div className="grid grid-cols-2 gap-10">
                <div>
                  <p className="text-sm text-gray-500">Subsidy Percentage</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {benefit.benefit.subsidyPercent}%
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Contract Required</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {benefit.benefit.requiresContract ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div className="my-8 h-px bg-gray-200" />

              <p className="text-base text-gray-500">
                {benefit.benefit.requiresContract
                  ? "This benefit requires contract acceptance before approval"
                  : "This benefit does not require contract acceptance before approval"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Eligibility Breakdown
              </h2>

              <div className="mt-6 space-y-5">
                {benefit.ruleEvaluation.map((item) => (
                  <div key={`${benefit.benefit.id}-${item.ruleType}`} className="flex gap-3">
                    <span
                      className={`mt-1 text-lg ${
                        item.passed ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {item.passed ? "✓" : "✕"}
                    </span>

                    <div>
                      <p className="font-medium text-gray-900">
                        {formatRuleLabel(item.ruleType)}
                      </p>
                      <p className="text-sm text-gray-600">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                {benefit.status === "ELIGIBLE" && (
                  <Link
                    href={`/employee-panel/benefits/${benefit.benefit.id}/request`}
                    className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-base font-medium text-white hover:bg-blue-700"
                  >
                    Request Benefit
                  </Link>
                )}

                {benefit.status === "LOCKED" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                      You don&apos;t meet all eligibility requirements for this
                      benefit.
                    </div>

                    {benefit.failedRule?.errorMessage && (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                        {benefit.failedRule.errorMessage}
                      </div>
                    )}
                  </div>
                )}

                {benefit.status === "ACTIVE" && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    This benefit is already active for you.
                  </div>
                )}

                {benefit.status === "PENDING" && (
                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
                    Your request for this benefit is currently pending approval.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
