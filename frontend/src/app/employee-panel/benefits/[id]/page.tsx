"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock, DollarSign, ExternalLink, FileText, Lock, MapPin, ShieldCheck, Users, XCircle } from "lucide-react";
import StatusBadge from "../../_components/benefits/StatusBadge";
import Sidebar from "../../_components/SideBar";
import BenefitRequestModal from "../../_components/benefits/BenefitRequestModal";
import PageLoading from "@/app/_components/PageLoading";
import { useGetMyBenefitsFullQuery, useGetBenefitRequestsQuery, useGetContractsForBenefitQuery } from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/use-current-employee";
import { getContractProxyUrl } from "@/lib/contracts";

function formatRuleLabel(value: string) {
  return value
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function ApprovalPolicyBadge({ policy }: { policy: string | null | undefined }) {
  const p = (policy ?? "hr").toLowerCase();
  if (p === "dual") {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
        <Users className="h-4 w-4" />
        HR + Finance Approval (Dual)
      </div>
    );
  }
  if (p === "finance") {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg border border-teal-100 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700">
        <ShieldCheck className="h-4 w-4" />
        Finance Approval
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
      <ShieldCheck className="h-4 w-4" />
      HR Approval
    </div>
  );
}

function getActiveStep(status: string): string {
  switch (status) {
    case "awaiting_contract_acceptance": return "Contract";
    case "awaiting_hr_review": return "HR Review";
    case "awaiting_finance_review": return "Finance Review";
    case "hr_approved": return "Finance Review";
    case "finance_approved":
    case "approved": return "Approved";
    default: return "Submitted";
  }
}

