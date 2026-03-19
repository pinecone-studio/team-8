"use client";

import { useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Trophy,
  UploadCloud,
} from "lucide-react";
import Sidebar from "../../../_components/SideBar";
import {
  BenefitFlowType,
  useGetMyBenefitsFullQuery,
  useGetMyScreenTimeMonthQuery,
  useGetScreenTimeLeaderboardQuery,
} from "@/graphql/generated/graphql";
import { getContractProxyUrl } from "@/lib/contracts";
import {
  getInitialScreenTimeMonthKey,
  getScreenTimeWindowForSlotDate,
} from "@/lib/screen-time-calendar";

function getApiBase(): string {
  const base =
    typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GRAPHQL_URL
      ? process.env.NEXT_PUBLIC_GRAPHQL_URL
      : "https://team8-api.team8pinequest.workers.dev/";
  return base.replace(/\/$/, "");
}

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

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function shiftMonth(monthKey: string, delta: number): string {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
  }).format(date);
}

function parseDateParts(isoDate: string): {
  month: string;
  day: string;
  weekday: string;
} {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return {
    month: date.toLocaleString("en-US", { month: "short" }),
    day: String(day).padStart(2, "0"),
    weekday: date.toLocaleString("en-US", { weekday: "short" }),
  };
}

function formatCompetitionStatus(status: string | null | undefined): string {
  return String(status ?? "in_progress").replaceAll("_", " ");
}

function getCompetitionStatusBadge(status: string | null | undefined): string {
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

type LeaderboardRowProps = {
  rank: number | null | undefined;
  name: string;
  secondaryLabel: string;
  avgDailyTime: string;
  isCurrentEmployee: boolean;
};

const RANK_STYLES: Record<number, { badge: string; row: string }> = {};

function LeaderboardRow({
  rank,
  name,
  secondaryLabel,
  avgDailyTime,
  isCurrentEmployee,
}: LeaderboardRowProps) {
  const rankNum = rank ?? 0;
  void RANK_STYLES[rankNum];

  const isRanked = rankNum > 0;

  const badgeClass = isCurrentEmployee
    ? "bg-gray-200 text-gray-700 ring-1 ring-gray-300"
    : "bg-white text-gray-600 ring-1 ring-gray-200";

  const rowClass = isCurrentEmployee
    ? "border border-gray-300 bg-gray-50/40"
    : isRanked
      ? "border border-amber-100 bg-amber-50/40"
      : "border border-gray-100 bg-white";

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition hover:shadow-sm ${rowClass}`}
    >
      <span
        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${badgeClass}`}
        aria-label={`Rank ${rankNum || "unranked"}`}
      >
        {rankNum ? `${rankNum}` : "—"}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
          {isCurrentEmployee ? (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
              You
            </span>
          ) : null}
        </div>
        {secondaryLabel ? (
          <p className="mt-0.5 text-xs text-gray-400">{secondaryLabel}</p>
        ) : null}
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-gray-900">{avgDailyTime}</p>
      </div>
    </div>
  );
}

type SlotVisualStatus =
  | "accepted"
  | "pending"
  | "rejected"
  | "missing"
  | "upcoming"
  | "active";

type FridaySlotCardProps = {
  slotDate: string;
  status: SlotVisualStatus;
  avgDailyTime: string;
  viewUrl?: string | null;
  fileName?: string | null;
  isUploadEligible: boolean;
  winnerPercent: number;
  rewardAmountMnt: number;
  onUploadClick: () => void;
};

