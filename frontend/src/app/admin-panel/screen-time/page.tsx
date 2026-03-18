"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, Smartphone, Trash2 } from "lucide-react";
import Sidebar from "../_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import {
  BenefitFlowType,
  GetAdminBenefitsDocument,
  useDeleteBenefitMutation,
  useGetAdminBenefitsQuery,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isHrAdmin } from "../_lib/access";

export default function AdminScreenTimePage() {
  const { employee, loading: employeeLoading } = useCurrentEmployee();
  const canManage = isHrAdmin(employee);
  const { data, loading, error } = useGetAdminBenefitsQuery({
    skip: !canManage,
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [deleteBenefit, { loading: deleting }] = useDeleteBenefitMutation({
    refetchQueries: [{ query: GetAdminBenefitsDocument }],
    onCompleted: () => setFeedback("Screen time program removed."),
    onError: (deleteError) =>
      setFeedback(deleteError.message || "Failed to remove screen time program."),
  });

  const programs = (data?.adminBenefits ?? []).filter(
    (benefit) => benefit.flowType === BenefitFlowType.ScreenTime,
  );

  async function handleDelete(id: string, name: string) {
    if (
      !window.confirm(
        `Remove screen time program "${name}"? This also removes submissions and monthly review history.`,
      )
    ) {
      return;
    }

    setDeletingId(id);
    setFeedback(null);
    try {
      await deleteBenefit({ variables: { id } });
    } finally {
      setDeletingId(null);
    }
  }

  if (employeeLoading || loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center">
          <PageLoading message="Loading screen time programs…" />
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
        <main className="w-full max-w-6xl px-8 py-8">
          <div className="rounded-3xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 via-white to-sky-50 p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-600 text-white">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Screen Time</h1>
                  <p className="mt-1 max-w-2xl text-sm text-gray-600">
                    Manage the standalone screen time salary uplift feature here. This stays separate from the normal company benefits catalog.
                  </p>
                </div>
              </div>

              <Link
                href="/admin-panel/screen-time/create"
                className="inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-fuchsia-700"
              >
                <Plus className="h-4 w-4" />
                New screen time program
              </Link>
            </div>
          </div>

          {feedback ? (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
              {feedback}
            </div>
          ) : null}

          <section className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold text-gray-900">Programs</h2>
              <p className="text-sm text-gray-500">
                {programs.length} configured
              </p>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
                Failed to load screen time programs.
              </div>
            ) : programs.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500">
                No screen time program yet. Create the first one from here.
              </div>
            ) : (
              <div className="mt-4 grid gap-4">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {program.description ||
                            "Weekly Monday screenshots with Gemini extraction and automatic month-end salary uplift calculation."}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span className="rounded-full bg-fuchsia-50 px-2.5 py-1 font-medium text-fuchsia-700">
                            Feature
                          </span>
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600">
                            {program.category}
                          </span>
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600">
                            approval: {program.approvalPolicy}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin-panel/screen-time/${program.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          Manage
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(program.id, program.name)}
                          disabled={deleting || deletingId !== null}
                          className="inline-flex items-center justify-center rounded-xl border border-red-100 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
