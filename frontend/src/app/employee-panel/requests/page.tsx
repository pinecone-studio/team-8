"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye } from "lucide-react";
import Topbar from "../_components/layout/Topbar";
import Sidebar from "../_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import {
  useGetBenefitRequestsQuery,
  useGetBenefitsQuery,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/use-current-employee";

const statusTone: Record<string, string> = {
  pending: "bg-orange-50 text-orange-600 border-orange-200",
  approved: "bg-green-50 text-green-600 border-green-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
  declined: "bg-red-50 text-red-600 border-red-200",
  cancelled: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function RequestsPage() {
  const searchParams = useSearchParams();
  const submitted = searchParams.get("submitted") === "true";
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
    const name = benefit?.name ?? request.benefitId;
    const vendor = benefit?.vendorName ?? "";
    const benefitLabel = vendor ? `${name} - ${vendor}` : name;
    return {
      id: request.id,
      benefitId: request.benefitId,
      benefitLabel,
      status: request.status,
      requestDate: request.createdAt?.split("T")[0] ?? "—",
      reviewer: request.reviewedBy ?? "—",
    };
  });

  return (
    <div className="flex min-h-screen bg-[#f6f7f9]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
          <p className="mt-2 text-lg text-gray-500">
            Track the status of your benefit requests
          </p>

          {submitted && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              Request submitted successfully. It will appear below with PENDING status until an admin approves it.
            </div>
          )}

          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-gray-200 bg-white text-sm font-semibold text-gray-700">
                  <tr>
                    <th className="px-5 py-4">Benefit</th>
                    <th className="px-5 py-4">Request Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Reviewer</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeLoading || requestsLoading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8">
                        <PageLoading inline message="Loading requests..." />
                      </td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td className="px-5 py-6 text-gray-500" colSpan={5}>
                        No requests found.
                      </td>
                    </tr>
                  ) : (
                    requests.map((request) => (
                      <tr
                        key={request.id}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <td className="px-5 py-5 font-medium text-gray-900">
                          {request.benefitLabel}
                        </td>
                        <td className="px-5 py-5 text-gray-700">
                          {request.requestDate}
                        </td>
                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${
                              statusTone[request.status.toLowerCase()] ??
                              "bg-gray-100 text-gray-500 border-gray-200"
                            }`}
                          >
                            {request.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-5 text-gray-700">
                          {request.reviewer}
                        </td>
                        <td className="px-5 py-5">
                          <Link
                            href={`/employee-panel/benefits/${request.benefitId}`}
                            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50 hover:text-blue-700 active:scale-95 active:bg-blue-100 active:text-blue-800"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
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
