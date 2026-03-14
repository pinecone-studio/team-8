"use client";

import Sidebar from "../_components/SideBar";
import SummaryCard from "../_components/benefits/SummaryCard";
import BenefitCard from "../_components/benefits/BenefitCard";
import PageLoading from "@/app/_components/PageLoading";
import {
  BenefitEligibilityStatus,
  useGetMyBenefitsQuery,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/use-current-employee";

export default function DashboardPage() {
  const { employee, error, loading: employeeLoading } =
    useCurrentEmployee();
  const {
    data,
    error: benefitsError,
    loading: benefitsLoading,
  } = useGetMyBenefitsQuery();

  const myBenefits = data?.myBenefits ?? [];
  const subtitle = error
    ? "We couldn't load your employee profile."
    : employeeLoading
      ? "Loading your employee profile..."
      : "Here's an overview of your benefits";
  const stats = myBenefits.reduce(
    (acc, benefit) => {
      if (benefit.status === BenefitEligibilityStatus.Active) acc.active += 1;
      if (benefit.status === BenefitEligibilityStatus.Eligible) acc.eligible += 1;
      if (benefit.status === BenefitEligibilityStatus.Pending) acc.pending += 1;
      return acc;
    },
    { active: 0, eligible: 0, pending: 0 }
  );
  const isDashboardLoading = employeeLoading || benefitsLoading;
  const dashboardError = error ?? benefitsError ?? null;

  return (
    <div className="flex min-h-screen bg-[#f6f7f9]">
      <Sidebar />

      <div className="flex-1">
        <main className="p-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Good to see you, {employee?.name ?? "Employee"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <SummaryCard label="Active Benefits" value={stats.active} />
            <SummaryCard
              label="Eligible Benefits"
              value={stats.eligible}
              valueClassName="text-blue-600"
            />
            <SummaryCard
              label="Pending Requests"
              value={stats.pending}
              valueClassName="text-orange-500"
            />
          </div>

          <section className="mt-6">
            <h2 className="text-base font-semibold text-gray-900">
              Benefits Overview
            </h2>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {isDashboardLoading ? (
                <PageLoading message="Loading benefits..." />
              ) : dashboardError ? (
                <div className="rounded-lg border border-red-100 bg-red-50/80 px-4 py-3 text-sm text-red-700">
                  Failed to load benefit data.
                </div>
              ) : myBenefits.length === 0 ? (
                <div className="rounded-lg border border-gray-100 bg-white px-4 py-6 text-center text-sm text-gray-500">
                  No benefits found for your account.
                </div>
              ) : (
                myBenefits.map((benefit) => (
                  <BenefitCard key={benefit.benefitId} benefit={benefit} />
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
