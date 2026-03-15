"use client";

import Link from "next/link";
import { AlertCircle, CheckCircle, Clock, FileText, Heart, Lock, ScrollText, Users } from "lucide-react";
import {
  useGetAdminDashboardSummaryQuery,
} from "@/graphql/generated/graphql";
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
    return <div className="h-[110px] animate-pulse rounded-2xl border border-slate-200 bg-white" />;
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-2 flex items-start justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <p className="text-4xl font-semibold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}

// ── Queue action card ────────────────────────────────────────────────────────

function QueueCard({
  label,
  count,
  href,
  tone,
  hint,
  loading,
}: {
  label: string;
  count: number;
  href: string;
  tone: "blue" | "teal" | "amber" | "green";
  hint: string;
  loading?: boolean;
}) {
  const tones = {
    blue:  { bg: "bg-blue-50",  border: "border-blue-100",  badge: "bg-blue-100 text-blue-700",  text: "text-blue-700", link: "text-blue-600" },
    teal:  { bg: "bg-teal-50",  border: "border-teal-100",  badge: "bg-teal-100 text-teal-700",  text: "text-teal-700", link: "text-teal-600" },
    amber: { bg: "bg-amber-50", border: "border-amber-100", badge: "bg-amber-100 text-amber-700", text: "text-amber-700", link: "text-amber-600" },
    green: { bg: "bg-green-50", border: "border-green-100", badge: "bg-green-100 text-green-700", text: "text-green-700", link: "text-green-600" },
  };
  const t = tones[tone];

  if (loading) {
    return <div className="h-[88px] animate-pulse rounded-2xl border border-slate-200 bg-white" />;
  }

  return (
    <Link
      href={href}
      className={`flex items-center justify-between gap-4 rounded-2xl border ${t.border} ${t.bg} px-5 py-4 transition hover:brightness-95`}
    >
      <div>
        <p className={`text-sm font-semibold ${t.text}`}>{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
      </div>
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${t.badge}`}>
        {count}
      </span>
    </Link>
  );
}

// ── Category bar chart (simple inline bars) ─────────────────────────────────

function CategoryBars({ data }: { data: Array<{ label: string; value: number }> }) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
        No usage data yet.
      </div>
    );
  }
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.slice(0, 6).map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <p className="w-32 shrink-0 truncate text-xs text-slate-600">{item.label}</p>
          <div className="flex-1 overflow-hidden rounded-full bg-slate-100 h-2">
            <div
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
          <span className="w-6 shrink-0 text-right text-xs font-semibold text-slate-700">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Lock reason list ─────────────────────────────────────────────────────────

function LockReasonList({ data }: { data: Array<{ label: string; value: number }> }) {
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
          <span className="text-xs font-semibold text-slate-700">{item.value}</span>
          <span className="text-xs text-slate-400">({Math.round((item.value / total) * 100)}%)</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const { employee, error: employeeError, loading: employeeLoading } = useCurrentEmployee();
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
          <h1 className="text-xl font-semibold text-gray-900">
            {getAdminDashboardTitle(employee)}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
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
            Your Clerk account is signed in, but no matching employee record was found.
          </div>
        ) : !employeeLoading && employee && !hasAdminAccess ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
            Admin access requires an HR or Finance employee with responsibility level 2 or higher.
          </div>
        ) : (
          <>
            {/* Summary stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total Employees"   value={summary?.totalEmployees ?? 0}  icon={Users}      iconColor="text-slate-400"   loading={isLoading} />
              <StatCard label="Active Benefits"   value={summary?.activeBenefits ?? 0}  icon={Heart}      iconColor="text-emerald-500" loading={isLoading} />
              <StatCard label="Pending Requests"  value={summary?.pendingRequests ?? 0} icon={ScrollText} iconColor="text-orange-500"  loading={isLoading} />
              <StatCard label="Locked Benefits"   value={summary?.lockedBenefits ?? 0}  icon={Lock}       iconColor="text-slate-400"   loading={isLoading} />
            </div>

            {/* Action queue cards */}
            <div className="mt-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Action Queues
              </h2>
              <div className={`grid gap-3 ${isHr ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2"}`}>
                {isHr && (
                  <QueueCard
                    label="HR Review Queue"
                    count={summary?.hrQueueCount ?? 0}
                    href="/admin-panel/pending-requests"
                    tone="blue"
                    hint="Requests awaiting HR decision"
                    loading={isLoading}
                  />
                )}
                <QueueCard
                  label="Finance Review Queue"
                  count={summary?.financeQueueCount ?? 0}
                  href="/admin-panel/pending-requests"
                  tone="teal"
                  hint="Requests awaiting Finance decision"
                  loading={isLoading}
                />
                {isHr && (
                  <QueueCard
                    label="Contract Acceptance"
                    count={summary?.awaitingContractCount ?? 0}
                    href="/admin-panel/pending-requests"
                    tone="amber"
                    hint="Employees yet to accept contract"
                    loading={isLoading}
                  />
                )}
                <QueueCard
                  label="Approved This Week"
                  count={summary?.approvedThisWeekCount ?? 0}
                  href="/admin-panel/pending-requests"
                  tone="green"
                  hint="Requests approved in the last 7 days"
                  loading={isLoading}
                />
              </div>
            </div>

            {/* Charts */}
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-semibold text-gray-900">Benefit Enrollment by Category</h2>
                <div className="mt-4">
                  {isLoading ? (
                    <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
                  ) : (
                    <CategoryBars data={summary?.usageByCategory ?? []} />
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-semibold text-gray-900">Eligibility Lock Reasons</h2>
                <div className="mt-4">
                  {isLoading ? (
                    <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
                  ) : (
                    <LockReasonList data={summary?.lockReasons ?? []} />
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
                    description: "View and override employee benefit eligibility in real time.",
                    href: "/admin-panel/eligibility-inspector",
                    icon: Users,
                    iconColor: "text-blue-500",
                  },
                  {
                    title: "Rule Configuration",
                    description: "Manage per-benefit eligibility rules and conditions.",
                    href: "/admin-panel/rule-configuration",
                    icon: AlertCircle,
                    iconColor: "text-orange-500",
                  },
                  {
                    title: "Vendor Contracts",
                    description: "Upload, activate, and review vendor contract documents.",
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
                    <p className="mt-1 text-xs text-slate-500">{item.description}</p>
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
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-teal-700">Finance Review Queue</p>
                    <p className="mt-0.5 text-xs text-slate-500">Process pending finance approval requests</p>
                  </div>
                </Link>
                <Link
                  href="/admin-panel/company-benefits"
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700">Company Benefits</p>
                    <p className="mt-0.5 text-xs text-slate-500">View and manage available benefits</p>
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