function FridaySlotCard({
  slotDate,
  status,
  avgDailyTime,
  viewUrl,
  fileName,
  isUploadEligible,
  rewardAmountMnt,
  onUploadClick,
}: FridaySlotCardProps) {
  const { month, day, weekday } = parseDateParts(slotDate);
  const window = getScreenTimeWindowForSlotDate(slotDate);

  const cardClass =
    status === "upcoming"
      ? "border-gray-100 bg-white"
      : "border-gray-300 bg-white";

  const helperText =
    status === "accepted"
      ? null
      : status === "pending"
        ? "Waiting for Gemini extraction and automatic review"
        : status === "rejected"
          ? "This Friday slot no longer counts toward the monthly competition"
          : status === "missing"
            ? null
            : status === "active"
              ? `Submit today to stay in contention for ${formatMoney(rewardAmountMnt)}`
              : null;

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border px-5 py-4 transition hover:shadow-sm sm:flex-row sm:items-center sm:gap-5 ${cardClass}`}
    >
      <div className="flex w-14 shrink-0 flex-col items-center rounded-xl border border-gray-200 bg-white py-2 text-center text-gray-900">
        <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
          {month}
        </span>
        <span className="text-2xl font-bold leading-tight">{day}</span>
        <span className="text-[10px] font-medium opacity-60">{weekday}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-800">
          7-day average: <span className="text-gray-900">{avgDailyTime}</span>
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Window: {window.startDate.slice(5)} → {window.endDate.slice(5)}
        </p>
        {helperText ? (
          <span className="mt-2 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-500">
            {helperText}
          </span>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        {status === "accepted" ? (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Uploaded
            </span>
            {viewUrl && fileName ? (
              <a
                href={getContractProxyUrl(viewUrl) ?? viewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open screenshot
              </a>
            ) : null}
          </>
        ) : status === "active" && isUploadEligible ? (
          <button
            type="button"
            onClick={onUploadClick}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-700"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            Upload screenshot
          </button>
        ) : status === "pending" ? (
          <span className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
            Processing
          </span>
        ) : status === "rejected" ? (
          <span className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600">
            Rejected
          </span>
        ) : status === "missing" ? (
          <span className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-500">
            Not uploaded
          </span>
        ) : (
          <span className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-400">
            Upcoming
          </span>
        )}
      </div>
    </div>
  );
}

function Bone({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className ?? ""}`} />;
}

