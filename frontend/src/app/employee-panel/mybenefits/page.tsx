"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/app/_features/Header";
import AppSidebar from "@/app/_components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetEmployeesQuery,
  useMyBenefitsQuery,
  useGetEmployeeRequestsQuery,
  useGetBenefitRequestQuery,
  useConfirmBenefitRequestMutation,
} from "@/graphql/generated/graphql";
import type {
  BenefitEligibilityStatus,
  BenefitFlowType,
} from "@/graphql/generated/graphql";
import { Info, ChevronDown, ChevronRight, X, ExternalLink } from "lucide-react";

const REQUEST_STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-700",
};

function formatBenefitId(id: string) {
  return id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const CATEGORY_LABELS: Record<string, string> = {
  wellness: "Wellness",
  equipment: "Equipment",
  financial: "Financial",
  career: "Career",
  flexibility: "Flexibility",
};

const STATUS_COLORS: Record<BenefitEligibilityStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800",
  ELIGIBLE: "bg-sky-100 text-sky-800",
  LOCKED: "bg-amber-100 text-amber-800",
  PENDING: "bg-violet-100 text-violet-800",
};

const FLOW_LABELS: Record<BenefitFlowType, string> = {
  contract: "Contract-based",
  normal: "Normal",
  down_payment: "Finance",
  self_service: "Display only",
};

/** Human-readable labels for rule types (matches TDD spec) */
const RULE_TYPE_LABELS: Record<string, string> = {
  employment_status: "Employment Status",
  okr_submitted: "OKR Gate",
  attendance: "Attendance Gate",
  tenure_days: "Tenure",
  responsibility_level: "Responsibility Level",
  role: "Role",
};

/** Format condition for display (e.g. "status == 'active'", "late_arrival_count < 3") */
function formatCondition(ruleType: string, reason: string): string {
  const m = reason.match(/^Passed: (\w+) (\w+) (.+)$/);
  if (m) {
    const [, type, op, val] = m;
    const opMap: Record<string, string> = {
      eq: "==",
      neq: "!=",
      gte: ">=",
      gt: ">",
      lte: "<=",
      lt: "<",
    };
    const fieldMap: Record<string, string> = {
      employment_status: "status",
      okr_submitted: "okr_submitted",
      attendance: "late_arrival_count",
      tenure_days: "days_since_hire",
      responsibility_level: "responsibility_level",
      role: "role",
    };
    const field = fieldMap[type] ?? type;
    const sym = opMap[op] ?? op;
    return `${field} ${sym} ${val}`;
  }
  return reason;
}

type RuleBreakdownModalProps = {
  benefitName: string;
  ruleEvaluation: Array<{ ruleType: string; passed: boolean; reason: string }>;
  failedRule?: { ruleType: string; errorMessage: string } | null;
  requiresContract?: boolean;
  vendorName?: string | null;
  onClose: () => void;
};

