"use client";

import Link from "next/link";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Heart,
  Lock,
  ScrollText,
  Users,
} from "lucide-react";
import { useGetAdminDashboardSummaryQuery } from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import {
  getAdminDashboardSubtitle,
  getAdminDashboardTitle,
  isAdminEmployee,
  isHrAdmin,
} from "../_lib/access";

// ── Stat card ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  loading,
}: {
  label: string;
  value: number;
  icon: typeof Users;
  iconColor: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="h-[110px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
    );
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-2 flex items-start justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <p className="text-4xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

// ── Alert card (contract health) ────────────────────────────────────────────

function AlertCard({
  label,
  count,
  href,
  tone,
  hint,
  countLabel,
  loading,
}: {
  label: string;
  count: number;
  href: string;
  tone: "amber" | "rose" | "blue";
  hint: string;
  countLabel: string;
  loading?: boolean;
}) {
  const tones = {
    amber: {
      iconBg: "bg-amber-50",
      iconText: "text-amber-700",
      pill: "bg-amber-100 text-amber-700",
    },
    rose: {
      iconBg: "bg-rose-50",
      iconText: "text-rose-700",
      pill: "bg-rose-100 text-rose-700",
    },
    blue: {
      iconBg: "bg-blue-50",
      iconText: "text-blue-700",
      pill: "bg-blue-100 text-blue-700",
    },
  };
  const t = tones[tone];

  if (loading) {
    return (
      <div className="h-[116px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
    );
  }

  return (
    <Link
      href={href}
      className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-slate-300 hover:shadow-sm"
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${t.iconBg}`}
      >
        <span className={`text-lg ${t.iconText}`}>!</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
        <span
          className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${t.pill}`}
        >
          {count} {countLabel}
        </span>
      </div>
    </Link>
  );
}

// ── Action queue card ───────────────────────────────────────────────────────

function ActionQueueCard({
  label,
  count,
  href,
  tone,
  hint,
  maxCount,
  loading,
}: {
  label: string;
  count: number;
  href: string;
  tone: "blue" | "amber" | "rose" | "green";
  hint: string;
  maxCount: number;
  loading?: boolean;
}) {
  const tones = {
    blue: {
      accent: "text-blue-700",
      bar: "bg-blue-500",
    },
    amber: {
      accent: "text-amber-700",
      bar: "bg-amber-500",
    },
    rose: {
      accent: "text-rose-600",
      bar: "bg-rose-500",
    },
    green: {
      accent: "text-emerald-700",
      bar: "bg-emerald-500",
    },
  };
  const t = tones[tone];
  const safeMax = Math.max(maxCount, 1);
  const width = Math.min((count / safeMax) * 100, 100);

  if (loading) {
    return (
      <div className="h-[128px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
    );
  }

  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-slate-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
        </div>
        <span className={`text-2xl font-semibold ${t.accent}`}>
          {count}
        </span>
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${t.bar}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </Link>
  );
}

// ── Category bar chart (palette progress bars) ──────────────────────────────

