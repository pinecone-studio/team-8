"use client";

import { useState } from "react";
import { Check, ChevronDown, Clock, Plus, Trash2, X } from "lucide-react";
import {
  useGetAdminBenefitsQuery,
  useGetEligibilityRulesQuery,
  useGetRuleProposalsQuery,
  useProposeRuleChangeMutation,
  useApproveRuleProposalMutation,
  useRejectRuleProposalMutation,
  GetEligibilityRulesDocument,
  GetRuleProposalsDocument,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isHrAdmin } from "@/app/admin-panel/_lib/access";

const RULE_TYPES = [
  "employment_status",
  "okr_submitted",
  "attendance",
  "responsibility_level",
  "role",
  "tenure_days",
];

const OPERATORS = ["eq", "neq", "gte", "gt", "lte", "lt", "in", "not_in"];

const defaultForm = {
  ruleType: "employment_status",
  operator: "eq",
  value: "",
  errorMessage: "",
  priority: 0,
};

type ProposalFormMode = "create" | "update" | "delete";

type EligibilityRule = {
  id: string;
  benefitId: string;
  ruleType: string;
  operator: string;
  value: string;
  errorMessage: string;
  priority: number;
  isActive: boolean;
};

type RuleProposal = {
  id: string;
  benefitId: string;
  ruleId?: string | null;
  changeType: string;
  proposedData: string;
  summary: string;
  status: string;
  proposedByEmployeeId: string;
  reviewedByEmployeeId?: string | null;
  proposedAt: string;
  reviewedAt?: string | null;
  reason?: string | null;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

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

export default function RuleConfiguration() {
  const { employee: me } = useCurrentEmployee();
  const isHr = isHrAdmin(me);

  const [selectedBenefitId, setSelectedBenefitId] = useState<string>("");
  const [proposalMode, setProposalMode] = useState<ProposalFormMode | null>(null);
  const [editingRule, setEditingRule] = useState<EligibilityRule | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: benefitsData, loading: benefitsLoading } = useGetAdminBenefitsQuery({ skip: !isHr });
  const benefits = benefitsData?.adminBenefits ?? [];
  const selectedBenefit = benefits.find((b) => b.id === selectedBenefitId);

  const refetchQueries = selectedBenefitId
    ? [
        { query: GetEligibilityRulesDocument, variables: { benefitId: selectedBenefitId } },
        { query: GetRuleProposalsDocument, variables: { benefitId: selectedBenefitId } },
      ]
    : [];

  const { data: rulesData, loading: rulesLoading } = useGetEligibilityRulesQuery({
    variables: { benefitId: selectedBenefitId },
    skip: !selectedBenefitId || !isHr,
  });

  const { data: proposalsData, loading: proposalsLoading } = useGetRuleProposalsQuery({
    variables: { benefitId: selectedBenefitId },
    skip: !selectedBenefitId || !isHr,
  });

  const [proposeChange, { loading: proposing }] = useProposeRuleChangeMutation({ refetchQueries });
  const [approveProposal, { loading: approving }] = useApproveRuleProposalMutation({ refetchQueries });
  const [rejectProposal, { loading: rejecting }] = useRejectRuleProposalMutation({ refetchQueries });

  const rules = (rulesData?.eligibilityRules ?? []) as EligibilityRule[];
  const proposals = (proposalsData?.ruleProposals ?? []) as RuleProposal[];
  const pendingProposals = proposals.filter((p) => p.status === "pending");
  const historyProposals = proposals.filter((p) => p.status !== "pending");

  function openCreateForm() {
    setProposalMode("create");
    setEditingRule(null);
    setForm(defaultForm);
    setActionError(null);
  }

  function openUpdateForm(rule: EligibilityRule) {
    setProposalMode("update");
    setEditingRule(rule);
    setForm({
      ruleType: rule.ruleType,
      operator: rule.operator,
      value: rule.value,
      errorMessage: rule.errorMessage,
      priority: rule.priority,
    });
    setActionError(null);
  }

  function openDeleteProposal(rule: EligibilityRule) {
    setEditingRule(rule);
    setProposalMode("delete");
    setActionError(null);
  }

  async function handleSubmitProposal() {
    if (!proposalMode || !selectedBenefitId) return;

    if (proposalMode !== "delete" && (!form.value || !form.errorMessage)) {
      setActionError("Please fill in all required fields.");
      return;
    }

    setActionError(null);
    try {
      const proposedData =
        proposalMode === "delete"
          ? JSON.stringify({ id: editingRule?.id })
          : JSON.stringify({
              ruleType: form.ruleType,
              operator: form.operator,
              value: form.value,
              errorMessage: form.errorMessage,
              priority: form.priority,
              isActive: true,
            });

      let summary = "";
      if (proposalMode === "create") {
        summary = `Add new rule: ${form.ruleType} ${form.operator} ${form.value}`;
      } else if (proposalMode === "update") {
        summary = `Update rule: ${form.ruleType} ${form.operator} ${form.value}`;
      } else {
        summary = `Delete rule: ${editingRule?.ruleType} ${editingRule?.operator} ${editingRule?.value}`;
      }

      await proposeChange({
        variables: {
          input: {
            benefitId: selectedBenefitId,
            ruleId: editingRule?.id ?? null,
            changeType: proposalMode,
            proposedData,
            summary,
          },
        },
      });
      setProposalMode(null);
      setEditingRule(null);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to submit proposal");
    }
  }

  async function handleApprove(id: string) {
    setActionError(null);
    try {
      await approveProposal({ variables: { id } });
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to approve proposal");
    }
  }

  async function handleReject() {
    if (!rejectTarget || !rejectReason.trim()) return;
    setActionError(null);
    try {
      await rejectProposal({ variables: { id: rejectTarget, reason: rejectReason.trim() } });
      setRejectTarget(null);
      setRejectReason("");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to reject proposal");
    }
  }

  if (!isHr) {
    return (
      <main className="flex-1 px-8 py-9">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-8 text-center max-w-md">
          <p className="text-sm font-semibold text-amber-800">HR access required</p>
          <p className="mt-1 text-xs text-amber-700">Rule Configuration is restricted to HR administrators.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-8 py-9">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          {benefitsLoading ? (
            <>
              <div className="h-6 w-44 rounded-full bg-white/30 animate-pulse" />
              <div className="mt-2 h-3.5 w-96 rounded-full bg-white/20 animate-pulse" />
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-white">Rule Configuration</h1>
              <p className="mt-1 text-sm text-gray-500">
                Propose and approve eligibility rule changes for benefits. All changes require a second HR admin to approve.
              </p>
            </>
          )}
        </div>

        <div className="mb-6 max-w-sm">
          {benefitsLoading ? (
            <div className="h-3.5 w-24 rounded-full bg-slate-200/80 animate-pulse mb-2" />
          ) : (
            <label className="mb-2 block text-sm font-medium text-slate-700">Select Benefit</label>
          )}
          {benefitsLoading ? (
            <div className="h-12 w-full rounded-xl bg-slate-200/80 animate-pulse" />
          ) : (
            <div className="relative">
              <select
                value={selectedBenefitId}
                onChange={(e) => {
                  setSelectedBenefitId(e.target.value);
                  setProposalMode(null);
                  setEditingRule(null);
                  setActionError(null);
                }}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700"
              >
                <option value="">Select a benefit</option>
                {benefits.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}{b.vendorName ? ` – ${b.vendorName}` : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          )}
        </div>

        {selectedBenefitId && (
          <div className="space-y-6">
            {/* Pending Proposals */}
            {(pendingProposals.length > 0 || proposalsLoading) && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <h2 className="text-sm font-semibold text-amber-900">
                    Pending Proposals ({pendingProposals.length})
                  </h2>
                  <span className="text-xs text-amber-700">— requires a second HR admin to approve</span>
                </div>
                {proposalsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="rounded-xl border border-amber-100 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-2">
                            <div className="h-3.5 w-3/5 rounded-full bg-slate-200/80 animate-pulse" />
                            <div className="h-2.5 w-2/5 rounded-full bg-slate-200/80 animate-pulse" />
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <div className="h-7 w-16 rounded-lg bg-slate-200/80 animate-pulse" />
                            <div className="h-7 w-14 rounded-lg bg-slate-200/80 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingProposals.map((p) => (
                      <div key={p.id} className="rounded-xl border border-amber-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-slate-800">{p.summary}</p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Proposed {timeAgo(p.proposedAt)} · by {p.proposedByEmployeeId.slice(0, 8)}…
                            </p>
                            {p.proposedByEmployeeId === me?.id && (
                              <p className="mt-1 text-[11px] font-medium text-amber-700">
                                ⚠ You proposed this — another HR admin must approve it
                              </p>
                            )}
                          </div>
                          <div className="flex shrink-0 gap-2">
                            {p.proposedByEmployeeId !== me?.id && (
                              <button
                                type="button"
                                onClick={() => handleApprove(p.id)}
                                disabled={approving}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                              >
                                <Check className="h-3 w-3" />
                                Approve
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => { setRejectTarget(p.id); setRejectReason(""); }}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                            >
                              <X className="h-3 w-3" />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reject reason modal */}
            {rejectTarget && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                role="dialog"
                aria-modal="true"
                onClick={() => setRejectTarget(null)}
              >
                <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Reject Proposal</h3>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Reason for rejection (required)"
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  />
                  <div className="mt-4 flex justify-end gap-2">
                    <button type="button" onClick={() => setRejectTarget(null)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={!rejectReason.trim() || rejecting}
                      className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {rejecting ? "Rejecting…" : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Current Rules */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Active Rules</h2>
                  {selectedBenefit && (
                    <p className="mt-0.5 text-sm text-slate-500">
                      {selectedBenefit.name}{selectedBenefit.vendorName ? ` – ${selectedBenefit.vendorName}` : ""}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4" />
                  Propose New Rule
                </button>
              </div>

              {actionError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {actionError}
                </div>
              )}

              {/* Proposal form */}
              {proposalMode && (
                <div className={`mb-5 rounded-2xl border p-4 ${
                  proposalMode === "delete"
                    ? "border-red-100 bg-red-50"
                    : "border-blue-100 bg-blue-50"
                }`}>
                  <p className="mb-3 text-sm font-semibold text-slate-800">
                    {proposalMode === "create" ? "Propose New Rule" : proposalMode === "update" ? "Propose Rule Edit" : "Propose Rule Deletion"}
                  </p>

                  {proposalMode === "delete" ? (
                    <div className="rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-slate-700">
                      <p className="font-medium text-red-800">Delete rule:</p>
                      <p className="mt-1">{editingRule?.ruleType} {editingRule?.operator} <code className="bg-red-50 px-1 rounded">{editingRule?.value}</code></p>
                      <p className="mt-1 text-xs text-slate-500">This will require second-admin approval before taking effect.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">Rule Type</label>
                        <select
                          value={form.ruleType}
                          onChange={(e) => setForm((f) => ({ ...f, ruleType: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        >
                          {RULE_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">Operator</label>
                        <select
                          value={form.operator}
                          onChange={(e) => setForm((f) => ({ ...f, operator: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        >
                          {OPERATORS.map((o) => (<option key={o} value={o}>{o}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">Value *</label>
                        <input
                          value={form.value}
                          onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                          placeholder='e.g. "active" or 2'
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">Priority</label>
                        <input
                          type="number"
                          value={form.priority}
                          onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) }))}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-700">Error Message *</label>
                        <input
                          value={form.errorMessage}
                          onChange={(e) => setForm((f) => ({ ...f, errorMessage: e.target.value }))}
                          placeholder="Shown to employee when rule fails"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-500">A second HR admin will need to approve this before it takes effect.</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setProposalMode(null); setEditingRule(null); }}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitProposal}
                        disabled={proposing}
                        className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        {proposing ? "Submitting…" : "Submit Proposal"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {rulesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-3.5 w-16 rounded-full bg-slate-200/80 animate-pulse" />
                        <div className="flex gap-2">
                          <div className="h-7 w-20 rounded-lg bg-slate-200/80 animate-pulse" />
                          <div className="h-7 w-7 rounded-lg bg-slate-200/80 animate-pulse" />
                        </div>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {[["w-16","w-24"],["w-14","w-16"],["w-10","w-20"],["w-14","w-8"]].map(([lw, vw], j) => (
                          <div key={j}>
                            <div className={`h-2.5 ${lw} rounded-full bg-slate-200/80 animate-pulse`} />
                            <div className={`mt-1.5 h-3.5 ${vw} rounded-full bg-slate-200/80 animate-pulse`} />
                          </div>
                        ))}
                        <div className="md:col-span-2">
                          <div className="h-2.5 w-24 rounded-full bg-slate-200/80 animate-pulse" />
                          <div className="mt-1.5 h-3.5 w-full rounded-full bg-slate-200/80 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : rules.length === 0 ? (
                <p className="text-sm text-slate-500">No rules configured for this benefit.</p>
              ) : (
                <div className="space-y-3">
                  {rules.map((rule, idx) => (
                    <div
                      key={rule.id}
                      className={`rounded-2xl border p-4 ${
                        rule.isActive ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">
                          Rule {idx + 1}
                          {!rule.isActive && <span className="ml-2 text-xs font-normal text-slate-400">(disabled)</span>}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openUpdateForm(rule)}
                            className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                          >
                            Propose Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteProposal(rule)}
                            className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div>
                          <p className="text-xs text-slate-500">Rule Type</p>
                          <p className="mt-0.5 text-sm font-medium text-slate-800">{rule.ruleType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Operator</p>
                          <p className="mt-0.5 text-sm font-medium text-slate-800">{rule.operator}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Value</p>
                          <p className="mt-0.5 text-sm font-medium text-slate-800">{rule.value}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Priority</p>
                          <p className="mt-0.5 text-sm font-medium text-slate-800">{rule.priority}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-xs text-slate-500">Error Message</p>
                          <p className="mt-0.5 text-sm text-slate-700">{rule.errorMessage}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Proposal History */}
            {historyProposals.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="mb-4 text-sm font-semibold text-slate-600 uppercase tracking-wide">Proposal History</h2>
                <div className="space-y-2">
                  {historyProposals.map((p) => (
                    <div key={p.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{p.summary}</p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {timeAgo(p.proposedAt)}
                          {p.reason && ` · ${p.reason}`}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold uppercase ${STATUS_STYLES[p.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!selectedBenefitId && !benefitsLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Select a benefit above to view and manage its eligibility rules.
          </div>
        )}
      </section>
    </main>
  );
}
