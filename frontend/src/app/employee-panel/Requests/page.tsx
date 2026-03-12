import Topbar from "../_components/layout/Topbar";
import Sidebar from "../_components/SideBar";
import StatusBadge from "../_components/benefits/StatusBadge";
import { benefits } from "@/lib/  mock-data";

const pendingRequests = benefits
  .filter((benefit) => benefit.status === "PENDING")
  .map((benefit, index) => ({
    id: `REQ-${String(index + 1).padStart(3, "0")}`,
    benefit: benefit.name,
    vendor: benefit.vendor,
    status: benefit.status,
    date: "2026-03-12",
  }));

export default async function RequestsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const submitted = params?.submitted === "true";

  return (
    <div className="flex min-h-screen bg-[#f6f7f9]">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <h1 className="text-4xl font-bold text-gray-900">Requests</h1>
          <p className="mt-2 text-lg text-gray-500">
            Track your submitted benefit requests
          </p>

          {submitted && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              Your benefit request was submitted successfully and is now pending
              review.
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-500">
                    <th className="pb-4 font-medium">Request ID</th>
                    <th className="pb-4 font-medium">Benefit</th>
                    <th className="pb-4 font-medium">Vendor</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {pendingRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-gray-100 text-base last:border-b-0"
                    >
                      <td className="py-4 text-gray-700">{request.id}</td>
                      <td className="py-4 font-medium text-gray-900">
                        {request.benefit}
                      </td>
                      <td className="py-4 text-gray-700">{request.vendor}</td>
                      <td className="py-4">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="py-4 text-gray-700">{request.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
