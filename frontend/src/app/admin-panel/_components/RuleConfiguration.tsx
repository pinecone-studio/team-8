import { ChevronDown, Plus, Trash2 } from "lucide-react";

const rules = [
  {
    id: 1,
    type: "Employment Status",
    displayName: "Employment Status",
    description: "Must be a permanent employee",
  },
  {
    id: 2,
    type: "OKR Submission",
    displayName: "OKR Submission",
    description: "Must have submitted current quarter OKRs",
  },
  {
    id: 3,
    type: "Responsibility Level",
    displayName: "Responsibility Level",
    description: "Requires minimum level 3 responsibility",
  },
];

export default function RuleConfiguration() {
  return (
    <main className="flex-1 px-8 py-9">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-[2.25rem] font-semibold tracking-[-0.02em] text-slate-900">
            Rule Configuration
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Manage eligibility rules for benefits
          </p>
        </div>

        <div className="mb-6 max-w-sm">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Select Benefit
          </label>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <span>Gym Membership - PineFit</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Eligibility Rules</h2>
              <p className="mt-2 text-sm text-slate-500">Gym Membership - PineFit</p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Rule
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Rule {rule.id}</p>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Rule Type
                    </label>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      {rule.type}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Display Name
                    </label>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      {rule.displayName}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {rule.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
