"use client";

import Sidebar from "../_components/SideBar";
import SummaryCard from "../_components/benefits/SummaryCard";
import BenefitCard from "../_components/benefits/BenefitCard";
import PageHeader from "../_components/layout/PageHeader";
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
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl p-8">
          <PageHeader
            title={`Good to see you, ${employee?.name ?? "Employee"}`}
            description={subtitle}
          />

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <SummaryCard label="Active Benefits" value={stats.active} />
            <SummaryCard
              label="Eligible Benefits"
              value={stats.eligible}
              valueClassName="text-primary"
            />
            <SummaryCard
              label="Pending Requests"
              value={stats.pending}
              valueClassName="text-amber-600 dark:text-amber-400"
            />
          </div>

          <section className="mt-6">
            <h2 className="text-base font-semibold text-foreground">
              Benefits Overview
            </h2>

            <div className="mt-3 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))] [&>*]:min-w-0">
              {isDashboardLoading ? (
                <PageLoading message="Loading benefits..." />
              ) : dashboardError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  Failed to load benefit data.
                </div>
              ) : myBenefits.length === 0 ? (
                <div className="rounded-lg border border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
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
