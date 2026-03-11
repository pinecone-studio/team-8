import { Eye } from "lucide-react";

const requests = [
  {
    id: 1,
    benefit: "Gym Membership - PineFit",
    requestDate: "2026-03-08",
    status: "APPROVED",
    reviewer: "Sarah Chen",
  },
  {
    id: 2,
    benefit: "MacBook Subsidy",
    requestDate: "2026-03-09",
    status: "PENDING",
    reviewer: "-",
  },
  {
    id: 3,
    benefit: "Digital Wellness",
    requestDate: "2026-03-08",
    status: "APPROVED",
    reviewer: "Sarah Chen",
  },
];

const statusStyles = {
  APPROVED: "border border-green-200 bg-green-50 text-green-700",
  PENDING: "border border-orange-200 bg-orange-50 text-orange-600",
} as const;

export default function Requests() {
  return (
    <main className="flex-1 px-8 py-9">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-[2.25rem] font-semibold tracking-[-0.02em] text-slate-900">
            My Requests
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Track the status of your benefit requests
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-slate-200 bg-white">
                <tr className="text-sm font-semibold text-slate-700">
                  <th className="px-6 py-5">Benefit</th>
                  <th className="px-6 py-5">Request Date</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Reviewer</th>
                  <th className="px-6 py-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-slate-200 last:border-b-0"
                  >
                    <td className="px-6 py-6 text-lg font-medium text-slate-900">
                      {request.benefit}
                    </td>
                    <td className="px-6 py-6 text-base text-slate-500">
                      {request.requestDate}
                    </td>
                    <td className="px-6 py-6">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[request.status]}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-base text-slate-500">
                      {request.reviewer}
                    </td>
                    <td className="px-6 py-6">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 text-base font-semibold text-blue-600 transition hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                        View
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
