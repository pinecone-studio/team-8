"use client";
import { use, useMemo } from "react";
import Sidebar from "../_components/SideBar";
import BenefitCard from "../_components/benefits/BenefitCard";
import RequestedBenefitCard from "../_components/benefits/RequestedBenefitCard";
import PageLoading from "@/app/_components/PageLoading";
import type { Benefit } from "@/graphql/generated/graphql";
import { BenefitEligibilityStatus } from "@/graphql/generated/graphql";
import {
  useGetMyBenefitsQuery,
  useGetBenefitRequestsQuery,
  useGetBenefitsQuery,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/use-current-employee";

const STATUS_ORDER: Record<string, number> = { ACTIVE: 0, PENDING: 1 };
const CATEGORY_ORDER = ["Wellness", "Equipment", "Financial"];

type PageProps = { params?: Promise<Record<string, string | string[]>> };
export default function Mybenefits({ params }: PageProps) {
  if (params) use(params);

  const { loading: employeeLoading } = useCurrentEmployee();
  const {
    data,
    error: benefitsError,
    loading: benefitsLoading,
  } = useGetMyBenefitsQuery({
    fetchPolicy: "cache-and-network",
  });
  const { data: requestsData, loading: requestsLoading } = useGetBenefitRequestsQuery({
    fetchPolicy: "cache-and-network",
  });
  const { data: benefitsData, loading: benefitsCatalogLoading } = useGetBenefitsQuery({
    fetchPolicy: "cache-and-network",
  });

  const myBenefitsRaw = useMemo(() => data?.myBenefits ?? [], [data?.myBenefits]);
  const myBenefits = useMemo(
    () =>
      myBenefitsRaw.filter((b) => {
        const s = String(b.status).toUpperCase();
        return s === "ACTIVE" || s === "PENDING";
      }),
    [myBenefitsRaw]
  );
  const benefitRequests = useMemo(() => requestsData?.benefitRequests ?? [], [requestsData?.benefitRequests]);
  const benefitsById = useMemo(
    () => new Map((benefitsData?.benefits ?? []).map((b) => [b.id, b])),
    [benefitsData?.benefits]
  );

  const requestedBenefits = useMemo(() => {
    return benefitRequests
      .map((req) => {
        const benefit = benefitsById.get(req.benefitId);
        if (!benefit) return null;
        return { requestId: req.id, benefit, requestStatus: req.status };
      })
      .filter((x): x is { requestId: string; benefit: Benefit; requestStatus: string } => x !== null);
  }, [benefitRequests, benefitsById]);

  const requestedBenefitIds = useMemo(
    () => new Set(requestedBenefits.map((r) => r.benefit.id)),
    [requestedBenefits]
  );

  const myBenefitsExcludingRequested = useMemo(
    () => myBenefits.filter((b) => !requestedBenefitIds.has(b.benefitId)),
    [myBenefits, requestedBenefitIds]
  );

  const byCategory = useMemo(() => {
    const map = new Map<string, typeof myBenefitsExcludingRequested>();
    for (const b of myBenefitsExcludingRequested) {
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
  }, [myBenefitsExcludingRequested]);

  const isLoading =
    employeeLoading ||
    benefitsLoading ||
    requestsLoading ||
    benefitsCatalogLoading;
  const hasError = benefitsError ?? null;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col items-center bg-[linear-gradient(180deg,#3652c5_0%,#ffffff_100%)]">
        <main className="w-full max-w-7xl p-8">
          <h1 className="text-xl font-semibold text-white">My Benefits</h1>
          <p className="mt-1 text-sm text-gray-500">
            Benefits you are currently enrolled in.
          </p>

          {isLoading ? (
            <PageLoading message="Loading benefits..." className="mt-8" />
          ) : hasError ? (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
              Failed to load benefit data.
            </div>
          ) : myBenefitsExcludingRequested.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
              You do not have any active or pending benefits yet.
            </div>
          ) : (
            <div className="mt-10 space-y-10">
              <section>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  My benefits
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {myBenefitsExcludingRequested.map((benefit) => (
                    <BenefitCard key={benefit.benefitId} benefit={benefit} />
                  ))}
                </div>
              </section>

              {requestedBenefits.length > 0 && (
                <section>
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Benefit requests
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {requestedBenefits.map(({ requestId, benefit, requestStatus }) => (
                      <RequestedBenefitCard
                        key={requestId}
                        benefit={benefit}
                        requestStatus={requestStatus}
                        requestId={requestId}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
