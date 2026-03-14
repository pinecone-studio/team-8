"use client";

import { useState } from "react";
import Sidebar from "../_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import {
  useGetAllBenefitRequestsQuery,
  useGetAdminBenefitsQuery,
  useGetEmployeesQuery,
  useApproveBenefitRequestMutation,
  useDeclineBenefitRequestMutation,
  GetAllBenefitRequestsDocument,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isAdminEmployee } from "@/app/admin-panel/_lib/access";

const statusTone: Record<string, string> = {
  pending: "bg-orange-50 text-orange-600 border-orange-200",
  approved: "bg-green-50 text-green-600 border-green-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
  cancelled: "bg-gray-50 text-gray-500 border-gray-200",
};

type ActionResult = { id: string; ok: boolean; message: string };

export default function PendingRequestsPage() {
  const { employee } = useCurrentEmployee();
  const isAdmin = isAdminEmployee(employee);

  const { data: requestsData, loading: requestsLoading } =
    useGetAllBenefitRequestsQuery({
      variables: { status: "pending" },
      skip: !isAdmin,
    });
  const { data: benefitsData } = useGetAdminBenefitsQuery({ skip: !isAdmin });
  const { data: employeesData } = useGetEmployeesQuery({ skip: !isAdmin });

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [declineModalId, setDeclineModalId] = useState<string | null>(null);
  const [results, setResults] = useState<ActionResult[]>([]);

  const refetchOptions = {
    refetchQueries: [
      { query: GetAllBenefitRequestsDocument, variables: { status: "pending" } },
    ],
  };

  const [approveRequest] = useApproveBenefitRequestMutation(refetchOptions);
  const [declineRequest] = useDeclineBenefitRequestMutation(refetchOptions);

  const benefitsById = new Map(
    (benefitsData?.adminBenefits ?? []).map((b) => [b.id, b]),
  );
  const employeesById = new Map(
    (employeesData?.getEmployees ?? []).map((e) => [e.id, e]),
  );

  const requests = (requestsData?.allBenefitRequests ?? []).map((req) => {
    const benefit = benefitsById.get(req.benefitId);
    const emp = employeesById.get(req.employeeId);
    const benefitName = benefit?.name ?? req.benefitId;
    const vendor = benefit?.vendorName ?? "";
    const benefitLabel = vendor ? `${benefitName} – ${vendor}` : benefitName;
    return {
      id: req.id,
      benefitLabel,
      employeeName: emp?.name ?? req.employeeId,
      requestDate: req.createdAt?.split("T")[0] ?? "—",
      status: req.status,
      requestedAmount: req.requestedAmount ?? null,
      repaymentMonths: req.repaymentMonths ?? null,
    };
  });

  const addResult = (id: string, ok: boolean, message: string) => {
    setResults((prev) => [...prev.filter((r) => r.id !== id), { id, ok, message }]);
    setTimeout(() => setResults((prev) => prev.filter((r) => r.id !== id)), 4000);
  };

  const handleApprove = async (requestId: string) => {
    setApprovingId(requestId);
    try {
      await approveRequest({ variables: { requestId } });
      addResult(requestId, true, "Approved");
    } catch (e) {
      addResult(requestId, false, e instanceof Error ? e.message : "Failed");
    } finally {
      setApprovingId(null);
    }
  };

  const openDeclineModal = (requestId: string) => {
    setDeclineModalId(requestId);
    setDeclineReason("");
  };

  const handleDecline = async () => {
    if (!declineModalId) return;
    setDecliningId(declineModalId);
    try {
      await declineRequest({
        variables: { requestId: declineModalId, reason: declineReason || null },
      });
      addResult(declineModalId, true, "Declined");
      setDeclineModalId(null);
    } catch (e) {
      addResult(declineModalId, false, e instanceof Error ? e.message : "Failed");
    } finally {
      setDecliningId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-muted-foreground">Admin access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl p-8">
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
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requestsLoading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8">
                        <PageLoading inline message="Loading pending requests..." />
                      </td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td className="px-5 py-6 text-gray-500" colSpan={6}>
                        No pending requests.
                      </td>
                    </tr>
                  ) : (
                    requests.map((req) => {
                      const result = results.find((r) => r.id === req.id);
                      return (
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
                          <td className="px-5 py-5 text-gray-700 text-sm">
                            {req.requestedAmount != null ? (
                              <span>
                                {req.requestedAmount.toLocaleString()}
                                {req.repaymentMonths
                                  ? ` / ${req.repaymentMonths} mo`
                                  : ""}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-5 py-5">
                            {result ? (
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${
                                  result.ok
                                    ? "bg-green-50 text-green-600 border-green-200"
                                    : "bg-red-50 text-red-600 border-red-200"
                                }`}
                              >
                                {result.message}
                              </span>
                            ) : (
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${
                                  statusTone[req.status.toLowerCase()] ??
                                  "bg-gray-100 text-gray-500 border-gray-200"
                                }`}
                              >
                                {req.status.charAt(0).toUpperCase() +
                                  req.status.slice(1)}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleApprove(req.id)}
                                disabled={
                                  approvingId !== null || decliningId !== null
                                }
                                className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98] active:bg-blue-800 disabled:bg-gray-300 disabled:active:scale-100"
                              >
                                {approvingId === req.id
                                  ? "Approving…"
                                  : "Approve"}
                              </button>
                              <button
                                type="button"
                                onClick={() => openDeclineModal(req.id)}
                                disabled={
                                  approvingId !== null || decliningId !== null
                                }
                                className="inline-flex items-center rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                              >
                                Decline
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Decline modal */}
      {declineModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Decline Request
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Optionally provide a reason for declining this request.
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Reason (optional)"
              rows={3}
              className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeclineModalId(null)}
                disabled={decliningId !== null}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDecline}
                disabled={decliningId !== null}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {decliningId ? "Declining…" : "Confirm Decline"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
