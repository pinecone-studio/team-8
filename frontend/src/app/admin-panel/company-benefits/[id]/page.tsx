"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  FileText,
  Monitor,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Sidebar from "../../_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import {
  useGetAdminBenefitsQuery,
  useGetAllBenefitRequestsQuery,
  useGetEmployeesQuery,
  useUpdateBenefitMutation,
  useGetEligibilityRulesQuery,
  useGetRuleProposalsQuery,
  useGetContractsForBenefitQuery,
  useProposeRuleChangeMutation,
  useApproveRuleProposalMutation,
  useRejectRuleProposalMutation,
  GetAdminBenefitsDocument,
  GetEligibilityRulesDocument,
  GetRuleProposalsDocument,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isAdminEmployee, isHrAdmin } from "../../_lib/access";
import { getContractProxyUrl } from "@/lib/contracts";

// ── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ["wellness", "equipment", "financial", "career", "flexibility", "other"];
const APPROVAL_POLICIES = [
  { value: "hr", label: "HR only" },
  { value: "finance", label: "Finance only" },
  { value: "dual", label: "Dual (HR + Finance)" },
];
type RuleFieldKey = "employment_status" | "okr_submitted" | "attendance" | "responsibility_level" | "role" | "tenure_days";

const RULE_FIELDS: {
  key: RuleFieldKey;
  label: string;
  valueType: "select" | "boolean" | "number" | "text";
  options?: { value: string; label: string }[];
  unit?: string;
  defaultValue: string;
  operators: { value: string; label: string }[];
}[] = [
  {
    key: "employment_status", label: "Employment Status", valueType: "select",
    options: [{ value: '"active"', label: "Active" }, { value: '"probation"', label: "Probation" }, { value: '"leave"', label: "On Leave" }, { value: '"terminated"', label: "Terminated" }],
    defaultValue: '"active"',
    operators: [{ value: "eq", label: "is" }, { value: "neq", label: "is not" }],
  },
  {
    key: "okr_submitted", label: "OKR Submitted", valueType: "boolean",
    options: [{ value: "true", label: "Yes" }, { value: "false", label: "No" }],
    defaultValue: "true",
    operators: [{ value: "eq", label: "is" }],
  },
  {
    key: "attendance", label: "Attendance (late arrivals)", valueType: "number", unit: "times",
    defaultValue: "3",
    operators: [{ value: "lt", label: "less than" }, { value: "lte", label: "at most" }, { value: "gte", label: "at least" }],
  },
  {
    key: "responsibility_level", label: "Responsibility Level", valueType: "select",
    options: [{ value: "1", label: "Standard (1)" }, { value: "2", label: "Senior (2)" }, { value: "3", label: "Lead (3)" }, { value: "4", label: "Principal (4)" }],
    defaultValue: "1",
    operators: [{ value: "gte", label: "or above" }, { value: "eq", label: "exactly" }, { value: "lte", label: "or below" }],
  },
  {
    key: "role", label: "Role", valueType: "text", defaultValue: '"engineer"',
    operators: [{ value: "eq", label: "is" }, { value: "neq", label: "is not" }],
  },
  {
    key: "tenure_days", label: "Tenure (days)", valueType: "number", unit: "days", defaultValue: "180",
    operators: [{ value: "gte", label: "or more" }, { value: "lte", label: "or less" }, { value: "gt", label: "more than" }],
  },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

// ── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function getUploadUrl(): string {
  const base =
    typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GRAPHQL_URL
      ? process.env.NEXT_PUBLIC_GRAPHQL_URL
      : "https://team8-api.team8pinequest.workers.dev/";
  return base.replace(/\/$/, "") + "/api/contracts/upload";
}

type ContractRow = {
  id: string;
  vendorName: string;
  version: string;
  effectiveDate: string;
  expiryDate: string;
  isActive: boolean;
  viewUrl?: string | null;
};

type EmployeeSignedContractRow = {
  requestId: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  fileName: string;
  uploadedAt: string;
  status: string;
  viewUrl: string | null;
};

function getExpiryStatus(c: ContractRow, now: number): "active" | "expiring_soon" | "expired" | "inactive" {
  if (!c.isActive) return "inactive";
  const exp = new Date(c.expiryDate).getTime();
  if (exp < now) return "expired";
  if (exp - now <= SIXTY_DAYS_MS) return "expiring_soon";
  return "active";
}

