"use client";

import { useState } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, X } from "lucide-react";
import Sidebar from "../_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import {
  useGetBenefitRequestsQuery,
  useGetBenefitsQuery,
  useCancelBenefitRequestMutation,
  GetBenefitRequestsDocument,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/use-current-employee";

const statusTone: Record<string, string> = {
  pending: "bg-orange-50 text-orange-600 border-orange-200",
  approved: "bg-green-50 text-green-600 border-green-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
  declined: "bg-red-50 text-red-600 border-red-200",
  cancelled: "bg-gray-100 text-gray-500 border-gray-200",
};

function RequestsContent() {
  const searchParams = useSearchParams();
  const submitted = searchParams.get("submitted") === "true";
  const { loading: employeeLoading } = useCurrentEmployee();
  const { data: requestsData, loading: requestsLoading } =
    useGetBenefitRequestsQuery({
      // After submit redirect, refetch so the new PENDING request appears
      fetchPolicy: submitted ? "network-only" : "cache-first",
    });
  const { data: benefitsData } = useGetBenefitsQuery();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [cancelRequest] = useCancelBenefitRequestMutation({
    refetchQueries: [{ query: GetBenefitRequestsDocument }],
    onCompleted: () => {
      setCancellingId(null);
      setFeedback({ type: "success", message: "Request cancelled." });
      setTimeout(() => setFeedback(null), 4000);
    },
    onError: () => {
      setCancellingId(null);
      setFeedback({ type: "error", message: "Failed to cancel. Please try again." });
      setTimeout(() => setFeedback(null), 5000);
    },
  });

  const benefitsById = new Map(
    (benefitsData?.benefits ?? []).map((benefit) => [benefit.id, benefit]),
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
        <main className="p-8">
          <h1 className="text-xl font-semibold text-gray-900">My Requests</h1>
          <p className="mt-1 text-sm text-gray-500">
            Benefit request status
          </p>

          {submitted && (
            <div className="mt-4 rounded-lg border border-green-100 bg-green-50/80 px-3 py-2 text-xs text-green-700">
              Submitted. Shown below as PENDING until approved.
            </div>
          )}

          {feedback && (
            <div
              className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
                feedback.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <div className="mt-6 overflow-hidden rounded-lg border border-gray-100 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-gray-100 text-xs font-medium uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Benefit</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Reviewer</th>
                    <th className="px-4 py-3 w-16" />
                  </tr>
                </thead>
                <tbody>
                  {employeeLoading || requestsLoading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10">
                        <PageLoading inline message="Loading..." />
                      </td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td className="px-4 py-8 text-center" colSpan={5}>
                        <p className="text-sm text-gray-500">No requests yet.</p>
                        <Link
                          href="/employee-panel/mybenefits"
                          className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                        >
                          Browse benefits →
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    requests.map((request) => (
                      <tr
                        key={request.id}
                        className="border-b border-gray-50 last:border-b-0 transition-colors hover:bg-gray-50/50"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {request.benefitLabel}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {request.requestDate}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                              statusTone[request.status.toLowerCase()] ??
                              "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {request.reviewer}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/employee-panel/benefits/${request.benefitId}`}
                              className="inline-flex items-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                            {request.status.toLowerCase() === "pending" && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (!window.confirm("Cancel this benefit request?")) return;
                                  setCancellingId(request.id);
                                  cancelRequest({ variables: { requestId: request.id } });
                                }}
                                disabled={cancellingId === request.id}
                                className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                              >
                                <X className="h-4 w-4" />
                                {cancellingId === request.id ? "Cancelling..." : "Cancel"}
                              </button>
                            )}
                          </div>
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

export default function RequestsPage() {
  return (
    <Suspense fallback={<PageLoading message="Loading..." />}>
      <RequestsContent />
    </Suspense>
  );
}
