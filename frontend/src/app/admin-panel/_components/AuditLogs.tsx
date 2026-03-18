"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
} from "lucide-react";
import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import {
  useGetAuditLogsQuery,
  useGetEmployeesQuery,
  useGetAllBenefitRequestsQuery,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isHrAdmin } from "@/app/admin-panel/_lib/access";
import { UserAvatar } from "@clerk/nextjs";
import { getContractProxyUrl } from "@/lib/contracts";
import { FileText, ExternalLink } from "lucide-react";

const ACTION_TYPE_LABELS: Record<string, string> = {
  REQUEST_SUBMITTED: "Submitted",
  REQUEST_CANCELLED: "Cancelled",
  REQUEST_APPROVED: "Approved",
  REQUEST_REJECTED: "Rejected",
  REQUEST_HR_APPROVED: "HR Approved",
  REQUEST_FINANCE_APPROVED: "Finance Approved",
  CONTRACT_ACCEPTED: "Contract Accepted",
  CONTRACT_UPLOADED: "Contract Uploaded",
  ELIGIBILITY_OVERRIDE_SET: "Eligibility Override",
  ELIGIBILITY_RULE_CREATED: "Rule Created",
  ELIGIBILITY_RULE_UPDATED: "Rule Updated",
  ELIGIBILITY_RULE_DELETED: "Rule Deleted",
  ENROLLMENT_CREATED: "New Enrollment",
  ENROLLMENT_SUSPENDED: "Enrollment Suspended",
  ENROLLMENT_REACTIVATED: "Enrollment Reactivated",
  RULE_PROPOSAL_SUBMITTED: "Rule Proposal Submitted",
  RULE_PROPOSAL_APPROVED: "Rule Proposal Approved",
  RULE_PROPOSAL_REJECTED: "Rule Proposal Rejected",
  ATTENDANCE_IMPORT: "Attendance Import",
  ELIGIBILITY_RECOMPUTED: "Eligibility Recomputed",
  OKR_SYNC: "OKR Sync",
};

/** Default short description when reason is empty — derived from action type */
const ACTION_DEFAULT_REASON: Record<string, string> = {
  REQUEST_SUBMITTED: "Benefit request was submitted",
  REQUEST_CANCELLED: "Benefit request was cancelled",
  REQUEST_APPROVED: "Benefit request was approved",
  REQUEST_REJECTED: "Benefit request was rejected",
  REQUEST_HR_APPROVED: "HR approved the request",
  REQUEST_FINANCE_APPROVED: "Finance approved the request",
  CONTRACT_ACCEPTED: "Contract was accepted",
  CONTRACT_UPLOADED: "Contract was uploaded",
  ELIGIBILITY_OVERRIDE_SET: "Eligibility override was set",
  ELIGIBILITY_RULE_CREATED: "Eligibility rule was created",
  ELIGIBILITY_RULE_UPDATED: "Eligibility rule was updated",
  ELIGIBILITY_RULE_DELETED: "Eligibility rule was deleted",
  ENROLLMENT_CREATED: "New benefit enrollment was created",
  ENROLLMENT_SUSPENDED: "Enrollment was suspended",
  ENROLLMENT_REACTIVATED: "Enrollment was reactivated",
  RULE_PROPOSAL_SUBMITTED: "Rule proposal was submitted",
  RULE_PROPOSAL_APPROVED: "Rule proposal was approved",
  RULE_PROPOSAL_REJECTED: "Rule proposal was rejected",
  ATTENDANCE_IMPORT: "Attendance data was imported",
  ELIGIBILITY_RECOMPUTED: "Eligibility was recomputed",
  OKR_SYNC: "OKR data was synced",
};

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



