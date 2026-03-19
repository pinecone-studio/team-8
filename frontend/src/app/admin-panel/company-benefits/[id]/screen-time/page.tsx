"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Save,
  Users,
} from "lucide-react";
import Sidebar from "../../../_components/SideBar";
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
import { getInitialScreenTimeMonthKey } from "@/lib/screen-time-calendar";
import { isHrAdmin } from "../../../_lib/access";
import PageLoading from "@/app/_components/PageLoading";

function formatMinutes(totalMinutes: number | null | undefined): string {
  if (typeof totalMinutes !== "number" || totalMinutes <= 0) return "—";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

function formatMoney(amount: number | null | undefined): string {
  if (typeof amount !== "number" || amount <= 0) return "—";
  return `${amount.toLocaleString()} MNT`;
}

const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatMonthDisplay(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const date = new Date(parseInt(year ?? "0", 10), parseInt(month ?? "1", 10) - 1, 1);
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function shiftMonth(monthKey: string, delta: number): string {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year ?? 0, (month ?? 1) - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatSlotDate(dateStr: string): string {
  const parts = dateStr.split("-");
  const monthIndex = parseInt(parts[1] ?? "0", 10) - 1;
  return `${MONTH_ABBR[monthIndex] ?? parts[1]} ${parts[2]}`;
}

function formatStatusLabel(status: string | null | undefined): string {
  return String(status ?? "unknown").replaceAll("_", " ");
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "winner":
      return "bg-emerald-100 text-emerald-700";
    case "qualified":
      return "bg-blue-100 text-blue-700";
    case "disqualified_missing_slot":
    case "disqualified_rejected_submission":
      return "bg-red-100 text-red-700";
    case "not_eligible":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

function getBenefitStatusBadgeClass(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700";
    case "ELIGIBLE":
      return "bg-blue-100 text-blue-700";
    case "PENDING":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
}

function Bone({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className ?? ""}`} />;
}

function AdminScreenTimeSkeleton() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="mx-auto w-full max-w-7xl px-8 py-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Bone className="h-7 w-56" />
            <Bone className="h-9 w-52 rounded-xl" />
          </div>

          <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1fr_340px]">
            {/* Left: Rankings skeleton */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
                <div className="space-y-1.5">
                  <Bone className="h-4 w-24" />
                  <Bone className="h-3 w-48" />
                </div>
                <Bone className="h-7 w-10 rounded-full" />
              </div>
              <div className="divide-y divide-gray-100">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Bone className="h-8 w-8 rounded-full shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Bone className="h-4 w-36" />
                        <Bone className="h-3 w-48" />
                      </div>
                      <Bone className="h-4 w-4 rounded" />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <Bone className="h-14 rounded-lg" />
                      <Bone className="h-14 rounded-lg" />
                      <Bone className="h-14 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Config skeleton */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
                <div className="space-y-1.5">
                  <Bone className="h-4 w-44" />
                  <Bone className="h-3 w-36" />
                </div>
                <Bone className="h-8 w-16 rounded-lg" />
              </div>
              <div className="space-y-4 px-5 py-5">
                <div className="space-y-1.5">
                  <Bone className="h-3 w-28" />
                  <Bone className="h-10 w-full rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Bone className="h-3 w-28" />
                  <Bone className="h-10 w-full rounded-xl" />
                </div>
                <Bone className="h-32 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function AdminScreenTimeProgramPageContent() {
  const params = useParams();
  const benefitId = typeof params.id === "string" ? params.id : "";
  const [monthKey, setMonthKey] = useState(getInitialScreenTimeMonthKey);
  const [winnerPercentOverride, setWinnerPercentOverride] = useState<string | null>(null);
  const [rewardAmountOverride, setRewardAmountOverride] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { employee, loading: employeeLoading } = useCurrentEmployee();
  const canManage = isHrAdmin(employee);
  const {
    data: adminBenefitsData,
    loading: benefitsLoading,
    refetch: refetchBenefits,
  } = useGetAdminBenefitsQuery({
    skip: !canManage,
    fetchPolicy: "cache-and-network",
  });
  const { data, loading, refetch: refetchBoard } = useGetAdminScreenTimeMonthQuery({
    variables: { benefitId, monthKey },
    skip: !canManage || !benefitId,
    fetchPolicy: "cache-and-network",
  });
  const {
    data: leaderboardData,
    loading: _leaderboardLoading,
    refetch: refetchLeaderboard,
  } = useGetScreenTimeLeaderboardQuery({
    variables: { benefitId, monthKey },
    skip: !canManage || !benefitId,
    fetchPolicy: "cache-and-network",
  });
  const [upsertProgram, { loading: savingProgram }] =
    useUpsertScreenTimeProgramMutation({
      refetchQueries: [
        {
          query: GetAdminScreenTimeMonthDocument,
          variables: { benefitId, monthKey },
        },
      ],
      awaitRefetchQueries: true,
    });

  const benefit = adminBenefitsData?.adminBenefits.find((item) => item.id === benefitId);
  const board = data?.adminScreenTimeMonth;
  void (leaderboardData?.screenTimeLeaderboard);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const winnerPercent = winnerPercentOverride ?? String(board?.program?.winnerPercent ?? 20);
  const rewardAmountMnt = rewardAmountOverride ?? String(board?.program?.rewardAmountMnt ?? 100000);

  const sortedRows = useMemo(() => {
    return [...(board?.rows ?? [])].sort((left, right) => {
      const leftRank = left.result.rankPosition ?? Number.POSITIVE_INFINITY;
      const rightRank = right.result.rankPosition ?? Number.POSITIVE_INFINITY;
      if (leftRank !== rightRank) return leftRank - rightRank;
      return left.employeeName.localeCompare(right.employeeName);
    });
  }, [board?.rows]);

  const monthlyOverallAvg = useMemo(() => {
    const values = sortedRows
      .map((r) => r.result.monthlyAvgDailyMinutes)
      .filter((v): v is number => typeof v === "number" && v > 0);
    if (values.length === 0) return null;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [sortedRows]);

  async function handleSaveProgram() {
    setError(null);
    setFeedback(null);

    const parsedWinnerPercent = Number(winnerPercent);
    const parsedRewardAmount = Number(rewardAmountMnt);

    if (!Number.isFinite(parsedWinnerPercent) || parsedWinnerPercent <= 0 || parsedWinnerPercent > 100) {
      setError("Top winner percent must be between 1 and 100.");
      return;
    }

    if (!Number.isFinite(parsedRewardAmount) || parsedRewardAmount <= 0) {
      setError("Reward amount must be a positive MNT value.");
      return;
    }

    try {
      await upsertProgram({
        variables: {
          input: {
            benefitId,
            winnerPercent: parsedWinnerPercent,
            rewardAmountMnt: parsedRewardAmount,
          },
        },
      });
      await Promise.all([
        refetchBenefits(),
        refetchBoard({ benefitId, monthKey }),
        refetchLeaderboard({ benefitId, monthKey }),
      ]);
      setWinnerPercentOverride(null);
      setRewardAmountOverride(null);
      setFeedback("Competition settings saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save competition settings.");
    }
  }

  if (employeeLoading || benefitsLoading || loading) {
    return <AdminScreenTimeSkeleton />;
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
            This benefit is not configured as a screen time competition.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="mx-auto w-full max-w-7xl px-8 py-8">

          {/* ── Page header ── */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Screen Time Competition</h1>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
              <span className="font-medium text-gray-500">Month</span>
              <button
                type="button"
                onClick={() => setMonthKey(shiftMonth(monthKey, -1))}
                className="rounded p-0.5 transition hover:bg-gray-100"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4 text-gray-500" />
              </button>
              <span className="min-w-[100px] text-center text-sm font-semibold text-gray-800">
                {formatMonthDisplay(monthKey)}
              </span>
              <button
                type="button"
                onClick={() => setMonthKey(shiftMonth(monthKey, 1))}
                className="rounded p-0.5 transition hover:bg-gray-100"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* ── Feedback banners ── */}
          {error ? (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          {feedback ? (
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {feedback}
            </div>
          ) : null}

          {/* ── 2-column layout: Rankings LEFT, Config RIGHT ── */}
          <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1fr_340px]">

            {/* ── LEFT: Rankings ── */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Rankings</h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Monthly average screen time: {monthlyOverallAvg ? formatMinutes(monthlyOverallAvg) : "—"}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  <Users className="h-3.5 w-3.5" />
                  {sortedRows.length}
                </span>
              </div>

              {sortedRows.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-gray-400">
                  No employee data for this month yet.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {sortedRows.map((row) => (
                    <details key={row.employeeId} className="group">
                      <summary className="list-none cursor-pointer px-6 py-4 transition hover:bg-gray-50">
                        {/* Summary row */}
                        <div className="flex items-center gap-4">
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                            {row.result.rankPosition ? `#${row.result.rankPosition}` : "—"}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="text-sm font-semibold text-gray-900">{row.employeeName}</p>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getBenefitStatusBadgeClass(row.benefitStatus)}`}>
                                {row.benefitStatus.toLowerCase()}
                              </span>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getStatusBadgeClass(row.result.status)}`}>
                                {formatStatusLabel(row.result.status)}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-gray-400">{row.employeeEmail}</p>
                          </div>
                          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition group-open:rotate-180" />
                        </div>

                        {/* Metrics strip */}
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Average</p>
                            <p className="mt-0.5 text-sm font-semibold text-gray-900">{formatMinutes(row.result.monthlyAvgDailyMinutes)}</p>
                          </div>
                          <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Approved</p>
                            <p className="mt-0.5 text-sm font-semibold text-gray-900">
                              {row.result.approvedSlotCount}/{row.result.requiredSlotCount}
                            </p>
                          </div>
                          <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Reward</p>
                            <p className="mt-0.5 text-sm font-semibold text-emerald-700">
                              {row.result.isWinner ? formatMoney(row.result.rewardAmountMnt) : "—"}
                            </p>
                          </div>
                        </div>
                      </summary>

                      {/* Expanded detail */}
                      <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                        {row.result.disqualificationReason ? (
                          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {row.result.disqualificationReason}
                          </div>
                        ) : null}

                        <div className="mt-3 grid gap-3 lg:grid-cols-2">
                          {row.result.requiredSlotDates
                            .filter((slotDate) => slotDate <= todayStr)
                            .map((slotDate) => {
                              const submission = row.result.submissions.find((item) => item.slotDate === slotDate);
                              return (
                                <div key={slotDate} className="rounded-xl border border-gray-200 bg-white p-4">
                                  <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900">{formatSlotDate(slotDate)}</p>
                                      <p className="mt-2 text-xs text-gray-500">
                                        {submission
                                          ? `Avg: ${formatMinutes(submission.avgDailyMinutes)} · ${submission.reviewStatus.replaceAll("_", " ")}`
                                          : row.result.missingDueSlotDates.includes(slotDate)
                                            ? "Missing required Friday submission"
                                            : "No submission yet"}
                                      </p>
                                      {submission?.reviewNote ? (
                                        <p className="mt-2 text-xs text-gray-500">{submission.reviewNote}</p>
                                      ) : null}
                                    </div>
                                    {submission?.viewUrl && submission.fileName ? (
                                      <a
                                        href={getContractProxyUrl(submission.viewUrl) ?? submission.viewUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                      >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        Open screenshot
                                      </a>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </section>

            {/* ── RIGHT: Competition Configuration ── */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">Competition Configuration</h2>
                    <p className="mt-0.5 text-xs text-gray-500">Winner % and fixed reward per winner.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveProgram}
                    disabled={savingProgram}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-gray-700 disabled:opacity-40"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save
                  </button>
                </div>
              </div>

              <div className="space-y-4 px-5 py-5">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Top Winner Percent
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={winnerPercent}
                      onChange={(event) => setWinnerPercentOverride(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">%</span>
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Fixed Reward Amount
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      step={1000}
                      value={rewardAmountMnt}
                      onChange={(event) => setRewardAmountOverride(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">MNT</span>
                  </div>
                </label>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs font-semibold text-gray-700">How winners are decided</p>
                  <ul className="mt-2 space-y-1.5 text-xs text-gray-500">
                    <li>1. Employees upload one screenshot every required Friday.</li>
                    <li>2. Each screenshot covers the last 7 days, assigned to the month with the majority of days in that window.</li>
                    <li>3. Missing or rejected required slots disqualify that employee for the month.</li>
                    <li>4. Among qualified employees, the lowest averages win the fixed reward.</li>
                  </ul>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

export default function LegacyAdminScreenTimeProgramRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const benefitId = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    if (!benefitId) return;
    router.replace(`/admin-panel/screen-time/${benefitId}`);
  }, [benefitId, router]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 items-center justify-center">
        <PageLoading message="Opening screen time competition…" />
      </div>
    </div>
  );
}
