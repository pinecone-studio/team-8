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
  useGetAuditLogsQuery,
  useGetEmployeesQuery,
  useGetAdminBenefitsQuery,
  useGetAllBenefitRequestsQuery,
} from "@/graphql/generated/graphql";
import { getContractProxyUrl } from "@/lib/contracts";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isHrAdmin } from "@/app/admin-panel/_lib/access";
import { UserAvatar } from "@clerk/nextjs";

const ACTION_TYPE_LABELS: Record<string, string> = {
  REQUEST_SUBMITTED: "Request Submitted",
  REQUEST_CANCELLED: "Request Cancelled",
  REQUEST_APPROVED: "Request Approved",
  REQUEST_REJECTED: "Request Rejected",
  REQUEST_HR_APPROVED: "HR Approved",
  REQUEST_FINANCE_APPROVED: "Finance Approved",
  CONTRACT_ACCEPTED: "Contract Accepted",
  CONTRACT_UPLOADED: "Contract Uploaded",
  ELIGIBILITY_OVERRIDE_SET: "Eligibility Override",
  ELIGIBILITY_RULE_CREATED: "Rule Created",
  ELIGIBILITY_RULE_UPDATED: "Rule Updated",
  ELIGIBILITY_RULE_DELETED: "Rule Deleted",
  ENROLLMENT_CREATED: "Enrollment Created",
  ENROLLMENT_SUSPENDED: "Enrollment Suspended",
  ENROLLMENT_REACTIVATED: "Enrollment Reactivated",
  RULE_PROPOSAL_SUBMITTED: "Rule Proposal Submitted",
  RULE_PROPOSAL_APPROVED: "Rule Proposal Approved",
  RULE_PROPOSAL_REJECTED: "Rule Proposal Rejected",
  ATTENDANCE_IMPORT: "Attendance Import",
  ELIGIBILITY_RECOMPUTED: "Eligibility Recomputed",
  OKR_SYNC: "OKR Sync",
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
            : isLo || isHi || inRange
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

function ContractPreview({ url, expanded, onExpand, onClose, title }: {
  url: string | null;
  expanded: boolean;
  onExpand: () => void;
  onClose: () => void;
  title: string;
}) {
  if (!url) return <p className="text-xs text-slate-400">Гэрээний баримт бичиг олдсонгүй.</p>;
  return (
    <>
      <div className="relative cursor-zoom-in group" onClick={onExpand}>
        <iframe
          src={url}
          className="h-56 w-full rounded-lg border border-slate-200 pointer-events-none"
          title={title}
        />
        <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow">
            Томруулах
          </span>
        </div>
      </div>
      {expanded && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6"
          onClick={onClose}
        >
          <div
            className="relative w-full max-w-4xl h-[85vh] rounded-2xl overflow-hidden bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-lg bg-white/90 p-1.5 text-slate-500 shadow hover:bg-white hover:text-slate-700 transition"
            >
              <X className="h-4 w-4" />
            </button>
            <iframe src={url} className="h-full w-full" title={title} />
          </div>
        </div>
      )}
    </>
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

type EmployeeInfo = { name?: string | null; role?: string | null; department?: string | null; email?: string | null };
type BenefitInfo = { name?: string | null; vendorName?: string | null };

function DetailPanel({ log, actorEmployee, targetEmployee, benefit, signedContractViewUrl, onClose }: {
  log: AuditLog;
  actorEmployee: EmployeeInfo | null;
  targetEmployee: EmployeeInfo | null;
  benefit: BenefitInfo | null;
  signedContractViewUrl: string | null;
  onClose: () => void;
}) {
  const before = useMemo(() => tryParseJson(log.beforeJson), [log.beforeJson]);
  const after = useMemo(() => tryParseJson(log.afterJson), [log.afterJson]);
  const meta = useMemo(
    () => tryParseJson(log.metadataJson),
    [log.metadataJson],
  );

  const [signedExpanded, setSignedExpanded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const hasInvolvedParties =
    log.actorEmployeeId ||
    log.targetEmployeeId ||
    log.benefitId ||
    log.requestId ||
    log.contractId;
  const hasChanges = !!(before || after);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="flex w-full max-w-xl flex-col rounded-2xl bg-white shadow-xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
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
          {/* Actor Employee Info */}
          <div className="px-6 py-5">
            <SectionLabel icon={null}>Шалгасан ажилтан</SectionLabel>
            <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-slate-400">Нэр</span>
                <span className="text-xs font-semibold text-slate-700">
                  {actorEmployee?.name ?? log.actorEmployeeId ?? "System"}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-slate-400">Албан тушаал</span>
                <span className="text-xs font-semibold text-slate-700">
                  {actorEmployee?.role ? formatRole(actorEmployee.role) : formatRole(log.actorRole)}
                </span>
              </div>
              {actorEmployee?.department && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-slate-400">Хэлтэс</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {actorEmployee.department}
                  </span>
                </div>
              )}
              {actorEmployee?.email && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-slate-400">И-мэйл</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {actorEmployee.email}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Target employee + benefit */}
          {(targetEmployee || benefit || log.targetEmployeeId || log.benefitId) && (
            <div className="border-t border-slate-100 px-6 py-5">
              <SectionLabel icon={null}>Хүсэлт гаргасан ажилтан</SectionLabel>
              <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
                {(targetEmployee?.name || log.targetEmployeeId) && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs text-slate-400">Нэр</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {targetEmployee?.name ?? log.targetEmployeeId}
                    </span>
                  </div>
                )}
                {targetEmployee?.role && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs text-slate-400">Албан тушаал</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {formatRole(targetEmployee.role)}
                    </span>
                  </div>
                )}
                {targetEmployee?.department && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs text-slate-400">Хэлтэс</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {targetEmployee.department}
                    </span>
                  </div>
                )}
                {targetEmployee?.email && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs text-slate-400">И-мэйл</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {targetEmployee.email}
                    </span>
                  </div>
                )}
                {(benefit?.name || log.benefitId) && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs text-slate-400">Benefit</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {benefit?.name ?? log.benefitId}
                      {benefit?.vendorName && (
                        <span className="ml-1 text-slate-400">– {benefit.vendorName}</span>
                      )}
                    </span>
                  </div>
                )}
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


          {/* Ажилтны гарын үсэгтэй гэрээ */}
          {signedContractViewUrl && (
            <div className="border-t border-slate-100 px-6 py-5">
              <SectionLabel icon={null}>Гэрээ</SectionLabel>
              <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 space-y-3">
                <ContractPreview
                  url={getContractProxyUrl(signedContractViewUrl)}
                  expanded={signedExpanded}
                  onExpand={() => setSignedExpanded(true)}
                  onClose={() => setSignedExpanded(false)}
                  title="Ажилтны гарын үсэгтэй гэрээ"
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
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
  const { data: benefitsData } = useGetAdminBenefitsQuery({ skip: !isHr });
  const { data: allRequestsData } = useGetAllBenefitRequestsQuery({
    variables: { status: null, queue: null },
    skip: !isHr,
  });

  const fullLogs = useMemo(() => (data?.auditLogs ?? []) as AuditLog[], [data]);
  const employeesById = useMemo(
    () => new Map((employeesData?.getEmployees ?? []).map((e) => [e.id, e])),
    [employeesData],
  );
  const benefitsById = useMemo(
    () => new Map((benefitsData?.adminBenefits ?? []).map((b) => [b.id, b])),
    [benefitsData],
  );
  const requestsById = useMemo(
    () => new Map((allRequestsData?.allBenefitRequests ?? []).map((r) => [r.id, r])),
    [allRequestsData],
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <th className="px-5 py-3">
                      <div className="h-2.5 w-10 rounded-full bg-slate-200/80 animate-pulse" />
                    </th>
                    <th className="px-5 py-3">
                      <div className="h-2.5 w-16 rounded-full bg-slate-200/80 animate-pulse" />
                    </th>
                    <th className="px-5 py-3">
                      <div className="h-2.5 w-12 rounded-full bg-slate-200/80 animate-pulse" />
                    </th>
                    <th className="px-5 py-3 w-44">
                      <div className="h-2.5 w-8 rounded-full bg-slate-200/80 animate-pulse" />
                    </th>
                    <th className="px-5 py-3 w-full">
                      <div className="h-2.5 w-12 rounded-full bg-slate-200/80 animate-pulse" />
                    </th>
                    <th className="px-5 py-3 w-12" />
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: skeletonRowCount }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-7 rounded-full bg-slate-200/80 animate-pulse shrink-0" />
                          <div className="space-y-1.5">
                            <div className="h-3.5 w-28 rounded-full bg-slate-200/80 animate-pulse" />
                            <div className="h-2.5 w-20 rounded-full bg-slate-200/80 animate-pulse" />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="h-3.5 w-20 rounded-full bg-slate-200/80 animate-pulse" />
                      </td>
                      <td className="px-5 py-3">
                        <div className="inline-flex items-center rounded px-2 py-0.5 bg-slate-100/60">
                          <div className="h-3 w-24 rounded-full bg-slate-200/80 animate-pulse" />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3">
                        <div className="h-3.5 w-36 rounded-full bg-slate-200/80 animate-pulse" />
                      </td>
                      <td className="px-5 py-3">
                        <div className="h-3.5 w-44 rounded-full bg-slate-200/80 animate-pulse" />
                      </td>
                      <td className="px-5 py-3 text-right">
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
          actorEmployee={selectedLog.actorEmployeeId ? (employeesById.get(selectedLog.actorEmployeeId) ?? null) : null}
          targetEmployee={selectedLog.targetEmployeeId ? (employeesById.get(selectedLog.targetEmployeeId) ?? null) : null}
          benefit={selectedLog.benefitId ? (benefitsById.get(selectedLog.benefitId) ?? null) : null}
          signedContractViewUrl={selectedLog.requestId ? (requestsById.get(selectedLog.requestId)?.employeeSignedContract?.viewUrl ?? null) : null}
          onClose={() => setSelectedLog(null)}
        />
      )}

      <main className="flex-1 px-8 py-9">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">
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
                      <th className="px-5 py-3">Name</th>
                      <th className="px-5 py-3">Position</th>
                      <th className="px-5 py-3">Action</th>
                      <th className="px-5 py-3 w-44">Date</th>
                      <th className="px-5 py-3 w-full">Reason</th>
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
                          <td className="px-5 py-3 text-slate-700">
                            <div className="flex items-center gap-3">
                              <UserAvatar />
                              <div className="flex flex-col">
                                <span className="font-medium">{actorName}</span>
                                {actorEmployee?.email && (
                                  <span className="text-xs text-slate-400">
                                    {actorEmployee.email}
                                  </span>
                                )}
                              </div>
                            </div>
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
