"use client";

import { useMemo, useState } from "react";
import { Settings2 } from "lucide-react";
import Sidebar from "../_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import { useGetAdminBenefitsQuery } from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isHrAdmin } from "../_lib/access";

// ── Mock data ─────────────────────────────────────────────────────────────────

const mockEmployees = [
  { id: "emp-1", name: "Bataa", screenTimeHours: 5 },
  { id: "emp-2", name: "Boldoo", screenTimeHours: 5 },
  { id: "emp-3", name: "Tergel", screenTimeHours: 3 },
  { id: "emp-4", name: "Tsetsgee", screenTimeHours: 3 },
  { id: "emp-5", name: "Galaa", screenTimeHours: 6 },
  { id: "emp-6", name: "Togoldor", screenTimeHours: 2 },
];

type MockEmployee = (typeof mockEmployees)[number];
type RewardStatus = "rewarded" | "eligible" | "above_average";

type LeaderboardEntry = MockEmployee & {
  rank: number;
  status: RewardStatus;
  rewardAmount: number;
};

function computeLeaderboard(
  employees: MockEmployee[],
  rewardPercentage: number,
  rewardAmount: number,
): {
  leaderboard: LeaderboardEntry[];
  average: number;
  rewardCount: number;
  eligibleCount: number;
} {
  const total = employees.length;
  const average =
    employees.reduce((sum, e) => sum + e.screenTimeHours, 0) / total;
  const rewardCount = Math.floor((total * rewardPercentage) / 100);

  const sorted = [...employees].sort((a, b) => {
    if (a.screenTimeHours !== b.screenTimeHours)
      return a.screenTimeHours - b.screenTimeHours;
    return a.name.localeCompare(b.name);
  });

  const eligibleSorted = sorted.filter((e) => e.screenTimeHours < average);
  const rewardedIds = new Set(
    eligibleSorted.slice(0, rewardCount).map((e) => e.id),
  );
  const eligibleIds = new Set(eligibleSorted.map((e) => e.id));

  const leaderboard: LeaderboardEntry[] = sorted.map((e, i) => {
    let status: RewardStatus;
    if (rewardedIds.has(e.id)) status = "rewarded";
    else if (eligibleIds.has(e.id)) status = "eligible";
    else status = "above_average";

    return {
      ...e,
      rank: i + 1,
      status,
      rewardAmount: status === "rewarded" ? rewardAmount : 0,
    };
  });

  return { leaderboard, average, rewardCount, eligibleCount: eligibleSorted.length };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminScreenTimePage() {
  const { employee, loading: employeeLoading } = useCurrentEmployee();
  const canManage = isHrAdmin(employee);
  const { loading } = useGetAdminBenefitsQuery({ skip: !canManage });

  const [rewardPercentage, setRewardPercentage] = useState(50);
  const [rewardAmount, setRewardAmount] = useState(100000);

  const { leaderboard, average, rewardCount, eligibleCount } = useMemo(
    () => computeLeaderboard(mockEmployees, rewardPercentage, rewardAmount),
    [rewardPercentage, rewardAmount],
  );

  if (employeeLoading || loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center">
          <PageLoading message="Loading…" />
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="mx-auto w-full max-w-5xl px-8 py-10 space-y-6">

          {/* ── 1. Reward configuration — amber accent ─────────────────── */}
          <section className="rounded-2xl border border-amber-200 bg-white p-7">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-200">
                <Settings2 className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Reward Configuration
                </h2>
                <p className="mt-0.5 text-sm text-gray-400">
                  Employees below the company average are ranked lowest to
                  highest. The selected percentage of all employees will receive
                  the reward.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  Reward percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={rewardPercentage}
                    onChange={(e) =>
                      setRewardPercentage(
                        Math.min(100, Math.max(1, Number(e.target.value))),
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  />
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    %
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-gray-400">
                  {rewardCount} of {mockEmployees.length} employees rewarded
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  Reward amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={rewardAmount}
                    onChange={(e) =>
                      setRewardAmount(Math.max(0, Number(e.target.value)))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-8 text-sm text-gray-900 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  />
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    ₮
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-gray-400">
                  Total payout:{" "}
                  {(rewardCount * rewardAmount).toLocaleString()}₮
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-800">
              {eligibleCount} employee{eligibleCount !== 1 ? "s" : ""} eligible
              (below {average.toFixed(1)}h average) · top {rewardCount} rewarded
              · {rewardAmount.toLocaleString()}₮ each
            </div>
          </section>

          {/* ── 3. Leaderboard ─────────────────────────────────────────── */}
          <section className="rounded-2xl border border-gray-200 bg-white p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Leaderboard
                </h2>
                <p className="mt-0.5 text-sm text-gray-400">
                  Company average:{" "}
                  <span className="font-medium text-gray-700">
                    {average.toFixed(1)}h
                  </span>
                </p>
              </div>
              <span className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500">
                {mockEmployees.length} employees
              </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-gray-100">
              <table className="min-w-full text-left">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="w-14 px-4 py-3 text-xs font-medium text-gray-400">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-400">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-400">
                      Screen time
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">
                      Reward
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => {
                    const isRewarded = entry.status === "rewarded";
                    const isEligible = entry.status === "eligible";

                    const rankBadgeCls = isRewarded
                      ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
                      : isEligible
                        ? "bg-gray-100 text-gray-600"
                        : "bg-gray-100 text-gray-400";

                    const statusCls = isRewarded
                      ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                      : isEligible
                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                        : "bg-gray-100 text-gray-400";

                    const statusLabel = isRewarded
                      ? "Rewarded"
                      : isEligible
                        ? "Eligible"
                        : "Above average";

                    return (
                      <tr
                        key={entry.id}
                        className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${rankBadgeCls}`}
                          >
                            {entry.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-medium text-gray-900">
                            {entry.name}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm tabular-nums text-gray-600">
                            {entry.screenTimeHours}h
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${statusCls}`}
                          >
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {isRewarded ? (
                            <span className="text-sm font-semibold tabular-nums text-green-600">
                              {entry.rewardAmount.toLocaleString()}₮
                            </span>
                          ) : (
                            <span className="text-sm text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend + status descriptions */}
            <div className="mt-5 space-y-3">
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                <LegendDot dotClass="bg-green-400" label="Rewarded" />
                <LegendDot dotClass="bg-blue-300" label="Eligible" />
                <LegendDot
                  dotClass="bg-gray-200 ring-1 ring-gray-300"
                  label="Above average"
                />
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 space-y-1.5 text-xs text-gray-500">
                <p>
                  <span className="font-medium text-green-700">Rewarded</span>
                  {" — "}eligible employees within the top reward percentage
                </p>
                <p>
                  <span className="font-medium text-blue-700">Eligible</span>
                  {" — "}screen time below the company average, but outside the
                  reward cutoff
                </p>
                <p>
                  <span className="font-medium text-gray-600">
                    Above average
                  </span>
                  {" — "}screen time at or above the company average (
                  {average.toFixed(1)}h)
                </p>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function LegendDot({ dotClass, label }: { dotClass: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}
