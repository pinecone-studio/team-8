"use client";

import { Heart, Lock, ScrollText, Users } from "lucide-react";
import {
  useGetAdminDashboardSummaryQuery,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import {
  getAdminDashboardSubtitle,
  getAdminDashboardTitle,
  isAdminEmployee,
} from "../_lib/access";

type DashboardBucket = {
  label: string;
  value: number;
};

const quickLinks = [
  {
    title: "Employee Eligibility Inspector",
    description: "View and override employee benefit eligibility",
  },
  {
    title: "Rule Configuration",
    description: "Manage benefit eligibility rules",
  },
  {
    title: "Vendor Contracts",
    description: "Manage benefit vendor contracts",
  },
];

function BarChart({ data }: { data: DashboardBucket[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[230px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
        No usage data yet.
      </div>
    );
  }

  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="flex h-[230px] items-end gap-4 border-b border-l border-dashed border-slate-200 px-3 pb-0 pt-3">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-[180px] w-full items-end">
            <div
              className="w-full rounded-t-md bg-blue-500"
              style={{ height: `${(item.value / max) * 100}%` }}
            />
          </div>
          <div className="text-center">
            <span className="block text-xs font-semibold text-slate-700">{item.value}</span>
            <span className="text-[11px] text-slate-500">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PieChart({ data }: { data: DashboardBucket[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[230px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
        No locked benefits right now.
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const palette = ["#3b82f6", "#f97316", "#10b981", "#6366f1", "#ef4444"];

  const segments = data.map((item, index) => ({
    ...item,
    color: palette[index % palette.length],
    percentage: (item.value / total) * 100,
  }));

  const gradientStops = segments.reduce<string[]>((acc, segment, index) => {
    const start = segments
      .slice(0, index)
      .reduce((sum, item) => sum + item.percentage, 0);
    const end = start + segment.percentage;

    acc.push(`${segment.color} ${start}%`, `${segment.color} ${end}%`);
    return acc;
  }, []);

  return (
    <div className="flex h-[230px] items-center justify-center gap-8">
      <div
        className="h-36 w-36 rounded-full"
        style={{ background: `conic-gradient(${gradientStops.join(", ")})` }}
      />

      <div className="space-y-3">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <div>
              <p className="text-sm font-medium text-slate-700">{segment.label}</p>
              <p className="text-xs text-slate-500">
                {segment.value} locked benefit{segment.value === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
}: {
  label: string;
  value: number;
  icon: typeof Users;
  iconColor: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-start justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <p className="text-4xl font-semibold tracking-[-0.02em] text-slate-900">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { employee, error: employeeError, loading: employeeLoading } =
    useCurrentEmployee();
  const hasAdminAccess = isAdminEmployee(employee);
  const {
    data,
    error: dashboardError,
    loading: dashboardLoading,
  } = useGetAdminDashboardSummaryQuery({
    skip: !hasAdminAccess,
  });

  const summary = data?.adminDashboardSummary;
  const isLoading = employeeLoading || (hasAdminAccess && dashboardLoading);
  const errorMessage = employeeError ?? dashboardError ?? null;
  const stats = summary
    ? [
        {
          label: "Total Employees",
          value: summary.totalEmployees,
          icon: Users,
          iconColor: "text-slate-400",
        },
        {
          label: "Active Benefits",
          value: summary.activeBenefits,
          icon: Heart,
          iconColor: "text-emerald-500",
        },
        {
          label: "Pending Requests",
          value: summary.pendingRequests,
          icon: ScrollText,
          iconColor: "text-orange-500",
        },
        {
          label: "Locked Benefits",
          value: summary.lockedBenefits,
          icon: Lock,
          iconColor: "text-slate-400",
        },
      ]
    : [];

  return (
    <main className="flex-1 px-8 py-9">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">
            {getAdminDashboardTitle(employee)}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {employeeLoading
              ? "Loading admin profile..."
              : !employee
                ? "We couldn't find your employee profile."
                : !hasAdminAccess
                  ? "This account does not currently have admin access."
                  : getAdminDashboardSubtitle(employee)}
          </p>
        </div>

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
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-[126px] animate-pulse rounded-2xl border border-slate-200 bg-white"
                    />
                  ))
                : stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Benefit Usage by Category
                </h2>
                <div className="mt-4">
                  {isLoading ? (
                    <div className="h-[230px] animate-pulse rounded-2xl bg-slate-100" />
                  ) : (
                    <BarChart data={summary?.usageByCategory ?? []} />
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Eligibility Lock Reasons
                </h2>
                <div className="mt-4">
                  {isLoading ? (
                    <div className="h-[230px] animate-pulse rounded-2xl bg-slate-100" />
                  ) : (
                    <PieChart data={summary?.lockReasons ?? []} />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {quickLinks.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-3 text-sm text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
