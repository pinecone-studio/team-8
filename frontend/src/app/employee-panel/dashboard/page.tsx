"use client";

import Topbar from "../_components/layout/Topbar";
import Sidebar from "../_components/SideBar";
import SummaryCard from "../_components/benefits/SummaryCard";
import BenefitCard from "../_components/benefits/BenefitCard";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import {
  BenefitEligibilityStatus,
  useGetMyBenefitsQuery,
} from "@/graphql/generated/graphql";

function formatCategory(value: string) {
  return value.toUpperCase();
}

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

export default function DashboardPage() {
  const { employee, error, loading } = useCurrentEmployee();
  const displayName = employee?.name ?? "there";
  const {
    data: myBenefitsData,
    error: myBenefitsError,
    loading: myBenefitsLoading,
  } = useGetMyBenefitsQuery({
    variables: { employeeId: employee?.id ?? "" },
    skip: !employee?.id,
  });
  const subtitle = error
    ? "We couldn't load your employee profile."
    : loading
      ? "Loading your employee profile..."
      : "Here's an overview of your benefits";
  const benefits = myBenefitsData?.myBenefits ?? [];
  const activeCount = benefits.filter(
    (benefit) => benefit.status === BenefitEligibilityStatus.Active
  ).length;
  const eligibleCount = benefits.filter(
    (benefit) => benefit.status === BenefitEligibilityStatus.Eligible
  ).length;
  const pendingCount = benefits.filter(
    (benefit) => benefit.status === BenefitEligibilityStatus.Pending
  ).length;
  const benefitCards = benefits.map((item) => ({
    category: formatCategory(item.benefit.category),
    description: buildBenefitDescription({
      employeePercent: item.benefit.employeePercent,
      failedRuleError: item.failedRule?.errorMessage,
      optionsDescription: item.benefit.optionsDescription,
      requiresContract: item.benefit.requiresContract,
      subsidyPercent: item.benefit.subsidyPercent,
    }),
    id: item.benefit.id,
    name: item.benefit.name,
    status: item.status,
    subsidy: `${item.benefit.subsidyPercent}%`,
    vendor: item.benefit.vendorName ?? "Internal Benefit",
  }));
  const isDashboardLoading = loading || myBenefitsLoading;
  const dashboardError = error ?? myBenefitsError ?? null;

  return (
    <div className="flex min-h-screen bg-[#f6f7f9]">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Good to see you, {displayName}
            </h1>
            <p className="mt-2 text-lg text-gray-500">
              {subtitle}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <SummaryCard
              label="Active Benefits"
              value={activeCount}
            />
            <SummaryCard
              label="Eligible Benefits"
              value={eligibleCount}
              valueClassName="text-blue-600"
            />
            <SummaryCard
              label="Pending Requests"
              value={pendingCount}
              valueClassName="text-orange-500"
            />
          </div>

          <section className="mt-10">
            <h2 className="text-3xl font-semibold text-gray-900">
              Benefits Overview
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3 md:grid-cols-2">
              {isDashboardLoading ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-500">
                  Loading benefits...
                </div>
              ) : dashboardError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                  Failed to load benefit data.
                </div>
              ) : benefitCards.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-500">
                  No benefits available for this employee yet.
                </div>
              ) : (
                benefitCards.map((benefit) => (
                  <BenefitCard key={benefit.id} benefit={benefit} />
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
