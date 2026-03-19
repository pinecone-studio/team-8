"use client";

import { useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Trophy,
  UploadCloud,
} from "lucide-react";
import Sidebar from "../../../_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import {
  BenefitFlowType,
  useGetMyBenefitsFullQuery,
  useGetScreenTimeLeaderboardQuery,
  useGetMyScreenTimeMonthQuery,
} from "@/graphql/generated/graphql";
import { getContractProxyUrl } from "@/lib/contracts";

function getApiBase(): string {
  const base =
    typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GRAPHQL_URL
      ? process.env.NEXT_PUBLIC_GRAPHQL_URL
      : "https://team8-api.team8pinequest.workers.dev/";
  return base.replace(/\/$/, "");
}

function getInitialMonthKey(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ulaanbaatar",
    year: "numeric",
    month: "2-digit",
  }).format(new Date());
}

function formatMinutes(totalMinutes: number | null | undefined): string {
  if (typeof totalMinutes !== "number" || totalMinutes <= 0) return "—";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

// Frontend-only month label formatter
function formatMonthLabel(monthKey: string): string {
  const [year, mon] = monthKey.split("-").map(Number);
  return new Date(year, mon - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// Frontend-only month shifter — no backend involvement
function shiftMonth(monthKey: string, delta: number): string {
  const [year, mon] = monthKey.split("-").map(Number);
  const d = new Date(year, mon - 1 + delta, 1);
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
  }).format(d);
}

// Temporary frontend mock data for leaderboard preview
const MOCK_LEADERBOARD = [
  { id: "1", rank: 1, name: "Тэмүүлэн",   avgDailyTime: "52m"    },
  { id: "2", rank: 2, name: "Номин",       avgDailyTime: "1h 03m" },
  { id: "3", rank: 3, name: "Билгүүн",    avgDailyTime: "1h 11m" },
  { id: "4", rank: 4, name: "Уянга",       avgDailyTime: "1h 18m" },
  { id: "5", rank: 5, name: "Мөнхзул",    avgDailyTime: "1h 26m" },
  { id: "6", rank: 6, name: "Оргил",       avgDailyTime: "1h 34m" },
  { id: "7", rank: 7, name: "Ану",         avgDailyTime: "1h 41m" },
  { id: "8", rank: 8, name: "Цэцгээ",     avgDailyTime: "1h 49m" },
] as const;

// Temporary mock for current user position
const MOCK_MY_POSITION = { rank: 12, avgDailyTime: "2h 08m" } as const;

// ── LeaderboardRow ────────────────────────────────────────────────────────────

type LeaderboardRowProps = {
  rank: number | null | undefined;
  name: string;
  secondaryLabel: string;
  avgDailyTime: string;
  isProvisional: boolean;
  isCurrentEmployee: boolean;
};

const RANK_STYLES: Record<number, { badge: string; row: string }> = {
  1: { badge: "bg-amber-100 text-amber-700 ring-amber-200", row: "border-amber-100 bg-amber-50/40" },
  2: { badge: "bg-gray-200 text-gray-600 ring-gray-300",   row: "border-gray-200 bg-gray-50/60" },
  3: { badge: "bg-orange-100 text-orange-600 ring-orange-200", row: "border-orange-100 bg-orange-50/30" },
};

function LeaderboardRow({
  rank,
  name,
  secondaryLabel,
  avgDailyTime,
  isProvisional,
  isCurrentEmployee,
}: LeaderboardRowProps) {
  const rankNum = rank ?? 0;
  const podium = RANK_STYLES[rankNum];

  const badgeClass = podium
    ? `${podium.badge} ring-1`
    : isCurrentEmployee
    ? "bg-fuchsia-100 text-fuchsia-700 ring-1 ring-fuchsia-200"
    : "bg-white text-gray-600 ring-1 ring-gray-200";

  const rowClass = podium
    ? `${podium.row} border`
    : isCurrentEmployee
    ? "border border-fuchsia-200 bg-fuchsia-50/30"
    : "border border-gray-100 bg-white";

  return (
    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 transition hover:shadow-sm ${rowClass}`}>
      <span
        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${badgeClass}`}
        aria-label={`Rank ${rankNum || "unranked"}`}
      >
        {rankNum ? `${rankNum}` : "—"}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
          {isCurrentEmployee && (
            <span className="rounded-full bg-fuchsia-100 px-2 py-0.5 text-[10px] font-semibold text-fuchsia-700">
              You
            </span>
          )}
          {isProvisional && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
              Provisional
            </span>
          )}
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

// ── Presentational types ──────────────────────────────────────────────────────

type SlotStatus = "submitted" | "missing" | "upcoming" | "active";

type MondaySlotCardProps = {
  slotDate: string;
  status: SlotStatus;
  avgDailyTime: string;
  upliftPercent: number;
  viewUrl?: string | null;
  fileName?: string | null;
  isUploadEligible: boolean;
  onUploadClick: () => void;
};

// Frontend-only date parser — no backend involvement
function parseDateParts(isoDate: string): { month: string; day: string; weekday: string } {
  const [year, mon, day] = isoDate.split("-").map(Number);
  const d = new Date(year, mon - 1, day);
  return {
    month: d.toLocaleString("en-US", { month: "short" }),
    day: String(day).padStart(2, "0"),
    weekday: d.toLocaleString("en-US", { weekday: "short" }),
  };
}

// ── MondaySlotCard ────────────────────────────────────────────────────────────

function MondaySlotCard({
  slotDate,
  status,
  avgDailyTime,
  upliftPercent,
  viewUrl,
  fileName,
  isUploadEligible,
  onUploadClick,
}: MondaySlotCardProps) {
  const isSubmitted = status === "submitted";
  const isMissing = status === "missing";
  const isActive = status === "active";

  const { month, day, weekday } = parseDateParts(slotDate);

  const cardClass = isSubmitted
    ? "border-emerald-200 bg-emerald-50/30"
    : isActive
    ? "border-fuchsia-200 bg-fuchsia-50/30"
    : "border-neutral-100 bg-white";

  const dateBoxClass = "border border-gray-200 bg-white text-gray-900";

  const upliftClass = isSubmitted || isActive
    ? "bg-emerald-50 text-emerald-700"
    : "bg-gray-100 text-gray-500";

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border px-5 py-4 transition hover:shadow-sm sm:flex-row sm:items-center sm:gap-5 ${cardClass}`}
    >
      {/* LEFT: stacked date box */}
      <div
        className={`flex w-14 shrink-0 flex-col items-center rounded-xl py-2 text-center ${dateBoxClass}`}
      >
        <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
          {month}
        </span>
        <span className="text-2xl font-bold leading-tight">{day}</span>
        <span className="text-[10px] font-medium opacity-60">{weekday}</span>
      </div>

      {/* CENTER: avg time + uplift */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-800">
          Avg daily time:{" "}
          <span className="text-gray-900">{avgDailyTime}</span>
        </p>
        <span
          className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${upliftClass}`}
        >
          +{upliftPercent}% uplift
        </span>
      </div>

      {/* RIGHT: action area */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        {isSubmitted ? (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Uploaded
            </span>
            {viewUrl && fileName && (
              <a
                href={getContractProxyUrl(viewUrl) ?? viewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open screenshot
              </a>
            )}
          </>
        ) : isUploadEligible ? (
          <button
            type="button"
            onClick={onUploadClick}
            className="inline-flex items-center gap-1.5 rounded-xl bg-fuchsia-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-fuchsia-700"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            Upload screenshot
          </button>
        ) : isMissing ? (
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EmployeeScreenTimePage() {
  const params = useParams();
  const benefitId = typeof params.id === "string" ? params.id : "";
  const { getToken } = useAuth();
  const [monthKey, setMonthKey] = useState(getInitialMonthKey);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: benefitsData, loading: benefitsLoading } = useGetMyBenefitsFullQuery();
  const {
    data,
    loading,
    refetch,
  } = useGetMyScreenTimeMonthQuery({
    variables: { benefitId, monthKey },
    skip: !benefitId,
  });
  const { data: leaderboardData, loading: leaderboardLoading } = useGetScreenTimeLeaderboardQuery({
    variables: { benefitId, monthKey },
    skip: !benefitId,
  });

  const benefitEligibility = benefitsData?.myBenefits.find((item) => item.benefitId === benefitId);
  const benefit = benefitEligibility?.benefit;
  const month = data?.myScreenTimeMonth.month;
  const leaderboard = leaderboardData?.screenTimeLeaderboard ?? [];
  const submissionBySlot = useMemo(
    () => new Map((month?.submissions ?? []).map((submission) => [submission.slotDate, submission])),
    [month?.submissions],
  );
  const currentEmployeeRank = leaderboard.find((row) => row.employeeId === month?.employeeId) ?? null;

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
        throw new Error((json as { error?: string }).error ?? "Failed to upload screenshot.");
      }
      setSuccess("Screenshot uploaded. Your monthly status has been refreshed.");
      await refetch();
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
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center">
          <PageLoading message="Loading screen time tracker…" />
        </div>
      </div>
    );
  }

  if (!benefit || benefit.flowType !== BenefitFlowType.ScreenTime) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex flex-1 items-center justify-center p-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-sm text-red-700">
            This benefit is not configured as a screen time salary uplift program.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl px-8 py-8">

          {/* Hidden file input — slot card upload buttons trigger this */}
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

          {/* ── Page header ── */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{benefit.name}</h1>
              <p className="mt-1 max-w-xl text-sm text-gray-500">
                Use the OS-level Screen Time / Digital Wellbeing weekly average view. If any required Monday is missed, the month receives 0% uplift.
              </p>
            </div>

            {/* Arrow-based month navigator */}
            <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-2 py-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setMonthKey((k) => shiftMonth(k, -1))}
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
                onClick={() => setMonthKey((k) => shiftMonth(k, 1))}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <div className="mt-6 grid gap-8 xl:grid-cols-[2fr_1.1fr]">

            {/* ── Weekly Monday Slots ── */}
            <section className="rounded-2xl border border-gray-100 bg-white p-6">
              <h2 className="text-base font-semibold text-gray-900">Weekly Monday Slots</h2>

              <div className="mt-5 grid gap-3">
                {month?.requiredSlotDates.map((slotDate) => {
                  const submission = submissionBySlot.get(slotDate);
                  const isDue = month.dueSlotDates.includes(slotDate);
                  const isActiveSlot = data?.myScreenTimeMonth.activeSlotDate === slotDate;

                  const status: SlotStatus = submission
                    ? "submitted"
                    : isActiveSlot
                    ? "active"
                    : isDue
                    ? "missing"
                    : "upcoming";

                  return (
                    <MondaySlotCard
                      key={slotDate}
                      slotDate={slotDate}
                      status={status}
                      avgDailyTime={formatMinutes(submission?.avgDailyMinutes)}
                      upliftPercent={month.awardedSalaryUpliftPercent ?? 0}
                      viewUrl={submission?.viewUrl}
                      fileName={submission?.fileName}
                      isUploadEligible={isActiveSlot && (data?.myScreenTimeMonth.isUploadOpenToday ?? false) && !uploading}
                      onUploadClick={() => fileInputRef.current?.click()}
                    />
                  );
                })}

                {!month?.requiredSlotDates.length && (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center text-sm text-gray-500">
                    No Monday slots found for this month.
                  </div>
                )}
              </div>
            </section>

            {/* ── Leaderboard ── */}
            <section className="self-start rounded-2xl border border-gray-100 bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Leaderboard</h2>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Top 8 · lowest avg for {formatMonthLabel(monthKey)}
                    </p>
                  </div>
                </div>
                {currentEmployeeRank?.rank ? (
                  <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-fuchsia-700">
                    Your rank #{currentEmployeeRank.rank}
                  </span>
                ) : null}
              </div>

              {leaderboardLoading ? (
                <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                  Loading leaderboard…
                </div>
              ) : (
                <>
                  <div className="mt-5 space-y-2">
                    {(leaderboard.length > 0
                      ? leaderboard.slice(0, 5).map((row) => ({
                          id: row.employeeId,
                          rank: row.rank,
                          name: row.employeeName,
                          secondaryLabel: `${row.approvedSlotCount}/${row.dueSlotCount} slots`,
                          avgDailyTime: formatMinutes(row.avgDailyMinutes),
                          isProvisional: row.isProvisional ?? false,
                          isCurrentEmployee: row.employeeId === month?.employeeId,
                        }))
                      : MOCK_LEADERBOARD.slice(0, 5).map((row) => ({
                          id: row.id,
                          rank: row.rank,
                          name: row.name,
                          secondaryLabel: "",
                          avgDailyTime: row.avgDailyTime,
                          isProvisional: false,
                          isCurrentEmployee: false,
                        }))
                    ).map((row) => (
                      <LeaderboardRow
                        key={row.id}
                        rank={row.rank}
                        name={row.name}
                        secondaryLabel={row.secondaryLabel}
                        avgDailyTime={row.avgDailyTime}
                        isProvisional={row.isProvisional}
                        isCurrentEmployee={row.isCurrentEmployee}
                      />
                    ))}
                  </div>

                  {/* Your position */}
                  {(() => {
                    const myRank = currentEmployeeRank?.rank ?? MOCK_MY_POSITION.rank;
                    const myTime = currentEmployeeRank
                      ? formatMinutes(currentEmployeeRank.avgDailyMinutes)
                      : MOCK_MY_POSITION.avgDailyTime;
                    return (
                      <div className="mt-1 flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3">
                        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700 ring-1 ring-gray-300">
                          {myRank}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-gray-900">You</p>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                              Your rank
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">#{myRank} in {formatMonthLabel(monthKey)}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-gray-900">{myTime}</p>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
