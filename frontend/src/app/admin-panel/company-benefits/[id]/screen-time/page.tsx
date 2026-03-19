"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronDown,
  Clock3,
  ExternalLink,
  Save,
  Sparkles,
} from "lucide-react";
import Sidebar from "../../../_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import {
  BenefitFlowType,
  GetAdminScreenTimeMonthDocument,
  useGetAdminBenefitsQuery,
  useGetAdminScreenTimeMonthQuery,
  useGetScreenTimeLeaderboardQuery,
  useUpsertScreenTimeProgramMutation,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { getContractProxyUrl } from "@/lib/contracts";
import { isHrAdmin } from "../../../_lib/access";

type EditableTier = {
  id: string;
  label: string;
  maxDailyMinutes: string;
  salaryUpliftPercent: string;
};

type ResultSnapshot = {
  avgDailyMinutes: number;
  awardedSalaryUpliftPercent: number;
  isProvisional: boolean;
};

function formatMinutes(totalMinutes: number | null | undefined): string {
  if (typeof totalMinutes !== "number" || totalMinutes <= 0) return "—";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

function initialMonthKey(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ulaanbaatar",
    year: "numeric",
    month: "2-digit",
  }).format(new Date());
}

function averageRounded(values: number[]): number | null {
  if (!values.length) return null;
  return Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length,
  );
}

function resolveAwardedPercent(
  tiers: EditableTier[],
  avgDailyMinutes: number | null,
): number {
  if (avgDailyMinutes == null) return 0;
  const sorted = [...tiers]
    .map((tier) => ({
      maxDailyMinutes: Number(tier.maxDailyMinutes),
      salaryUpliftPercent: Number(tier.salaryUpliftPercent),
    }))
    .filter(
      (tier) =>
        Number.isFinite(tier.maxDailyMinutes) &&
        Number.isFinite(tier.salaryUpliftPercent),
    )
    .sort((left, right) => left.maxDailyMinutes - right.maxDailyMinutes);
  return (
    sorted.find((tier) => avgDailyMinutes <= tier.maxDailyMinutes)
      ?.salaryUpliftPercent ?? 0
  );
}

function resolveCurrentSnapshot(
  result: {
    dueSlotDates: string[];
    requiredSlotCount: number;
    submissions: Array<{
      slotDate: string;
      avgDailyMinutes?: number | null;
      reviewStatus: string;
    }>;
  },
  tiers: EditableTier[],
): ResultSnapshot | null {
  if (!result.dueSlotDates.length) return null;

  const approvedBySlot = new Map(
    result.submissions
      .filter((submission) =>
        ["approved", "auto_approved"].includes(submission.reviewStatus),
      )
      .map((submission) => [submission.slotDate, submission]),
  );

  const dueMinutes: number[] = [];
  for (const slotDate of result.dueSlotDates) {
    const submission = approvedBySlot.get(slotDate);
    if (!submission || typeof submission.avgDailyMinutes !== "number") {
      return null;
    }
    dueMinutes.push(submission.avgDailyMinutes);
  }

  const avgDailyMinutes = averageRounded(dueMinutes);
  if (avgDailyMinutes == null) return null;

  return {
    avgDailyMinutes,
    awardedSalaryUpliftPercent: resolveAwardedPercent(tiers, avgDailyMinutes),
    isProvisional: result.dueSlotDates.length < result.requiredSlotCount,
  };
}

