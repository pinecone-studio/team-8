"use client";

import { useState } from "react";
import { ChevronDown, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import PageLoading from "@/app/_components/PageLoading";
import {
  useGetAdminBenefitsQuery,
  useGetEligibilityRulesQuery,
  useCreateEligibilityRuleMutation,
  useUpdateEligibilityRuleMutation,
  useDeleteEligibilityRuleMutation,
  GetEligibilityRulesDocument,
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

export default function RuleConfiguration() {
  const { employee: me } = useCurrentEmployee();
  const isHr = isHrAdmin(me);

  const [selectedBenefitId, setSelectedBenefitId] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: benefitsData, loading: benefitsLoading } = useGetAdminBenefitsQuery({
    skip: !isHr,
  });

  const { data: rulesData, loading: rulesLoading } = useGetEligibilityRulesQuery({
    variables: { benefitId: selectedBenefitId },
    skip: !selectedBenefitId || !isHr,
  });

  const refetchOptions = {
    refetchQueries: selectedBenefitId
      ? [{ query: GetEligibilityRulesDocument, variables: { benefitId: selectedBenefitId } }]
      : [],
  };

  const [createRule, { loading: creating }] = useCreateEligibilityRuleMutation(refetchOptions);
  const [updateRule] = useUpdateEligibilityRuleMutation(refetchOptions);
  const [deleteRule] = useDeleteEligibilityRuleMutation(refetchOptions);

  const benefits = benefitsData?.adminBenefits ?? [];
  const rules = rulesData?.eligibilityRules ?? [];
  const selectedBenefit = benefits.find((b) => b.id === selectedBenefitId);

  const handleCreate = async () => {
    if (!selectedBenefitId || !form.value || !form.errorMessage) {
      setActionError("Please fill in all required fields.");
      return;
    }
    setActionError(null);
    try {
      await createRule({
        variables: {
          input: {
            benefitId: selectedBenefitId,
            ruleType: form.ruleType,
            operator: form.operator,
            value: form.value,
            errorMessage: form.errorMessage,
            priority: form.priority,
          },
        },
      });
      setForm(defaultForm);
      setShowAddForm(false);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to create rule");
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await updateRule({ variables: { id, input: { isActive: !isActive } } });
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to update rule");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRule({ variables: { id } });
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to delete rule");
    }
  };

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
          <h1 className="text-xl font-semibold text-gray-900">
            Rule Configuration
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage eligibility rules for benefits
          </p>
        </div>

        <div className="mb-6 max-w-sm">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Select Benefit
          </label>
          <div className="relative">
            <select
              value={selectedBenefitId}
              onChange={(e) => {
                setSelectedBenefitId(e.target.value);
                setShowAddForm(false);
                setActionError(null);
              }}
              disabled={benefitsLoading}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 disabled:opacity-70"
            >
              <option value="">
                {benefitsLoading ? "Loading…" : "Select a benefit"}
              </option>
              {benefits.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                  {b.vendorName ? ` – ${b.vendorName}` : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {selectedBenefitId && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Eligibility Rules
                </h2>
                {selectedBenefit && (
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedBenefit.name}
                    {selectedBenefit.vendorName
                      ? ` – ${selectedBenefit.vendorName}`
                      : ""}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAddForm(true);
                  setActionError(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98] active:bg-blue-800"
              >
                <Plus className="h-4 w-4" />
                Add Rule
              </button>
            </div>

            {actionError && (
              <p className="mt-3 text-sm text-rose-600">{actionError}</p>
            )}

            {showAddForm && (
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="mb-3 text-sm font-semibold text-blue-900">
                  New Rule
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Rule Type
                    </label>
                    <select
                      value={form.ruleType}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, ruleType: e.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                    >
                      {RULE_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Operator
                    </label>
                    <select
                      value={form.operator}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, operator: e.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                    >
                      {OPERATORS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Value *
                    </label>
                    <input
                      value={form.value}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, value: e.target.value }))
                      }
                      placeholder='e.g. "active" or 2'
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Priority
                    </label>
                    <input
                      type="number"
                      value={form.priority}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          priority: Number(e.target.value),
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Error Message *
                    </label>
                    <input
                      value={form.errorMessage}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          errorMessage: e.target.value,
                        }))
                      }
                      placeholder="Shown to employee when rule fails"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={creating}
                    className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {creating ? "Saving…" : "Save Rule"}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-5 space-y-3">
              {rulesLoading ? (
                <PageLoading inline message="Loading rules…" />
              ) : rules.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No rules configured for this benefit.
                </p>
              ) : (
                rules.map((rule, idx) => (
                  <div
                    key={rule.id}
                    className={`rounded-2xl border p-4 ${
                      rule.isActive
                        ? "border-slate-200 bg-white"
                        : "border-slate-100 bg-slate-50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">
                        Rule {idx + 1}
                        {!rule.isActive && (
                          <span className="ml-2 text-xs font-normal text-slate-400">
                            (disabled)
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          title={rule.isActive ? "Disable rule" : "Enable rule"}
                          onClick={() => handleToggle(rule.id, rule.isActive)}
                          className="text-slate-400 transition hover:text-slate-600"
                        >
                          {rule.isActive ? (
                            <ToggleRight className="h-5 w-5 text-blue-500" />
                          ) : (
                            <ToggleLeft className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          type="button"
                          title="Delete rule"
                          onClick={() => handleDelete(rule.id)}
                          className="text-red-400 transition hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div>
                        <p className="text-xs text-slate-500">Rule Type</p>
                        <p className="mt-0.5 text-sm font-medium text-slate-800">
                          {rule.ruleType}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Operator</p>
                        <p className="mt-0.5 text-sm font-medium text-slate-800">
                          {rule.operator}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Value</p>
                        <p className="mt-0.5 text-sm font-medium text-slate-800">
                          {rule.value}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Priority</p>
                        <p className="mt-0.5 text-sm font-medium text-slate-800">
                          {rule.priority}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-slate-500">Error Message</p>
                        <p className="mt-0.5 text-sm text-slate-700">
                          {rule.errorMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
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
