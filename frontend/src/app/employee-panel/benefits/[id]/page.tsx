"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import StatusBadge from "../../_components/benefits/StatusBadge";
import Sidebar from "../../_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import { useGetMyBenefitsQuery } from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/use-current-employee";

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
  const params = useParams();
  const id = params.id as string;
  const { loading: employeeLoading } = useCurrentEmployee();
  const { data, error, loading } = useGetMyBenefitsQuery();

  const benefitEligibility = data?.myBenefits.find((item) => item.benefitId === id);

  if (employeeLoading || loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col items-center">
          <main className="flex w-full max-w-7xl items-center justify-center p-8">
            <PageLoading message="Loading benefit details..." />
          </main>
        </div>
      </div>
    );
  }

  if (error || !benefitEligibility) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col items-center">
          <main className="w-full max-w-7xl p-8">
            <Link
              href="/employee-panel/mybenefits"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground active:opacity-80"
            >
              ← Back to Benefits
            </Link>
            <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-destructive">
              Benefit data could not be loaded.
            </div>
          </main>
        </div>
      </div>
    );
  }

  const benefit = benefitEligibility.benefit;
  const vendor = benefit.vendorName ?? "Internal Benefit";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl p-8">
          <Link
            href="/employee-panel/mybenefits"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground active:opacity-80"
          >
            ← Back to Benefits
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {benefit.name}
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">{vendor}</p>
                </div>

                <StatusBadge status={benefitEligibility.status} />
              </div>

              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                {buildBenefitDescription({
                  employeePercent: benefit.employeePercent,
                  failedRuleError: benefitEligibility.failedRule?.errorMessage,
                  optionsDescription: benefit.optionsDescription,
                  requiresContract: benefit.requiresContract,
                  subsidyPercent: benefit.subsidyPercent,
                })}
              </p>

              <div className="my-8 h-px bg-gray-200" />

              <div className="grid grid-cols-2 gap-10">
                <div>
                  <p className="text-sm text-gray-500">Subsidy Percentage</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {benefit.subsidyPercent}%
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Contract Required</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {benefit.requiresContract ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div className="my-8 h-px bg-gray-200" />

              <p className="text-base text-gray-500">
                {benefit.requiresContract
                  ? "This benefit requires contract acceptance before approval"
                  : "This benefit does not require contract acceptance before approval"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Eligibility Breakdown
              </h2>

              <div className="mt-6 space-y-5">
                {benefitEligibility.ruleEvaluation.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    Eligibility rules are not available.
                  </div>
                ) : (
                  benefitEligibility.ruleEvaluation.map((item) => (
                    <div key={item.ruleType} className="flex gap-3">
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
                  ))
                )}
              </div>

              <div className="mt-8">
                {benefitEligibility.status === "ELIGIBLE" && (
                  <Link
                    href={`/employee-panel/benefits/${benefitEligibility.benefitId}/request`}
                    className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-base font-medium text-white transition hover:bg-blue-700 active:scale-[0.98] active:bg-blue-800"
                  >
                    Request Benefit
                  </Link>
                )}

                {benefitEligibility.status === "LOCKED" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                      You don&apos;t meet all eligibility requirements for this
                      benefit.
                    </div>

                    {benefitEligibility.failedRule?.errorMessage && (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                        {benefitEligibility.failedRule.errorMessage}
                      </div>
                    )}
                  </div>
                )}

                {benefitEligibility.status === "ACTIVE" && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    This benefit is already active for you.
                  </div>
                )}

                {benefitEligibility.status === "PENDING" && (
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
