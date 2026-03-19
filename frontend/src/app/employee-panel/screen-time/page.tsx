"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldAlert, Smartphone, Sparkles } from "lucide-react";
import Sidebar from "../_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import {
  BenefitEligibilityStatus,
  BenefitFlowType,
  useGetMyBenefitsFullQuery,
} from "@/graphql/generated/graphql";

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  ELIGIBLE: "bg-blue-100 text-blue-700",
  PENDING: "bg-amber-100 text-amber-700",
  LOCKED: "bg-red-100 text-red-700",
};

export default function EmployeeScreenTimeHubPage() {
  const router = useRouter();
  const { data, loading, error } = useGetMyBenefitsFullQuery();

  const screenTimePrograms = useMemo(
    () =>
      (data?.myBenefits ?? []).filter(
        (item) => item.benefit.flowType === BenefitFlowType.ScreenTime,
      ),
    [data?.myBenefits],
  );

  useEffect(() => {
    if (!loading && screenTimePrograms.length === 1) {
      router.replace(`/employee-panel/screen-time/${screenTimePrograms[0].benefitId}`);
    }
  }, [loading, router, screenTimePrograms]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center">
          <PageLoading message="Loading screen time feature…" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex flex-1 items-center justify-center p-8">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-sm text-red-700">
            Failed to load screen time programs.
          </div>
        </main>
      </div>
    );
  }

  if (screenTimePrograms.length === 1) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center">
          <PageLoading message="Opening your screen time tracker…" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-6xl px-8 py-8">
          <div className="rounded-3xl border border-fuchsia-100 bg-white p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-600 text-white">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Screen Time</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Weekly Monday screenshots, Gemini extraction, and month-based salary uplift tracking all live here.
                </p>
              </div>
            </div>
          </div>

          <section className="mt-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-fuchsia-600" />
              <h2 className="text-base font-semibold text-gray-900">Available programs</h2>
            </div>

            {screenTimePrograms.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500">
                No screen time program is available to you right now.
              </div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {screenTimePrograms.map((program) => {
                  const status = String(program.status).toUpperCase();
                  return (
                    <div
                      key={program.benefitId}
                      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {program.benefit.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {program.benefit.description ||
                              "Upload one 7-day average screenshot on each required Monday to stay eligible for the month."}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                            STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {status.toLowerCase()}
                        </span>
                      </div>

                      {program.failedRule?.errorMessage ? (
                        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>{program.failedRule.errorMessage}</span>
                        </div>
                      ) : null}

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <div className="text-sm text-gray-500">
                          {program.status === BenefitEligibilityStatus.Active ||
                          program.status === BenefitEligibilityStatus.Eligible
                            ? "Open the tracker to upload the current Monday screenshot and monitor the monthly uplift."
                            : "You can still open the tracker to review requirements and current month status."}
                        </div>
                        <Link
                          href={`/employee-panel/screen-time/${program.benefitId}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-fuchsia-700"
                        >
                          Open tracker
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
