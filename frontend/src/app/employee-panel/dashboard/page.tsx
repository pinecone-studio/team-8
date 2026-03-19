"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { CheckCircle, Clock, CreditCard, Search, Sparkles } from "lucide-react";
import Sidebar from "../_components/SideBar";
import SummaryCard from "../_components/benefits/SummaryCard";
import BenefitCard from "../_components/benefits/BenefitCard";
import BenefitDetailModal from "../_components/benefits/BenefitDetailModal";
import BenefitRequestModal from "../_components/benefits/BenefitRequestModal";
import PageHeader from "../_components/layout/PageHeader";
import BenefitCardSkeleton from "../_components/benefits/BenefitCardSkeleton";
import SummaryCardSkeleton from "../_components/benefits/SummaryCardSkeleton";
import {
  BenefitEligibilityStatus,
  BenefitFlowType,
  useGetBenefitRequestsQuery,
  useGetMyBenefitsFullQuery,
  type BenefitEligibility,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/use-current-employee";

const STATUS_FILTERS = [
  { label: "All",      value: "ALL" },
  { label: "Active",   value: "ACTIVE" },
  { label: "Pending",  value: "PENDING" },
  { label: "Eligible", value: "ELIGIBLE" },
  { label: "Locked",   value: "LOCKED" },
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number]["value"];

const STATUS_ORDER: Record<string, number> = {
  ACTIVE: 0,
  PENDING: 1,
  ELIGIBLE: 2,
  LOCKED: 3,
};

const PAYMENT_ACCOUNT_DETAILS = {
  bankName: "PineQuest Corporate Account",
  accountNumber: "0000 0000 0000",
  accountHolder: "PineQuest LLC",
} as const;

function getApiBase(): string {
  const base =
    typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GRAPHQL_URL
      ? process.env.NEXT_PUBLIC_GRAPHQL_URL
      : "https://team8-api.team8pinequest.workers.dev/";
  return base.replace(/\/$/, "");
}

function formatMoney(amount: number) {
  return `${amount.toLocaleString()}₮`;
}

function DashboardPaymentDialog({
  benefit,
  employeeName,
  requestStatus,
  submitting,
  submitError,
  onSubmit,
  onClose,
}: {
  benefit: BenefitEligibility;
  employeeName: string;
  requestStatus: string;
  submitting: boolean;
  submitError: string | null;
  onSubmit: () => Promise<void> | void;
  onClose: () => void;
}) {
  const totalAmount = benefit.benefit.amount ?? 0;
  const companyPercent = benefit.benefit.subsidyPercent;
  const employeePercent = benefit.benefit.employeePercent;
  const companyPays = Math.round((totalAmount * companyPercent) / 100);
  const employeePays = Math.round((totalAmount * employeePercent) / 100);
  const waitingForReview = requestStatus === "awaiting_payment_review";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <CreditCard className="h-3.5 w-3.5" />
          Payment Details
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">{benefit.benefit.name}</h2>
        <p className="mt-1 text-sm text-gray-500">Complete your payment step for this contract-based benefit.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">Total</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{formatMoney(totalAmount)}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-500">Company Pays</p>
            <p className="mt-2 text-lg font-semibold text-emerald-700">{formatMoney(companyPays)}</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-xs uppercase tracking-wide text-amber-500">Your Payment</p>
            <p className="mt-2 text-lg font-semibold text-amber-700">{formatMoney(employeePays)}</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Company Bank Account</p>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>{PAYMENT_ACCOUNT_DETAILS.bankName}</p>
            <p>{PAYMENT_ACCOUNT_DETAILS.accountHolder}</p>
            <p className="font-medium">{PAYMENT_ACCOUNT_DETAILS.accountNumber}</p>
            <p className="text-xs text-blue-700">Reference: {benefit.benefit.name} - {employeeName}</p>
          </div>
        </div>

        {waitingForReview && (
          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
            HR is checking your payment now.
          </div>
        )}
        {submitError && (
          <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting || waitingForReview}
            className={`inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition ${
              waitingForReview
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            }`}
          >
            {waitingForReview ? "Төлбөр илгээгдсэн" : submitting ? "Submitting..." : "Төлбөр төлсөн — Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { getToken } = useAuth();
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitEligibility | null>(null);
  const [requestBenefitId, setRequestBenefitId] = useState<string | null>(null);
  const [paymentBenefit, setPaymentBenefit] = useState<BenefitEligibility | null>(null);
  const [paymentRequestId, setPaymentRequestId] = useState<string | null>(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentSubmitError, setPaymentSubmitError] = useState<string | null>(null);

  const { employee, error, loading: employeeLoading } = useCurrentEmployee();

  const {
    data: benefitsData,
    error: benefitsError,
    loading: benefitsLoading,
    refetch: refetchBenefits,
  } = useGetMyBenefitsFullQuery();
  const { data: requestsData, refetch: refetchRequests } = useGetBenefitRequestsQuery();

  const myBenefits = (benefitsData?.myBenefits ?? []).filter(
    (benefit) => benefit.benefit.flowType !== "screen_time",
  );

  const filteredBenefits = myBenefits
    .filter((b) => {
      const matchesStatus = activeFilter === "ALL" || String(b.status).toUpperCase() === activeFilter;
      const matchesSearch = search.trim() === "" ||
        b.benefit.name.toLowerCase().includes(search.toLowerCase()) ||
        (b.benefit.vendorName ?? "").toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => (STATUS_ORDER[String(a.status).toUpperCase()] ?? 99) - (STATUS_ORDER[String(b.status).toUpperCase()] ?? 99));

  const latestRequestByBenefit = new Map(
    (requestsData?.benefitRequests ?? [])
      .slice()
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .map((request) => [request.benefitId, request]),
  );

  const subtitle = error
    ? "We couldn't load your employee profile."
    : "Here's an overview of your benefits";

  const stats = myBenefits.reduce(
    (acc, benefit) => {
      if (benefit.status === BenefitEligibilityStatus.Active) acc.active += 1;
      if (benefit.status === BenefitEligibilityStatus.Eligible) acc.eligible += 1;
      if (benefit.status === BenefitEligibilityStatus.Pending) acc.pending += 1;
      return acc;
    },
    { active: 0, eligible: 0, pending: 0 },
  );

  const isDashboardLoading = employeeLoading || benefitsLoading;
  const dashboardError = error ?? benefitsError ?? null;

  const submitPayment = async () => {
    if (!paymentRequestId) return;
    setSubmittingPayment(true);
    setPaymentSubmitError(null);
    try {
      const token = await getToken();
      const res = await fetch(`${getApiBase()}/api/benefit-requests/payment-submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ requestId: paymentRequestId }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: "Failed to submit payment." }));
        throw new Error((json as { error?: string }).error ?? "Failed to submit payment.");
      }
      await Promise.all([refetchRequests(), refetchBenefits()]);
      setPaymentBenefit(null);
      setPaymentRequestId(null);
    } catch (err) {
      setPaymentSubmitError(err instanceof Error ? err.message : "Failed to submit payment.");
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (isDashboardLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 flex-col items-center bg-[linear-gradient(180deg,#3652c5_0%,#ffffff_100%)]">
          <main className="w-full max-w-7xl px-8 py-8">
            {/* Heading skeleton */}
            <div>
              <div className="h-7 w-64 rounded-full bg-white/30 animate-pulse" />
              <div className="mt-2 h-3.5 w-48 rounded-full bg-white/20 animate-pulse" />
            </div>

            {/* Summary cards skeleton */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <SummaryCardSkeleton />
              <SummaryCardSkeleton />
              <SummaryCardSkeleton />
            </div>

            {/* Benefits section skeleton */}
            <section className="mt-8">
              {/* Section heading + search skeleton */}
              <div className="flex items-center justify-between gap-4">
                <div className="h-4 w-36 rounded-full bg-slate-200/80 animate-pulse" />
                <div className="h-9 w-48 rounded-xl bg-slate-200/80 animate-pulse" />
              </div>

              {/* Tabs skeleton */}
              <div className="mt-4 flex items-center gap-1">
                {[28, 52, 60, 60, 52].map((w, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-slate-200/80 animate-pulse"
                    style={{ width: w, height: 32 }}
                  />
                ))}
              </div>

              {/* Benefit cards skeleton */}
              <div className="mt-4 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))] [&>*]:min-w-0">
                {Array.from({ length: 8 }).map((_, i) => (
                  <BenefitCardSkeleton key={i} />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl px-8 py-8">
          <PageHeader
            title={`Good to see you, ${employee?.name ?? "Employee"}`}
            description={subtitle}
          />

          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <SummaryCard
              label="Active Benefits"
              value={stats.active}
              icon={<CheckCircle className="h-5 w-5" />}
            />
            <SummaryCard
              label="Eligible Benefits"
              value={stats.eligible}
              icon={<Sparkles className="h-5 w-5" />}
            />
            <SummaryCard
              label="Pending Requests"
              value={stats.pending}
              icon={<Clock className="h-5 w-5" />}
            />
          </div>

          {/* Benefits Overview */}
          <section className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold text-gray-900">Benefits Overview</h2>
              {/* Search */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48 rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-0"
                />
              </div>
            </div>

            {/* Status tabs */}
            <div className="mt-4 flex items-center gap-1">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setActiveFilter(f.value)}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeFilter === f.value
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))] [&>*]:min-w-0">
              {dashboardError ? (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  Failed to load benefit data.
                </div>
              ) : filteredBenefits.length === 0 ? (
                <div className="rounded-xl border border-gray-100 bg-white px-4 py-6 text-center text-sm text-gray-400">
                  No benefits found.
                </div>
              ) : (
                filteredBenefits.map((benefit) => (
                  <BenefitCard
                    key={benefit.benefitId}
                    benefit={benefit}
                    onClick={(selected) => {
                      const latestRequest = latestRequestByBenefit.get(selected.benefitId);
                      const latestStatus = latestRequest?.status?.toLowerCase();
                      const isPaymentPending =
                        selected.benefit.flowType === BenefitFlowType.Contract &&
                        (latestStatus === "awaiting_payment" || latestStatus === "awaiting_payment_review");

                      if (isPaymentPending && latestRequest) {
                        setPaymentSubmitError(null);
                        setPaymentBenefit(selected);
                        setPaymentRequestId(latestRequest.id);
                        return;
                      }
                      setSelectedBenefit(selected);
                    }}
                  />
                ))
              )}
            </div>
          </section>
        </main>

        {selectedBenefit && (
          <BenefitDetailModal
            benefit={selectedBenefit}
            onClose={() => setSelectedBenefit(null)}
            onRequestBenefit={(benefitId) => {
              setSelectedBenefit(null);
              setRequestBenefitId(benefitId);
            }}
          />
        )}

        {requestBenefitId && (
          <BenefitRequestModal
            benefitId={requestBenefitId}
            onClose={() => setRequestBenefitId(null)}
            onSuccess={() => setRequestBenefitId(null)}
          />
        )}

        {paymentBenefit && paymentRequestId && (
          <DashboardPaymentDialog
            benefit={paymentBenefit}
            employeeName={employee?.name ?? "Employee"}
            requestStatus={latestRequestByBenefit.get(paymentBenefit.benefitId)?.status?.toLowerCase() ?? "awaiting_payment"}
            submitting={submittingPayment}
            submitError={paymentSubmitError}
            onSubmit={submitPayment}
            onClose={() => {
              setPaymentBenefit(null);
              setPaymentRequestId(null);
              setPaymentSubmitError(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
