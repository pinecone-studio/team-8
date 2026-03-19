"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Trash2 } from "lucide-react";
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
  const router = useRouter();
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

  const programs = useMemo(
    () =>
      (data?.adminBenefits ?? [])
        .filter((benefit) => benefit.flowType === BenefitFlowType.ScreenTime)
        .sort((left, right) => Number(right.isActive) - Number(left.isActive)),
    [data?.adminBenefits],
  );

  useEffect(() => {
    if (!loading && programs.length === 1) {
      router.replace(`/admin-panel/screen-time/${programs[0].id}`);
    }
  }, [loading, programs, router]);

  async function handleDelete(id: string, name: string) {
    if (
      !window.confirm(
        `Remove screen time program "${name}"? This also removes submissions and monthly ranking history.`,
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
          <PageLoading message="Loading screen time…" />
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

  if (programs.length === 1) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center">
          <PageLoading message="Opening screen time competition…" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="mx-auto w-full max-w-5xl px-8 py-10">
          {feedback ? (
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
              {feedback}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              Failed to load screen time programs.
            </div>
          ) : programs.length === 0 ? (
            <section className="rounded-2xl border border-gray-200 bg-white p-7">
              <h2 className="text-sm font-semibold text-gray-900">
                No screen time competition yet
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Create the first program to start collecting Friday screenshots
                and ranking employees by the lowest monthly averages.
              </p>
              <Link
                href="/admin-panel/screen-time/create"
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-fuchsia-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-fuchsia-700"
              >
                Create competition
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          ) : (
            <section className="rounded-2xl border border-gray-200 bg-white p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Screen Time Programs
                  </h2>
                  <p className="mt-0.5 text-sm text-gray-400">
                    Choose which competition to manage.
                  </p>
                </div>
                <span className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500">
                  {programs.length} programs
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {program.name}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                            program.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {program.isActive ? "active" : "inactive"}
                        </span>
                      </div>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        {program.description ||
                          "Friday screenshots, ranking by the lowest averages, and fixed cash rewards for the top winner zone."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin-panel/screen-time/${program.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        Open
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
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
