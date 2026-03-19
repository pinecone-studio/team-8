"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  Calendar,
  Clock3,
  ExternalLink,
  ImageUp,
  ShieldAlert,
  Sparkles,
  UploadCloud,
  XCircle,
} from "lucide-react";
import Sidebar from "../../../_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import {
  BenefitFlowType,
  BenefitEligibilityStatus,
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

function averageRounded(values: number[]): number | null {
  if (!values.length) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function resolveCurrentAverageFromDueSlots(input: {
  dueSlotDates: string[];
  submissions: Array<{
    slotDate: string;
    avgDailyMinutes?: number | null;
    reviewStatus: string;
  }>;
}): number | null {
  if (!input.dueSlotDates.length) return null;

  const approvedBySlot = new Map(
    input.submissions
      .filter((submission) => ["approved", "auto_approved"].includes(submission.reviewStatus))
      .map((submission) => [submission.slotDate, submission]),
  );

  const dueMinutes: number[] = [];
  for (const slotDate of input.dueSlotDates) {
    const submission = approvedBySlot.get(slotDate);
    if (!submission || typeof submission.avgDailyMinutes !== "number") {
      return null;
    }
    dueMinutes.push(submission.avgDailyMinutes);
  }

  return averageRounded(dueMinutes);
}

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
  const program = data?.myScreenTimeMonth.program;
  const leaderboard = leaderboardData?.screenTimeLeaderboard ?? [];
  const submissionBySlot = useMemo(
    () => new Map((month?.submissions ?? []).map((submission) => [submission.slotDate, submission])),
    [month?.submissions],
  );
  const currentEmployeeRank = leaderboard.find((row) => row.employeeId === month?.employeeId) ?? null;
  const currentAverageDisplay = useMemo(
    () =>
      month
        ? resolveCurrentAverageFromDueSlots({
            dueSlotDates: month.dueSlotDates,
            submissions: month.submissions,
          }) ?? month.monthlyAvgDailyMinutes
        : null,
    [month],
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
        <main className="w-full max-w-6xl px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link
                href="/employee-panel/screen-time"
                className="text-sm text-gray-500 transition hover:text-gray-800"
              >
                ← Back to screen time
              </Link>
              <h1 className="mt-3 text-2xl font-semibold text-gray-900">
                {benefit.name}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Upload a 7-day average phone screen-time screenshot every Monday of the month. Missing any required Monday means no salary uplift for that month.
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

          <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <section className="rounded-2xl border border-gray-100 bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Current Month Status</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Required Monday slots: {month?.requiredSlotDates.join(", ") || "—"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      month?.status === "eligible"
                        ? "bg-emerald-100 text-emerald-700"
                        : month?.status === "ineligible_missing_slots"
                          ? "bg-red-100 text-red-700"
                          : month?.status === "not_qualified"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {month?.status?.replaceAll("_", " ") || "unknown"}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Submitted Slots
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">
                      {month?.submittedSlotCount ?? 0}/{month?.requiredSlotCount ?? 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Monthly Avg Daily Time
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">
                      {formatMinutes(currentAverageDisplay)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Salary Uplift
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-700">
                      +{month?.awardedSalaryUpliftPercent ?? 0}%
                    </p>
                  </div>
                </div>

                {data?.myScreenTimeMonth.failedRuleMessage && (
                  <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {data.myScreenTimeMonth.failedRuleMessage}
                  </div>
                )}

                {month?.missingDueSlotDates?.length ? (
                  <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    Missing required Monday uploads: {month.missingDueSlotDates.join(", ")}.
                    This month currently has no uplift eligibility.
                  </div>
                ) : null}
              </section>

              <section className="rounded-2xl border border-gray-100 bg-white p-6">
                <h2 className="text-base font-semibold text-gray-900">Weekly Monday Slots</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Only screenshots captured on the month&apos;s Monday slots count toward the uplift.
                </p>

                <div className="mt-5 grid gap-3">
                  {month?.requiredSlotDates.map((slotDate) => {
                    const submission = submissionBySlot.get(slotDate);
                    const isDue = month.dueSlotDates.includes(slotDate);
                    const isActive = data?.myScreenTimeMonth.activeSlotDate === slotDate;

                    return (
                      <div
                        key={slotDate}
                        className={`rounded-2xl border p-4 ${
                          isActive
                            ? "border-fuchsia-200 bg-fuchsia-50"
                            : submission
                              ? "border-emerald-100 bg-emerald-50"
                              : isDue
                                ? "border-red-100 bg-red-50"
                                : "border-gray-100 bg-gray-50"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{slotDate}</p>
                            <p className="mt-1 text-xs text-gray-500">
                              {submission
                                ? `Extracted average: ${formatMinutes(submission.avgDailyMinutes)}`
                                : isDue
                                  ? "Required Monday slot is missing."
                                  : "Upcoming Monday slot."}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {submission ? (
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                                  submission.reviewStatus === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {submission.reviewStatus.replaceAll("_", " ")}
                              </span>
                            ) : isDue ? (
                              <XCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <Clock3 className="h-5 w-5 text-gray-300" />
                            )}

                            {submission?.viewUrl && submission.fileName && (
                              <a
                                href={getContractProxyUrl(submission.viewUrl) ?? submission.viewUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Open screenshot
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-2xl border border-gray-100 bg-white p-6">
                <h2 className="text-base font-semibold text-gray-900">Salary Uplift Bands</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {program?.tiers.map((tier) => (
                    <div key={tier.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-sm font-semibold text-gray-900">{tier.label}</p>
                      <p className="mt-2 text-xs uppercase tracking-wide text-gray-400">Up to</p>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">
                        {formatMinutes(tier.maxDailyMinutes)}
                      </p>
                      <p className="mt-3 text-sm font-medium text-emerald-700">
                        +{tier.salaryUpliftPercent}% salary uplift
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-2xl border border-gray-100 bg-white p-6">
                <h2 className="text-base font-semibold text-gray-900">Monday Upload</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Upload the phone OS screenshot that shows the last 7 days average.
                </p>

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

                <div className="mt-5 rounded-2xl border border-dashed border-fuchsia-200 bg-fuchsia-50 p-5 text-center">
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
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-fuchsia-600 shadow-sm">
                    <ImageUp className="h-7 w-7" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-gray-900">
                    {data?.myScreenTimeMonth.isUploadOpenToday
                      ? `Today's slot is open: ${data.myScreenTimeMonth.activeSlotDate}`
                      : "Upload opens only on the current month's Monday slots"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Gemini extracts the average daily screen time automatically and the system trusts the returned result.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!data?.myScreenTimeMonth.isUploadOpenToday || uploading}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {uploading ? (
                      <>
                        <Clock3 className="h-4 w-4 animate-spin" />
                        Uploading…
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-4 w-4" />
                        Upload Monday screenshot
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                  Use the OS-level Screen Time / Digital Wellbeing weekly average view. If any required Monday is missed, the month receives 0% uplift.
                </div>

                <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-500">
                  Tracker date: {data?.myScreenTimeMonth.todayLocalDate || "—"}
                </div>
              </section>

              <section className="rounded-2xl border border-gray-100 bg-white p-6">
                <h2 className="text-base font-semibold text-gray-900">Submission Notes</h2>
                <div className="mt-4 space-y-3">
                  {month?.submissions.length ? (
                    month.submissions.map((submission) => (
                      <div key={submission.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                        <div className="flex items-start gap-2">
                          {submission.reviewStatus === "rejected" ? (
                            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                          ) : (
                            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{submission.slotDate}</p>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {submission.reviewNote || "Accepted automatically from Gemini extraction."}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      Submission notes will appear here after you start uploading Monday screenshots.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-gray-100 bg-white p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Leaderboard</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Showing the top 5 employees with the lowest monthly average for {monthKey}.
                    </p>
                  </div>
                  {currentEmployeeRank?.rank ? (
                    <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-fuchsia-700">
                      Your rank #{currentEmployeeRank.rank}
                    </span>
                  ) : null}
                </div>

                {leaderboardLoading ? (
                  <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                    Loading leaderboard…
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                    No ranked results yet for this month.
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {leaderboard.map((row) => {
                      const isCurrentEmployee = row.employeeId === month?.employeeId;
                      return (
                        <div
                          key={row.employeeId}
                          className={`rounded-xl border px-4 py-3 ${
                            isCurrentEmployee
                              ? "border-fuchsia-200 bg-fuchsia-50"
                              : "border-gray-100 bg-gray-50"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-white px-2 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
                                  {row.rank ? `#${row.rank}` : "—"}
                                </span>
                                <p className="text-sm font-semibold text-gray-900">
                                  {row.employeeName}
                                  {isCurrentEmployee ? " (You)" : ""}
                                </p>
                              </div>
                              <p className="mt-1 text-xs text-gray-500">
                                {row.approvedSlotCount}/{row.dueSlotCount} completed Monday slots so far
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                {formatMinutes(row.avgDailyMinutes)}
                              </p>
                              <p className="mt-1 text-xs font-medium text-emerald-700">
                                +{row.awardedSalaryUpliftPercent}% uplift
                              </p>
                              {row.isProvisional ? (
                                <p className="mt-1 text-[11px] font-medium text-fuchsia-700">
                                  Provisional
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
