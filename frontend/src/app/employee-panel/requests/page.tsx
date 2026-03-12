"use client";

import Topbar from "../_components/layout/Topbar";
import Sidebar from "../_components/SideBar";
import {
  useGetBenefitRequestsQuery,
  useGetBenefitsQuery,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/use-current-employee";

const statusTone: Record<string, string> = {
  pending: "bg-orange-50 text-orange-600",
  approved: "bg-green-50 text-green-600",
  rejected: "bg-red-50 text-red-600",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function RequestsPage() {
  const { employeeId, loading: employeeLoading } = useCurrentEmployee();
  const { data: requestsData, loading: requestsLoading } =
    useGetBenefitRequestsQuery({
      variables: { employeeId: employeeId ?? "" },
      skip: !employeeId,
    });
  const { data: benefitsData } = useGetBenefitsQuery();

  const benefitsById = new Map(
    (benefitsData?.benefits ?? []).map((benefit) => [benefit.id, benefit])
  );

  const requests = (requestsData?.benefitRequests ?? []).map((request) => {
    const benefit = benefitsById.get(request.benefitId);
    return {
      id: request.id,
      benefit: benefit?.name ?? request.benefitId,
      vendor: benefit?.vendorName ?? "Vendor",
      status: request.status,
      date: request.createdAt?.split("T")[0] ?? "-",
    };
  });

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
                  {employeeLoading || requestsLoading ? (
                    <tr className="border-b border-gray-100 text-base">
                      <td className="py-4 text-gray-500" colSpan={5}>
                        Loading requests...
                      </td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr className="border-b border-gray-100 text-base">
                      <td className="py-4 text-gray-500" colSpan={5}>
                        No requests found.
                      </td>
                    </tr>
                  ) : (
                    requests.map((request) => (
                      <tr
                        key={request.id}
                        className="border-b border-gray-100 text-base"
                      >
                        <td className="py-4 text-gray-700">{request.id}</td>
                        <td className="py-4 font-medium text-gray-900">
                          {request.benefit}
                        </td>
                        <td className="py-4 text-gray-700">{request.vendor}</td>
                        <td className="py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                              statusTone[request.status] ??
                              "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-700">{request.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