function RuleBreakdownModal({
  benefitName,
  ruleEvaluation,
  failedRule,
  requiresContract,
  vendorName,
  onClose,
}: RuleBreakdownModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Eligibility Conditions — {benefitName}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          See whether each condition is eligible or not for this benefit.
        </p>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Rule Type
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Condition
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Blocking Message
                </th>
              </tr>
            </thead>
            <tbody>
              {ruleEvaluation.map((r, i) => (
                <tr
                  key={i}
                  className={`border-t border-gray-100 ${
                    r.passed ? "bg-emerald-50/50" : "bg-amber-50/50"
                  }`}
                >
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {RULE_TYPE_LABELS[r.ruleType] ?? r.ruleType}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {formatCondition(r.ruleType, r.reason)}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.passed
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {r.passed ? "Eligible" : "Not eligible"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {!r.passed && failedRule?.ruleType === r.ruleType
                      ? failedRule.errorMessage
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {requiresContract && (
          <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <tbody>
                <tr className="bg-gray-50/50">
                  <td className="px-4 py-2 font-medium text-gray-900">
                    Contract
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    Requires {vendorName ?? "vendor"} contract acceptance
                  </td>
                  <td className="px-4 py-2">
                    <span className="inline-flex rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">
                      Required
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {failedRule && (
          <p className="mt-4 rounded-lg bg-amber-100 p-3 text-sm text-amber-900">
            <strong>Blocking:</strong> {failedRule.errorMessage}
          </p>
        )}
        <Button variant="outline" className="mt-4" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

type RequestDetailModalProps = {
  requestId: string;
  onClose: () => void;
  onConfirmContract?: () => void;
};

function RequestDetailModal({
  requestId,
  onClose,
  onConfirmContract,
}: RequestDetailModalProps) {
  const [accepted, setAccepted] = useState(false);
  const { data, loading } = useGetBenefitRequestQuery({
    variables: { id: requestId },
    skip: !requestId,
  });
  const [confirmBenefitRequest, { loading: confirmLoading }] =
    useConfirmBenefitRequestMutation({
      onCompleted: () => {
        onConfirmContract?.();
        onClose();
      },
      onError: (err) => alert(err.message),
    });

  const req = data?.getBenefitRequest;
  if (!req && !loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[85vh] w-full max-w-lg overflow-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Request Detail</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading…</p>}
        {req && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">Benefit</p>
              <p className="font-medium text-gray-900">
                {req.benefit?.name ?? formatBenefitId(req.benefitId)}
              </p>
              {req.benefit?.duration && (
                <p className="text-sm text-gray-500">Duration: {req.benefit.duration}</p>
              )}
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">Status</p>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  REQUEST_STATUS_COLORS[req.status] ?? "bg-gray-100 text-gray-700"
                }`}
              >
                {req.status}
              </span>
              {req.status === "pending" && req.contractAcceptedAt && (
                <p className="mt-1 text-xs text-amber-700">
                  Contract signed — awaiting HR approval
                </p>
              )}
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">Requested</p>
              <p className="text-sm text-gray-700">
                {new Date(req.createdAt).toLocaleString()}
              </p>
            </div>
            {req.requestedAmount != null && (
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">Amount</p>
                <p className="text-sm text-gray-700">
                  {req.requestedAmount.toLocaleString()} MNT
                </p>
              </div>
            )}
            {req.contractAcceptedAt && (
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">Contract Accepted</p>
                <p className="text-sm text-gray-700">
                  {new Date(req.contractAcceptedAt).toLocaleString()}
                </p>
              </div>
            )}
            {req.reviewedBy && (
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">Reviewed By</p>
                <p className="text-sm text-gray-700">{req.reviewedBy}</p>
              </div>
            )}
            {req.declineReason && (
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">Decline Reason</p>
                <p className="text-sm text-red-700">{req.declineReason}</p>
              </div>
            )}

            {req.status === "pending" && req.viewContractUrl && onConfirmContract && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Contract acceptance required
                </p>
                <a
                  href={req.viewContractUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-3 inline-flex items-center gap-1 text-sm text-blue-600 underline"
                >
                  Open contract PDF <ExternalLink className="h-4 w-4" />
                </a>
                <label className="mb-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="h-4 w-4 rounded"
                  />
                  <span className="text-sm">I accept the contract terms</span>
                </label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      confirmBenefitRequest({
                        variables: { requestId: req.id, contractAccepted: accepted },
                      })
                    }
                    disabled={!accepted || confirmLoading}
                  >
                    {confirmLoading ? "Confirming…" : "Confirm & Submit"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      confirmBenefitRequest({
                        variables: { requestId: req.id, contractAccepted: false },
                      });
                    }}
                    disabled={confirmLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Mybenefits() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [expandedBenefit, setExpandedBenefit] = useState<string | null>(null);
  const [ruleModal, setRuleModal] = useState<{
    benefitName: string;
    ruleEvaluation: Array<{
      ruleType: string;
      passed: boolean;
      reason: string;
    }>;
    failedRule?: { ruleType: string; errorMessage: string } | null;
    requiresContract?: boolean;
    vendorName?: string | null;
  } | null>(null);
  const [detailRequestId, setDetailRequestId] = useState<string | null>(null);

  const { data: employeesData } = useGetEmployeesQuery();
  const { data: myBenefitsData, loading: myBenefitsLoading } =
    useMyBenefitsQuery({
      variables: { employeeId: selectedEmployeeId },
      skip: !selectedEmployeeId,
    });
  const { data: requestsData, refetch: refetchRequests } =
    useGetEmployeeRequestsQuery({
      variables: { employeeId: selectedEmployeeId },
      skip: !selectedEmployeeId,
    });

  const employees = employeesData?.getEmployees ?? [];
  const myBenefits = myBenefitsData?.myBenefits ?? [];
  const requests = requestsData?.getEmployeeRequests ?? [];

  // Group by category
  const alreadyHave = myBenefits.filter((item) => item.status === "ACTIVE");
  const canGet = myBenefits.filter((item) => item.status !== "ACTIVE");

  return (
    <div className="flex min-h-screen bg-[#f8f8f9]">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <main className="p-8">
          <h1 className="text-3xl font-semibold text-gray-900">My Benefits</h1>
          <p className="mt-2 text-gray-500">
            View your benefit eligibility and request benefits. Select an
            employee to see their status.
          </p>

          {/* Employee selector */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              View as employee
            </label>
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setEmployeeDropdownOpen(!employeeDropdownOpen)}
                className="flex min-w-[240px] items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left text-sm shadow-sm hover:bg-gray-50"
              >
                <span>
                  {selectedEmployeeId
                    ? (employees.find((e) => e.id === selectedEmployeeId)
                        ?.name ?? selectedEmployeeId)
                    : "Select employee"}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              {employeeDropdownOpen && (
                <div className="absolute left-0 top-full z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                  {employees.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-500">
                      No employees. Run db:seed.
                    </p>
                  ) : (
                    employees.map((emp) => (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => {
                          setSelectedEmployeeId(emp.id);
                          setEmployeeDropdownOpen(false);
                        }}
                        className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 ${
                          selectedEmployeeId === emp.id
                            ? "bg-indigo-50 text-indigo-900"
                            : ""
                        }`}
                      >
                        {emp.name}
                        {emp.nameEng && (
                          <span className="text-gray-500">
                            {" "}
                            ({emp.nameEng})
                          </span>
                        )}
                        <span className="ml-2 text-xs text-gray-400">
                          {emp.role}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {!selectedEmployeeId && (
            <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
              Select an employee to view their benefits. Run{" "}
              <code className="rounded bg-amber-100 px-1">
                npm run db:seed --workspace=backend
              </code>{" "}
              after migrations for demo data.
            </p>
          )}

          {selectedEmployeeId && (
            <Tabs defaultValue="already" className="mt-8 w-full">
              <TabsList className="mb-4 inline-flex h-11 w-full max-w-2xl items-center justify-start rounded-lg border border-gray-200 bg-gray-100 p-1 text-gray-700">
                <TabsTrigger value="already" className="rounded-md px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Benefits I already have
                </TabsTrigger>
                <TabsTrigger value="canget" className="rounded-md px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Benefits I can get
                </TabsTrigger>
                <TabsTrigger value="requests" className="rounded-md px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  My Requests
                </TabsTrigger>
              </TabsList>
              <TabsContent value="already" className="mt-0">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-1 text-lg font-semibold text-gray-900">
                    Benefits I already have
                  </h2>
                  <p className="mb-4 text-sm text-gray-500">
                    Benefits you currently have access to.
                  </p>
                  {myBenefitsLoading ? (
                    <p className="text-gray-500">Loading benefits…</p>
                  ) : (
                  <div className="space-y-4">
                    {alreadyHave.length === 0 ? (
                      <p className="rounded-lg border border-gray-100 bg-gray-50/50 py-6 text-center text-sm text-gray-500">
                        No active benefits yet.
                      </p>
                    ) : (
                      alreadyHave.map((item) => {
                        const { benefit, status, ruleEvaluation, failedRule } =
                          item;
                        const flowType = benefit.flowType;
                        const canRequest =
                          (flowType === "contract" ||
                            flowType === "normal" ||
                            flowType === "down_payment") &&
                          status === "ELIGIBLE";
                        const isDisplayOnly = flowType === "self_service";

                        const isExpanded = expandedBenefit === item.benefitId;
                        return (
                          <div
                            key={item.benefitId}
                            className="rounded-lg border border-gray-100 p-4"
                          >
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <Link
                                    href={`/employee-panel/Mybenefits/${item.benefitId}?employeeId=${selectedEmployeeId}`}
                                    className="font-medium text-gray-900 hover:text-indigo-600 hover:underline"
                                  >
                                    {benefit.name}
                                  </Link>
                                  <Link
                                    href={`/employee-panel/Mybenefits/${item.benefitId}?employeeId=${selectedEmployeeId}`}
                                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-indigo-600"
                                    title="View benefit detail"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Link>
                                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                                    {FLOW_LABELS[flowType]}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  Company {benefit.subsidyPercent}% / Employee{" "}
                                  {benefit.employeePercent}%
                                  {benefit.unitPrice != null && (
                                    <span className="ml-2">
                                      — {benefit.unitPrice.toLocaleString()} MNT
                                    </span>
                                  )}
                                  {benefit.duration && (
                                    <span className="ml-2">
                                      · Duration: {benefit.duration}
                                    </span>
                                  )}
                                </p>
                                {isDisplayOnly &&
                                  benefit.optionsDescription && (
                                    <p className="mt-1 text-sm text-gray-600">
                                      {benefit.optionsDescription}
                                    </p>
                                  )}
                              </div>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  STATUS_COLORS[status] ??
                                  "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {status}
                              </span>
                              {failedRule && (
                                <span className="w-full text-sm text-amber-700">
                                  {failedRule.errorMessage}
                                </span>
                              )}
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedBenefit(
                                      isExpanded ? null : item.benefitId,
                                    )
                                  }
                                  className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                  View conditions
                                </button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setRuleModal({
                                      benefitName: benefit.name,
                                      ruleEvaluation,
                                      failedRule,
                                      requiresContract:
                                        benefit.requiresContract,
                                      vendorName: benefit.vendorName,
                                    })
                                  }
                                  title="View full details"
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                                {canRequest && (
                                  <Link
                                    href={`/employee-panel/Mybenefits/${item.benefitId}?employeeId=${selectedEmployeeId}`}
                                  >
                                    <Button size="sm">
                                      View detail & request
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                            {isExpanded && (
                              <div className="mt-4 border-t border-gray-100 pt-4">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                                  Your conditions — eligible or not
                                </p>
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-gray-50">
                                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                                          Rule Type
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                                          Condition
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                                          Status
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                                          Blocking Message
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {ruleEvaluation.map((r, i) => (
                                        <tr
                                          key={i}
                                          className={`border-t border-gray-100 ${
                                            r.passed
                                              ? "bg-emerald-50/50"
                                              : "bg-amber-50/50"
                                          }`}
                                        >
                                          <td className="px-3 py-2 font-medium text-gray-900">
                                            {RULE_TYPE_LABELS[r.ruleType] ??
                                              r.ruleType}
                                          </td>
                                          <td className="px-3 py-2 text-gray-700">
                                            {formatCondition(
                                              r.ruleType,
                                              r.reason,
                                            )}
                                          </td>
                                          <td className="px-3 py-2">
                                            <span
                                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                r.passed
                                                  ? "bg-emerald-100 text-emerald-800"
                                                  : "bg-amber-100 text-amber-800"
                                              }`}
                                            >
                                              {r.passed
                                                ? "Eligible"
                                                : "Not eligible"}
                                            </span>
                                          </td>
                                          <td className="px-3 py-2 text-gray-600">
                                            {!r.passed &&
                                            failedRule?.ruleType === r.ruleType
                                              ? failedRule.errorMessage
                                              : "—"}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                {benefit.requiresContract && (
                                  <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
                                    <table className="w-full text-sm">
                                      <tbody>
                                        <tr className="bg-gray-50/50">
                                          <td className="px-3 py-2 font-medium text-gray-900">
                                            Contract
                                          </td>
                                          <td className="px-3 py-2 text-gray-700">
                                            Requires{" "}
                                            {benefit.vendorName ?? "vendor"}{" "}
                                            contract acceptance
                                          </td>
                                          <td className="px-3 py-2">
                                            <span className="inline-flex rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">
                                              Required
                                            </span>
                                          </td>
                                          <td className="px-3 py-2 text-gray-600">
                                            —
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="canget" className="mt-0">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-1 text-lg font-semibold text-gray-900">
                    Benefits I can get
                  </h2>
                  <p className="mb-4 text-sm text-gray-500">
                    Benefits you are eligible for or can request.
                  </p>
                  {myBenefitsLoading ? (
                    <p className="text-gray-500">Loading benefits…</p>
                  ) : (
                  <div className="space-y-4">
                    {canGet.length === 0 ? (
                      <p className="rounded-lg border border-gray-100 bg-gray-50/50 py-6 text-center text-sm text-gray-500">
                        No other benefits to show.
                      </p>
                    ) : (
                      canGet.map((item) => {
                        const { benefit, status, ruleEvaluation, failedRule } =
                          item;
                        const flowType = benefit.flowType;
                        const canRequest =
                          (flowType === "contract" ||
                            flowType === "normal" ||
                            flowType === "down_payment") &&
                          status === "ELIGIBLE";
                        const isDisplayOnly = flowType === "self_service";
                        const isExpanded = expandedBenefit === item.benefitId;
                        return (
                          <div
                            key={item.benefitId}
                            className="rounded-lg border border-gray-100 p-4"
                          >
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <Link
                                    href={`/employee-panel/Mybenefits/${item.benefitId}?employeeId=${selectedEmployeeId}`}
                                    className="font-medium text-gray-900 hover:text-indigo-600 hover:underline"
                                  >
                                    {benefit.name}
                                  </Link>
                                  <Link
                                    href={`/employee-panel/Mybenefits/${item.benefitId}?employeeId=${selectedEmployeeId}`}
                                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-indigo-600"
                                    title="View benefit detail"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Link>
                                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                                    {FLOW_LABELS[flowType]}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  Company {benefit.subsidyPercent}% / Employee{" "}
                                  {benefit.employeePercent}%
                                  {benefit.unitPrice != null && (
                                    <span className="ml-2">
                                      — {benefit.unitPrice.toLocaleString()} MNT
                                    </span>
                                  )}
                                  {benefit.duration && (
                                    <span className="ml-2">
                                      · Duration: {benefit.duration}
                                    </span>
                                  )}
                                </p>
                                {isDisplayOnly &&
                                  benefit.optionsDescription && (
                                    <p className="mt-1 text-sm text-gray-600">
                                      {benefit.optionsDescription}
                                    </p>
                                  )}
                              </div>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  STATUS_COLORS[status] ??
                                  "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {status}
                              </span>
                              {failedRule && (
                                <span className="w-full text-sm text-amber-700">
                                  {failedRule.errorMessage}
                                </span>
                              )}
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedBenefit(
                                      isExpanded ? null : item.benefitId,
                                    )
                                  }
                                  className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                  View conditions
                                </button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setRuleModal({
                                      benefitName: benefit.name,
                                      ruleEvaluation,
                                      failedRule,
                                      requiresContract:
                                        benefit.requiresContract,
                                      vendorName: benefit.vendorName,
                                    })
                                  }
                                  title="View full details"
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                                {canRequest && (
                                  <Link
                                    href={`/employee-panel/Mybenefits/${item.benefitId}?employeeId=${selectedEmployeeId}`}
                                  >
                                    <Button size="sm">
                                      View detail & request
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                            {isExpanded && (
                              <div className="mt-4 border-t border-gray-100 pt-4">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                                  Your conditions — eligible or not
                                </p>
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-gray-50">
                                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                                          Rule Type
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                                          Condition
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                                          Status
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                                          Blocking Message
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {ruleEvaluation.map((r, i) => (
                                        <tr
                                          key={i}
                                          className={`border-t border-gray-100 ${
                                            r.passed
                                              ? "bg-emerald-50/50"
                                              : "bg-amber-50/50"
                                          }`}
                                        >
                                          <td className="px-3 py-2 font-medium text-gray-900">
                                            {RULE_TYPE_LABELS[r.ruleType] ??
                                              r.ruleType}
                                          </td>
                                          <td className="px-3 py-2 text-gray-700">
                                            {formatCondition(
                                              r.ruleType,
                                              r.reason,
                                            )}
                                          </td>
                                          <td className="px-3 py-2">
                                            <span
                                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                r.passed
                                                  ? "bg-emerald-100 text-emerald-800"
                                                  : "bg-amber-100 text-amber-800"
                                              }`}
                                            >
                                              {r.passed
                                                ? "Eligible"
                                                : "Not eligible"}
                                            </span>
                                          </td>
                                          <td className="px-3 py-2 text-gray-600">
                                            {!r.passed &&
                                            failedRule?.ruleType === r.ruleType
                                              ? failedRule.errorMessage
                                              : "—"}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                {benefit.requiresContract && (
                                  <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
                                    <table className="w-full text-sm">
                                      <tbody>
                                        <tr className="bg-gray-50/50">
                                          <td className="px-3 py-2 font-medium text-gray-900">
                                            Contract
                                          </td>
                                          <td className="px-3 py-2 text-gray-700">
                                            Requires{" "}
                                            {benefit.vendorName ?? "vendor"}{" "}
                                            contract acceptance
                                          </td>
                                          <td className="px-3 py-2">
                                            <span className="inline-flex rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">
                                              Required
                                            </span>
                                          </td>
                                          <td className="px-3 py-2 text-gray-600">
                                            —
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="requests" className="mt-0">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-1 text-lg font-semibold text-gray-900">
                    My Requests
                  </h2>
              <p className="mb-4 text-sm text-gray-500">
                Your benefit requests and their status.
              </p>
              {requests.length === 0 ? (
                <p className="rounded-lg border border-gray-100 bg-gray-50/50 py-6 text-center text-sm text-gray-500">
                  No requests yet. Request a benefit from the sections above.
                </p>
              ) : (
                <div className="space-y-3">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setDetailRequestId(req.id)}
                          className="rounded-lg p-1 hover:bg-gray-100"
                        >
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        </button>
                        <div>
                          <p className="font-medium text-gray-900">
                            {req.benefit?.name ?? formatBenefitId(req.benefitId)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(req.createdAt).toLocaleDateString()}
                            {req.benefit?.duration && ` · ${req.benefit.duration}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            REQUEST_STATUS_COLORS[req.status] ?? "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {req.status}
                        </span>
                        {req.status === "pending" && req.contractAcceptedAt && (
                          <span className="text-xs text-amber-600">
                            Awaiting HR
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDetailRequestId(req.id)}
                        >
                          View detail
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>

      {ruleModal && (
        <RuleBreakdownModal
          benefitName={ruleModal.benefitName}
          ruleEvaluation={ruleModal.ruleEvaluation}
          failedRule={ruleModal.failedRule}
          requiresContract={ruleModal.requiresContract}
          vendorName={ruleModal.vendorName}
          onClose={() => setRuleModal(null)}
        />
      )}

      {detailRequestId && (
        <RequestDetailModal
          requestId={detailRequestId}
          onClose={() => setDetailRequestId(null)}
          onConfirmContract={() => refetchRequests()}
        />
      )}
    </div>
  );
}
