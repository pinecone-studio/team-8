"use client";

import { useCallback, useMemo, useState } from "react";
import { Download, X } from "lucide-react";
import { useGetAuditLogsQuery, useGetEmployeesQuery } from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isHrAdmin } from "@/app/admin-panel/_lib/access";
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
  { value: "ENROLLMENT_SUSPENDED", label: "Enrollment Suspended" },
  { value: "ENROLLMENT_REACTIVATED", label: "Enrollment Reactivated" },
  { value: "RULE_PROPOSAL_SUBMITTED", label: "Rule Proposal Submitted" },
  { value: "RULE_PROPOSAL_APPROVED", label: "Rule Proposal Approved" },
  { value: "RULE_PROPOSAL_REJECTED", label: "Rule Proposal Rejected" },
  { value: "ATTENDANCE_IMPORT", label: "Attendance Import" },
  { value: "ELIGIBILITY_RECOMPUTED", label: "Eligibility Recomputed" },
  { value: "OKR_SYNC", label: "OKR Sync" },
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
  ENROLLMENT_SUSPENDED: "bg-orange-50 text-orange-700",
  ENROLLMENT_REACTIVATED: "bg-emerald-50 text-emerald-700",
  RULE_PROPOSAL_SUBMITTED: "bg-violet-50 text-violet-700",
  RULE_PROPOSAL_APPROVED: "bg-green-50 text-green-700",
  RULE_PROPOSAL_REJECTED: "bg-red-50 text-red-700",
  ATTENDANCE_IMPORT: "bg-amber-50 text-amber-700",
  ELIGIBILITY_RECOMPUTED: "bg-sky-50 text-sky-700",
  OKR_SYNC: "bg-lime-50 text-lime-700",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatRole(role: string) {
  return role
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function tryParseJson(raw: string | null | undefined): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

// ── Detail panel sub-components ──────────────────────────────────────────────

function SectionLabel({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
      {icon}
      {children}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-xs text-slate-400">{label}</span>
      <span className="text-right text-xs font-medium text-slate-700 break-all">
        {value}
      </span>
    </div>
  );
}

function MonoId({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-xs text-slate-400">{label}</span>
      <span className="text-right font-mono text-[11px] text-slate-500 break-all">
        {value}
      </span>
    </div>
  );
}

function JsonDiffBlock({
  label,
  value,
  tone,
}: {
  label: string;
  value: unknown;
  tone: "red" | "green" | "slate";
}) {
  if (!value) return null;
  const text =
    typeof value === "string" ? value : JSON.stringify(value, null, 2);
  const styles = {
    red: {
      wrap: "border-red-100 bg-red-50",
      badge: "bg-red-100 text-red-600",
      pre: "text-red-800",
    },
    green: {
      wrap: "border-green-100 bg-green-50",
      badge: "bg-green-100 text-green-700",
      pre: "text-green-800",
    },
    slate: {
      wrap: "border-slate-200 bg-slate-50",
      badge: "bg-slate-100 text-slate-600",
      pre: "text-slate-700",
    },
  }[tone];
  return (
    <div className={`rounded-xl border p-3 ${styles.wrap}`}>
      <span
        className={`inline-flex rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles.badge}`}
      >
        {label}
      </span>
      <pre
        className={`mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed ${styles.pre}`}
      >
        {text}
      </pre>
    </div>
  );
}

type AuditLog = {
  id: string;
  actorEmployeeId?: string | null;
  actorRole: string;
  actionType: string;
  entityType: string;
  entityId: string;
  targetEmployeeId?: string | null;
  benefitId?: string | null;
  requestId?: string | null;
  contractId?: string | null;
  reason?: string | null;
  beforeJson?: string | null;
  afterJson?: string | null;
  metadataJson?: string | null;
  ipAddress?: string | null;
  createdAt: string;
};

function DetailPanel({ log, onClose }: { log: AuditLog; onClose: () => void }) {
  const before = useMemo(() => tryParseJson(log.beforeJson), [log.beforeJson]);
  const after = useMemo(() => tryParseJson(log.afterJson), [log.afterJson]);
  const meta = useMemo(
    () => tryParseJson(log.metadataJson),
    [log.metadataJson],
  );

  const hasInvolvedParties =
    log.actorEmployeeId ||
    log.targetEmployeeId ||
    log.benefitId ||
    log.requestId ||
    log.contractId;
  const hasChanges = !!(before || after);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 z-50 flex w-[460px] flex-col border-l border-slate-200 bg-white shadow-2xl">
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="shrink-0 border-b border-slate-100 px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span
                className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold tracking-wide ${ACTION_TONE[log.actionType] ?? "bg-gray-100 text-gray-600"}`}
              >
                {formatRole(log.actionType)}
              </span>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-300" />
                {formatDate(log.createdAt)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Scrollable body ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {/* Actor + Entity */}
          <div className="px-6 py-5">
            <SectionLabel icon={null}>Event</SectionLabel>
            <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-slate-400">Actor role</span>
                <span className="text-xs font-semibold text-slate-700">
                  {formatRole(log.actorRole)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 px-4 py-3">
                <span className="shrink-0 text-xs text-slate-400">Entity</span>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-700">
                    {log.entityType}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Involved parties */}
          {hasInvolvedParties && (
            <div className="border-t border-slate-100 px-6 py-5">
              <SectionLabel icon={null}>Involved Parties</SectionLabel>
              <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
                <MonoId label="Actor ID" value={log.actorEmployeeId} />
                <MonoId label="Target Employee" value={log.targetEmployeeId} />
                <MonoId label="Benefit" value={log.benefitId} />
                <MonoId label="Request" value={log.requestId} />
                <MonoId label="Contract" value={log.contractId} />
              </div>
            </div>
          )}

          {/* Reason */}
          {log.reason && (
            <div className="border-t border-slate-100 px-6 py-5">
              <SectionLabel icon={null}>Reason</SectionLabel>
              <blockquote className="mt-3 rounded-xl border-l-4 border-blue-300 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-900">
                {log.reason}
              </blockquote>
            </div>
          )}

          {/* Before / After diff */}
          {hasChanges && (
            <div className="border-t border-slate-100 px-6 py-5">
              <SectionLabel icon={null}>Changes</SectionLabel>
              <div className="mt-3 space-y-3">
                <JsonDiffBlock label="Before" value={before} tone="red" />
                <JsonDiffBlock label="After" value={after} tone="green" />
              </div>
            </div>
          )}

          {/* Metadata */}
          {!!meta && (
            <div className="border-t border-slate-100 px-6 py-5">
              <SectionLabel icon={null}>Metadata</SectionLabel>
              <JsonDiffBlock label="Data" value={meta} tone="slate" />
            </div>
          )}

          {/* Footer — IP + Log ID */}
          <div className="border-t border-slate-100 px-6 py-5">
            <div className="space-y-2">
              {log.ipAddress && (
                <MetaRow
                  label="IP Address"
                  value={<span className="font-mono">{log.ipAddress}</span>}
                />
              )}
              <MetaRow
                label="Log ID"
                value={
                  <span className="font-mono text-slate-400">{log.id}</span>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function exportCsv(
  logs: AuditLog[],
  filters: { actionType: string; fromDate: string; toDate: string },
) {
  const headers = [
    "Time",
    "Action",
    "Actor Role",
    "Actor ID",
    "Entity Type",
    "Entity ID",
    "Target Employee",
    "Benefit",
    "Request",
    "Contract",
    "Reason",
    "IP Address",
  ];

  const escape = (val: string | null | undefined) => {
    const str = val ?? "";
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = logs.map((log) => [
    escape(formatDate(log.createdAt)),
    escape(log.actionType),
    escape(formatRole(log.actorRole)),
    escape(log.actorEmployeeId),
    escape(log.entityType),
    escape(log.entityId),
    escape(log.targetEmployeeId),
    escape(log.benefitId),
    escape(log.requestId),
    escape(log.contractId),
    escape(log.reason),
    escape(log.ipAddress),
  ]);

  const csv = [
    headers.map((h) => `"${h}"`).join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");
  const dateStr = new Date().toISOString().slice(0, 10);
  const filterTag = filters.actionType
    ? `-${filters.actionType.toLowerCase()}`
    : "";
  const filename = `audit-log${filterTag}-${dateStr}.csv`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AuditLogs() {
  const { employee: me } = useCurrentEmployee();
  const isHr = isHrAdmin(me);

  const [actionType, setActionType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data, loading } = useGetAuditLogsQuery({
    variables: {
      actionType: actionType || null,
      fromDate: fromDate || null,
      toDate: toDate || null,
      limit: 200,
    },
    skip: !isHr,
  });

  const { data: employeesData } = useGetEmployeesQuery({ skip: !isHr });

  const employeesById = useMemo(() => {
    return new Map((employeesData?.getEmployees ?? []).map((e) => [e.id, e]));
  }, [employeesData]);

  const logs = useMemo(() => (data?.auditLogs ?? []) as AuditLog[], [data]);

  const handleExport = useCallback(() => {
    // logs is memoized — direct dep is fine for export
    exportCsv(logs, { actionType, fromDate, toDate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, actionType, fromDate, toDate]);

  if (!isHr) {
    return (
      <main className="flex-1 px-8 py-9">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-8 text-center max-w-md">
          <p className="text-sm font-semibold text-amber-800">
            HR access required
          </p>
          <p className="mt-1 text-xs text-amber-700">
            Request History is restricted to HR administrators.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      {selectedLog && (
        <DetailPanel log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}

      <main className="flex-1 px-8 py-9">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Request History
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                All benefit request activity and change history
              </p>
            </div>
            <div className="flex items-center gap-3">
              {logs.length > 0 && (
                <p className="text-xs text-slate-400">{logs.length} entries</p>
              )}
              {logs.length > 0 && (
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-3">
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
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
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
            />
            {(actionType || fromDate || toDate) && (
              <button
                type="button"
                onClick={() => {
                  setActionType("");
                  setFromDate("");
                  setToDate("");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm transition hover:bg-slate-50"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>

          {loading ? (
            <PageLoading inline message="Loading audit logs…" />
          ) : logs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center">
              <p className="text-sm font-medium text-slate-600">
                No audit log entries found
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {actionType || fromDate || toDate
                  ? "Try adjusting the filters above."
                  : "System activity will appear here as actions are taken."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Name</th>
                      <th className="px-5 py-3">Position</th>
                      <th className="px-5 py-3">Action</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Reason</th>
                      <th className="px-5 py-3 w-20" />
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => {
                      const actorEmployee = log.actorEmployeeId
                        ? employeesById.get(log.actorEmployeeId)
                        : null;
                      const actorName = actorEmployee?.name ?? (log.actorEmployeeId ? "Unknown" : "System");
                      return (
                      <tr
                        key={log.id}
                        className={`border-b border-slate-100 last:border-b-0 cursor-pointer transition-colors hover:bg-slate-50 ${
                          selectedLog?.id === log.id ? "bg-blue-50/40" : ""
                        }`}
                        onClick={() => setSelectedLog(log)}
                      >
                        <td className="px-5 py-3 text-slate-700">
                          <span className="font-medium">{actorName}</span>
                          {actorEmployee?.email && (
                            <span className="ml-1.5 text-xs text-slate-400">
                              {actorEmployee.email}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-slate-700">
                          {formatRole(log.actorRole)}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                              ACTION_TONE[log.actionType] ??
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {log.actionType}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-slate-500">
                          {formatDate(log.createdAt)}
                        </td>
                        <td className="px-5 py-3 max-w-[180px] truncate text-slate-500">
                          {log.reason ?? "—"}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className="text-xs font-medium text-blue-500 hover:underline">
                            Details →
                          </span>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
