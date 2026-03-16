"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, Search, Sparkles } from "lucide-react";
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

const CATEGORY_FILTERS = [
  { label: "All",         value: "ALL" },
  { label: "Wellness",    value: "wellness" },
  { label: "Equipment",   value: "equipment" },
  { label: "Career",      value: "career" },
  { label: "Financial",   value: "financial" },
  { label: "Flexibility", value: "flexibility" },
] as const;

type CategoryFilter = (typeof CATEGORY_FILTERS)[number]["value"];

export default function DashboardPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("ALL");
  const [search, setSearch] = useState("");
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitEligibility | null>(null);
  const [requestModalBenefitId, setRequestModalBenefitId] = useState<string | null>(null);

  const { employee, error, loading: employeeLoading } = useCurrentEmployee();

  const {
    data: benefitsData,
    error: benefitsError,
    loading: benefitsLoading,
  } = useGetMyBenefitsQuery();

  const myBenefits = benefitsData?.myBenefits ?? [];

  const filteredBenefits = myBenefits.filter((b) => {
    const matchesCategory = activeFilter === "ALL" || b.benefit.category === activeFilter;
    const matchesSearch = search.trim() === "" ||
      b.benefit.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.benefit.vendorName ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
    { active: 0, eligible: 0, pending: 0 },
  );

  const isDashboardLoading = employeeLoading || benefitsLoading;
  const dashboardError = error ?? benefitsError ?? null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl px-8 py-8">
          <PageHeader
            title={`Good to see you, ${employee?.name ?? "Employee"}`}
            description={subtitle}
          />

          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <SummaryCard
              label="Active Benefits"
              value={stats.active}
              icon={<CheckCircle className="h-5 w-5" />}
            />
            <SummaryCard
              label="Eligible Benefits"
              value={stats.eligible}
              icon={<Sparkles className="h-5 w-5" />}
            />
            <SummaryCard
              label="Pending Requests"
              value={stats.pending}
              icon={<Clock className="h-5 w-5" />}
            />
          </div>

          {/* Benefits Overview */}
          <section className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold text-gray-900">Benefits Overview</h2>
              {/* Search */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48 rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-0"
                />
              </div>
            </div>

            {/* Category tabs */}
            <div className="mt-4 flex items-center gap-1">
              {CATEGORY_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setActiveFilter(f.value)}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeFilter === f.value
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))] [&>*]:min-w-0">
              {isDashboardLoading ? (
                <PageLoading message="Loading benefits..." />
              ) : dashboardError ? (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  Failed to load benefit data.
                </div>
              ) : filteredBenefits.length === 0 ? (
                <div className="rounded-xl border border-gray-100 bg-white px-4 py-6 text-center text-sm text-gray-400">
                  No benefits found.
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
