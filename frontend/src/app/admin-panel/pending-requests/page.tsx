"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Sidebar from "../_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import {
  useGetAllBenefitRequestsQuery,
  useGetBenefitsQuery,
  useGetEmployeesQuery,
  useApproveBenefitRequestMutation,
  GetAllBenefitRequestsDocument,
} from "@/graphql/generated/graphql";

const statusTone: Record<string, string> = {
  pending: "bg-orange-50 text-orange-600 border-orange-200",
  approved: "bg-green-50 text-green-600 border-green-200",
  declined: "bg-red-50 text-red-600 border-red-200",
};

export default function PendingRequestsPage() {
  const { user } = useUser();
  const reviewedBy = user?.fullName ?? "Admin";

  const { data: requestsData, loading: requestsLoading } =
    useGetAllBenefitRequestsQuery({
      variables: { status: "pending" },
    });
  const { data: benefitsData } = useGetBenefitsQuery();
  const { data: employeesData } = useGetEmployeesQuery();

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approveRequest] = useApproveBenefitRequestMutation({
    refetchQueries: [{ query: GetAllBenefitRequestsDocument, variables: { status: "pending" } }],
  });

  const benefitsById = new Map(
    (benefitsData?.benefits ?? []).map((b) => [b.id, b])
  );
  const employeesById = new Map(
    (employeesData?.getEmployees ?? []).map((e) => [e.id, e])
  );

  const requests = (requestsData?.allBenefitRequests ?? []).map((req) => {
    const benefit = benefitsById.get(req.benefitId);
    const employee = employeesById.get(req.employeeId);
    const benefitName = benefit?.name ?? req.benefitId;
    const vendor = benefit?.vendorName ?? "";
    const benefitLabel = vendor ? `${benefitName} - ${vendor}` : benefitName;
    return {
      id: req.id,
      benefitLabel,
      employeeName: employee?.name ?? req.employeeId,
      requestDate: req.createdAt?.split("T")[0] ?? "—",
      status: req.status,
    };
  });

  const handleApprove = async (requestId: string) => {
    setApprovingId(requestId);
    try {
      await approveRequest({
        variables: { requestId, reviewedBy },
      });
    } catch {
      // Error handled by Apollo
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="p-8">
          <h1 className="text-xl font-semibold text-gray-900">
            Pending Requests
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Approve or decline benefit requests from employees
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-gray-200 bg-white text-sm font-semibold text-gray-700">
                  <tr>
                    <th className="px-5 py-4">Benefit</th>
                    <th className="px-5 py-4">Employee</th>
                    <th className="px-5 py-4">Request Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requestsLoading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8">
                        <PageLoading inline message="Loading pending requests..." />
                      </td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td className="px-5 py-6 text-gray-500" colSpan={5}>
                        No pending requests.
                      </td>
                    </tr>
                  ) : (
                    requests.map((req) => (
                      <tr
                        key={req.id}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <td className="px-5 py-5 font-medium text-gray-900">
                          {req.benefitLabel}
                        </td>
                        <td className="px-5 py-5 text-gray-700">
                          {req.employeeName}
                        </td>
                        <td className="px-5 py-5 text-gray-700">
                          {req.requestDate}
                        </td>
                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${
                              statusTone[req.status.toLowerCase()] ??
                              "bg-gray-100 text-gray-500 border-gray-200"
                            }`}
                          >
                            {req.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-5">
                          <button
                            type="button"
                            onClick={() => handleApprove(req.id)}
                            disabled={approvingId !== null}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98] active:bg-blue-800 disabled:bg-gray-300 disabled:active:scale-100"
                          >
                            {approvingId === req.id ? "Approving..." : "Approve"}
                          </button>
                        </td>
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
