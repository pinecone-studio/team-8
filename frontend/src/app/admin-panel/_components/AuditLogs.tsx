import { Download, Filter } from "lucide-react";

type LogTone = "neutral" | "success" | "warning";

type AuditLog = {
  timestamp: string;
  employee: string;
  benefit: string;
  action: string;
  triggered: string;
  tone: LogTone;
};

const logs: AuditLog[] = [
  {
    timestamp: "2026-03-11 09:15:23",
    employee: "Alex Johnson",
    benefit: "MacBook Subsidy",
    action: "Request Submitted",
    triggered: "-",
    tone: "neutral",
  },
  {
    timestamp: "2026-03-11 08:45:12",
    employee: "Maria Garcia",
    benefit: "Stock Options",
    action: "Eligibility Checked",
    triggered: "Responsibility Level - FAILED",
    tone: "neutral",
  },
  {
    timestamp: "2026-03-10 16:30:45",
    employee: "Alex Johnson",
    benefit: "Gym Membership",
    action: "Request Approved",
    triggered: "-",
    tone: "success",
  },
  {
    timestamp: "2026-03-10 14:22:18",
    employee: "Emily Chen",
    benefit: "Professional Development",
    action: "Eligibility Override",
    triggered: "Manual approval by Sarah Chen",
    tone: "warning",
  },
  {
    timestamp: "2026-03-10 11:05:33",
    employee: "James Wilson",
    benefit: "Travel Insurance",
    action: "Eligibility Checked",
    triggered: "OKR Submission - FAILED",
    tone: "neutral",
  },
  {
    timestamp: "2026-03-09 17:48:02",
    employee: "Alex Johnson",
    benefit: "Remote Work Stipend",
    action: "Request Approved",
    triggered: "-",
    tone: "success",
  },
];

const toneStyles: Record<LogTone, string> = {
  neutral: "bg-slate-100 text-slate-600",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-orange-100 text-orange-700",
};

export default function AuditLogs() {
  return (
    <main className="flex-1 px-8 py-9">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[2.25rem] font-semibold tracking-[-0.02em] text-slate-900">
              Audit Logs
            </h1>
            <p className="mt-2 text-lg text-slate-500">
              Track all system decisions and eligibility evaluations
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] active:bg-slate-100"
          >
            <Download className="h-4 w-4" />
            Export Logs
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="grid gap-4 md:grid-cols-[40px_1fr_1fr_1fr]">
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
              <Filter className="h-4 w-4 text-slate-400" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Employee
              </label>
              <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-400">
                Filter by employee...
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Benefit
              </label>
              <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-400">
                Filter by benefit...
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Date Range
              </label>
              <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                Last 7 days
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-slate-200 bg-white text-sm font-semibold text-slate-700">
                <tr>
                  <th className="px-5 py-4">Timestamp</th>
                  <th className="px-5 py-4">Employee</th>
                  <th className="px-5 py-4">Benefit</th>
                  <th className="px-5 py-4">Action</th>
                  <th className="px-5 py-4">Rule Triggered</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((row) => (
                  <tr key={`${row.timestamp}-${row.employee}`} className="border-b border-slate-200 last:border-b-0">
                    <td className="px-5 py-5 text-sm text-slate-500">{row.timestamp}</td>
                    <td className="px-5 py-5 text-sm font-medium text-slate-900">{row.employee}</td>
                    <td className="px-5 py-5 text-sm text-slate-700">{row.benefit}</td>
                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${toneStyles[row.tone]}`}
                      >
                        {row.action}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-sm text-slate-500">{row.triggered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-500">Showing 6 of 6 logs</p>
      </section>
    </main>
  );
}
