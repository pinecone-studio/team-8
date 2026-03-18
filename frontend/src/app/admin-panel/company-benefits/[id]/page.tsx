"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { gql, useQuery } from "@apollo/client";
import { useAuth } from "@clerk/nextjs";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  FileText,
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
  GetContractsForBenefitDocument,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isAdminEmployee, isHrAdmin } from "../../_lib/access";

// ── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ["wellness", "equipment", "financial", "career", "flexibility", "other"];
const APPROVAL_POLICIES = [
  { value: "hr", label: "HR only" },
  { value: "finance", label: "Finance only" },
  { value: "dual", label: "Dual (HR + Finance)" },
];
const RULE_TYPES = ["employment_status", "okr_submitted", "attendance", "responsibility_level", "role", "tenure_days"];
const OPERATORS = ["eq", "neq", "gte", "gt", "lte", "lt", "in", "not_in"];

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

// ── BenefitDetails (edit) ─────────────────────────────────────────────────────

function BenefitDetails({ benefitId, isHr }: { benefitId: string; isHr: boolean }) {
  const { data, loading } = useGetAdminBenefitsQuery();
  const benefit = data?.adminBenefits?.find((b) => b.id === benefitId);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", subsidyPercent: 0, vendorName: "", requiresContract: false, approvalPolicy: "hr" });
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
    });
    setFeedback(null);
    setEditing(true);
  }

  async function handleSave(e: React.FormEvent) {
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
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Subsidy %</label>
              <input type="number" min={0} max={100} value={form.subsidyPercent}
                onChange={(e) => setForm((f) => ({ ...f, subsidyPercent: Number(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            </div>
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
            <InfoRow label="Subsidy" value={`${benefit.subsidyPercent}%`} />
            <InfoRow label="Vendor" value={benefit.vendorName ?? "—"} />
            <InfoRow label="Approval Policy" value={policyLabel} />
            <InfoRow label="Requires Contract" value={benefit.requiresContract ? "Yes" : "No"} />
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
  type RuleProposal = { id: string; changeType: string; proposedData: string; summary: string; status: string; proposedByEmployeeId: string; proposedAt: string; reason?: string | null };

  const [proposalMode, setProposalMode] = useState<ProposalMode | null>(null);
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

  return (
    <Section title="Rule Configuration" icon={<ChevronDown className="h-4 w-4 text-gray-400" />}>
      {/* Pending proposals */}
      {(pending.length > 0 || proposalsLoading) && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-900">Pending Proposals ({pending.length})</span>
            <span className="text-xs text-amber-700">— requires a second HR admin</span>
          </div>
          {proposalsLoading ? <PageLoading inline message="Loading…" /> : (
            <div className="space-y-2">
              {pending.map((p) => (
                <div key={p.id} className="rounded-xl border border-amber-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{p.summary}</p>
                      <p className="mt-0.5 text-xs text-slate-500">Proposed {timeAgo(p.proposedAt)} · by {p.proposedByEmployeeId.slice(0, 8)}…</p>
                      {p.proposedByEmployeeId === me?.id && <p className="mt-1 text-[11px] font-medium text-amber-700">⚠ You proposed this — another HR admin must approve</p>}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {p.proposedByEmployeeId !== me?.id && (
                        <button type="button" onClick={() => approveProposal({ variables: { id: p.id } })} disabled={approving}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50">
                          <Check className="h-3 w-3" />Approve
                        </button>
                      )}
                      <button type="button" onClick={() => { setRejectTarget(p.id); setRejectReason(""); }}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50">
                        <X className="h-3 w-3" />Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active rules */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">Active Rules</h3>
        <button type="button" onClick={() => { setProposalMode("create"); setEditingRule(null); setForm(defaultRuleForm); setActionError(null); }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700">
          <Plus className="h-3.5 w-3.5" />Propose New Rule
        </button>
      </div>

      {actionError && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{actionError}</div>}

      {/* Proposal form */}
      {proposalMode && (
        <div className={`mb-4 rounded-2xl border p-4 ${proposalMode === "delete" ? "border-red-100 bg-red-50" : "border-blue-100 bg-blue-50"}`}>
          <p className="mb-3 text-sm font-semibold text-slate-800">
            {proposalMode === "create" ? "Propose New Rule" : proposalMode === "update" ? "Propose Rule Edit" : "Propose Rule Deletion"}
          </p>
          {proposalMode === "delete" ? (
            <div className="rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-slate-700">
              <p className="font-medium text-red-800">Delete rule:</p>
              <p className="mt-1">{editingRule?.ruleType} {editingRule?.operator} <code className="bg-red-50 px-1 rounded">{editingRule?.value}</code></p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Rule Type</label>
                <select value={form.ruleType} onChange={(e) => setForm((f) => ({ ...f, ruleType: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                  {RULE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Operator</label>
                <select value={form.operator} onChange={(e) => setForm((f) => ({ ...f, operator: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                  {OPERATORS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Value *</label>
                <input value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                  placeholder='e.g. "active" or 2' className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Priority</label>
                <input type="number" value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-700">Error Message *</label>
                <input value={form.errorMessage} onChange={(e) => setForm((f) => ({ ...f, errorMessage: e.target.value }))}
                  placeholder="Shown to employee when rule fails" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
              </div>
            </div>
          )}
          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="text-xs text-slate-500">A second HR admin must approve this before it takes effect.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setProposalMode(null); setEditingRule(null); }}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={submitProposal} disabled={proposing}
                className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {proposing ? "Submitting…" : "Submit Proposal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {rulesLoading ? <PageLoading inline message="Loading rules…" /> : rules.length === 0 ? (
        <p className="text-sm text-slate-500">No rules configured for this benefit.</p>
      ) : (
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
  const { data, loading } = useGetContractsForBenefitQuery({ variables: { benefitId } });
  const activeContract = (data?.contracts ?? []).find((c) => c.isActive);

  return (
    <Section title="Contract" icon={<FileText className="h-4 w-4 text-gray-400" />}>
      {loading ? (
        <PageLoading inline message="Loading…" />
      ) : activeContract ? (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-800">{activeContract.vendorName}</p>
            <p className="text-xs text-gray-400">
              {activeContract.effectiveDate} — {activeContract.expiryDate}
            </p>
          </div>
          {activeContract.viewUrl && (
            <a href={activeContract.viewUrl} target="_blank" rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50">
              <ExternalLink className="h-3.5 w-3.5" />
              View PDF
            </a>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No contract uploaded yet.</p>
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
            {isHr && <RuleConfigSection benefitId={benefitId} />}
            {isHr && <VendorContractSection benefitId={benefitId} />}
          </div>
        </main>
      </div>
    </div>
  );
}
