"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import Header from "@/app/_features/Header";
import AppSidebar from "@/app/_components/AppSidebar";
import { Button } from "@/components/ui/button";
import {
  useGetEmployeesQuery,
  useMyBenefitsQuery,
  useRequestBenefitMutation,
  useConfirmBenefitRequestMutation,
} from "@/graphql/generated/graphql";
import type {
  BenefitEligibilityStatus,
  BenefitFlowType,
} from "@/graphql/generated/graphql";
import { ArrowLeft, Check, FileText, ExternalLink } from "lucide-react";

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

const RULE_TYPE_LABELS: Record<string, string> = {
  employment_status: "Employment Status",
  okr_submitted: "OKR Gate",
  attendance: "Attendance Gate",
  tenure_days: "Tenure",
  responsibility_level: "Responsibility Level",
  role: "Role",
};

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

type StepperProps = {
  currentStep: 1 | 2 | 3;
  hasContract: boolean;
};

function Stepper({ currentStep, hasContract }: StepperProps) {
  const steps = hasContract
    ? [
        { num: 1, label: "Confirm Eligibility" },
        { num: 2, label: "Contract Acceptance" },
        { num: 3, label: "Submit Request" },
      ]
    : [
        { num: 1, label: "Confirm Eligibility" },
        { num: 2, label: "Submit Request" },
      ];

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => {
        const isActive = step.num === currentStep;
        const isPast = step.num < currentStep;
        return (
          <div key={step.num} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : isPast
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {isPast ? <Check className="h-4 w-4" /> : step.num}
              </div>
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-3 h-0.5 w-8 ${
                  isPast ? "bg-indigo-200" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BenefitDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const benefitId = params.benefitId as string;
  const employeeId = searchParams.get("employeeId") ?? "";

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [contractAccepted, setContractAccepted] = useState(false);
  const [downPaymentAmount, setDownPaymentAmount] = useState("");
  const [viewContractUrl, setViewContractUrl] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  const { data: employeesData } = useGetEmployeesQuery();
  const {
    data: myBenefitsData,
    loading: myBenefitsLoading,
    refetch: refetchBenefits,
  } = useMyBenefitsQuery({
    variables: { employeeId },
    skip: !employeeId,
  });

  const [requestBenefit, { loading: requestLoading }] = useRequestBenefitMutation(
    {
      onCompleted: (data) => {
        const req = data.requestBenefit;
        setRequestId(req.id);
        if (req.viewContractUrl) {
          setViewContractUrl(req.viewContractUrl);
          setStep(2);
        } else {
          refetchBenefits();
          setStep(2); // For non-contract, step 2 is "Submit Request" - we're done
        }
      },
      onError: (err) => alert(err.message),
    },
  );

  const [confirmBenefitRequest, { loading: confirmLoading }] =
    useConfirmBenefitRequestMutation({
      onCompleted: () => {
        refetchBenefits();
        setStep(3);
      },
      onError: (err) => alert(err.message),
    });

  const employees = employeesData?.getEmployees ?? [];
  const myBenefits = myBenefitsData?.myBenefits ?? [];
  const item = myBenefits.find((b) => b.benefitId === benefitId);
  const benefit = item?.benefit;
  const status = item?.status;
  const ruleEvaluation = item?.ruleEvaluation ?? [];
  const failedRule = item?.failedRule;
  const requiresContract = benefit?.requiresContract ?? false;
  const flowType = (benefit?.flowType ?? "normal") as BenefitFlowType;
  const canRequest =
    (flowType === "contract" ||
      flowType === "normal" ||
      flowType === "down_payment") &&
    (status === "ELIGIBLE" || status === "ACTIVE");

  const handleRequest = () => {
    if (!employeeId) return;
    const input: {
      employeeId: string;
      benefitId: string;
      requestedAmount?: number;
    } = { employeeId, benefitId };
    if (flowType === "down_payment" && downPaymentAmount) {
      input.requestedAmount = parseInt(downPaymentAmount, 10);
    }
    requestBenefit({ variables: { input } });
  };

  const handleConfirmContract = () => {
    if (!requestId) return;
    confirmBenefitRequest({
      variables: { requestId, contractAccepted: contractAccepted },
    });
  };

  if (!employeeId) {
    return (
      <div className="flex min-h-screen bg-[#f8f8f9]">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="p-8">
            <Link
              href="/employee-panel/Mybenefits"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Benefits
            </Link>
            <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
              Select an employee on the My Benefits page first, then open a
              benefit.
            </p>
          </main>
        </div>
      </div>
    );
  }

  if (myBenefitsLoading || !item) {
    return (
      <div className="flex min-h-screen bg-[#f8f8f9]">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="p-8">
            <Link
              href={`/employee-panel/Mybenefits?employeeId=${employeeId}`}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Benefits
            </Link>
            <p className="mt-8 text-gray-500">
              {myBenefitsLoading ? "Loading…" : "Benefit not found."}
            </p>
          </main>
        </div>
      </div>
    );
  }

  const backHref = `/employee-panel/Mybenefits?employeeId=${employeeId}`;
  const effectiveStep =
    requiresContract && viewContractUrl && step === 2 ? 2 : step;
  const hasContract = requiresContract;

  return (
    <div className="flex min-h-screen bg-[#f8f8f9]">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="p-8">
          <Link
            href={backHref}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Benefits
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {benefit?.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {CATEGORY_LABELS[benefit?.category ?? ""] ?? benefit?.category} ·{" "}
              Company {benefit?.subsidyPercent}% / Employee {benefit?.employeePercent}%
              {benefit?.duration && ` · ${benefit.duration}`}
            </p>
          </div>

          <div className="mb-8">
            <Stepper
              currentStep={
                hasContract
                  ? (effectiveStep as 1 | 2 | 3)
                  : step === 1
                    ? 1
                    : 2
              }
              hasContract={hasContract}
            />
          </div>

          {/* Step 1: Confirm Eligibility */}
          <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Eligibility Match
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              See whether each condition is eligible or not for this benefit.
            </p>
            <div className="mb-4">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  STATUS_COLORS[status ?? "LOCKED"] ?? "bg-gray-100 text-gray-700"
                }`}
              >
                {status}
              </span>
            </div>
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
                        Requires {benefit?.vendorName ?? "vendor"} contract
                        acceptance
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
          </section>

          {/* Step 2: Contract Acceptance (contract-based only) */}
          {requiresContract && (
            <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FileText className="h-5 w-5" />
                Contract
              </h2>
              {viewContractUrl ? (
                <>
                  <p className="mb-4 text-sm text-gray-600">
                    Please review the vendor contract before accepting. By
                    accepting, you agree to the terms.
                  </p>
                  <a
                    href={viewContractUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open contract PDF in new tab
                  </a>
                  <label className="mb-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={contractAccepted}
                      onChange={(e) => setContractAccepted(e.target.checked)}
                      className="h-4 w-4 rounded"
                    />
                    <span className="text-sm">
                      I have read and accept the contract terms
                    </span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      onClick={handleConfirmContract}
                      disabled={!contractAccepted || confirmLoading}
                    >
                      {confirmLoading ? "Confirming…" : "Confirm & Submit"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!requestId) return;
                        confirmBenefitRequest({
                          variables: { requestId, contractAccepted: true },
                        });
                      }}
                      disabled={confirmLoading}
                      className="text-gray-500"
                    >
                      Demo: Skip to next step
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-500">
                    {requestId
                      ? "No contract file is available for this benefit yet."
                      : "Contract will be available after you start the request."}
                  </p>
                  {requestId && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 text-gray-500"
                      onClick={() => {
                        confirmBenefitRequest({
                          variables: { requestId, contractAccepted: true },
                        });
                      }}
                      disabled={confirmLoading}
                    >
                      Demo: Skip to next step
                    </Button>
                  )}
                </>
              )}
            </section>
          )}

          {/* Step 2/3: Submit Request */}
          {step === 1 && canRequest && !requiresContract && (
            <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Submit Request
              </h2>
              {flowType === "down_payment" && (
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Requested amount (MNT)
                  </label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={downPaymentAmount}
                    onChange={(e) => setDownPaymentAmount(e.target.value)}
                    className="w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              )}
              <Button
                onClick={handleRequest}
                disabled={requestLoading}
              >
                {requestLoading ? "Submitting…" : "Submit Request"}
              </Button>
            </section>
          )}

          {step === 1 && canRequest && requiresContract && (
            <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Submit Request
              </h2>
              <p className="mb-4 text-sm text-gray-500">
                Start the request to receive the contract for acceptance.
              </p>
              <Button onClick={handleRequest} disabled={requestLoading}>
                {requestLoading ? "Submitting…" : "Start Request"}
              </Button>
            </section>
          )}

          {step === 2 && !requiresContract && (
            <section className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
              <p className="font-medium text-emerald-800">
                Request submitted. Check My Requests for status.
              </p>
            </section>
          )}

          {step === 3 && (
            <section className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
              <p className="font-medium text-emerald-800">
                Contract accepted. Request is pending HR approval. Check My
                Requests for status.
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
