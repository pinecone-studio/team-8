"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Smartphone, Trophy } from "lucide-react";
import Sidebar from "../../_components/SideBar";
import {
  BenefitFlowType,
  GetAdminBenefitsDocument,
  useCreateBenefitMutation,
  useUpsertScreenTimeProgramMutation,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isHrAdmin } from "../../_lib/access";

export default function CreateScreenTimeProgramPage() {
  const router = useRouter();
  const { employee, loading: employeeLoading } = useCurrentEmployee();
  const canManage = isHrAdmin(employee);

  const [name, setName] = useState("Digital Wellness Competition");
  const [description, setDescription] = useState(
    "Employees upload a 7-day average screen-time screenshot every required Friday. Missing or rejected required slots disqualify that month. The top-ranked employees with the lowest averages win a fixed cash reward.",
  );
  const [winnerPercent, setWinnerPercent] = useState("20");
  const [rewardAmountMnt, setRewardAmountMnt] = useState("100000");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [createBenefit] = useCreateBenefitMutation({
    refetchQueries: [{ query: GetAdminBenefitsDocument }],
  });
  const [upsertProgram] = useUpsertScreenTimeProgramMutation();

  async function handleSubmit() {
    setError(null);

    if (!name.trim()) {
      setError("Program name is required.");
      return;
    }

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

    setSaving(true);
    try {
      const result = await createBenefit({
        variables: {
          input: {
            name: name.trim(),
            description: description.trim() || undefined,
            category: "wellness",
            subsidyPercent: 0,
            requiresContract: false,
            flowType: BenefitFlowType.ScreenTime,
            approvalPolicy: "hr",
          },
        },
      });

      const benefitId = result.data?.createBenefit.id;
      if (!benefitId) {
        throw new Error("Failed to create the screen time benefit record.");
      }

      await upsertProgram({
        variables: {
          input: {
            benefitId,
            winnerPercent: parsedWinnerPercent,
            rewardAmountMnt: parsedRewardAmount,
          },
        },
      });

      router.push(`/admin-panel/screen-time/${benefitId}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create screen time program.",
      );
      setSaving(false);
    }
  }

  if (employeeLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          Loading…
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
      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-5xl px-8 py-8">
          <Link
            href="/admin-panel/screen-time"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to screen time
          </Link>

          <div className="mt-4 rounded-3xl border border-fuchsia-100 bg-white p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-600 text-white">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">New Screen Time Competition</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Create the feature here, then manage rankings, Friday submissions, and monthly winners from the dedicated admin screen time section.
                </p>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
            <section className="rounded-2xl border border-gray-100 bg-white p-6">
              <h2 className="text-base font-semibold text-gray-900">Program details</h2>
              <div className="mt-5 grid gap-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-400">
                    Program name
                  </span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-400">
                    Description
                  </span>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-400">
                      Top winner percent
                    </span>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={winnerPercent}
                        onChange={(event) => setWinnerPercent(event.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-gray-400">%</span>
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-400">
                      Reward per winner
                    </span>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        step={1000}
                        value={rewardAmountMnt}
                        onChange={(event) => setRewardAmountMnt(event.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-gray-400">MNT</span>
                    </div>
                  </label>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-fuchsia-600" />
                <h2 className="text-base font-semibold text-gray-900">How it works</h2>
              </div>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <p>1. Employees upload one screenshot on each required Friday.</p>
                <p>2. Each screenshot covers the last 7 days, and the slot is assigned to the month with the majority of days.</p>
                <p>3. Missing or rejected required slots disqualify the employee for that month.</p>
                <p>4. Qualified employees are ranked by lowest average screen time, and the top {winnerPercent || "0"}% each receive {Number(rewardAmountMnt || 0).toLocaleString()} MNT.</p>
              </div>
            </section>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-xl bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {saving ? "Creating…" : "Create Screen Time Competition"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