function CategoryBars({
  data,
}: {
  data: Array<{ label: string; value: number }>;
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
        No usage data yet.
      </div>
    );
  }
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const safeTotal = Math.max(total, 1);
  const paletteByLabel: Record<string, string> = {
    Career: "bg-indigo-500",
    Flexibility: "bg-purple-500",
    Equipment: "bg-slate-500",
    Wellness: "bg-emerald-500",
  };
  const orderedLabels = [
    "Wellness",
    "Equipment",
    "Financial",
    "Career",
    "Flexibility",
    "Other",
  ];
  const valueByLabel = data.reduce<Record<string, number>>((acc, item) => {
    acc[item.label] = item.value;
    return acc;
  }, {});
  const orderedItems = orderedLabels
    .map((label) => ({
      label,
      value: valueByLabel[label] ?? 0,
    }))
    .sort((a, b) => {
      if (b.value !== a.value) return b.value - a.value;
      return a.label.localeCompare(b.label);
    });
  return (
    <div className="space-y-4">
      {orderedItems.map((item) => {
        const width = Math.min((item.value / safeTotal) * 100, 100);
        const color = paletteByLabel[item.label] ?? "bg-slate-400";
        const isZero = item.value === 0;
        return (
          <div
            key={item.label}
            className={`grid grid-cols-[1fr_220px_64px] items-center gap-4 ${
              isZero ? "opacity-50" : ""
            }`}
          >
            <p className="text-sm font-semibold text-slate-700">
              {item.label}
            </p>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div
                className={`h-2 rounded-full ${color}`}
                style={{ width: `${width}%` }}
              />
            </div>
            <div className="text-right text-sm text-slate-500">
              <span className="font-semibold text-slate-700">
                {item.value}
              </span>
              {" / "}
              {safeTotal}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Lock reason list ─────────────────────────────────────────────────────────

function LockReasonList({
  data,
}: {
  data: Array<{ label: string; value: number }>;
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
        No locked benefits right now.
      </div>
    );
  }
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <div className="space-y-2.5">
      {data.slice(0, 5).map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <p className="flex-1 truncate text-xs text-slate-600">{item.label}</p>
          <span className="text-xs font-semibold text-slate-700">
            {item.value}
          </span>
          <span className="text-xs text-slate-400">
            ({Math.round((item.value / total) * 100)}%)
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const {
    employee,
    error: employeeError,
    loading: employeeLoading,
  } = useCurrentEmployee();
  const hasAdminAccess = isAdminEmployee(employee);
  const isHr = isHrAdmin(employee);

  const {
    data,
    error: dashboardError,
    loading: dashboardLoading,
  } = useGetAdminDashboardSummaryQuery({ skip: !hasAdminAccess });

  const summary = data?.adminDashboardSummary;
  const isLoading = employeeLoading || (hasAdminAccess && dashboardLoading);
  const errorMessage = employeeError ?? dashboardError ?? null;

  return (
    <main className="flex-1 px-8 py-9">
      <section className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            {getAdminDashboardTitle(employee)}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {employeeLoading
              ? "Loading admin profile…"
              : !employee
                ? "We couldn't find your employee profile."
                : !hasAdminAccess
                  ? "This account does not currently have admin access."
                  : getAdminDashboardSubtitle(employee)}
          </p>
        </div>

        {/* Guard states */}
        {errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            Failed to load admin dashboard data.
          </div>
        ) : !employeeLoading && !employee ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
            Your Clerk account is signed in, but no matching employee record was
            found.
          </div>
        ) : !employeeLoading && employee && !hasAdminAccess ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
            Admin access requires an HR or Finance employee with responsibility
            level 2 or higher.
          </div>
        ) : (
          <>
            {/* Summary stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total Employees"
                value={summary?.totalEmployees ?? 0}
                icon={Users}
                iconColor="text-slate-400"
                loading={isLoading}
              />
              <StatCard
                label="Active Benefits"
                value={summary?.activeBenefits ?? 0}
                icon={Heart}
                iconColor="text-emerald-500"
                loading={isLoading}
              />
              <StatCard
                label="Pending Requests"
                value={summary?.pendingRequests ?? 0}
                icon={ScrollText}
                iconColor="text-orange-500"
                loading={isLoading}
              />
              <StatCard
                label="Locked Benefits"
                value={summary?.lockedBenefits ?? 0}
                icon={Lock}
                iconColor="text-slate-400"
                loading={isLoading}
              />
            </div>

            {/* Contract health + suspension alerts (HR only) */}
            {isHr && (
              <div className="mt-6">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Contract Health &amp; Enrollment Alerts
                </h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  <AlertCard
                    label="Contracts expiring soon"
                    count={summary?.contractsExpiringSoon ?? 0}
                    href="/admin-panel/vendor-contracts"
                    tone="amber"
                    hint="Active contracts expiring within 60 days"
                    countLabel="contracts"
                    loading={isLoading}
                  />
                  <AlertCard
                    label="Missing active contracts"
                    count={summary?.benefitsMissingContracts ?? 0}
                    href="/admin-panel/vendor-contracts"
                    tone="rose"
                    hint="Benefits that need a contract uploaded"
                    countLabel="benefits"
                    loading={isLoading}
                  />
                  <AlertCard
                    label="Suspended enrollments"
                    count={summary?.suspendedEnrollments ?? 0}
                    href="/admin-panel/eligibility-inspector"
                    tone="blue"
                    hint="Enrollments pending re-evaluation"
                    countLabel="enrollments"
                    loading={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Action queues + Benefit enrollment */}
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Action Queues
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(() => {
                    const hrCount = summary?.hrQueueCount ?? 0;
                    const financeCount = summary?.financeQueueCount ?? 0;
                    const contractCount = summary?.awaitingContractCount ?? 0;
                    const approvedCount = summary?.approvedThisWeekCount ?? 0;
                    const maxCount = Math.max(
                      hrCount,
                      financeCount,
                      contractCount,
                      approvedCount,
                      1,
                    );

                    return (
                      <>
                        {isHr && (
                          <ActionQueueCard
                            label="HR review"
                            count={hrCount}
                            href="/admin-panel/pending-requests"
                            tone="blue"
                            hint="Awaiting HR decision"
                            maxCount={maxCount}
                            loading={isLoading}
                          />
                        )}
                        <ActionQueueCard
                          label="Finance review"
                          count={financeCount}
                          href="/admin-panel/pending-requests"
                          tone="amber"
                          hint="Awaiting Finance decision"
                          maxCount={maxCount}
                          loading={isLoading}
                        />
                        {isHr && (
                          <ActionQueueCard
                            label="Contract acceptance"
                            count={contractCount}
                            href="/admin-panel/pending-requests"
                            tone="rose"
                            hint="Yet to accept contract"
                            maxCount={maxCount}
                            loading={isLoading}
                          />
                        )}
                        <ActionQueueCard
                          label="Approved this week"
                          count={approvedCount}
                          href="/admin-panel/pending-requests"
                          tone="green"
                          hint="Last 7 days"
                          maxCount={maxCount}
                          loading={isLoading}
                        />
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-semibold text-gray-900">
                  Benefit Enrollment by Category
                </h2>
                <div className="mt-4">
                  {isLoading ? (
                    <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
                  ) : (
                    <CategoryBars data={summary?.usageByCategory ?? []} />
                  )}
                </div>
              </div>
            </div>

            {/* Quick links */}
            {isHr && (
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {[
                  {
                    title: "Eligibility Inspector",
                    description:
                      "View and override employee benefit eligibility in real time.",
                    href: "/admin-panel/eligibility-inspector",
                    icon: Users,
                    iconColor: "text-blue-500",
                  },
                  {
                    title: "Rule Configuration",
                    description:
                      "Manage per-benefit eligibility rules and conditions.",
                    href: "/admin-panel/rule-configuration",
                    icon: AlertCircle,
                    iconColor: "text-orange-500",
                  },
                  {
                    title: "Vendor Contracts",
                    description:
                      "Upload, activate, and review vendor contract documents.",
                    href: "/admin-panel/vendor-contracts",
                    icon: FileText,
                    iconColor: "text-purple-500",
                  },
                ].map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <item.icon className={`h-5 w-5 ${item.iconColor} mb-3`} />
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}

            {/* Finance-only shortcut */}
            {!isHr && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Link
                  href="/admin-panel/pending-requests"
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <Clock className="h-5 w-5 text-teal-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-teal-700">
                      Finance Review Queue
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Process pending finance approval requests
                    </p>
                  </div>
                </Link>
                <Link
                  href="/admin-panel/company-benefits"
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700">
                      Company Benefits
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      View and manage available benefits
                    </p>
                  </div>
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
