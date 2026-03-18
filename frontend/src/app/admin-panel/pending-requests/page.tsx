"use client";

import { useState } from "react";
import { CheckCircle, FileText } from "lucide-react";
import {
  useGetAllBenefitRequestsQuery,
  useGetAdminBenefitsQuery,
  useGetEmployeesQuery,
  useApproveBenefitRequestMutation,
  useDeclineBenefitRequestMutation,
  GetAllBenefitRequestsDocument,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { getContractProxyUrl } from "@/lib/contracts";
import {
  isAdminEmployee,
  isHrAdmin,
  isFinanceAdmin,
} from "@/app/admin-panel/_lib/access";

const STATUS_TONE: Record<string, string> = {
  pending: "bg-orange-50 text-orange-600 border-orange-200",
  awaiting_contract_acceptance:
    "bg-yellow-50 text-yellow-700 border-yellow-200",
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

const POLICY_STYLE: Record<
  string,
  { cls: string; label: string; hint: string }
> = {
  hr: {
    cls: "bg-gray-100 text-gray-700",
    label: "HR",
    hint: "HR approval required",
  },
  finance: {
    cls: "bg-blue-50 text-blue-700",
    label: "Finance",
    hint: "Finance approval required",
  },
  dual: {
    cls: "bg-purple-50 text-purple-700",
    label: "Dual",
    hint: "HR + Finance approval required",
  },
};

type QueueTab = "all" | "hr" | "finance";
type ActionResult = { id: string; ok: boolean; message: string };

type RequestRow = {
  id: string;
  benefitId: string;
  benefitLabel: string;
  benefitName: string;
  vendorName: string;
  subsidyPercent: number | null;
  employeeName: string;
  employeeEmail: string;
  employeeDepartment: string;
  employeeRole: string;
  employeeHireDate: string;
  requestDate: string;
  status: string;
  approvalPolicy: string;
  unitPrice: number | null;
  requestedAmount: number | null;
  repaymentMonths: number | null;
  viewContractUrl: string | null;
  employeeSignedContractViewUrl: string | null;
  employeeSignedContractFileName: string | null;
  employeeSignedContractUploadedAt: string | null;
  contractAcceptedAt: string | null;
  contractVersionAccepted: string | null;
  employeeApprovedAt: string | null;
  reviewedBy: string | null;
  requiresContract: boolean;
  updatedAt: string;
};

export default function PendingRequestsPage() {
  const { employee } = useCurrentEmployee();
  const isAdmin = isAdminEmployee(employee);
  const isHr = isHrAdmin(employee);
  const isFinance = isFinanceAdmin(employee);

  const defaultQueue: QueueTab = isFinance && !isHr ? "finance" : "hr";
  const [activeQueue, setActiveQueue] = useState<QueueTab>(defaultQueue);

  const currentVars =
    activeQueue === "all"
      ? { status: "pending" as string, queue: null as string | null }
      : { status: null as string | null, queue: activeQueue as string };

  const { data: requestsData, loading: requestsLoading } =
    useGetAllBenefitRequestsQuery({
      variables: currentVars,
      skip: !isAdmin,
    });

  const { data: hrCountData } = useGetAllBenefitRequestsQuery({
    variables: { queue: "hr", status: null },
    skip: !isHr,
  });
  const { data: financeCountData } = useGetAllBenefitRequestsQuery({
    variables: { queue: "finance", status: null },
    skip: !isFinance,
  });

  const hrCount = hrCountData?.allBenefitRequests?.length ?? 0;
  const financeCount = financeCountData?.allBenefitRequests?.length ?? 0;

  const { data: benefitsData } = useGetAdminBenefitsQuery({ skip: !isAdmin });
  const { data: employeesData } = useGetEmployeesQuery({ skip: !isAdmin });

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [declineModalId, setDeclineModalId] = useState<string | null>(null);
  const [results, setResults] = useState<ActionResult[]>([]);
  const [detailReq, setDetailReq] = useState<RequestRow | null>(null);

  const makeRefetch = () => ({
    refetchQueries: [
      { query: GetAllBenefitRequestsDocument, variables: currentVars },
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

  const requests: RequestRow[] = (requestsData?.allBenefitRequests ?? []).map(
    (req) => {
      const emp = employeesById.get(req.employeeId);
      const benefit = benefitsById.get(req.benefitId);
      const benefitName = benefit?.name ?? req.benefitId;
      const vendor = benefit?.vendorName ?? "";
      return {
        id: req.id,
        benefitId: req.benefitId,
        benefitLabel: vendor ? `${benefitName} – ${vendor}` : benefitName,
        benefitName,
        vendorName: vendor,
        subsidyPercent: benefit?.subsidyPercent ?? null,
        employeeName: emp?.name ?? req.employeeId,
        employeeEmail: emp?.email ?? "",
        employeeDepartment: emp?.department ?? "",
        employeeRole: emp?.role ?? "",
        employeeHireDate: emp?.hireDate ? emp.hireDate.split("T")[0] : "",
        requestDate: req.createdAt?.split("T")[0] ?? "—",
        status: req.status,
        approvalPolicy: benefit?.approvalPolicy ?? "hr",
        unitPrice: benefit?.unitPrice ?? null,
        requestedAmount: req.requestedAmount ?? null,
        repaymentMonths: req.repaymentMonths ?? null,
        viewContractUrl: req.viewContractUrl ?? null,
        employeeSignedContractViewUrl:
          req.employeeSignedContract?.viewUrl ?? null,
        employeeSignedContractFileName:
          req.employeeSignedContract?.fileName ?? null,
        employeeSignedContractUploadedAt:
          req.employeeSignedContract?.uploadedAt ?? null,
        contractAcceptedAt: req.contractAcceptedAt ?? null,
        contractVersionAccepted: req.contractVersionAccepted ?? null,
        employeeApprovedAt: req.employeeApprovedAt ?? null,
        reviewedBy: req.reviewedBy ?? null,
        requiresContract: benefit?.requiresContract ?? false,
        updatedAt: req.updatedAt?.split("T")[0] ?? "—",
      };
    },
  );

  const addResult = (id: string, ok: boolean, message: string) => {
    setResults((prev) => [
      ...prev.filter((r) => r.id !== id),
      { id, ok, message },
    ]);
    setTimeout(
      () => setResults((prev) => prev.filter((r) => r.id !== id)),
      4000,
    );
  };

  const handleApprove = async (requestId: string) => {
    setApprovingId(requestId);
    try {
      await approveRequest({ variables: { requestId }, ...makeRefetch() });
      addResult(requestId, true, "Approved");
      setDetailReq(null);
    } catch (e) {
      addResult(requestId, false, e instanceof Error ? e.message : "Failed");
    } finally {
      setApprovingId(null);
    }
  };

  const handleDecline = async () => {
    if (!declineModalId) return;
    setDecliningId(declineModalId);
    try {
      await declineRequest({
        variables: { requestId: declineModalId, reason: declineReason || null },
        ...makeRefetch(),
      });
      addResult(declineModalId, true, "Declined");
      setDeclineModalId(null);
      setDetailReq(null);
    } catch (e) {
      addResult(
        declineModalId,
        false,
        e instanceof Error ? e.message : "Failed",
      );
    } finally {
      setDecliningId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  type TabDef = {
    key: QueueTab;
    label: string;
    count?: number;
    description: string;
  };
  const tabs: TabDef[] = [];
  if (isHr) {
    tabs.push({
      key: "hr",
      label: "HR Queue",
      count: hrCount,
      description: "Requests awaiting HR review",
    });
  }
  if (isFinance) {
    tabs.push({
      key: "finance",
      label: "Finance Queue",
      count: financeCount,
      description: "Requests awaiting Finance review",
    });
  }
  if (isHr) {
    tabs.push({
      key: "all",
      label: "All In-Progress",
      description: "Full view of all active requests",
    });
  }

  const activeTabDef = tabs.find((t) => t.key === activeQueue) ?? tabs[0];

  const emptyMessages: Record<QueueTab, { title: string; body: string }> = {
    hr: {
      title: "HR queue is clear",
      body: "No requests are waiting for HR review at this time.",
    },
    finance: {
      title: "Finance queue is clear",
      body: "No requests are waiting for Finance review at this time.",
    },
    all: {
      title: "No in-progress requests",
      body: "All benefit requests have been resolved.",
    },
  };
  const emptyMsg = emptyMessages[activeQueue];

  return (
    <div className="flex flex-1 flex-col items-center">
      <main className="w-full max-w-7xl p-8">
          <div className="flex items-end justify-between gap-4">
            {requestsLoading ? (
              <div>
                <div className="h-6 w-40 rounded-full bg-white/30 animate-pulse" />
                <div className="mt-2 h-3.5 w-64 rounded-full bg-white/20 animate-pulse" />
              </div>
            ) : (
              <div>
                <h1 className="text-xl font-semibold text-white">
                  Pending Requests
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTabDef?.description ??
                    "Review benefit requests in detail before deciding"}
                </p>
              </div>
            )}
            {!requestsLoading && requests.length > 0 && (
              <p className="text-xs text-gray-400">
                {requests.length} request{requests.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Queue tabs */}
          <div className="mt-6 flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 w-fit">
            {requestsLoading ? (
              // Skeleton tab placeholders — widths mirror "HR Queue" / "Finance Queue" / "All In-Progress"
              [80, 104, 112].map((w, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-slate-200/80 animate-pulse"
                  style={{ width: w, height: 32 }}
                />
              ))
            ) : (
              tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveQueue(tab.key)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                    activeQueue === tab.key
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                        activeQueue === tab.key
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-gray-200 bg-white">
                  <tr>
                    {requestsLoading ? (
                      <>
                        <th className="px-5 py-3"><div className="h-2.5 w-16 rounded-full bg-slate-200/80 animate-pulse" /></th>
                        <th className="px-5 py-3"><div className="h-2.5 w-12 rounded-full bg-slate-200/80 animate-pulse" /></th>
                        <th className="px-5 py-3"><div className="h-2.5 w-8 rounded-full bg-slate-200/80 animate-pulse" /></th>
                        <th className="px-5 py-3"><div className="h-2.5 w-20 rounded-full bg-slate-200/80 animate-pulse" /></th>
                        <th className="px-5 py-3"><div className="h-2.5 w-10 rounded-full bg-slate-200/80 animate-pulse" /></th>
                        <th className="px-5 py-3"><div className="h-2.5 w-10 rounded-full bg-slate-200/80 animate-pulse" /></th>
                        <th className="px-5 py-3"><div className="h-2.5 w-12 rounded-full bg-slate-200/80 animate-pulse" /></th>
                      </>
                    ) : (
                      <>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Employee</th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Benefit</th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Date</th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Amount / Subsidy</th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Policy</th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {requestsLoading ? (
                    <>
                      {Array.from({
                        length:
                          requestsData?.allBenefitRequests?.length ?? 5,
                      }).map((_, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-b-0">
                          {/* Employee: avatar + name bar + email bar */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-slate-200/80 animate-pulse shrink-0" />
                              <div className="space-y-1.5">
                                <div className="h-3.5 w-28 rounded-full bg-slate-200/80 animate-pulse" />
                                <div className="h-2.5 w-20 rounded-full bg-slate-200/80 animate-pulse" />
                              </div>
                            </div>
                          </td>
                          {/* Benefit name — wider bar */}
                          <td className="px-5 py-4">
                            <div className="h-3.5 w-36 rounded-full bg-slate-200/80 animate-pulse" />
                          </td>
                          {/* Date */}
                          <td className="px-5 py-4">
                            <div className="h-3.5 w-20 rounded-full bg-slate-200/80 animate-pulse" />
                          </td>
                          {/* Amount / subsidy */}
                          <td className="px-5 py-4">
                            <div className="h-3.5 w-16 rounded-full bg-slate-200/80 animate-pulse" />
                          </td>
                          {/* Status badge — pill outline with inner text bar */}
                          <td className="px-5 py-4">
                            <div className="inline-flex items-center rounded border border-slate-100 px-2 py-0.5">
                              <div className="h-3 w-20 rounded-full bg-slate-200/80 animate-pulse" />
                            </div>
                          </td>
                          {/* Policy badge — subtle background pill */}
                          <td className="px-5 py-4">
                            <div className="inline-flex items-center rounded px-2 py-0.5 bg-slate-100/60">
                              <div className="h-3 w-10 rounded-full bg-slate-200/80 animate-pulse" />
                            </div>
                          </td>
                          {/* View Details button — icon + text */}
                          <td className="px-5 py-4">
                            <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5">
                              <div className="h-3.5 w-3.5 rounded-sm bg-slate-200/80 animate-pulse shrink-0" />
                              <div className="h-3 w-16 rounded-full bg-slate-200/80 animate-pulse" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="flex flex-col items-center justify-center py-14 text-center">
                          <CheckCircle className="h-10 w-10 text-green-200" />
                          <p className="mt-3 text-sm font-medium text-gray-700">
                            {emptyMsg.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-400 max-w-xs">
                            {emptyMsg.body}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    requests.map((req) => {
                      const result = results.find((r) => r.id === req.id);
                      const policy =
                        POLICY_STYLE[req.approvalPolicy] ?? POLICY_STYLE.hr;
                      return (
                        <tr
                          key={req.id}
                          className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-5 py-4 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                              <UserAvatar />
                              <span>{req.employeeName}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-gray-900">
                              {req.benefitLabel}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">
                            {req.requestDate}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-700">
                            {req.requestedAmount != null ? (
                              <span>
                                {req.requestedAmount.toLocaleString()}
                                {req.repaymentMonths
                                  ? ` / ${req.repaymentMonths} mo`
                                  : ""}
                              </span>
                            ) : req.unitPrice != null ? (
                              <span>{req.unitPrice.toLocaleString()}</span>
                            ) : req.subsidyPercent != null ? (
                              <span
                                className="text-gray-500"
                                title="No specific amount provided for this request. Showing benefit subsidy rate instead."
                              >
                                {req.subsidyPercent}% subsidy
                              </span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {result ? (
                              <span
                                className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                  result.ok
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-red-50 text-red-600 border-red-200"
                                }`}
                              >
                                {result.message}
                              </span>
                            ) : (
                              <span
                                className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                  STATUS_TONE[req.status] ??
                                  "bg-gray-100 text-gray-500 border-gray-200"
                                }`}
                              >
                                {STATUS_LABELS[req.status] ?? req.status}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${policy.cls}`}
                              title={policy.hint}
                            >
                              {policy.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => setDetailReq(req)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              View Details
                            </button>
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

      {/* Request Detail Modal */}
      {detailReq && (
        <RequestDetailModal
          req={detailReq}
          approvingId={approvingId}
          decliningId={decliningId}
          onClose={() => setDetailReq(null)}
          onApprove={() => handleApprove(detailReq.id)}
          onDecline={() => {
            setDeclineReason("");
            setDeclineModalId(detailReq.id);
          }}
        />
      )}

      {/* Decline confirmation modal */}
      {declineModalId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setDeclineModalId(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-gray-900">
              Decline Request
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Optionally provide a reason. The employee will see this reason.
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Reason (optional)"
              rows={3}
              className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-300"
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setDeclineModalId(null)}
                disabled={decliningId !== null}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDecline}
                disabled={decliningId !== null}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
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

// ── Request Detail Modal ─────────────────────────────────────────────────────

import { X, User, Briefcase, Calendar, ExternalLink } from "lucide-react";
import { useGetContractsForBenefitQuery } from "@/graphql/generated/graphql";
import { UserAvatar } from "@clerk/nextjs";

function RequestDetailModal({
  req,
  approvingId,
  decliningId,
  onClose,
  onApprove,
  onDecline,
}: {
  req: RequestRow;
  approvingId: string | null;
  decliningId: string | null;
  onClose: () => void;
  onApprove: () => void;
  onDecline: () => void;
}) {
  const { data: contractsData, loading: contractsLoading } =
    useGetContractsForBenefitQuery({
      variables: { benefitId: req.benefitId },
      skip: !req.requiresContract,
    });

  const activeContract =
    contractsData?.contracts?.find((c) => c.isActive) ?? null;
  const contractUrl = getContractProxyUrl(
    req.viewContractUrl ?? activeContract?.viewUrl ?? null,
  );
  const employeeSignedContractUrl = getContractProxyUrl(
    req.employeeSignedContractViewUrl,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Request Details
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Review all information before making a decision
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-5">
          {/* Employee Info */}
          <section>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <User className="h-3.5 w-3.5" />
              Employee Information
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
              <InfoRow label="Name" value={req.employeeName} />
              <InfoRow label="Email" value={req.employeeEmail || "—"} />
              <InfoRow
                label="Department"
                value={req.employeeDepartment || "—"}
              />
              <InfoRow label="Role" value={req.employeeRole || "—"} />
              {req.employeeHireDate && (
                <InfoRow label="Hire Date" value={req.employeeHireDate} />
              )}
            </div>
          </section>

          {/* Benefit Info */}
          <section>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <Briefcase className="h-3.5 w-3.5" />
              Benefit Details
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
              <InfoRow label="Benefit" value={req.benefitName} />
              {req.vendorName && (
                <InfoRow label="Vendor" value={req.vendorName} />
              )}
              {req.subsidyPercent != null && (
                <InfoRow label="Subsidy" value={`${req.subsidyPercent}%`} />
              )}
              <InfoRow
                label="Approval Policy"
                value={
                  (POLICY_STYLE[req.approvalPolicy] ?? POLICY_STYLE.hr).hint
                }
              />
              <InfoRow
                label="Contract Required"
                value={req.requiresContract ? "Yes" : "No"}
              />
            </div>
          </section>

          {/* Request Info */}
          <section>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <Calendar className="h-3.5 w-3.5" />
              Request Information
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
              <InfoRow
                label="Status"
                value={
                  <span
                    className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${STATUS_TONE[req.status] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}
                  >
                    {STATUS_LABELS[req.status] ?? req.status}
                  </span>
                }
              />
              <InfoRow label="Submitted On" value={req.requestDate} />
              {req.requestedAmount != null && (
                <InfoRow
                  label="Requested Amount"
                  value={`${req.requestedAmount.toLocaleString()}${req.repaymentMonths ? ` / ${req.repaymentMonths} months` : ""}`}
                />
              )}
              {req.employeeApprovedAt && (
                <InfoRow
                  label="Benefit Start Date"
                  value={req.employeeApprovedAt.split("T")[0]}
                />
              )}
              {req.reviewedBy && (
                <InfoRow label="Reviewed By" value={req.reviewedBy} />
              )}
              <InfoRow label="Last Updated" value={req.updatedAt} />
            </div>
          </section>

          {/* HR Contract Document */}
          {req.requiresContract && (
            <section>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <FileText className="h-3.5 w-3.5" />
                HR Contract
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 space-y-3">
                {req.contractVersionAccepted && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span>
                      Employee accepted version{" "}
                      <strong>{req.contractVersionAccepted}</strong>
                    </span>
                    {req.contractAcceptedAt && (
                      <span className="text-gray-400">
                        on {req.contractAcceptedAt.split("T")[0]}
                      </span>
                    )}
                  </div>
                )}
                {contractsLoading && (
                  <p className="text-xs text-gray-400">Loading contract…</p>
                )}
                {!contractsLoading && contractUrl ? (
                  <>
                    <a
                      href={contractUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Contract Document
                    </a>
                    <iframe
                      src={contractUrl}
                      className="mt-2 h-56 w-full rounded-lg border border-gray-200"
                      title="Contract Document"
                    />
                  </>
                ) : (
                  !contractsLoading && (
                    <p className="text-xs text-gray-400">
                      No contract document available.
                    </p>
                  )
                )}
              </div>
            </section>
          )}

          {req.requiresContract && (
            <section>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <FileText className="h-3.5 w-3.5" />
                Employee Signed Copy
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 space-y-3">
                {employeeSignedContractUrl ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                      <span>
                        Uploaded
                        {req.employeeSignedContractUploadedAt
                          ? ` on ${req.employeeSignedContractUploadedAt.split("T")[0]}`
                          : ""}
                      </span>
                      {req.employeeSignedContractFileName && (
                        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-gray-500">
                          {req.employeeSignedContractFileName}
                        </span>
                      )}
                    </div>
                    <a
                      href={employeeSignedContractUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Signed Copy
                    </a>
                    <iframe
                      src={employeeSignedContractUrl}
                      className="mt-2 h-56 w-full rounded-lg border border-gray-200"
                      title="Employee Signed Contract"
                    />
                  </>
                ) : (
                  <p className="text-xs text-gray-400">
                    No employee-uploaded signed copy has been attached to this request yet.
                  </p>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onDecline}
            type="button"
            disabled={approvingId !== null || decliningId !== null}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={onApprove}
            disabled={approvingId !== null || decliningId !== null}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:bg-gray-300"
          >
            {approvingId === req.id ? "Approving…" : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <div className="mt-0.5 text-sm text-gray-800 break-words">{value}</div>
    </div>
  );
}