const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_ABBRS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function isoToLocal(iso: string): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function dateToIso(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

function fmtMDY(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function shiftMonth(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

function buildGrid(year: number, month: number): (Date | null)[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(firstWeekday).fill(null);
  for (let n = 1; n <= totalDays; n++) cells.push(new Date(year, month, n));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// ── MonthCalendar ─────────────────────────────────────────────────────────────

function MonthCalendar({
  year,
  month,
  start,
  end,
  hover,
  phase,
  onDayClick,
  onDayHover,
}: {
  year: number;
  month: number;
  start: Date | null;
  end: Date | null;
  hover: Date | null;
  phase: "idle" | "end";
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date | null) => void;
}) {
  const today = useMemo(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }, []);
  const cells = useMemo(() => buildGrid(year, month), [year, month]);

  // Use hover preview as effective end while user is picking
  const previewEnd = end ?? (phase === "end" && hover ? hover : null);
  const lo =
    start && previewEnd ? (start <= previewEnd ? start : previewEnd) : start;
  const hi =
    start && previewEnd ? (start <= previewEnd ? previewEnd : start) : null;
  const single = lo && hi && sameDay(lo, hi);

  return (
    <div className="w-56">
      <div className="mb-1 grid grid-cols-7">
        {DAY_ABBRS.map((a) => (
          <div
            key={a}
            className="flex h-7 items-center justify-center text-[11px] font-semibold text-slate-400"
          >
            {a}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          if (!d) return <div key={`p${i}`} className="h-8" />;

          const isLo = lo !== null && sameDay(d, lo);
          const isHi = hi !== null && sameDay(d, hi);
          const inRange =
            !single && lo !== null && hi !== null && d > lo && d < hi;
          const isToday = sameDay(d, today);

          // Continuous stripe background between start and end
          const bg = single
            ? ""
            : isLo && hi
              ? "bg-gradient-to-r from-transparent to-blue-50"
              : isHi && lo
                ? "bg-gradient-to-r from-blue-50 to-transparent"
                : inRange
                  ? "bg-blue-50"
                  : "";

          const btnColor =
            isLo || isHi
              ? "bg-blue-600 text-white"
              : inRange
                ? "text-blue-700 hover:bg-blue-100"
                : isToday
                  ? "text-slate-900 ring-1 ring-blue-400 ring-offset-1 hover:bg-slate-100"
                  : "text-slate-700 hover:bg-slate-100";

          return (
            <div
              key={d.toISOString()}
              className={`flex h-8 items-center justify-center ${bg}`}
            >
              <button
                type="button"
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${btnColor}`}
                onClick={() => onDayClick(d)}
                onMouseEnter={() => onDayHover(d)}
                onMouseLeave={() => onDayHover(null)}
              >
                {d.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── DateRangePicker ───────────────────────────────────────────────────────────

function DateRangePicker({
  fromDate,
  toDate,
  onChange,
  onClear,
}: {
  fromDate: string;
  toDate: string;
  onChange: (from: string, to: string) => void;
  onClear: () => void;
}) {
  const now = new Date();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"idle" | "end">("idle");
  const [hover, setHover] = useState<Date | null>(null);
  const [view, setView] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setPhase("idle");
        setHover(null);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const start = isoToLocal(fromDate);
  const end = isoToLocal(toDate);
  const right = shiftMonth(view.year, view.month, 1);

  function handleDayClick(d: Date) {
    if (phase === "idle") {
      onChange(dateToIso(d), "");
      setPhase("end");
    } else {
      const from = start ?? d;
      if (d < from) {
        onChange(dateToIso(d), dateToIso(from));
      } else {
        onChange(dateToIso(from), dateToIso(d));
      }
      setPhase("idle");
      setHover(null);
      setOpen(false);
    }
  }

  const hasRange = fromDate || toDate;
  const triggerLabel = fromDate
    ? toDate
      ? `${fmtMDY(fromDate)} – ${fmtMDY(toDate)}`
      : `${fmtMDY(fromDate)} – ...`
    : "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setPhase(fromDate && !toDate ? "end" : "idle");
          setOpen((o) => !o);
        }}
        className={`inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm shadow-sm transition hover:bg-slate-50 ${
          hasRange ? "border-blue-300" : "border-slate-200"
        }`}
      >
        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <span className={hasRange ? "text-slate-700" : "text-slate-400"}>
          {triggerLabel || "Select date range"}
        </span>
        {hasRange && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
              setPhase("idle");
            }}
            className="ml-0.5 cursor-pointer rounded p-0.5 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3 w-3" />
          </span>
        )}
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
          {/* Navigation header */}
          <div className="mb-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setView((v) => shiftMonth(v.year, v.month, -1))}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex flex-1 justify-around">
              <span className="text-sm font-semibold text-slate-700">
                {MONTH_NAMES[view.month]} {view.year}
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {MONTH_NAMES[right.month]} {right.year}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setView((v) => shiftMonth(v.year, v.month, 1))}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Two-month grid */}
          <div className="flex gap-6">
            <MonthCalendar
              year={view.year}
              month={view.month}
              start={start}
              end={end}
              hover={hover}
              phase={phase}
              onDayClick={handleDayClick}
              onDayHover={setHover}
            />
            <div className="w-px bg-slate-100" />
            <MonthCalendar
              year={right.year}
              month={right.month}
              start={start}
              end={end}
              hover={hover}
              phase={phase}
              onDayClick={handleDayClick}
              onDayHover={setHover}
            />
          </div>

          {phase === "end" && (
            <p className="mt-3 text-center text-xs text-slate-400">
              Now pick an end date
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

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

/** Human-friendly relative time: "5 minutes ago", "Today at 12:16 AM", "Yesterday at 12:16 AM" */
function formatRelativeTime(iso: string): string {
  try {
    const date = new Date(iso);
    const now = new Date();
    const mins = differenceInMinutes(now, date);
    const hours = differenceInHours(now, date);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
    if (hours < 24 && isToday(date)) return formatDistanceToNow(date, { addSuffix: true });
    if (isToday(date)) return `Today at ${format(date, "h:mm a")}`;
    if (isYesterday(date)) return `Yesterday at ${format(date, "h:mm a")}`;
    if (hours < 48) return formatDistanceToNow(date, { addSuffix: true });
    return format(date, "MMM d, h:mm a");
  } catch {
    return iso;
  }
}

/** Reason column: use log.reason or default description from action type / metadata */
function getReasonDisplay(log: AuditLog): string {
  if (log.reason?.trim()) return log.reason.trim();
  const defaultReason = ACTION_DEFAULT_REASON[log.actionType];
  if (defaultReason) return defaultReason;
  const meta = tryParseJson(log.metadataJson) as Record<string, unknown> | null;
  if (meta && typeof meta.description === "string") return meta.description;
  const after = tryParseJson(log.afterJson) as Record<string, unknown> | null;
  if (after && typeof after.status === "string") return `Status: ${after.status}`;
  return "—";
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
  description,
  children,
}: {
  icon: React.ReactNode;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {icon}
        {children}
      </div>
      {description && (
        <p className="mt-1 text-xs font-normal normal-case tracking-normal text-slate-500">
          {description}
        </p>
      )}
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

type BenefitRequestForDetail = {
  id: string;
  viewContractUrl?: string | null;
  employeeSignedContract?: {
    viewUrl?: string | null;
    fileName?: string | null;
  } | null;
};

type EmployeeMap = Map<
  string,
  { id: string; name: string; nameEng?: string | null; role: string; department: string }
>;

function TraceabilityCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
        {title}
      </p>
      {description && (
        <p className="mt-0.5 text-[11px] font-normal normal-case text-slate-400">
          {description}
        </p>
      )}
      <div className="mt-2 text-sm text-slate-700">{children}</div>
    </div>
  );
}

function DetailPanel({
  log,
  onClose,
  employeesById,
  benefitRequest,
}: {
  log: AuditLog;
  onClose: () => void;
  employeesById: EmployeeMap;
  benefitRequest?: BenefitRequestForDetail | null;
}) {
  const actorEmployee = log.actorEmployeeId
    ? employeesById.get(log.actorEmployeeId)
    : null;
  const targetEmployee = log.targetEmployeeId
    ? employeesById.get(log.targetEmployeeId)
    : null;
  const contractUrl = benefitRequest?.viewContractUrl
    ? getContractProxyUrl(benefitRequest.viewContractUrl)
    : null;
  const signedContractUrl = benefitRequest?.employeeSignedContract?.viewUrl
    ? getContractProxyUrl(benefitRequest.employeeSignedContract.viewUrl)
    : null;

  const requestApprovalStatus = (() => {
    // Only interpret benefit request approval/rejection/cancel events
    // (e.g. REQUEST_HR_APPROVED, REQUEST_APPROVED, REQUEST_REJECTED, REQUEST_CANCELLED)
    switch (log.actionType) {
      case "REQUEST_APPROVED":
      case "REQUEST_HR_APPROVED":
      case "REQUEST_FINANCE_APPROVED":
        return { text: "Approved", tone: "approved" as const };
      case "REQUEST_REJECTED":
      case "REQUEST_CANCELLED":
        return { text: "Not approved", tone: "not_approved" as const };
      default:
        return { text: "In review", tone: "in_review" as const };
    }
  })();

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="flex max-h-[90vh] w-full max-w-[460px] flex-col rounded-xl border border-slate-200 bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="shrink-0 border-b border-slate-100 px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-slate-800">
                Benefit Request Detail
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Request overview: approver, employee, contract
              </p>
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
          {/* 1. Approver Info (Who & When) */}
          <div className="px-6 py-5">
            <SectionLabel
              icon={null}
            >
              Approver
            </SectionLabel>
            <div className="mt-3 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  Full name
                </span>
                <p className="text-sm font-semibold text-slate-800">
                  {actorEmployee?.name ?? actorEmployee?.nameEng ?? "—"}
                </p>
                <p className="text-xs text-slate-500">
                  <span className="font-medium text-slate-600">Position:</span>{" "}
                  {formatRole(log.actorRole)}
                </p>
                {actorEmployee?.department && (
                  <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-600">
                      Department:
                    </span>{" "}
                    {actorEmployee.department}
                  </p>
                )}
                <div className="mt-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Status
                  </span>
                  <div
                    className={`mt-0.5 flex w-fit rounded-md px-2 py-0.5 text-xs font-medium ${
                      requestApprovalStatus.tone === "approved"
                        ? "bg-green-50 text-green-700"
                        : requestApprovalStatus.tone === "not_approved"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {requestApprovalStatus.text}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Traceability — card-based */}
          <div className="border-t border-slate-100 px-6 py-5">
            <SectionLabel
              icon={null}
            >
              Employee
            </SectionLabel>
            <div className="mt-3 grid gap-3">
              {/* Beneficiary Info (Target Employee) */}
              {log.targetEmployeeId && (
                <TraceabilityCard
                  title="Employee"
                  description="Employee name, position, department"
                >
                  {targetEmployee ? (
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-800">
                        {targetEmployee.name || targetEmployee.nameEng || "—"}
                      </p>
                      <p className="text-xs text-slate-500">
                        <span className="font-medium text-slate-600">Position:</span>{" "}
                        {formatRole(targetEmployee.role)}
                      </p>
                      {targetEmployee.department && (
                        <p className="text-xs text-slate-500">
                          <span className="font-medium text-slate-600">Department:</span>{" "}
                          {targetEmployee.department}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="font-mono text-xs text-slate-500">
                      —
                    </span>
                  )}
                </TraceabilityCard>
              )}
            </div>
          </div>

          {/* 4. Contract (Terms / file link) */}
          <div className="border-t border-slate-100 px-6 py-5">
            <SectionLabel
              icon={null}
              description="Terms and conditions or attached contract file"
            >
              Contract
            </SectionLabel>
            <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              {contractUrl || signedContractUrl ? (
                <div className="space-y-4">
                  {contractUrl && (
                    <div>
                      <a
                        href={contractUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-blue-600"
                      >
                        <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                        Terms and Conditions
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <iframe
                        src={contractUrl}
                        className="mt-2 h-56 w-full rounded-lg border border-slate-200 bg-white"
                        title="Terms and Conditions"
                      />
                    </div>
                  )}
                  {signedContractUrl && (
                    <div>
                      <a
                        href={signedContractUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-blue-600"
                      >
                        <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                        {benefitRequest?.employeeSignedContract?.fileName ??
                          "Signed contract"}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <iframe
                        src={signedContractUrl}
                        className="mt-2 h-56 w-full rounded-lg border border-slate-200 bg-white"
                        title="Signed contract"
                      />
                    </div>
                  )}
                </div>
              ) : log.contractId ? (
                <span className="break-all font-mono text-[11px] text-slate-700">
                  Contract ID: {log.contractId}
                </span>
              ) : (
                <p className="text-xs text-slate-500">
                  Contract will appear here once available.
                </p>
              )}
            </div>
          </div>

          {/* Footer — IP + Log ID */}
          <div className="border-t border-slate-100 px-6 py-5">
            <div className="space-y-2">
              {log.ipAddress && (
                <MetaRow
                  label="IP хаяг"
                  value={<span className="font-mono">{log.ipAddress}</span>}
                />
              )}
            </div>
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
  const { employee: me, loading: meLoading } = useCurrentEmployee();
  const isHr = isHrAdmin(me);

  const [actionType, setActionType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Fetch ALL logs without actionType — filtering is done client-side so the
  // dropdown options always reflect the full dataset regardless of selection.
  const {
    data,
    loading: auditLoading,
    previousData: prevAuditData,
  } = useGetAuditLogsQuery({
    variables: {
      fromDate: fromDate || null,
      toDate: toDate || null,
      limit: 200,
    },
    skip: !isHr,
  });
  const { data: employeesData } = useGetEmployeesQuery({ skip: !isHr });
  const { data: allRequestsData } = useGetAllBenefitRequestsQuery({
    skip: !isHr || !selectedLog?.requestId,
  });

  const fullLogs = useMemo(() => (data?.auditLogs ?? []) as AuditLog[], [data]);
  const employeesById = useMemo(
    () => new Map((employeesData?.getEmployees ?? []).map((e) => [e.id, e])),
    [employeesData],
  );
  const benefitRequestForDetail = useMemo(() => {
    if (!selectedLog?.requestId || !allRequestsData?.allBenefitRequests) return null;
    const req = allRequestsData.allBenefitRequests.find(
      (r) => r.id === selectedLog.requestId,
    );
    return req
      ? {
          id: req.id,
          viewContractUrl: req.viewContractUrl ?? null,
          employeeSignedContract: req.employeeSignedContract
            ? {
                viewUrl: req.employeeSignedContract.viewUrl ?? null,
                fileName: req.employeeSignedContract.fileName ?? null,
              }
            : null,
        }
      : null;
  }, [selectedLog, allRequestsData]);

  const actionTypeOptions = useMemo(() => {
    const unique = Array.from(
      new Set(fullLogs.map((log) => log.actionType)),
    ).sort();
    return [
      { value: "", label: "All Actions" },
      ...unique.map((t) => ({ value: t, label: ACTION_TYPE_LABELS[t] ?? t })),
    ];
  }, [fullLogs]);

  const logs = useMemo(
    () =>
      actionType
        ? fullLogs.filter((log) => log.actionType === actionType)
        : fullLogs,
    [fullLogs, actionType],
  );

  const handleExport = useCallback(() => {
    exportCsv(logs, { actionType, fromDate, toDate });
  }, [logs, actionType, fromDate, toDate]);
  const isLoading = meLoading || auditLoading;
  const skeletonRowCount = (prevAuditData?.auditLogs?.length ?? 0) || 6;
  // ── 1. Loading skeleton screen (no real text, no access banner) ────────────
  if (isLoading) {
    return (
      <main className="flex-1 px-8 py-9">
        <section className="mx-auto max-w-7xl">
          {/* Heading skeleton */}
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="h-7 w-44 rounded-full bg-white/30 animate-pulse" />
              <div className="mt-2 h-3.5 w-64 rounded-full bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Filter row skeleton */}
          <div className="mb-6 flex flex-wrap gap-3">
            <div className="h-9 w-36 rounded-xl bg-slate-200/80 animate-pulse" />
            <div className="h-9 w-48 rounded-xl bg-slate-200/80 animate-pulse" />
          </div>

          {/* Table skeleton */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm table-fixed">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4">
                      <div className="h-2.5 w-10 rounded-full bg-slate-200/80 animate-pulse" />
                    </th>
                    <th className="px-6 py-4">
                      <div className="h-2.5 w-16 rounded-full bg-slate-200/80 animate-pulse" />
                    </th>
                    <th className="px-6 py-4">
                      <div className="h-2.5 w-12 rounded-full bg-slate-200/80 animate-pulse" />
                    </th>
                    <th className="px-6 py-4 w-44">
                      <div className="h-2.5 w-8 rounded-full bg-slate-200/80 animate-pulse" />
                    </th>
                    <th className="px-6 py-4 w-full">
                      <div className="h-2.5 w-12 rounded-full bg-slate-200/80 animate-pulse" />
                    </th>
                    <th className="px-6 py-4 w-12" />
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: skeletonRowCount }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-7 rounded-full bg-slate-200/80 animate-pulse shrink-0" />
                          <div className="space-y-1.5">
                            <div className="h-3.5 w-28 rounded-full bg-slate-200/80 animate-pulse" />
                            <div className="h-2.5 w-20 rounded-full bg-slate-200/80 animate-pulse" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-3.5 w-20 rounded-full bg-slate-200/80 animate-pulse" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center rounded px-2 py-0.5 bg-slate-100/60">
                          <div className="h-3 w-24 rounded-full bg-slate-200/80 animate-pulse" />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="h-3.5 w-36 rounded-full bg-slate-200/80 animate-pulse" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-3.5 w-44 rounded-full bg-slate-200/80 animate-pulse" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200/80 animate-pulse" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    );
  }
  // ── 2. Access denied (only shown after loading resolves) ───────────────────
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
        <DetailPanel
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
          employeesById={employeesById}
          benefitRequest={benefitRequestForDetail}
        />
      )}

      <main className="flex-1 px-8 py-9">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Request History</h1>
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
            {/* Custom action type dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                {actionType
                  ? (ACTION_TYPE_LABELS[actionType] ?? actionType)
                  : "All Actions"}
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 top-full z-30 mt-1.5 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <ul className="max-h-72 overflow-y-auto py-1">
                    {actionTypeOptions.map((opt) => {
                      const isSelected = opt.value === actionType;
                      return (
                        <li key={opt.value}>
                          <button
                            type="button"
                            onClick={() => {
                              setActionType(opt.value);
                              setDropdownOpen(false);
                            }}
                            className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition ${
                              isSelected
                                ? "bg-blue-50 font-medium text-blue-700"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {opt.value && (
                              <span
                                className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                                  ACTION_TONE[opt.value]?.includes("blue")
                                    ? "bg-blue-400"
                                    : ACTION_TONE[opt.value]?.includes(
                                          "green",
                                        ) ||
                                        ACTION_TONE[opt.value]?.includes(
                                          "emerald",
                                        ) ||
                                        ACTION_TONE[opt.value]?.includes("teal")
                                      ? "bg-green-400"
                                      : ACTION_TONE[opt.value]?.includes("red")
                                        ? "bg-red-400"
                                        : ACTION_TONE[opt.value]?.includes(
                                              "orange",
                                            ) ||
                                            ACTION_TONE[opt.value]?.includes(
                                              "amber",
                                            )
                                          ? "bg-orange-400"
                                          : ACTION_TONE[opt.value]?.includes(
                                                "purple",
                                              ) ||
                                              ACTION_TONE[opt.value]?.includes(
                                                "violet",
                                              ) ||
                                              ACTION_TONE[opt.value]?.includes(
                                                "indigo",
                                              )
                                            ? "bg-purple-400"
                                            : "bg-slate-300"
                                }`}
                              />
                            )}
                            {opt.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
            <DateRangePicker
              fromDate={fromDate}
              toDate={toDate}
              onChange={(from, to) => {
                setFromDate(from);
                setToDate(to);
              }}
              onClear={() => {
                setFromDate("");
                setToDate("");
              }}
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
          {logs.length === 0 ? (
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
                <table className="min-w-full text-left text-sm table-fixed">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Position</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4 w-44">Date</th>
                      <th className="px-6 py-4 w-full">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => {
                      const actorEmployee = log.actorEmployeeId
                        ? (employeesById.get(log.actorEmployeeId) ?? null)
                        : null;
                      const actorName =
                        actorEmployee?.name ??
                        (log.actorEmployeeId ? log.actorEmployeeId : "System");
                      return (
                        <tr
                          key={log.id}
                          className={`border-b border-slate-100 last:border-b-0 cursor-pointer transition-colors hover:bg-slate-50 ${
                            selectedLog?.id === log.id ? "bg-blue-50/40" : ""
                          }`}
                          onClick={() => setSelectedLog(log)}
                        >
                          <td className="px-6 py-4 text-slate-700">
                            <div className="flex items-center gap-3">
                              <UserAvatar />
                              <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="font-semibold text-slate-900 truncate">
                                  {actorName}
                                </span>
                                {actorEmployee?.email && (
                                  <span className="text-xs text-slate-500 truncate">
                                    {actorEmployee.email}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-700 text-sm">
                            {formatRole(log.actorRole)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${
                                ACTION_TONE[log.actionType] ??
                                "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {ACTION_TYPE_LABELS[log.actionType] ?? log.actionType}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                            {formatRelativeTime(log.createdAt)}
                          </td>
                          <td className="px-6 py-4 max-w-[220px] text-sm text-slate-600">
                            <span className="line-clamp-2" title={getReasonDisplay(log)}>
                              {getReasonDisplay(log)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                              <ChevronRight className="h-4 w-4" />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
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
