import { CheckCircle2, ChevronDown, XCircle } from "lucide-react";

const employeeDetails = [
  { label: "Name", value: "Alex Johnson" },
  { label: "Role", value: "Senior Software Engineer" },
  { label: "Department", value: "Engineering" },
  { label: "Responsibility Level", value: "Level 3" },
  { label: "OKR Submitted", value: "Yes" },
  { label: "Late Arrivals", value: "1 this month" },
  { label: "Tenure", value: "18 months" },
];

const benefits = [
  { benefit: "Gym Membership", status: "Eligible", blockingRule: "-", tone: "success" },
  { benefit: "Private Health Insurance", status: "Eligible", blockingRule: "-", tone: "success" },
  { benefit: "Digital Wellness", status: "Eligible", blockingRule: "-", tone: "success" },
  { benefit: "MacBook Subsidy", status: "Eligible", blockingRule: "-", tone: "success" },
  { benefit: "Remote Work Stipend", status: "Eligible", blockingRule: "-", tone: "success" },
  {
    benefit: "Travel Insurance",
    status: "Not Eligible",
    blockingRule: "OKR Submission",
    tone: "danger",
  },
];

function StatusBadge({ tone, label }: { tone: string; label: string }) {
  if (tone === "success") {
    return (
      <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
        <CheckCircle2 className="h-4 w-4" />
        {label}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-red-600">
      <XCircle className="h-4 w-4" />
      {label}
    </span>
  );
}

export default function EligibilityInspector() {
  return (
    <main className="flex-1 px-8 py-9">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">
            Employee Eligibility Inspector
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Review and override employee benefit eligibility
          </p>
        </div>

        <div className="mb-6 max-w-md">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Select Employee
          </label>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <span>Alex Johnson - Senior Software Engineer</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">Employee Profile</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {employeeDetails.map((item) => (
              <div key={item.label}>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Benefits Eligibility</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-slate-200 bg-white text-sm font-semibold text-slate-700">
                <tr>
                  <th className="px-5 py-4">Benefit</th>
                  <th className="px-5 py-4">Eligibility Status</th>
                  <th className="px-5 py-4">Blocking Rule</th>
                  <th className="px-5 py-4">Override</th>
                </tr>
              </thead>
              <tbody>
                {benefits.map((row) => (
                  <tr
                    key={row.benefit}
                    className="border-b border-slate-200 last:border-b-0"
                  >
                    <td className="px-5 py-5 text-sm font-medium text-slate-900">
                      {row.benefit}
                    </td>
                    <td className="px-5 py-5">
                      <StatusBadge tone={row.tone} label={row.status} />
                    </td>
                    <td className="px-5 py-5 text-sm text-slate-500">
                      {row.blockingRule}
                    </td>
                    <td className="px-5 py-5">
                      <button
                        type="button"
                        className="text-sm font-medium text-blue-600 transition hover:text-blue-700 active:opacity-80"
                      >
                        Override
                      </button>
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
