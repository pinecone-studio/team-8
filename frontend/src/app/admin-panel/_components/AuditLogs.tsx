"use client";

import { useState } from "react";
import { useGetAuditLogsQuery } from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isAdminEmployee } from "@/app/admin-panel/_lib/access";
import PageLoading from "@/app/_components/PageLoading";

const ACTION_TYPE_OPTIONS = [
  { value: "", label: "All Actions" },
  { value: "REQUEST_SUBMITTED", label: "Request Submitted" },
  { value: "REQUEST_CANCELLED", label: "Request Cancelled" },
  { value: "REQUEST_APPROVED", label: "Request Approved" },
  { value: "REQUEST_REJECTED", label: "Request Rejected" },
  { value: "REQUEST_HR_APPROVED", label: "HR Approved" },
  { value: "REQUEST_FINANCE_APPROVED", label: "Finance Approved" },
  { value: "CONTRACT_ACCEPTED", label: "Contract Accepted" },
  { value: "CONTRACT_UPLOADED", label: "Contract Uploaded" },
  { value: "ELIGIBILITY_OVERRIDE_SET", label: "Eligibility Override" },
  { value: "ELIGIBILITY_RULE_CREATED", label: "Rule Created" },
  { value: "ELIGIBILITY_RULE_UPDATED", label: "Rule Updated" },
  { value: "ELIGIBILITY_RULE_DELETED", label: "Rule Deleted" },
  { value: "ENROLLMENT_CREATED", label: "Enrollment Created" },
];

const ACTION_TONE: Record<string, string> = {
  REQUEST_SUBMITTED: "bg-blue-50 text-blue-700",
  REQUEST_CANCELLED: "bg-gray-100 text-gray-600",
  REQUEST_APPROVED: "bg-green-50 text-green-700",
  REQUEST_REJECTED: "bg-red-50 text-red-700",
  REQUEST_HR_APPROVED: "bg-emerald-50 text-emerald-700",
  REQUEST_FINANCE_APPROVED: "bg-teal-50 text-teal-700",
  CONTRACT_ACCEPTED: "bg-purple-50 text-purple-700",
  CONTRACT_UPLOADED: "bg-purple-50 text-purple-700",
  ELIGIBILITY_OVERRIDE_SET: "bg-orange-50 text-orange-700",
  ELIGIBILITY_RULE_CREATED: "bg-indigo-50 text-indigo-700",
  ELIGIBILITY_RULE_UPDATED: "bg-indigo-50 text-indigo-700",
  ELIGIBILITY_RULE_DELETED: "bg-red-50 text-red-700",
  ENROLLMENT_CREATED: "bg-green-50 text-green-700",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function AuditLogs() {
  const { employee: me } = useCurrentEmployee();
  const isAdmin = isAdminEmployee(me);

  const [actionType, setActionType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data, loading } = useGetAuditLogsQuery({
    variables: {
      actionType: actionType || null,
      fromDate: fromDate || null,
      toDate: toDate || null,
      limit: 200,
    },
    skip: !isAdmin,
  });

  if (!isAdmin) {
    return (
      <main className="flex-1 px-8 py-9">
        <p className="text-gray-500">Admin access required.</p>
      </main>
    );
  }

  const logs = data?.auditLogs ?? [];

  return (
    <main className="flex-1 px-8 py-9">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Audit Logs</h1>
          <p className="mt-1 text-sm text-gray-500">
            System activity and change history
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <select
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
          >
            {ACTION_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="From date"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            placeholder="To date"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
          />
        </div>

        {loading ? (
          <PageLoading inline message="Loading audit logs…" />
        ) : logs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center text-sm text-slate-500">
            No audit log entries found.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Time</th>
                    <th className="px-5 py-3">Action</th>
                    <th className="px-5 py-3">Actor Role</th>
                    <th className="px-5 py-3">Entity</th>
                    <th className="px-5 py-3">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-5 py-3 text-slate-500">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                            ACTION_TONE[log.actionType] ?? "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {log.actionType}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-700">{log.actorRole}</td>
                      <td className="px-5 py-3 text-slate-700">
                        <span className="font-mono text-xs">{log.entityType}</span>
                        <span className="ml-1 text-slate-400">{log.entityId.slice(0, 8)}…</span>
                      </td>
                      <td className="px-5 py-3 text-slate-500">{log.reason ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
