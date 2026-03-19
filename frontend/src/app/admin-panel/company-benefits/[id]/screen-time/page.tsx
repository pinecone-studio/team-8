"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  ExternalLink,
  Medal,
  Save,
  Sparkles,
  Trophy,
  Users,
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
import { getInitialScreenTimeMonthKey, getScreenTimeWindowForSlotDate } from "@/lib/screen-time-calendar";
import { isHrAdmin } from "../../../_lib/access";

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
    loading: leaderboardLoading,
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
  const leaderboard = leaderboardData?.screenTimeLeaderboard ?? [];

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
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center">
          <PageLoading message="Loading screen time competition…" />
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
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link
                href="/admin-panel/screen-time"
                className="text-sm text-gray-500 transition hover:text-gray-800"
              >
                ← Back to screen time
              </Link>
              <h1 className="mt-3 text-2xl font-semibold text-gray-900">
                {benefit.name} · Screen Time Competition
              </h1>
              <p className="mt-1 max-w-3xl text-sm text-gray-500">
                Employees upload one 7-day average screenshot on each required Friday. If any required slot is missing or rejected, that employee is disqualified for the month. The lowest averages win a fixed cash reward.
              </p>
            </div>

            <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
              <Calendar className="h-4 w-4" />
              <span>Month</span>
              <input
                type="month"
                value={monthKey}
                onChange={(event) => setMonthKey(event.target.value)}
                className="rounded-lg border border-gray-200 px-2 py-1 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
              />
            </label>
          </div>

          {error ? (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          {feedback ? (
            <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {feedback}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Total Employees</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{board?.totalEmployeeCount ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Competition Pool</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{board?.competitionParticipantCount ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Winner Cutoff</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">Top {board?.program?.winnerPercent ?? 0}%</p>
              <p className="mt-1 text-xs text-gray-500">{board?.winnerCount ?? 0} employees win</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Reward Per Winner</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-700">
                {formatMoney(board?.program?.rewardAmountMnt)}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_1.95fr]">
            <section className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Competition Configuration</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Admin chooses what percentage of the competition wins and how much cash each winner receives.
                  </p>
                </div>
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

              <div className="mt-5 grid gap-4">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-400">
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
                  <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-400">
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

                <div className="rounded-2xl border border-fuchsia-100 bg-fuchsia-50 p-4 text-sm text-fuchsia-900">
                  <p className="font-semibold">How winners are decided</p>
                  <ul className="mt-2 space-y-2 text-sm text-fuchsia-900">
                    <li>1. Employees upload one screenshot every required Friday.</li>
                    <li>2. Each screenshot covers the last 7 days, and the slot is assigned to the month with the majority of days in that window.</li>
                    <li>3. Missing or rejected required slots disqualify that employee for the month.</li>
                    <li>4. Among the qualified employees, the lowest averages win the fixed reward.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Winner Zone</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Current winners for {monthKey}. Each ranked employee here is inside the top {board?.program?.winnerPercent ?? 0}% zone.
                  </p>
                </div>
                <Trophy className="h-5 w-5 text-fuchsia-600" />
              </div>

              {leaderboardLoading ? (
                <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                  Loading leaderboard…
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                  No employees are inside the winner zone yet for this month.
                </div>
              ) : (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {leaderboard.map((row) => (
                    <div key={row.employeeId} className="rounded-xl border border-fuchsia-100 bg-fuchsia-50 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-white px-2 py-1 text-xs font-semibold text-fuchsia-700 ring-1 ring-fuchsia-200">
                              #{row.rank}
                            </span>
                            <p className="text-sm font-semibold text-gray-900">{row.employeeName}</p>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            {row.approvedSlotCount}/{row.requiredSlotCount} Friday slots approved
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">{formatMinutes(row.avgDailyMinutes)}</p>
                          <p className="mt-1 text-xs font-medium text-emerald-700">
                            {formatMoney(row.rewardAmountMnt)}
                          </p>
                          {row.isProvisional ? (
                            <p className="mt-1 text-[11px] font-medium text-fuchsia-700">Provisional</p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">All Employee Screen-Time Data</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Required Friday slots assigned to {monthKey}: {board?.slotDates.join(", ") || "—"}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
                <Users className="h-3.5 w-3.5" />
                {sortedRows.length} employees
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {sortedRows.map((row) => (
                <details key={row.employeeId} className="group rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <summary className="list-none cursor-pointer">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">{row.employeeName}</p>
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getBenefitStatusBadgeClass(row.benefitStatus)}`}>
                            {row.benefitStatus.toLowerCase()}
                          </span>
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusBadgeClass(row.result.status)}`}>
                            {formatStatusLabel(row.result.status)}
                          </span>
                          {row.result.isWinner ? (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                              Winner
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{row.employeeEmail}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {row.result.rankPosition ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
                            <Medal className="h-3.5 w-3.5" />
                            #{row.result.rankPosition}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-6">
                      <div className="rounded-xl border border-white bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Average</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {formatMinutes(row.result.monthlyAvgDailyMinutes)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Rank</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {row.result.rankPosition ? `#${row.result.rankPosition}` : "—"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Approved Slots</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {row.result.approvedSlotCount}/{row.result.requiredSlotCount}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Missing</p>
                        <p className="mt-1 text-lg font-semibold text-red-600">
                          {row.result.missingDueSlotDates.length}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Winner Cutoff</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {row.result.winnerCutoffRank ? `#${row.result.winnerCutoffRank}` : "—"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Reward</p>
                        <p className="mt-1 text-lg font-semibold text-emerald-700">
                          {row.result.isWinner
                            ? formatMoney(row.result.rewardAmountMnt)
                            : "—"}
                        </p>
                      </div>
                    </div>
                  </summary>

                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-600">
                      {row.result.decisionNote || "Competition status will update automatically from the accepted Friday screenshots."}
                    </div>

                    {row.result.disqualificationReason ? (
                      <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {row.result.disqualificationReason}
                      </div>
                    ) : null}

                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      {row.result.requiredSlotDates.map((slotDate) => {
                        const submission = row.result.submissions.find((item) => item.slotDate === slotDate);
                        const window = getScreenTimeWindowForSlotDate(slotDate);
                        return (
                          <div key={slotDate} className="rounded-xl border border-white bg-white p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{slotDate}</p>
                                <p className="mt-0.5 text-xs text-gray-500">
                                  Window: {window.startDate} → {window.endDate}
                                </p>
                                <p className="mt-2 text-xs text-gray-500">
                                  {submission
                                    ? `${formatMinutes(submission.avgDailyMinutes)} · ${submission.reviewStatus.replaceAll("_", " ")}`
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
          </section>
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
