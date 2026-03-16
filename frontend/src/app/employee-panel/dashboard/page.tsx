"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../_components/SideBar";
import SummaryCard from "../_components/benefits/SummaryCard";
import BenefitCard from "../_components/benefits/BenefitCard";
import BenefitDetailModal from "../_components/benefits/BenefitDetailModal";
import BenefitRequestModal from "../_components/benefits/BenefitRequestModal";
import PageHeader from "../_components/layout/PageHeader";
import PageLoading from "@/app/_components/PageLoading";
import {
  BenefitEligibilityStatus,
  useGetMyBenefitsQuery,
  type BenefitEligibility,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/use-current-employee";

const FILTERS = [
  { label: "All", value: "ALL" },
  { label: "Active", value: BenefitEligibilityStatus.Active },
  { label: "Eligible", value: BenefitEligibilityStatus.Eligible },
  { label: "Pending", value: BenefitEligibilityStatus.Pending },
  { label: "Locked", value: BenefitEligibilityStatus.Locked },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

export default function DashboardPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterValue>("ALL");
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitEligibility | null>(null);
  const [requestModalBenefitId, setRequestModalBenefitId] = useState<string | null>(null);

  const { employee, error, loading: employeeLoading } = useCurrentEmployee();

  const {
    data: benefitsData,
    error: benefitsError,
    loading: benefitsLoading,
  } = useGetMyBenefitsQuery();

  const myBenefits = benefitsData?.myBenefits ?? [];

  const filteredBenefits =
    activeFilter === "ALL"
      ? myBenefits
      : myBenefits.filter((b) => b.status === activeFilter);

  const subtitle = error
    ? "We couldn't load your employee profile."
    : employeeLoading
      ? "Loading your employee profile..."
      : "Here's an overview of your benefits";

  const stats = myBenefits.reduce(
    (acc, benefit) => {
      if (benefit.status === BenefitEligibilityStatus.Active) acc.active += 1;
      if (benefit.status === BenefitEligibilityStatus.Eligible)
        acc.eligible += 1;
      if (benefit.status === BenefitEligibilityStatus.Pending) acc.pending += 1;
      return acc;
    },
    { active: 0, eligible: 0, pending: 0 },
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

          {/* Summary Cards */}
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <SummaryCard label="Active Benefits" value={stats.active} />
            <SummaryCard label="Eligible Benefits" value={stats.eligible} />
            <SummaryCard label="Pending Requests" value={stats.pending} />
          </div>

          {/* Benefits Overview */}
          <section className="mt-6">
            <div className="flex items-center gap-5">
              <h2 className="text-lg font-semibold text-foreground">
                Benefits Overview
              </h2>
              <div className="flex items-center gap-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setActiveFilter(f.value)}
                    className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                      activeFilter === f.value
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] [&>*]:min-w-0">
              {isDashboardLoading ? (
                <PageLoading message="Loading benefits..." />
              ) : dashboardError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  Failed to load benefit data.
                </div>
              ) : filteredBenefits.length === 0 ? (
                <div className="rounded-lg border border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
                  No{" "}
                  {activeFilter === "ALL"
                    ? ""
                    : activeFilter.toLowerCase() + " "}
                  benefits found.
                </div>
              ) : (
                filteredBenefits.map((benefit) => (
                  <BenefitCard
                    key={benefit.benefitId}
                    benefit={benefit}
                    onClick={setSelectedBenefit}
                  />
                ))
              )}
            </div>
          </section>
        </main>
        {selectedBenefit && (
          <BenefitDetailModal
            benefit={selectedBenefit}
            onClose={() => setSelectedBenefit(null)}
            onRequestBenefit={(benefitId) => {
              setSelectedBenefit(null);
              setRequestModalBenefitId(benefitId);
            }}
          />
        )}
        {requestModalBenefitId && (
          <BenefitRequestModal
            benefitId={requestModalBenefitId}
            onClose={() => setRequestModalBenefitId(null)}
            onSuccess={() => {
              setRequestModalBenefitId(null);
              router.push("/employee-panel/requests?submitted=true");
            }}
          />
        )}
      </div>
    </div>
  );
}
