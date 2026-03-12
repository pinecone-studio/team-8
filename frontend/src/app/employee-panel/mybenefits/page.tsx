"use client";
import { use, useMemo } from "react";
import Header from "@/app/_features/Header";
import Sidebar from "../_components/SideBar";
import CatalogBenefitCard from "../_components/benefits/CatalogBenefitCard";
import PageLoading from "@/app/_components/PageLoading";
import { useGetMyBenefitsQuery } from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/use-current-employee";

type PageProps = { params?: Promise<Record<string, string | string[]>> };
export default function Mybenefits({ params }: PageProps) {
  if (params) use(params);

  const { employeeId, loading: employeeLoading } = useCurrentEmployee();
  const {
    data,
    error: benefitsError,
    loading: benefitsLoading,
  } = useGetMyBenefitsQuery({
    variables: { employeeId: employeeId ?? "" },
    skip: !employeeId,
  });

  const myBenefits = data?.myBenefits ?? [];
  const STATUS_ORDER: Record<string, number> = { ACTIVE: 0, ELIGIBLE: 1, PENDING: 2, LOCKED: 3 };
  const CATEGORY_ORDER = ["Wellness", "Equipment", "Financial"];
  const byCategory = useMemo(() => {
    const map = new Map<string, typeof myBenefits>();
    for (const b of myBenefits) {
      const raw = b.benefit.category || "Other";
      const cat = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
      if (cat.toLowerCase() === "wellness") {
        if (!map.has("Wellness")) map.set("Wellness", []);
        map.get("Wellness")!.push(b);
      } else if (cat.toLowerCase() === "equipment") {
        if (!map.has("Equipment")) map.set("Equipment", []);
        map.get("Equipment")!.push(b);
      } else if (cat.toLowerCase() === "financial") {
        if (!map.has("Financial")) map.set("Financial", []);
        map.get("Financial")!.push(b);
      } else {
        if (!map.has(cat)) map.set(cat, []);
        map.get(cat)!.push(b);
      }
    }
    for (const list of map.values()) {
      list.sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99));
    }
    const entries = Array.from(map.entries());
    return entries.sort(([a], [b]) => {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [myBenefits]);

  const isLoading = employeeLoading || benefitsLoading;
  const hasError = benefitsError ?? null;

  return (
    <div className="flex min-h-screen bg-[#f8f8f9]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />
        <main className="p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Benefits Catalog
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Explore all company benefits grouped by category.
          </p>

          {isLoading ? (
            <PageLoading message="Loading benefits..." className="mt-8" />
          ) : hasError ? (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
              Failed to load benefit data.
            </div>
          ) : myBenefits.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
              No benefits found for your account.
            </div>
          ) : (
            <div className="mt-10 space-y-10">
              {byCategory.map(([category, benefits]) => (
                <section key={category}>
                  <h2 className="mb-6 text-xl font-semibold text-gray-900">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {benefits.map((benefit) => (
                      <CatalogBenefitCard
                        key={benefit.benefitId}
                        benefit={benefit}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
