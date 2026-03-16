"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useGetAdminBenefitsQuery,
  useCreateBenefitMutation,
  useDeleteBenefitMutation,
  GetAdminBenefitsDocument,
} from "@/graphql/generated/graphql";
import PageLoading from "@/app/_components/PageLoading";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { isAdminEmployee, isHrAdmin } from "../_lib/access";
import { useCurrentEmployee } from "@/lib/current-employee-provider";

const CATEGORIES = ["wellness", "equipment", "financial", "career", "flexibility", "other"];

const APPROVAL_POLICIES = [
  { value: "hr", label: "HR only" },
  { value: "finance", label: "Finance only" },
  { value: "dual", label: "Dual (HR + Finance)" },
];

const APPROVAL_POLICY_LABELS: Record<string, string> = {
  hr: "HR",
  finance: "Finance",
  dual: "Dual",
};

export default function CompanyBenefits() {
  const { employee, loading: employeeLoading } = useCurrentEmployee();
  const hasAdminAccess = isAdminEmployee(employee);
  const canCreate = isHrAdmin(employee);
  const { data, loading, error } = useGetAdminBenefitsQuery({
    skip: !hasAdminAccess,
  });
  const [createBenefit, { loading: creating, error: createError }] = useCreateBenefitMutation({
    refetchQueries: [{ query: GetAdminBenefitsDocument }],
    onCompleted: () => {
      setFormOpen(false);
      setForm({ name: "", category: "wellness", subsidyPercent: 50, vendorName: "", requiresContract: false, approvalPolicy: "hr" });
    },
  });
  const [deleteBenefit, { loading: deleting }] = useDeleteBenefitMutation({
    refetchQueries: [{ query: GetAdminBenefitsDocument }],
    onCompleted: () => setFeedback({ type: "success", message: "Benefit removed." }),
    onError: () => setFeedback({ type: "error", message: "Failed to remove benefit." }),
  });

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "wellness",
    subsidyPercent: 50,
    vendorName: "",
    requiresContract: false,
    approvalPolicy: "hr",
  });
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Remove benefit "${name}"? This will also remove related requests, rules, and contracts.`)) return;
    setDeletingId(id);
    setFeedback(null);
    try {
      await deleteBenefit({ variables: { id } });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  const benefits = data?.adminBenefits ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!form.name.trim()) {
      setFeedback({ type: "error", message: "Name is required." });
      return;
    }
    if (form.subsidyPercent < 0 || form.subsidyPercent > 100) {
      setFeedback({ type: "error", message: "Subsidy must be between 0 and 100." });
      return;
    }
    try {
      await createBenefit({
        variables: {
          input: {
            name: form.name.trim(),
            category: form.category,
            subsidyPercent: form.subsidyPercent,
            vendorName: form.vendorName.trim() || undefined,
            requiresContract: form.requiresContract,
            approvalPolicy: form.approvalPolicy,
          },
        },
      });
      setFeedback({ type: "success", message: "Benefit added." });
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback({ type: "error", message: "Failed to add benefit. Try again." });
    }
  };

  if (employeeLoading || !hasAdminAccess) {
    return (
      <main className="p-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          {employeeLoading ? "Loading..." : "You need admin access to manage company benefits."}
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
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
              Add benefit
            </button>
          )}
        </div>

        {feedback && (
          <div
            className={`rounded-lg border px-3 py-2 text-sm ${
              feedback.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {formOpen && canCreate && (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-lg font-semibold text-gray-900">New benefit</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  placeholder="e.g. Gym membership"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Subsidy %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.subsidyPercent}
                  onChange={(e) => setForm((f) => ({ ...f, subsidyPercent: Number(e.target.value) || 0 }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Vendor (optional)</label>
                <input
                  type="text"
                  value={form.vendorName}
                  onChange={(e) => setForm((f) => ({ ...f, vendorName: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Vendor name"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Approval Policy</label>
                <select
                  value={form.approvalPolicy}
                  onChange={(e) => setForm((f) => ({ ...f, approvalPolicy: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  {APPROVAL_POLICIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 self-end pb-2">
                <input
                  type="checkbox"
                  id="requiresContract"
                  checked={form.requiresContract}
                  onChange={(e) => setForm((f) => ({ ...f, requiresContract: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="requiresContract" className="text-sm text-gray-600">
                  Requires contract
                </label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                disabled={creating}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
              >
                {creating ? "Adding..." : "Add benefit"}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                disabled={creating}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
            {createError && (
              <p className="mt-2 text-sm text-red-600">{createError.message}</p>
            )}
          </form>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          {loading ? (
            <div className="p-10">
              <PageLoading inline message="Loading benefits..." />
            </div>
          ) : error ? (
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
                      className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
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
                              onClick={() => handleDelete(b.id, b.name)}
                              disabled={deleting || deletingId !== null}
                              className="inline-flex items-center justify-center rounded-lg p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                              title="Remove benefit"
                            >
                              <Trash2 className="h-4 w-4" />
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
