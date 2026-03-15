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
import { isAdminEmployee, isHrAdmin, isFinanceAdmin } from "@/app/admin-panel/_lib/access";

const STATUS_TONE: Record<string, string> = {
  pending: "bg-orange-50 text-orange-600 border-orange-200",
  awaiting_contract_acceptance: "bg-yellow-50 text-yellow-700 border-yellow-200",
  awaiting_hr_review: "bg-orange-50 text-orange-600 border-orange-200",
  awaiting_finance_review: "bg-blue-50 text-blue-700 border-blue-200",
  hr_approved: "bg-teal-50 text-teal-700 border-teal-200",
  finance_approved: "bg-teal-50 text-teal-700 border-teal-200",
  approved: "bg-green-50 text-green-600 border-green-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
  cancelled: "bg-gray-50 text-gray-500 border-gray-200",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  awaiting_contract_acceptance: "Contract Pending",
  awaiting_hr_review: "HR Review",
  awaiting_finance_review: "Finance Review",
  hr_approved: "HR Approved",
  finance_approved: "Finance Approved",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

type QueueTab = "all" | "hr" | "finance";

type ActionResult = { id: string; ok: boolean; message: string };

export default function PendingRequestsPage() {
  const { employee } = useCurrentEmployee();
  const isAdmin = isAdminEmployee(employee);
  const isHr = isHrAdmin(employee);
  const isFinance = isFinanceAdmin(employee);

  // Default queue based on current admin's role
  const defaultQueue: QueueTab = isFinance && !isHr ? "finance" : isHr ? "hr" : "all";
  const [activeQueue, setActiveQueue] = useState<QueueTab>(defaultQueue);

  const queryVars =
    activeQueue === "all"
      ? { status: "pending" as string, queue: null as string | null }
      : { status: null as string | null, queue: activeQueue as string };

  const { data: requestsData, loading: requestsLoading } =
    useGetAllBenefitRequestsQuery({
      variables: queryVars,
      skip: !isAdmin,
    });
  const { data: benefitsData } = useGetAdminBenefitsQuery({ skip: !isAdmin });
  const { data: employeesData } = useGetEmployeesQuery({ skip: !isAdmin });

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [declineModalId, setDeclineModalId] = useState<string | null>(null);
  const [results, setResults] = useState<ActionResult[]>([]);

  const makeRefetchOptions = () => ({
    refetchQueries: [
      { query: GetAllBenefitRequestsDocument, variables: queryVars },
    ],
  });

  const [approveRequest] = useApproveBenefitRequestMutation();
  const [declineRequest] = useDeclineBenefitRequestMutation();

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
      approvalPolicy: benefit?.approvalPolicy ?? "hr",
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
      await approveRequest({
        variables: { requestId },
        ...makeRefetchOptions(),
      });
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
        ...makeRefetchOptions(),
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

  const tabs: { key: QueueTab; label: string }[] = [
    { key: "all", label: "All Pending" },
    { key: "hr", label: "HR Queue" },
    { key: "finance", label: "Finance Queue" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl p-8">
          <h1 className="text-xl font-semibold text-gray-900">Pending Requests</h1>
          <p className="mt-1 text-sm text-gray-500">
            Approve or decline benefit requests from employees
          </p>

          {/* Queue filter tabs */}
          <div className="mt-6 flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveQueue(tab.key)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                  activeQueue === tab.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-gray-200 bg-white text-sm font-semibold text-gray-700">
                  <tr>
                    <th className="px-5 py-4">Benefit</th>
                    <th className="px-5 py-4">Employee</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Policy</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requestsLoading ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8">
                        <PageLoading inline message="Loading requests..." />
                      </td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td className="px-5 py-6 text-sm text-gray-500" colSpan={7}>
                        No requests in this queue.
                      </td>
                    </tr>
                  ) : (
                    requests.map((req) => {
                      const result = results.find((r) => r.id === req.id);
                      return (
                        <tr key={req.id} className="border-b border-gray-100 last:border-b-0">
                          <td className="px-5 py-4 font-medium text-gray-900">{req.benefitLabel}</td>
                          <td className="px-5 py-4 text-sm text-gray-700">{req.employeeName}</td>
                          <td className="px-5 py-4 text-sm text-gray-700">{req.requestDate}</td>
                          <td className="px-5 py-4 text-sm text-gray-700">
                            {req.requestedAmount != null ? (
                              <span>
                                {req.requestedAmount.toLocaleString()}
                                {req.repaymentMonths ? ` / ${req.repaymentMonths} mo` : ""}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {result ? (
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                result.ok
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-600 border-red-200"
                              }`}>
                                {result.message}
                              </span>
                            ) : (
                              <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                STATUS_TONE[req.status] ?? "bg-gray-100 text-gray-500 border-gray-200"
                              }`}>
                                {STATUS_LABELS[req.status] ?? req.status}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                              req.approvalPolicy === "dual"
                                ? "bg-purple-50 text-purple-700"
                                : req.approvalPolicy === "finance"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-gray-100 text-gray-600"
                            }`}>
                              {req.approvalPolicy === "dual" ? "Dual" : req.approvalPolicy === "finance" ? "Finance" : "HR"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleApprove(req.id)}
                                disabled={approvingId !== null || decliningId !== null}
                                className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 disabled:bg-gray-300"
                              >
                                {approvingId === req.id ? "Approving…" : "Approve"}
                              </button>
                              <button
                                type="button"
                                onClick={() => openDeclineModal(req.id)}
                                disabled={approvingId !== null || decliningId !== null}
                                className="inline-flex items-center rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
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
            <h2 className="text-lg font-semibold text-gray-900">Decline Request</h2>
            <p className="mt-1 text-sm text-gray-500">
              Optionally provide a reason for declining this request.
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Reason (optional)"
              rows={3}
              className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
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