function ApprovalFlow({
  policy,
  requiresContract,
  requestStatus,
}: {
  policy: string | null | undefined;
  requiresContract: boolean;
  requestStatus?: string | null;
}) {
  const p = (policy ?? "hr").toLowerCase();
  const steps = ["Submitted"];
  if (requiresContract) steps.push("Contract");
  if (p === "hr" || p === "dual") steps.push("HR Review");
  if (p === "finance" || p === "dual") steps.push("Finance Review");
  steps.push("Approved");

  const activeStep = requestStatus ? getActiveStep(requestStatus) : null;
  const isTerminal = requestStatus === "approved" || requestStatus === "rejected" || requestStatus === "cancelled";

  const doneSteps = new Set<string>();
  if (requestStatus && !isTerminal) {
    for (const step of steps) {
      if (step === activeStep) break;
      doneSteps.add(step);
    }
  }
  if (requestStatus === "approved") steps.forEach((s) => doneSteps.add(s));

  return (
    <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <p className="mb-2 text-sm font-semibold text-gray-800">Approval Flow</p>
      <div className="flex flex-wrap items-center gap-1.5">
        {steps.map((step, i) => {
          const isActive = step === activeStep && !isTerminal;
          const isDone = doneSteps.has(step);
          return (
            <div key={step} className="flex items-center gap-1.5">
              {i > 0 && <ArrowRight className="h-3 w-3 text-gray-300 shrink-0" />}
              <span
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : isDone
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NextStepsBox({
  status,
  benefitId,
  failedRuleError,
  approvalPolicy,
  requiresContract,
  awaitingContract,
  onRequestBenefit,
}: {
  status: string;
  benefitId: string;
  failedRuleError?: string | null;
  approvalPolicy?: string | null;
  requiresContract: boolean;
  awaitingContract?: boolean;
  onRequestBenefit?: () => void;
}) {
  const p = (approvalPolicy ?? "hr").toLowerCase();

  // Pending sub-state: employee must accept a contract before review can proceed
  if (status === "PENDING" && awaitingContract) {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <FileText className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Contract acceptance required</p>
            <p className="mt-0.5 text-amber-700">
              Your request is waiting for you to review and accept the vendor contract before it can proceed.
            </p>
          </div>
        </div>
        <Link
          href="/employee-panel/requests"
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-amber-600 text-sm font-semibold text-white transition hover:bg-amber-700 active:scale-[0.98]"
        >
          Review &amp; Accept Contract →
        </Link>
      </div>
    );
  }

  if (status === "ELIGIBLE") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-500">
          You meet all eligibility requirements.{" "}
          {requiresContract
            ? "You will be asked to accept a vendor contract as part of the request."
            : "Your request will go through an approval process."}
        </p>
        {onRequestBenefit ? (
          <button
            type="button"
            onClick={onRequestBenefit}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Request Benefit
          </button>
        ) : (
          <Link
            href={`/employee-panel/benefits/${benefitId}/request`}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Request Benefit
          </Link>
        )}
      </div>
    );
  }

  if (status === "LOCKED") {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Eligibility requirements not met</p>
            {failedRuleError && <p className="mt-1 text-red-600">{failedRuleError}</p>}
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Contact HR if you believe this is incorrect or if circumstances have changed.
        </p>
      </div>
    );
  }

  if (status === "ACTIVE") {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-medium">Benefit is active</p>
          <p className="mt-0.5 text-green-600">You are currently enrolled in this benefit.</p>
        </div>
      </div>
    );
  }

  if (status === "PENDING") {
    const waiting =
      p === "hr" ? "HR team" : p === "finance" ? "Finance team" : "HR and Finance teams";
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-700">
        <Clock className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-medium">Awaiting approval</p>
          <p className="mt-0.5 text-orange-600">
            Your request is being reviewed by the {waiting}. No action needed from you right now.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export default function BenefitDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const { loading: employeeLoading } = useCurrentEmployee();
  const { data, error, loading } = useGetMyBenefitsFullQuery();
  const { data: requestsData } = useGetBenefitRequestsQuery();
  const { data: contractsData } = useGetContractsForBenefitQuery({ variables: { benefitId: id } });

  const benefitEligibility = data?.myBenefits.find((item: { benefitId: string }) => item.benefitId === id);

  // Find the latest request for this benefit to detect sub-states (e.g. awaiting_contract_acceptance)
  const latestRequest = requestsData?.benefitRequests
    .filter((r) => r.benefitId === id)
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))[0];
  const awaitingContract = latestRequest?.status === "awaiting_contract_acceptance";

  if (employeeLoading || loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col items-center">
          <main className="flex w-full max-w-7xl items-center justify-center p-8">
            <PageLoading message="Loading benefit details…" />
          </main>
        </div>
      </div>
    );
  }

  if (error || !benefitEligibility) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col items-center">
          <main className="w-full max-w-7xl p-8">
            <Link href="/employee-panel/mybenefits" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              ← Back to Benefits
            </Link>
            <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-destructive">
              Benefit data could not be loaded.
            </div>
          </main>
        </div>
      </div>
    );
  }

  const benefit = benefitEligibility.benefit;
  const vendor = benefit.vendorName ?? "Internal Benefit";
  const policy = benefit.approvalPolicy ?? "hr";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-5xl p-8">
          <Link
            href="/employee-panel/requests"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back
          </Link>

          {benefit.amount == null ? (
            /* ── Simple layout for non-payment benefits ── */
            <div className="mt-6 max-w-2xl rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{benefit.name}</h1>
                  <p className="mt-0.5 text-sm text-gray-500">{vendor}</p>
                </div>
                <StatusBadge status={benefitEligibility.status} />
              </div>

              {benefit.imageUrl && (
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}/api/benefits/image?key=${encodeURIComponent(benefit.imageUrl)}`}
                  alt={benefit.name}
                  className="mt-4 h-44 w-full rounded-xl object-cover"
                />
              )}

              {(benefit.description ?? benefit.optionsDescription) && (
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  {benefit.description ?? benefit.optionsDescription}
                </p>
              )}

              {benefit.location && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                  <span className="text-sm text-gray-700">{benefit.location}</span>
                </div>
              )}

              {/* Eligibility / status indicator */}
              <div className="mt-5">
                {benefitEligibility.status === "LOCKED" ? (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                      <p className="text-sm font-medium text-red-700">
                        {benefitEligibility.failedRule?.errorMessage ?? "You do not meet the eligibility requirements for this benefit."}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-red-400">Contact HR if you believe this is incorrect.</p>
                  </div>
                ) : benefitEligibility.status === "PENDING" ? (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                    <Clock className="h-4 w-4 shrink-0 text-amber-600" />
                    <p className="text-sm font-medium text-amber-800">Your request is being reviewed.</p>
                  </div>
                ) : benefitEligibility.status === "ACTIVE" ? (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <p className="text-sm font-medium text-emerald-800">You are currently enrolled in this benefit.</p>
                  </div>
                ) : null}
              </div>

              {/* Request button */}
              {benefitEligibility.status === "ELIGIBLE" && (
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(true)}
                  className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                >
                  Request Benefit
                </button>
              )}
            </div>
          ) : (
            /* ── Full layout for payment benefits ── */
            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
              {/* Left: benefit info */}
              <div className="space-y-5">
                {/* Header card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">{benefit.name}</h1>
                      <p className="mt-0.5 text-sm text-gray-500">{vendor}</p>
                    </div>
                    <StatusBadge status={benefitEligibility.status} />
                  </div>

                  {benefit.imageUrl && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}/api/benefits/image?key=${encodeURIComponent(benefit.imageUrl)}`}
                      alt={benefit.name}
                      className="mt-4 h-44 w-full rounded-xl object-cover"
                    />
                  )}

                  {(benefit.description ?? benefit.optionsDescription) && (
                    <p className="mt-4 text-sm leading-relaxed text-gray-600">
                      {benefit.description ?? benefit.optionsDescription}
                    </p>
                  )}

                  {/* Contribution split */}
                  <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Total Price</p>
                      <div className="mt-1 flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <p className="text-2xl font-bold text-gray-800">{benefit.amount!.toLocaleString()}₮</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Company covers</p>
                      <p className="mt-1 text-2xl font-bold text-emerald-600">{benefit.subsidyPercent}%</p>
                      <p className="text-xs text-emerald-600">
                        {Math.round(benefit.amount! * benefit.subsidyPercent / 100).toLocaleString()}₮
                      </p>
                    </div>
                  </div>

                  {benefit.location && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                      <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="text-sm text-gray-700">{benefit.location}</span>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-3">
                    <ApprovalPolicyBadge policy={policy} />
                    {benefit.requiresContract && (
                      <div className="inline-flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
                        <FileText className="h-4 w-4" />
                        Contract Required
                      </div>
                    )}
                  </div>

                  <ApprovalFlow
                    policy={policy}
                    requiresContract={benefit.requiresContract}
                    requestStatus={latestRequest?.status}
                  />
                </div>

                {/* Eligibility status */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h2 className="text-base font-semibold text-gray-900">Eligibility Status</h2>
                  <div className="mt-4">
                    {benefitEligibility.status === "ELIGIBLE" || benefitEligibility.status === "ACTIVE" ? (
                      <div className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <p className="text-sm font-medium text-emerald-800">You are eligible for this benefit</p>
                      </div>
                    ) : benefitEligibility.status === "LOCKED" ? (
                      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4">
                        <p className="mb-3 text-sm font-semibold text-red-700">The following requirements were not met:</p>
                        <div className="space-y-2">
                          {benefitEligibility.ruleEvaluation
                            .filter((r: { passed: boolean }) => !r.passed)
                            .map((item: { ruleType: string; reason: string }) => (
                              <div key={item.ruleType} className="flex items-start gap-2.5">
                                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                                <div>
                                  <p className="text-sm font-medium text-red-800">{formatRuleLabel(item.ruleType)}</p>
                                  <p className="text-xs text-red-600">{item.reason}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                        {benefitEligibility.failedRule?.errorMessage && (
                          <p className="mt-3 rounded-lg bg-red-100 px-3 py-2 text-xs text-red-600">
                            {benefitEligibility.failedRule.errorMessage}
                          </p>
                        )}
                        <p className="mt-3 text-xs text-red-400">
                          Contact HR if you believe this is incorrect or if circumstances have changed.
                        </p>
                      </div>
                    ) : benefitEligibility.ruleEvaluation.length === 0 ? (
                      <p className="text-sm text-gray-400">No eligibility rules configured for this benefit.</p>
                    ) : null}
                  </div>
                </div>

                {/* Contract link */}
                {benefit.requiresContract && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h2 className="text-base font-semibold text-gray-900">Contract</h2>
                    {contractsData?.contracts && contractsData.contracts.length > 0 ? (
                      <div className="mt-3 space-y-2">
                        {contractsData.contracts.map((c) => (
                          <div key={c.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                            <FileText className="h-4 w-4 shrink-0 text-gray-500" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800">
                                {c.vendorName} — v{c.version}
                                {c.isActive && (
                                  <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">Active</span>
                                )}
                              </p>
                              <p className="text-xs text-gray-400">{c.effectiveDate} – {c.expiryDate}</p>
                            </div>
                            {c.viewUrl && (
                              <a
                                href={getContractProxyUrl(c.viewUrl) ?? c.viewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
                              >
                                View <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                        <FileText className="h-4 w-4 shrink-0 text-amber-600" />
                        <p className="text-sm text-amber-800">
                          Contract has not been uploaded yet. You will be able to review it when you submit a request.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right: action panel */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 self-start">
                <h2 className="text-base font-semibold text-gray-900">Next Steps</h2>
                <div className="mt-4">
                  <NextStepsBox
                    status={benefitEligibility.status}
                    benefitId={benefitEligibility.benefitId}
                    failedRuleError={benefitEligibility.failedRule?.errorMessage}
                    approvalPolicy={policy}
                    requiresContract={benefit.requiresContract}
                    awaitingContract={awaitingContract}
                    onRequestBenefit={() => setRequestModalOpen(true)}
                  />
                </div>
                {benefit.requiresContract && benefitEligibility.status === "ELIGIBLE" && (
                  <div className="mt-5 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
                    <div className="flex items-start gap-2">
                      <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                      <p className="text-xs text-amber-700">
                        A vendor contract must be reviewed and accepted before your request can proceed to HR review.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
      {requestModalOpen && (
        <BenefitRequestModal
          benefitId={id}
          onClose={() => setRequestModalOpen(false)}
          onSuccess={() => {
            setRequestModalOpen(false);
            router.push("/employee-panel/requests?submitted=true");
          }}
        />
      )}
    </div>
  );
}