function ExpiryBadge({ contract, now }: { contract: ContractRow; now: number }) {
  const s = getExpiryStatus(contract, now);
  if (s === "inactive") return <span className="text-xs text-slate-400">Inactive</span>;
  if (s === "expired") return <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase bg-red-100 text-red-700"><Clock className="h-2.5 w-2.5" />Expired</span>;
  if (s === "expiring_soon") {
    const days = Math.ceil((new Date(contract.expiryDate).getTime() - now) / 86400000);
    return <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase bg-amber-100 text-amber-700"><AlertTriangle className="h-2.5 w-2.5" />Expires in {days}d</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">Active</span>;
}

function formatUploadedAt(iso: string): { date: string; time: string; relative: string } {
  const date = new Date(iso);
  return {
    date: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
    relative: timeAgo(iso),
  };
}

function formatContractStatus(status: string): string {
  return status
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function EmployeeContractStatusBadge({ status }: { status: string }) {
  const tone =
    status === "attached_to_request"
      ? "bg-emerald-100 text-emerald-700"
      : status === "uploaded"
        ? "bg-blue-100 text-blue-700"
        : "bg-slate-100 text-slate-600";

  return (
    <span className={`inline-flex min-w-fit items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-center text-xs font-semibold leading-none ${tone}`}>
      {formatContractStatus(status)}
    </span>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-gray-700">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function ScreenTimeProgramLinkSection({ benefitId }: { benefitId: string }) {
  const { data, loading } = useGetAdminBenefitsQuery();
  const benefit = data?.adminBenefits?.find((item) => item.id === benefitId);

  if (loading || benefit?.flowType !== "screen_time") return null;

  return (
    <Section title="Screen Time Program" icon={<Monitor className="h-4 w-4 text-fuchsia-500" />}>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-fuchsia-100 bg-fuchsia-50 p-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Weekly screenshot tracker and automatic monthly salary uplift
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Manage Monday slots, Gemini extraction, and automatic month-end payout rules from the dedicated screen time program page.
          </p>
        </div>
        <Link
          href={`/admin-panel/screen-time/${benefitId}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-fuchsia-700"
        >
          Open program
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}

// ── BenefitDetails (edit) ─────────────────────────────────────────────────────

function BenefitDetails({ benefitId, isHr }: { benefitId: string; isHr: boolean }) {
  const { data, loading } = useGetAdminBenefitsQuery();
  const benefit = data?.adminBenefits?.find((b) => b.id === benefitId);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", subsidyPercent: 0, vendorName: "", requiresContract: false, approvalPolicy: "hr", amount: 0 });
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const [updateBenefit, { loading: saving }] = useUpdateBenefitMutation({
    refetchQueries: [{ query: GetAdminBenefitsDocument }],
    onCompleted: () => {
      setEditing(false);
      setFeedback({ ok: true, msg: "Saved." });
      setTimeout(() => setFeedback(null), 3000);
    },
    onError: (e) => setFeedback({ ok: false, msg: e.message }),
  });

  function startEdit() {
    if (!benefit) return;
    setForm({
      name: benefit.name,
      category: benefit.category,
      subsidyPercent: benefit.subsidyPercent,
      vendorName: benefit.vendorName ?? "",
      requiresContract: benefit.requiresContract,
      approvalPolicy: benefit.approvalPolicy ?? "hr",
      amount: benefit.amount ?? 0,
    });
    setFeedback(null);
    setEditing(true);
  }

  async function handleSave(e: React.SyntheticEvent) {
    e.preventDefault();
    await updateBenefit({
      variables: {
        id: benefitId,
        input: {
          name: form.name.trim(),
          category: form.category,
          subsidyPercent: form.subsidyPercent,
          vendorName: form.vendorName.trim() || null,
          requiresContract: form.requiresContract,
          approvalPolicy: form.approvalPolicy,
          amount: benefit?.amount != null ? form.amount : undefined,
        },
      },
    });
  }

  if (loading) return <PageLoading inline message="Loading…" />;
  if (!benefit) return <p className="text-sm text-gray-500">Benefit not found.</p>;

  const policyLabel = APPROVAL_POLICIES.find((p) => p.value === benefit.approvalPolicy)?.label ?? benefit.approvalPolicy;

  return (
    <Section title="Benefit Information" icon={<FileText className="h-4 w-4 text-gray-400" />}>
      {feedback && (
        <div className={`mb-4 rounded-lg border px-3 py-2 text-sm ${feedback.ok ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>
          {feedback.msg}
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            {benefit.amount != null && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Subsidy %</label>
                <input type="number" min={0} max={100} value={form.subsidyPercent}
                  onChange={(e) => setForm((f) => ({ ...f, subsidyPercent: Number(e.target.value) || 0 }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              </div>
            )}
            {benefit.amount != null && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Total Amount (₮)</label>
                <input type="number" min={0} value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) || 0 }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Vendor</label>
              <input value={form.vendorName} onChange={(e) => setForm((f) => ({ ...f, vendorName: e.target.value }))}
                placeholder="Vendor name" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Approval Policy</label>
              <select value={form.approvalPolicy} onChange={(e) => setForm((f) => ({ ...f, approvalPolicy: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                {APPROVAL_POLICIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 self-end pb-2">
              <input type="checkbox" id="req_contract" checked={form.requiresContract}
                onChange={(e) => setForm((f) => ({ ...f, requiresContract: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300" />
              <label htmlFor="req_contract" className="text-sm text-gray-600">Requires contract</label>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50">
              {saving ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(false)} disabled={saving}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
            <InfoRow label="Name" value={benefit.name} />
            <InfoRow label="Category" value={<span className="capitalize">{benefit.category}</span>} />
            {benefit.amount != null && (
              <InfoRow label="Subsidy" value={`${benefit.subsidyPercent}%`} />
            )}
            <InfoRow label="Vendor" value={benefit.vendorName ?? "—"} />
            <InfoRow label="Approval Policy" value={policyLabel} />
            <InfoRow label="Requires Contract" value={benefit.requiresContract ? "Yes" : "No"} />
            {benefit.amount != null && (
              <InfoRow label="Total Amount" value={`₮${benefit.amount.toLocaleString()}`} />
            )}
            {benefit.amount != null && (
              <InfoRow label="Company Pays" value={`₮${Math.round(benefit.amount * benefit.subsidyPercent / 100).toLocaleString()} (${benefit.subsidyPercent}%)`} />
            )}
            {benefit.amount != null && benefit.employeePercent > 0 && (
              <InfoRow label="Employee Pays" value={`₮${Math.round(benefit.amount * benefit.employeePercent / 100).toLocaleString()} (${benefit.employeePercent}%)`} />
            )}
          </div>
          {isHr && (
            <button type="button" onClick={startEdit}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          )}
        </div>
      )}
    </Section>
  );
}

// ── RuleConfigSection ─────────────────────────────────────────────────────────

const defaultRuleForm = { ruleType: "employment_status", operator: "eq", value: "", errorMessage: "", priority: 0 };

function RuleConfigSection({ benefitId }: { benefitId: string }) {
  const { employee: me } = useCurrentEmployee();
  const isHr = isHrAdmin(me);

  const refetchQueries = [
    { query: GetEligibilityRulesDocument, variables: { benefitId } },
    { query: GetRuleProposalsDocument, variables: { benefitId } },
  ];

  const { data: rulesData, loading: rulesLoading } = useGetEligibilityRulesQuery({ variables: { benefitId }, skip: !isHr });
  const { data: proposalsData, loading: proposalsLoading } = useGetRuleProposalsQuery({ variables: { benefitId }, skip: !isHr });
  const [proposeChange, { loading: proposing }] = useProposeRuleChangeMutation({ refetchQueries });
  const [approveProposal, { loading: approving }] = useApproveRuleProposalMutation({ refetchQueries });
  const [rejectProposal, { loading: rejecting }] = useRejectRuleProposalMutation({ refetchQueries });

  type ProposalMode = "create" | "update" | "delete";
  type EligibilityRule = { id: string; benefitId: string; ruleType: string; operator: string; value: string; errorMessage: string; priority: number; isActive: boolean };
  type RuleProposal = { id: string; ruleId?: string | null; changeType: string; proposedData: string; summary: string; status: string; proposedByEmployeeId: string; proposedAt: string; reason?: string | null };

  const [proposalMode, setProposalMode] = useState<ProposalMode | null>(null);
  const [editingFromProposal, setEditingFromProposal] = useState(false);
  const [editingRule, setEditingRule] = useState<EligibilityRule | null>(null);
  const [form, setForm] = useState(defaultRuleForm);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const rules = (rulesData?.eligibilityRules ?? []) as EligibilityRule[];
  const proposals = (proposalsData?.ruleProposals ?? []) as RuleProposal[];
  const pending = proposals.filter((p) => p.status === "pending");
  const history = proposals.filter((p) => p.status !== "pending");

  async function submitProposal() {
    if (!proposalMode) return;
    if (proposalMode !== "delete" && (!form.value || !form.errorMessage)) {
      setActionError("Please fill in all required fields.");
      return;
    }
    setActionError(null);
    try {
      const proposedData = proposalMode === "delete"
        ? JSON.stringify({ id: editingRule?.id })
        : JSON.stringify({ ruleType: form.ruleType, operator: form.operator, value: form.value, errorMessage: form.errorMessage, priority: form.priority, isActive: true });
      const summary = proposalMode === "create"
        ? `Add new rule: ${form.ruleType} ${form.operator} ${form.value}`
        : proposalMode === "update"
          ? `Update rule: ${form.ruleType} ${form.operator} ${form.value}`
          : `Delete rule: ${editingRule?.ruleType} ${editingRule?.operator} ${editingRule?.value}`;
      await proposeChange({ variables: { input: { benefitId, ruleId: editingRule?.id ?? null, changeType: proposalMode, proposedData, summary } } });
      setProposalMode(null);
      setEditingRule(null);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to submit proposal");
    }
  }

  async function handleReject() {
    if (!rejectTarget || !rejectReason.trim()) return;
    try {
      await rejectProposal({ variables: { id: rejectTarget, reason: rejectReason.trim() } });
      setRejectTarget(null);
      setRejectReason("");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to reject");
    }
  }

  if (!isHr) return null;

  const fieldCfg = RULE_FIELDS.find((f) => f.key === (form.ruleType as RuleFieldKey)) ?? RULE_FIELDS[0];

  return (
    <Section title="Active Rules" icon={<ChevronDown className="h-4 w-4 text-gray-400" />}>
      {/* Pending proposals */}
      {proposalsLoading ? <PageLoading inline message="Loading…" /> : pending.length > 0 && (
        <div className="mb-5 space-y-2">
          {pending.map((p) => {
            const relatedRule = rules.find((r) => r.id === p.ruleId);
            const parsed = (() => { try { return JSON.parse(p.proposedData); } catch { return null; } })();
            function openEdit() {
              if (relatedRule) {
                setProposalMode("update"); setEditingRule(relatedRule);
                setForm({ ruleType: relatedRule.ruleType, operator: relatedRule.operator, value: relatedRule.value, errorMessage: relatedRule.errorMessage, priority: relatedRule.priority });
              } else if (parsed) {
                setProposalMode("create"); setEditingRule(null);
                setForm({ ruleType: parsed.ruleType ?? "employment_status", operator: parsed.operator ?? "eq", value: parsed.value ?? "", errorMessage: parsed.errorMessage ?? "", priority: parsed.priority ?? 0 });
              }
              setEditingFromProposal(true);
              setActionError(null);
            }
            return (
              <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{p.summary}</p>
                    <p className="mt-0.5 text-xs text-slate-500">Proposed {timeAgo(p.proposedAt)} · by {p.proposedByEmployeeId.slice(0, 8)}…</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {p.proposedByEmployeeId !== me?.id && (
                      <button type="button" onClick={() => approveProposal({ variables: { id: p.id } })} disabled={approving}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50">
                        <Check className="h-3 w-3" />Approve
                      </button>
                    )}
                    <button type="button" onClick={openEdit}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50">
                      <Pencil className="h-3.5 w-3.5" />Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active rules */}
      <div className="flex items-center justify-between mb-4">
<button type="button" onClick={() => { setProposalMode("create"); setEditingRule(null); setForm(defaultRuleForm); setEditingFromProposal(false); setActionError(null); }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700">
          <Plus className="h-3.5 w-3.5" />Propose New Rule
        </button>
      </div>

      {actionError && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{actionError}</div>}

      {/* Proposal form */}
      {proposalMode && (
        <div className={`mb-4 rounded-2xl border p-4 ${proposalMode === "delete" ? "border-red-100 bg-red-50" : "border-gray-100 bg-white"}`}>
          <p className="mb-4 text-sm font-semibold text-gray-800">
            {proposalMode === "delete" ? "Delete Rule" : editingFromProposal || proposalMode === "update" ? "Edit Rule" : "New Rule"}
          </p>
          {proposalMode === "delete" ? (
            <div className="rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-slate-700">
              <p className="font-medium text-red-800">Delete rule:</p>
              <p className="mt-1">{editingRule?.ruleType} {editingRule?.operator} <code className="bg-red-50 px-1 rounded">{editingRule?.value}</code></p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Condition</label>
                <select value={form.ruleType} onChange={(e) => {
                  const newField = RULE_FIELDS.find((f) => f.key === e.target.value as RuleFieldKey) ?? RULE_FIELDS[0];
                  setForm((f) => ({ ...f, ruleType: e.target.value, operator: newField.operators[0].value, value: newField.defaultValue }));
                }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  {RULE_FIELDS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Operator</label>
                <select value={form.operator} onChange={(e) => setForm((f) => ({ ...f, operator: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  {fieldCfg.operators.map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Value{fieldCfg.unit ? ` (${fieldCfg.unit})` : ""}
                </label>
                {fieldCfg.valueType === "select" || fieldCfg.valueType === "boolean" ? (
                  <select value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                    {fieldCfg.options!.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                ) : (
                  <input type={fieldCfg.valueType === "number" ? "number" : "text"} value={form.value}
                    onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                )}
              </div>
              <div className="sm:col-span-3">
                <label className="mb-1 block text-xs font-medium text-gray-600">Error Message</label>
                <input value={form.errorMessage} onChange={(e) => setForm((f) => ({ ...f, errorMessage: e.target.value }))}
                  placeholder="Shown to employee when rule fails"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              </div>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={submitProposal} disabled={proposing}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50">
              {proposing ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => { setProposalMode(null); setEditingRule(null); setEditingFromProposal(false); }} disabled={proposing}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
          </div>
        </div>
      )}

      {rulesLoading ? <PageLoading inline message="Loading rules…" /> : rules.length === 0 ? null : (
        <div className="space-y-3">
          {rules.map((rule, idx) => (
            <div key={rule.id} className={`rounded-2xl border p-4 ${rule.isActive ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-60"}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Rule {idx + 1}{!rule.isActive && <span className="ml-2 text-xs font-normal text-slate-400">(disabled)</span>}</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setProposalMode("update"); setEditingRule(rule); setForm({ ruleType: rule.ruleType, operator: rule.operator, value: rule.value, errorMessage: rule.errorMessage, priority: rule.priority }); setActionError(null); }}
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50">Propose Edit</button>
                  <button type="button" onClick={() => { setEditingRule(rule); setProposalMode("delete"); setActionError(null); }}
                    className="rounded-lg border border-red-200 p-1.5 text-red-600 transition hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div><p className="text-xs text-slate-500">Rule Type</p><p className="mt-0.5 text-sm font-medium text-slate-800">{rule.ruleType}</p></div>
                <div><p className="text-xs text-slate-500">Operator</p><p className="mt-0.5 text-sm font-medium text-slate-800">{rule.operator}</p></div>
                <div><p className="text-xs text-slate-500">Value</p><p className="mt-0.5 text-sm font-medium text-slate-800">{rule.value}</p></div>
                <div><p className="text-xs text-slate-500">Priority</p><p className="mt-0.5 text-sm font-medium text-slate-800">{rule.priority}</p></div>
                <div className="md:col-span-2"><p className="text-xs text-slate-500">Error Message</p><p className="mt-0.5 text-sm text-slate-700">{rule.errorMessage}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proposal history */}
      {history.length > 0 && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Proposal History</h3>
          <div className="space-y-2">
            {history.map((p) => (
              <div key={p.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-slate-700">{p.summary}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{timeAgo(p.proposedAt)}{p.reason && ` · ${p.reason}`}</p>
                </div>
                <span className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold uppercase ${STATUS_STYLES[p.status] ?? "bg-slate-100 text-slate-600"}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setRejectTarget(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Reject Proposal</h3>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason (required)" rows={3}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700" />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setRejectTarget(null)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={handleReject} disabled={!rejectReason.trim() || rejecting}
                className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
                {rejecting ? "Rejecting…" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

// ── VendorContractSection ─────────────────────────────────────────────────────
function VendorContractSection({ benefitId }: { benefitId: string }) {
  const { getToken } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { data: benefitData } = useGetAdminBenefitsQuery();
  const benefit = benefitData?.adminBenefits?.find((item) => item.id === benefitId);
  const { data: employeesData } = useGetEmployeesQuery();
  const { data: requestsData } = useGetAllBenefitRequestsQuery();
  const { data, loading, error, refetch } = useGetContractsForBenefitQuery({ variables: { benefitId } });
  const contracts = (data?.contracts ?? []) as ContractRow[];
  const [now] = useState(Date.now);

  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [form, setForm] = useState({ version: "", effectiveDate: "", expiryDate: "", vendorName: "" });
  const [file, setFile] = useState<File | null>(null);

  const openModal = useCallback(() => {
    setModalOpen(true);
    setUploadError(null);
    setForm({ version: "", effectiveDate: "", expiryDate: "", vendorName: "" });
    setFile(null);
  }, []);

  const closeModal = useCallback(() => { if (!uploading) setModalOpen(false); }, [uploading]);

  const handleUpload = useCallback(async () => {
    if (!form.version || !form.effectiveDate || !form.expiryDate || !file?.size) {
      setUploadError("Please fill all required fields and select a PDF file.");
      return;
    }
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("benefitId", benefitId);
      fd.set("version", form.version);
      fd.set("effectiveDate", form.effectiveDate);
      fd.set("expiryDate", form.expiryDate);
      fd.set("vendorName", form.vendorName || "Vendor");
      fd.set("file", file);
      const token = await getToken();
      const res = await fetch(getUploadUrl(), { method: "POST", body: fd, headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setUploadError(json?.error || `Upload failed (${res.status})`); return; }
      await refetch();
      setModalOpen(false);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [benefitId, file, form, getToken, refetch]);

  if (!benefit?.requiresContract) return null;

  const employeesById = new Map(
    (employeesData?.getEmployees ?? []).map((employee) => [employee.id, employee]),
  );

  const employeeSignedContracts: EmployeeSignedContractRow[] = (
    requestsData?.allBenefitRequests ?? []
  )
    .filter(
      (request) =>
        request.benefitId === benefitId && request.employeeSignedContract?.id,
    )
    .map((request) => {
      const employee = employeesById.get(request.employeeId);
      return {
        requestId: request.id,
        employeeId: request.employeeId,
        employeeName: employee?.name ?? request.employeeId,
        employeeEmail: employee?.email ?? "",
        fileName:
          request.employeeSignedContract?.fileName ?? "Signed contract",
        uploadedAt: request.employeeSignedContract?.uploadedAt ?? request.updatedAt,
        status: request.employeeSignedContract?.status ?? request.status,
        viewUrl: getContractProxyUrl(request.employeeSignedContract?.viewUrl ?? null),
      };
    });

  const clerkEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null;

  return (
    <Section title="Vendor Contracts" icon={<FileText className="h-4 w-4 text-gray-400" />}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-gray-500">Upload and manage vendor contracts for this benefit.</p>
        <button type="button" onClick={openModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700">
          <Upload className="h-3.5 w-3.5" />Upload Contract
        </button>
      </div>

      {loading ? <PageLoading inline message="Loading contracts…" /> : error ? (
        <p className="text-sm text-red-600">Failed to load contracts.</p>
      ) : contracts.length === 0 ? (
        <p className="text-sm text-slate-500">No contracts uploaded yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full text-left">
            <thead className="border-b border-slate-200 bg-white text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Version</th>
                <th className="px-4 py-3">Effective</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {contracts.map((row) => (
                <tr key={row.id} className="border-b last:border-b-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 flex items-center gap-2">
                    {row.isActive && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                    {row.vendorName}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${row.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      v{row.version}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{row.effectiveDate}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{row.expiryDate}</td>
                  <td className="px-4 py-3"><ExpiryBadge contract={row} now={now} /></td>
                  <td className="px-4 py-3">
                    {row.viewUrl ? (
                      <a href={getContractProxyUrl(row.viewUrl) ?? row.viewUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-blue-600 transition hover:text-blue-700">
                        <ExternalLink className="h-3.5 w-3.5" />View
                      </a>
                    ) : <span className="text-xs text-slate-400">No preview</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 border-t border-slate-100 pt-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Employee Signed Contracts</h3>
          <p className="mt-1 text-xs text-slate-500">
            Signed contract copies uploaded by employees for this benefit.
          </p>
        </div>

        {employeeSignedContracts.length === 0 ? (
          <p className="text-sm text-slate-500">No employee-signed contracts uploaded yet.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full text-left">
              <thead className="border-b border-slate-200 bg-white text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">File</th>
                  <th className="px-4 py-3">Uploaded</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {employeeSignedContracts.map((row) => (
                  <tr key={row.requestId} className="border-b last:border-b-0 hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <EmployeeAvatar
                          name={row.employeeName}
                          imageUrl={
                            isUserLoaded &&
                            !!clerkEmail &&
                            row.employeeEmail.toLowerCase() === clerkEmail
                              ? user?.imageUrl ?? null
                              : null
                          }
                        />
                        <div>
                          <div className="text-sm font-medium text-slate-900">{row.employeeName}</div>
                          <div className="text-xs text-slate-500">{row.employeeEmail || row.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-600">{row.fileName}</div>
                    </td>
                    <td className="px-4 py-3">
                      {row.uploadedAt ? (
                        <div>
                          <div className="text-sm text-slate-500">
                            {formatUploadedAt(row.uploadedAt).date}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <EmployeeContractStatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3">
                      {row.viewUrl ? (
                        <a
                          href={row.viewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-blue-600 transition hover:text-blue-700"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">No preview</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeModal}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Upload New Contract</h2>
              <button type="button" onClick={closeModal} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Version *</label>
                <input type="text" value={form.version} onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))} placeholder="e.g. 1.0"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Effective date *</label>
                <input type="date" value={form.effectiveDate} onChange={(e) => setForm((f) => ({ ...f, effectiveDate: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Expiry date *</label>
                <input type="date" value={form.expiryDate} onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Vendor name</label>
                <input type="text" value={form.vendorName} onChange={(e) => setForm((f) => ({ ...f, vendorName: e.target.value }))} placeholder="Vendor"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">PDF file *</label>
                <input type="file" accept=".pdf,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
              {uploadError && <p className="text-sm text-rose-600">{uploadError}</p>}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={closeModal} disabled={uploading}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
              <button type="button" onClick={handleUpload} disabled={uploading}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {uploading ? "Uploading…" : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

// ── InfoRow ───────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <div className="mt-0.5 text-sm text-gray-800 break-words">{value}</div>
    </div>
  );
}

function EmployeeAvatar({ name, imageUrl }: { name: string; imageUrl?: string | null }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "EM";

  return (
    imageUrl ? (
      <img
        src={imageUrl}
        alt={name}
        className="h-10 w-10 rounded-full object-cover"
      />
    ) : (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
        {initials}
      </div>
    )
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BenefitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const benefitId = typeof params.id === "string" ? params.id : "";

  const { employee, loading: empLoading } = useCurrentEmployee();
  const hasAccess = isAdminEmployee(employee);
  const isHr = isHrAdmin(employee);

  if (empLoading) return <div className="flex min-h-screen bg-gray-50"><Sidebar /><div className="flex flex-1 items-center justify-center"><PageLoading message="Loading…" /></div></div>;

  if (!hasAccess) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-gray-500">You need admin access to view this page.</p>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="mx-auto w-full max-w-4xl px-8 py-8">
          <button type="button" onClick={() => router.push("/admin-panel/company-benefits")}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-800">
            <ArrowLeft className="h-4 w-4" />
            Back to Company Benefits
          </button>

          <div className="space-y-6">
            <BenefitDetails benefitId={benefitId} isHr={isHr} />
            {isHr && <ScreenTimeProgramLinkSection benefitId={benefitId} />}
            {isHr && <RuleConfigSection benefitId={benefitId} />}
            {isHr && <VendorContractSection benefitId={benefitId} />}
          </div>
        </main>
      </div>
    </div>
  );
}