export default function AdminScreenTimeProgramPage() {
  const params = useParams();
  const benefitId = typeof params.id === "string" ? params.id : "";
  const [monthKey, setMonthKey] = useState(initialMonthKey);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tiers, setTiers] = useState<EditableTier[]>([]);

  const { employee, loading: employeeLoading } = useCurrentEmployee();
  const canManage = isHrAdmin(employee);
  const { data: adminBenefitsData, loading: benefitsLoading } =
    useGetAdminBenefitsQuery({
      skip: !canManage,
    });
  const { data, loading } = useGetAdminScreenTimeMonthQuery({
    variables: { benefitId, monthKey },
    skip: !canManage || !benefitId,
  });
  const { data: leaderboardData, loading: leaderboardLoading } =
    useGetScreenTimeLeaderboardQuery({
      variables: { benefitId, monthKey },
      skip: !canManage || !benefitId,
    });

  const [upsertProgram, { loading: savingProgram }] =
    useUpsertScreenTimeProgramMutation({
      refetchQueries: [
        {
          query: GetAdminScreenTimeMonthDocument,
          variables: { benefitId, monthKey },
        },
      ],
    });

  const benefit = adminBenefitsData?.adminBenefits.find(
    (item) => item.id === benefitId,
  );

  useEffect(() => {
    if (data?.adminScreenTimeMonth.program) {
      setTiers(
        data.adminScreenTimeMonth.program.tiers.map((tier) => ({
          id: tier.id,
          label: tier.label,
          maxDailyMinutes: String(tier.maxDailyMinutes),
          salaryUpliftPercent: String(tier.salaryUpliftPercent),
        })),
      );
    }
  }, [data?.adminScreenTimeMonth.program]);

  const slotDates = data?.adminScreenTimeMonth.slotDates ?? [];
  const leaderboard = leaderboardData?.screenTimeLeaderboard ?? [];
  const hasData = (data?.adminScreenTimeMonth.rows?.length ?? 0) > 0;

  const sortedRows = useMemo(
    () =>
      [...(data?.adminScreenTimeMonth.rows ?? [])].sort((left, right) => {
        const statusOrder = [
          "eligible",
          "not_qualified",
          "in_progress",
          "ineligible_missing_slots",
        ];
        const leftIndex = statusOrder.indexOf(left.result.status);
        const rightIndex = statusOrder.indexOf(right.result.status);
        if (leftIndex !== rightIndex) return leftIndex - rightIndex;
        return left.employeeName.localeCompare(right.employeeName);
      }),
    [data?.adminScreenTimeMonth.rows],
  );

  async function handleSaveProgram() {
    setError(null);
    setFeedback(null);
    try {
      if (!tiers.length)
        throw new Error("Add at least one salary uplift tier.");
      await upsertProgram({
        variables: {
          input: {
            benefitId,
            tiers: tiers.map((tier, index) => ({
              label: tier.label.trim(),
              maxDailyMinutes: Number(tier.maxDailyMinutes),
              salaryUpliftPercent: Number(tier.salaryUpliftPercent),
              displayOrder: index,
            })),
          },
        },
      });
      setFeedback("Program settings saved.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save program settings.",
      );
    }
  }

  function fillDemo() {
    setMonthKey(initialMonthKey());
    setTiers([
      {
        id: Math.random().toString(36).slice(2),
        label: "Deep focus",
        maxDailyMinutes: "45",
        salaryUpliftPercent: "20",
      },
      {
        id: Math.random().toString(36).slice(2),
        label: "Balanced",
        maxDailyMinutes: "90",
        salaryUpliftPercent: "12",
      },
      {
        id: Math.random().toString(36).slice(2),
        label: "Healthy",
        maxDailyMinutes: "150",
        salaryUpliftPercent: "6",
      },
    ]);
    setFeedback(null);
    setError(null);
  }

  if (employeeLoading || benefitsLoading || loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center">
          <PageLoading message="Loading screen time program…" />
        </div>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex flex-1 items-center justify-center p-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500">
            HR admin access required.
          </div>
        </main>
      </div>
    );
  }

  if (!benefit || benefit.flowType !== BenefitFlowType.ScreenTime) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex flex-1 items-center justify-center p-8">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-sm text-red-700">
            This benefit is not configured as a screen time program.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="mx-auto w-full max-w-6xl px-8 py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link
                href="/admin-panel/screen-time"
                className="text-sm text-gray-500 transition hover:text-gray-800"
              >
                ← Back to screen time
              </Link>
              <h1 className="mt-3 text-2xl font-semibold text-gray-900">
                {benefit.name} · Screen Time Program
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Gemini extracts the weekly screenshot automatically, and the
                system computes the month result without manual approval.
              </p>
            </div>
            <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
              <span>Month</span>
              <input
                type="month"
                value={monthKey}
                onChange={(event) => setMonthKey(event.target.value)}
                className="rounded-lg border border-gray-200 px-2 py-1 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
              />
            </label>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {feedback && (
            <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {feedback}
            </div>
          )}

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_1.85fr]">
            <section className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Program Configuration
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Salary uplift bands based on monthly average daily screen
                    time.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fillDemo}
                    className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Fill demo
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProgram}
                    disabled={savingProgram}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-40"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {tiers.map((tier, index) => (
                  <div
                    key={tier.id}
                    className="grid gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:grid-cols-3"
                  >
                    <div>
                      <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Tier Label
                      </label>
                      <input
                        type="text"
                        value={tier.label}
                        onChange={(event) =>
                          setTiers((prev) =>
                            prev.map((item) =>
                              item.id === tier.id
                                ? { ...item, label: event.target.value }
                                : item,
                            ),
                          )
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Max Daily Minutes
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={tier.maxDailyMinutes}
                        onChange={(event) =>
                          setTiers((prev) =>
                            prev.map((item) =>
                              item.id === tier.id
                                ? {
                                    ...item,
                                    maxDailyMinutes: event.target.value,
                                  }
                                : item,
                            ),
                          )
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Salary Uplift %
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={tier.salaryUpliftPercent}
                        onChange={(event) =>
                          setTiers((prev) =>
                            prev.map((item) =>
                              item.id === tier.id
                                ? {
                                    ...item,
                                    salaryUpliftPercent: event.target.value,
                                  }
                                : item,
                            ),
                          )
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-3 text-xs text-gray-500">
                      Band {index + 1}: up to{" "}
                      {formatMinutes(Number(tier.maxDailyMinutes))} → +
                      {tier.salaryUpliftPercent || 0}%
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Month Board
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Monday slots: {slotDates.join(", ") || "—"}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-fuchsia-100 bg-fuchsia-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Leaderboard
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Showing the top 5 employees with the lowest monthly
                      average for {monthKey}.
                    </p>
                  </div>
                </div>

                {leaderboardLoading ? (
                  <div className="mt-3 rounded-xl border border-fuchsia-100 bg-white px-4 py-3 text-sm text-gray-500">
                    Loading leaderboard…
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="mt-3 rounded-xl border border-fuchsia-100 bg-white px-4 py-3 text-sm text-gray-500">
                    No ranked results yet for this month.
                  </div>
                ) : (
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {leaderboard.map((row) => (
                      <div
                        key={row.employeeId}
                        className="rounded-xl border border-fuchsia-100 bg-white px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-fuchsia-100 px-2 py-1 text-xs font-semibold text-fuchsia-700">
                                #{row.rank}
                              </span>
                              <p className="text-sm font-semibold text-gray-900">
                                {row.employeeName}
                              </p>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              {row.approvedSlotCount}/{row.dueSlotCount}{" "}
                              completed Monday slots so far
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatMinutes(row.avgDailyMinutes)}
                            </p>
                            <p className="mt-1 text-xs font-medium text-emerald-700">
                              +{row.awardedSalaryUpliftPercent}%
                            </p>
                            {row.isProvisional ? (
                              <p className="mt-1 text-[11px] font-medium text-fuchsia-700">
                                Provisional
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!hasData ? (
                <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500">
                  No employee submissions yet for this month.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {sortedRows.map((row) => (
                    <details
                      key={row.employeeId}
                      className="group rounded-2xl border border-gray-100 bg-gray-50 p-5"
                    >
                      <summary className="list-none cursor-pointer">
                        {(() => {
                          const currentSnapshot = resolveCurrentSnapshot(
                            row.result,
                            tiers,
                          );
                          const displayAvg =
                            currentSnapshot?.avgDailyMinutes ??
                            row.result.monthlyAvgDailyMinutes;
                          const displayUplift =
                            currentSnapshot?.awardedSalaryUpliftPercent ??
                            row.result.awardedSalaryUpliftPercent;

                          return (
                            <>
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {row.employeeName}
                                  </p>
                                  <p className="mt-0.5 text-xs text-gray-500">
                                    {row.employeeEmail}
                                  </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 ring-1 ring-gray-200">
                                    {row.result.status.replaceAll("_", " ")}
                                  </span>
                                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                                    +{displayUplift}% uplift
                                  </span>
                                  {currentSnapshot?.isProvisional ? (
                                    <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-semibold text-fuchsia-700 ring-1 ring-fuchsia-200">
                                      Provisional
                                    </span>
                                  ) : null}
                                  <ChevronDown className="h-4 w-4 text-gray-400 transition group-open:rotate-180" />
                                </div>
                              </div>

                              <div className="mt-4 grid gap-3 md:grid-cols-4">
                                <div className="rounded-xl border border-white bg-white p-3">
                                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                    Slots So Far
                                  </p>
                                  <p className="mt-1 text-lg font-semibold text-gray-900">
                                    {row.result.approvedSlotCount}/
                                    {row.result.dueSlotDates.length}
                                  </p>
                                </div>
                                <div className="rounded-xl border border-white bg-white p-3">
                                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                    Current Avg
                                  </p>
                                  <p className="mt-1 text-lg font-semibold text-gray-900">
                                    {formatMinutes(displayAvg)}
                                  </p>
                                </div>
                                <div className="rounded-xl border border-white bg-white p-3">
                                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                    Missing Due
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-red-600">
                                    {row.result.missingDueSlotDates.length
                                      ? row.result.missingDueSlotDates.length
                                      : 0}
                                  </p>
                                </div>
                                <div className="rounded-xl border border-white bg-white p-3">
                                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                    Submitted
                                  </p>
                                  <p className="mt-1 text-lg font-semibold text-gray-900">
                                    {row.result.submittedSlotCount}/
                                    {row.result.requiredSlotCount}
                                  </p>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </summary>

                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
                          {row.result.status === "eligible" ? (
                            <Sparkles className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Clock3 className="h-4 w-4 text-gray-400" />
                          )}
                          Month result is computed automatically from the
                          accepted Monday screenshots.
                        </div>

                        <div className="grid gap-3 lg:grid-cols-2">
                          {row.result.submissions.map((submission) => (
                            <div
                              key={submission.id}
                              className="rounded-xl border border-white bg-white p-4"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {submission.slotDate}
                                  </p>
                                  <p className="mt-0.5 text-xs text-gray-500">
                                    {formatMinutes(submission.avgDailyMinutes)}{" "}
                                    · confidence{" "}
                                    {submission.confidenceScore ?? 0}% ·{" "}
                                    {submission.reviewStatus.replaceAll(
                                      "_",
                                      " ",
                                    )}
                                  </p>
                                  <p className="mt-2 text-xs text-gray-500">
                                    {submission.reviewNote ||
                                      "Accepted automatically from Gemini extraction."}
                                  </p>
                                </div>
                                {submission.viewUrl && submission.fileName && (
                                  <a
                                    href={
                                      getContractProxyUrl(submission.viewUrl) ??
                                      submission.viewUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Open screenshot
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
