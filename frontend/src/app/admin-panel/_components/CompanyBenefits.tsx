"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BenefitFlowType,
  useGetAdminBenefitsQuery,
  useUpdateBenefitMutation,
  GetAdminBenefitsDocument,
} from "@/graphql/generated/graphql";
import { ArrowRight, Plus } from "lucide-react";

function BenefitTableRowSkeleton() {
  return (
    <tr className="border-b border-gray-50 last:border-b-0">
      {/* Name — prominent, wider bar */}
      <td className="px-4 py-3"><div className="h-3.5 w-36 rounded-full bg-slate-200/80 animate-pulse" /></td>
      {/* Status */}
      <td className="px-4 py-3"><div className="h-3 w-14 rounded-full bg-slate-200/80 animate-pulse" /></td>
      {/* Category */}
      <td className="px-4 py-3"><div className="h-3 w-20 rounded-full bg-slate-200/80 animate-pulse" /></td>
      {/* Subsidy % */}
      <td className="px-4 py-3"><div className="h-3 w-10 rounded-full bg-slate-200/80 animate-pulse" /></td>
      {/* Vendor */}
      <td className="px-4 py-3"><div className="h-3 w-28 rounded-full bg-slate-200/80 animate-pulse" /></td>
      {/* Contract yes/no */}
      <td className="px-4 py-3"><div className="h-3 w-8 rounded-full bg-slate-200/80 animate-pulse" /></td>
      {/* Approval policy badge — pill outline with inner text line */}
      <td className="px-4 py-3">
        <div className="inline-flex items-center rounded px-2 py-0.5 border border-slate-100">
          <div className="h-3 w-12 rounded-full bg-slate-200/80 animate-pulse" />
        </div>
      </td>
      {/* Actions: View button + toggle */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="inline-flex items-center gap-1 rounded-lg border border-slate-100 px-2.5 py-1">
            <div className="h-3 w-3 rounded-sm bg-slate-200/80 animate-pulse shrink-0" />
            <div className="h-3 w-6 rounded-full bg-slate-200/80 animate-pulse" />
          </div>
          <div className="h-7 w-16 rounded-lg bg-slate-200/80 animate-pulse" />
        </div>
      </td>
    </tr>
  );
}
import { isAdminEmployee, isHrAdmin } from "../_lib/access";
import { useCurrentEmployee } from "@/lib/current-employee-provider";

const APPROVAL_POLICY_LABELS: Record<string, string> = {
  hr: "HR",
  finance: "Finance",
  dual: "Dual",
};

function FeedbackToast({
  feedback,
  onClose,
}: {
  feedback: { type: "success" | "error"; message: string } | null;
  onClose: () => void;
}) {
  if (!feedback) return null;

  const isSuccess = feedback.type === "success";

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:justify-end sm:px-6">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto flex w-full max-w-md items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${
          isSuccess
            ? "border-green-200 bg-green-50/95 text-green-900"
            : "border-red-200 bg-red-50/95 text-red-900"
        }`}
      >
        <span className="leading-5">{feedback.message}</span>
        <button
          type="button"
          onClick={onClose}
          className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium transition ${
            isSuccess ? "text-green-800 hover:bg-green-100" : "text-red-800 hover:bg-red-100"
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function CompanyBenefits() {
  const { employee, loading: employeeLoading } = useCurrentEmployee();
  const hasAdminAccess = isAdminEmployee(employee);
  const canCreate = isHrAdmin(employee);
  const { data, loading, error, previousData } = useGetAdminBenefitsQuery({
    skip: !hasAdminAccess,
  });
  const skeletonCount = data?.adminBenefits?.length ?? previousData?.adminBenefits?.length ?? 5;
  const [updateBenefit, { loading: updating }] = useUpdateBenefitMutation({
    refetchQueries: [{ query: GetAdminBenefitsDocument }],
    onCompleted: () => setFeedback({ type: "success", message: "Benefit status updated." }),
    onError: () => setFeedback({ type: "error", message: "Failed to update benefit status." }),
  });

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggleActive = async (id: string, nextActive: boolean) => {
    setUpdatingId(id);
    setFeedback(null);
    try {
      await updateBenefit({ variables: { id, input: { isActive: nextActive } } });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setUpdatingId(null);
    }
  };

  const allBenefits = data?.adminBenefits ?? [];
  const benefits = allBenefits.filter((benefit) => benefit.flowType !== BenefitFlowType.ScreenTime);
  const screenTimePrograms = allBenefits.filter(
    (benefit) => benefit.flowType === BenefitFlowType.ScreenTime,
  );
  const isLoading = employeeLoading || loading;

  // ── Full skeleton screen ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <main className="p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="h-7 w-48 rounded-full bg-white/30 animate-pulse" />
              <div className="mt-2 h-3.5 w-64 rounded-full bg-white/20 animate-pulse" />
            </div>
            <div className="inline-flex items-center justify-center rounded-xl border border-slate-200/60 bg-white/20 px-4 py-2.5">
              <div className="h-3.5 w-20 rounded-full bg-white/30 animate-pulse" />
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3"><div className="h-2.5 w-10 rounded-full bg-slate-200/80 animate-pulse" /></th>
                    <th className="px-4 py-3"><div className="h-2.5 w-12 rounded-full bg-slate-200/80 animate-pulse" /></th>
                    <th className="px-4 py-3"><div className="h-2.5 w-16 rounded-full bg-slate-200/80 animate-pulse" /></th>
                    <th className="px-4 py-3"><div className="h-2.5 w-12 rounded-full bg-slate-200/80 animate-pulse" /></th>
                    <th className="px-4 py-3"><div className="h-2.5 w-10 rounded-full bg-slate-200/80 animate-pulse" /></th>
                    <th className="px-4 py-3"><div className="h-2.5 w-14 rounded-full bg-slate-200/80 animate-pulse" /></th>
                    <th className="px-4 py-3"><div className="h-2.5 w-14 rounded-full bg-slate-200/80 animate-pulse" /></th>
                    <th className="px-4 py-3 w-24" />
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: skeletonCount }).map((_, i) => (
                    <BenefitTableRowSkeleton key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!hasAdminAccess) {
    return (
      <main className="p-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          You need admin access to manage company benefits.
        </div>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Company Benefits</h1>
            <p className="mt-1 text-sm text-gray-400">
              Add and view benefits offered by the company.
            </p>
          </div>
          {canCreate && (
            <Link
              href="/admin-panel/company-benefits/create"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
              Add benefit
            </Link>
          )}
        </div>

        <FeedbackToast feedback={feedback} onClose={() => setFeedback(null)} />

        {screenTimePrograms.length > 0 && (
          <div className="rounded-xl border border-fuchsia-100 bg-fuchsia-50 px-4 py-3 text-sm text-fuchsia-800">
            Screen time programs are managed separately from the benefits catalog.
            {" "}
            <Link href="/admin-panel/screen-time" className="font-medium underline underline-offset-2">
              Open Screen Time
            </Link>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          {error ? (
            <div className="p-8 text-center text-red-600">
              Failed to load benefits.
            </div>
          ) : benefits.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No benefits yet. Add one above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-gray-100 text-xs font-medium uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Subsidy</th>
                    <th className="px-4 py-3">Vendor</th>
                    <th className="px-4 py-3">Contract</th>
                    <th className="px-4 py-3">Approval</th>
                    <th className="px-4 py-3 w-24" />
                  </tr>
                </thead>
                <tbody>
                  {benefits.map((b) => (
                    <tr
                      key={b.id}
                      className={`border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 ${
                        b.isActive ? "" : "opacity-70"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                            b.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {b.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">{b.category}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{b.subsidyPercent}%</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{b.vendorName ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {b.requiresContract ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                          b.approvalPolicy === "dual"
                            ? "bg-purple-50 text-purple-700"
                            : b.approvalPolicy === "finance"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                        }`}>
                          {APPROVAL_POLICY_LABELS[b.approvalPolicy ?? "hr"] ?? b.approvalPolicy}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin-panel/company-benefits/${b.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                            View
                          </Link>
                          {canCreate && (
                            <button
                              type="button"
                              onClick={() => handleToggleActive(b.id, !b.isActive)}
                              disabled={updating || updatingId !== null}
                              className={`inline-flex items-center justify-center rounded-lg border px-2.5 py-1 text-xs font-medium transition disabled:opacity-50 ${
                                b.isActive
                                  ? "border-gray-200 text-gray-600 hover:bg-gray-50"
                                  : "border-green-200 text-green-700 hover:bg-green-50"
                              }`}
                              title={b.isActive ? "Deactivate benefit" : "Activate benefit"}
                            >
                              {b.isActive ? "Deactivate" : "Activate"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