function ScreenTimeTrackerSkeleton() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl px-8 py-8">

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <Bone className="h-7 w-56" />
              <Bone className="h-4 w-80" />
            </div>
            <Bone className="h-9 w-44 rounded-xl" />
          </div>

          {/* 2-column layout */}
          <div className="mt-6 grid gap-8 xl:grid-cols-[2fr_1.1fr]">

            {/* Left — Weekly Friday Slots */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <Bone className="mb-5 h-5 w-40" />
              <div className="grid gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-5 rounded-2xl border border-gray-100 px-5 py-4"
                  >
                    {/* Date box */}
                    <div className="flex w-14 shrink-0 flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50 py-2">
                      <Bone className="h-2.5 w-6" />
                      <Bone className="h-6 w-8" />
                      <Bone className="h-2 w-5" />
                    </div>
                    {/* Text lines */}
                    <div className="flex-1 space-y-2">
                      <Bone className="h-3.5 w-36" />
                      <Bone className="h-3 w-52" />
                    </div>
                    {/* Status pill */}
                    <Bone className="h-7 w-20 shrink-0 rounded-xl" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Winner Zone */}
            <div className="self-start rounded-2xl border border-gray-100 bg-white p-6">
              {/* Title row */}
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Bone className="h-9 w-9 rounded-xl" />
                  <div className="space-y-2">
                    <Bone className="h-4 w-28" />
                  </div>
                </div>
                <Bone className="h-6 w-20 rounded-full" />
              </div>

              {/* Leaderboard rows */}
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3"
                  >
                    <Bone className="h-7 w-7 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Bone className="h-3.5 w-28" />
                      <Bone className="h-2.5 w-36" />
                    </div>
                    <Bone className="h-3.5 w-10 shrink-0" />
                  </div>
                ))}
              </div>

              {/* "You" card */}
              <div className="mt-4 rounded-xl border border-gray-200 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Bone className="h-7 w-7 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Bone className="h-3.5 w-20" />
                    <Bone className="h-2.5 w-32" />
                  </div>
                  <div className="space-y-1.5 text-right">
                    <Bone className="h-3.5 w-12" />
                    <Bone className="h-2.5 w-20" />
                  </div>
                </div>
              </div>

              {/* Summary card */}
              <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="space-y-2.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Bone className="h-3 w-28" />
                      <Bone className="h-3 w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default function EmployeeScreenTimePage() {
  const params = useParams();
  const benefitId = typeof params.id === "string" ? params.id : "";
  const { getToken } = useAuth();
  const [monthKey, setMonthKey] = useState(getInitialScreenTimeMonthKey);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: benefitsData, loading: benefitsLoading } = useGetMyBenefitsFullQuery();
  const { data, loading, refetch } = useGetMyScreenTimeMonthQuery({
    variables: { benefitId, monthKey },
    skip: !benefitId,
    fetchPolicy: "cache-and-network",
  });
  const {
    data: leaderboardData,
    loading: leaderboardLoading,
    refetch: refetchLeaderboard,
  } = useGetScreenTimeLeaderboardQuery({
    variables: { benefitId, monthKey },
    skip: !benefitId,
    fetchPolicy: "cache-and-network",
  });

  const benefitEligibility = benefitsData?.myBenefits.find(
    (item) => item.benefitId === benefitId,
  );
  const benefit = benefitEligibility?.benefit;
  const program = data?.myScreenTimeMonth.program;
  const month = data?.myScreenTimeMonth.month;
  const leaderboard = leaderboardData?.screenTimeLeaderboard ?? [];

  const winnerZoneAvg = useMemo(() => {
    const values = leaderboard
      .map((r) => r.avgDailyMinutes)
      .filter((v): v is number => typeof v === "number" && v > 0);
    if (values.length === 0) return null;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [leaderboard]);
  const submissionBySlot = useMemo(
    () =>
      new Map(
        (month?.submissions ?? []).map((submission) => [
          submission.slotDate,
          submission,
        ]),
      ),
    [month?.submissions],
  );

  async function handleUpload(file: File) {
    setError(null);
    setSuccess(null);
    setUploading(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("benefitId", benefitId);
      formData.append("file", file);
      const response = await fetch(`${getApiBase()}/api/screen-time/upload`, {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          (json as { error?: string }).error ??
            "Failed to upload screenshot.",
        );
      }
      setSuccess("Screenshot uploaded. Your competition status has been refreshed.");
      await Promise.all([refetch(), refetchLeaderboard()]);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload screenshot.",
      );
    } finally {
      setUploading(false);
    }
  }

  if (benefitsLoading || loading) {
    return <ScreenTimeTrackerSkeleton />;
  }

  if (!benefit || benefit.flowType !== BenefitFlowType.ScreenTime || !month) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex flex-1 items-center justify-center p-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-sm text-red-700">
            This benefit is not configured as a screen time competition.
          </div>
        </main>
      </div>
    );
  }

  const statusLabel = formatCompetitionStatus(month.status);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl px-8 py-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleUpload(file);
              event.target.value = "";
            }}
          />

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Screen Time Competition
              </h1>
              <p className="mt-1 max-w-xl text-sm text-gray-500">
                Upload the OS weekly average view every required Friday. Missing
                or rejected Friday slots remove you from the month&apos;s
                competition.
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-2 py-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setMonthKey((value) => shiftMonth(value, -1))}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[110px] text-center text-sm font-medium text-gray-700">
                {formatMonthLabel(monthKey)}
              </span>
              <button
                type="button"
                onClick={() => setMonthKey((value) => shiftMonth(value, 1))}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          ) : null}


          <div className="mt-6 grid gap-8 xl:grid-cols-[2fr_1.1fr]">
            <section className="rounded-2xl border border-gray-100 bg-white p-6">
              <h2 className="text-base font-semibold text-gray-900">
                Weekly Friday Slots
              </h2>

              <div className="mt-5 grid gap-3">
                {month.requiredSlotDates.map((slotDate) => {
                  const submission = submissionBySlot.get(slotDate);
                  const isDue = month.dueSlotDates.includes(slotDate);
                  const isActiveSlot =
                    data?.myScreenTimeMonth.activeSlotDate === slotDate;

                  const status: SlotVisualStatus = submission
                    ? submission.reviewStatus === "rejected"
                      ? "rejected"
                      : submission.reviewStatus === "pending"
                        ? "pending"
                        : "accepted"
                    : isActiveSlot
                      ? "active"
                      : isDue
                        ? "missing"
                        : "upcoming";

                  return (
                    <FridaySlotCard
                      key={slotDate}
                      slotDate={slotDate}
                      status={status}
                      avgDailyTime={formatMinutes(submission?.avgDailyMinutes)}
                      viewUrl={submission?.viewUrl}
                      fileName={submission?.fileName}
                      winnerPercent={program?.winnerPercent ?? 0}
                      rewardAmountMnt={program?.rewardAmountMnt ?? 0}
                      isUploadEligible={
                        isActiveSlot &&
                        (data?.myScreenTimeMonth.isUploadOpenToday ?? false) &&
                        !submission &&
                        !uploading
                      }
                      onUploadClick={() => fileInputRef.current?.click()}
                    />
                  );
                })}

                {month.requiredSlotDates.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center text-sm text-gray-500">
                    No Friday slots are assigned to this month.
                  </div>
                ) : null}
              </div>
            </section>

            <section className="self-start rounded-2xl border border-gray-100 bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Winner Zone
                    </h2>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getCompetitionStatusBadge(
                    month.status,
                  )}`}
                >
                  {month.rankPosition ? `Your rank #${month.rankPosition}` : statusLabel}
                </span>
              </div>

              {leaderboardLoading ? (
                <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                  Loading leaderboard…
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                  No employees are inside the winner zone yet for this month.
                </div>
              ) : (
                <div className="mt-5 space-y-2">
                  {leaderboard.map((row) => (
                    <LeaderboardRow
                      key={row.employeeId}
                      rank={row.rank}
                      name={row.employeeName}
                      secondaryLabel={`${row.approvedSlotCount}/${row.requiredSlotCount} Friday slots approved`}
                      avgDailyTime={formatMinutes(row.avgDailyMinutes)}
                      isCurrentEmployee={row.employeeId === month.employeeId}
                    />
                  ))}
                </div>
              )}

              <div className="mt-4 rounded-xl border border-gray-300 bg-white px-4 py-3">
                {month.rankPosition ? (
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700 ring-1 ring-gray-300">
                      {month.rankPosition}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-gray-900">You</p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getCompetitionStatusBadge(
                            month.status,
                          )}`}
                        >
                          {month.isWinner ? "Winner" : statusLabel}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        #{month.rankPosition} of {month.competitionParticipantCount || "—"} employees ·
                        cutoff #{month.winnerCutoffRank || "—"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatMinutes(month.monthlyAvgDailyMinutes)}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-emerald-700">
                        {month.isWinner
                          ? formatMoney(month.rewardAmountMnt)
                          : formatMoney(program?.rewardAmountMnt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">You are not eligible to be ranked.</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Disqualified automatically because at least one required Friday slot is missing.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Winner zone avg</span>
                    <span className="font-semibold text-gray-900">{winnerZoneAvg ? formatMinutes(winnerZoneAvg) : "—"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Rewarded group</span>
                    <span className="font-semibold text-gray-900">Top {program?.winnerPercent ?? 0}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Reward amount</span>
                    <span className="font-semibold text-emerald-700">{formatMoney(program?.rewardAmountMnt)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
