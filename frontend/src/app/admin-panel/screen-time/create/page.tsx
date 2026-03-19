"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Smartphone, Trash2 } from "lucide-react";
import Sidebar from "../../_components/SideBar";
import {
  BenefitFlowType,
  GetAdminBenefitsDocument,
  useCreateBenefitMutation,
  useUpsertScreenTimeProgramMutation,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isHrAdmin } from "../../_lib/access";

type TierRow = {
  id: string;
  label: string;
  maxDailyMinutes: string;
  salaryUpliftPercent: string;
};

function newTier(index: number): TierRow {
  return {
    id: Math.random().toString(36).slice(2),
    label: `Tier ${index + 1}`,
    maxDailyMinutes: "",
    salaryUpliftPercent: "",
  };
}

export default function CreateScreenTimeProgramPage() {
  const router = useRouter();
  const { employee, loading: employeeLoading } = useCurrentEmployee();
  const canManage = isHrAdmin(employee);

  const [name, setName] = useState("Digital Wellness Salary Uplift");
  const [description, setDescription] = useState(
    "Employees upload a 7-day average screen-time screenshot every Monday. Missing any required Monday means no salary uplift for the month.",
  );
  const [subsidyPercent, setSubsidyPercent] = useState("0");
  const [tiers, setTiers] = useState<TierRow[]>([
    {
      id: "tier-1",
      label: "High focus",
      maxDailyMinutes: "60",
      salaryUpliftPercent: "15",
    },
    {
      id: "tier-2",
      label: "Strong balance",
      maxDailyMinutes: "120",
      salaryUpliftPercent: "10",
    },
    {
      id: "tier-3",
      label: "Healthy range",
      maxDailyMinutes: "180",
      salaryUpliftPercent: "5",
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [createBenefit] = useCreateBenefitMutation({
    refetchQueries: [{ query: GetAdminBenefitsDocument }],
  });
  const [upsertProgram] = useUpsertScreenTimeProgramMutation();

  function addTier() {
    setTiers((prev) => [...prev, newTier(prev.length)]);
  }

  function updateTier(id: string, patch: Partial<TierRow>) {
    setTiers((prev) =>
      prev.map((tier) => (tier.id === id ? { ...tier, ...patch } : tier)),
    );
  }

  function removeTier(id: string) {
    setTiers((prev) => prev.filter((tier) => tier.id !== id));
  }

  function fillDemo() {
    setName("Focus Week Salary Uplift");
    setDescription(
      "Employees submit a 7-day screen-time average every Monday. Submissions are checked automatically, and the highest eligible tier applies to the month.",
    );
    setSubsidyPercent("0");
    setTiers([
      {
        id: Math.random().toString(36).slice(2),
        label: "Deep focus",
        maxDailyMinutes: "45",
        salaryUpliftPercent: "20",
      },
      {
        id: Math.random().toString(36).slice(2),
        label: "Balanced",
        maxDailyMinutes: "90",
        salaryUpliftPercent: "12",
      },
      {
        id: Math.random().toString(36).slice(2),
        label: "Healthy",
        maxDailyMinutes: "150",
        salaryUpliftPercent: "6",
      },
    ]);
    setError(null);
  }

  async function handleSubmit() {
    setError(null);

    if (!name.trim()) {
      setError("Program name is required.");
      return;
    }
    if (!tiers.length) {
      setError("Add at least one salary uplift tier.");
      return;
    }
    for (const tier of tiers) {
      if (!tier.label.trim()) {
        setError("Each tier needs a label.");
        return;
      }
      if (!tier.maxDailyMinutes.trim() || Number(tier.maxDailyMinutes) <= 0) {
        setError("Each tier needs a valid max daily minutes value.");
        return;
      }
      if (
        !tier.salaryUpliftPercent.trim() ||
        Number(tier.salaryUpliftPercent) <= 0
      ) {
        setError("Each tier needs a valid salary uplift percent.");
        return;
      }
    }

    setSaving(true);
    try {
      const result = await createBenefit({
        variables: {
          input: {
            name: name.trim(),
            description: description.trim() || undefined,
            category: "wellness",
            subsidyPercent: Number(subsidyPercent) || 0,
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
            tiers: tiers.map((tier, index) => ({
              label: tier.label.trim(),
              maxDailyMinutes: Number(tier.maxDailyMinutes),
              salaryUpliftPercent: Number(tier.salaryUpliftPercent),
              displayOrder: index,
            })),
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
                <h1 className="text-2xl font-semibold text-gray-900">
                  New Screen Time Program
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Create the feature once here, then manage Monday submissions
                  and automatic month-end salary uplift results from the
                  dedicated admin screen time section.
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
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-gray-900">
                  Program details
                </h2>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="rounded-xl border border-gray-200 bg-yellow-400 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Fill demo
                </button>
              </div>
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

                <div>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-400">
                      Company subsidy %
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={subsidyPercent}
                      onChange={(event) =>
                        setSubsidyPercent(event.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                    />
                  </label>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-6">
              <h2 className="text-base font-semibold text-gray-900">
                How it works
              </h2>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <p>
                  1. Employees upload one screenshot on each Monday of the
                  month.
                </p>
                <p>2. Gemini extracts the 7-day daily average automatically.</p>
                <p>
                  3. Missing any required Monday means 0% uplift for that month.
                </p>
                <p>
                  4. The system calculates the monthly salary uplift
                  automatically from the accepted Monday slots.
                </p>
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Salary uplift tiers
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  The first band whose max daily minutes includes the
                  employee&apos;s monthly average wins.
                </p>
              </div>
              <button
                type="button"
                onClick={addTier}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
                Add tier
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="grid gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-[1.2fr_1fr_1fr_auto]"
                >
                  <input
                    value={tier.label}
                    onChange={(event) =>
                      updateTier(tier.id, { label: event.target.value })
                    }
                    placeholder="Tier label"
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                  />
                  <input
                    type="number"
                    min={1}
                    value={tier.maxDailyMinutes}
                    onChange={(event) =>
                      updateTier(tier.id, {
                        maxDailyMinutes: event.target.value,
                      })
                    }
                    placeholder="Max daily minutes"
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                  />
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={tier.salaryUpliftPercent}
                    onChange={(event) =>
                      updateTier(tier.id, {
                        salaryUpliftPercent: event.target.value,
                      })
                    }
                    placeholder="Salary uplift %"
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeTier(tier.id)}
                    disabled={tiers.length <= 1}
                    className="inline-flex items-center justify-center rounded-xl border border-red-100 px-3 py-3 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:opacity-50"
            >
              <Smartphone className="h-4 w-4" />
              {saving ? "Creating…" : "Create screen time program"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
