"use client";

import { X, CheckCircle2, Clock, XCircle, MapPin, DollarSign } from "lucide-react";
import type { BenefitEligibility } from "@/graphql/generated/graphql";
import { BenefitEligibilityStatus } from "@/graphql/generated/graphql";

type Props = {
  benefit: BenefitEligibility;
  onClose: () => void;
  onRequestBenefit?: (benefitId: string) => void;
};

function formatCategory(cat: string) {
  return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
}

function StatusPill({ status }: { status: BenefitEligibilityStatus }) {
  const map: Record<BenefitEligibilityStatus, string> = {
    [BenefitEligibilityStatus.Eligible]: "bg-emerald-600 text-white shadow-sm",
    [BenefitEligibilityStatus.Active]: "bg-emerald-600 text-white shadow-sm",
    [BenefitEligibilityStatus.Pending]: "bg-amber-500 text-white shadow-sm",
    [BenefitEligibilityStatus.Locked]: "bg-red-500 text-white shadow-sm",
  };
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${map[status] ?? "bg-gray-200 text-gray-700"}`}
    >
      {status}
    </span>
  );
}

export default function BenefitDetailModal({ benefit, onClose, onRequestBenefit }: Props) {
  const vendor = benefit.benefit.vendorName ?? "Internal Benefit";
  const b = benefit.benefit;
  const isSelfService = b.flowType === "self_service";
  const description =
    b.description ??
    b.optionsDescription ??
    `Company covers ${b.subsidyPercent}%. Employee share ${b.employeePercent}%.`;
  const category = formatCategory(b.category ?? "Other");

  const isEligible =
    benefit.status === BenefitEligibilityStatus.Eligible ||
    benefit.status === BenefitEligibilityStatus.Active;

  const failedRules = benefit.ruleEvaluation.filter((r) => !r.passed);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 bg-gray-50/80 px-6 py-5">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">{b.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{vendor}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StatusPill status={benefit.status} />
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 transition hover:bg-white hover:text-gray-600 hover:shadow-sm"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {/* Image */}
          {b.imageUrl && (
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}/api/benefits/image?key=${encodeURIComponent(b.imageUrl)}`}
              alt={b.name}
              className="mb-4 h-40 w-full rounded-xl object-cover"
            />
          )}

          {/* Description */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Description</p>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-700">{description}</p>
          </div>

          {/* Amount + Subsidy */}
          {b.amount != null && (
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Price</p>
                <div className="mt-1.5 flex items-center gap-1 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-800 ring-1 ring-gray-100">
                  <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                  {b.amount.toLocaleString()}₮
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Company Covers</p>
                <div className="mt-1.5 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  {b.subsidyPercent}% ({Math.round(b.amount * b.subsidyPercent / 100).toLocaleString()}₮)
                </div>
              </div>
            </div>
          )}

          {/* Category + Location */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Category</p>
              <div className="mt-1.5 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-800 ring-1 ring-gray-100">
                {category}
              </div>
            </div>
            {b.location && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Location</p>
                <div className="mt-1.5 flex items-center gap-1.5 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-800 ring-1 ring-gray-100">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  {b.location}
                </div>
              </div>
            )}
          </div>

          {/* Eligibility status */}
          <div className="mt-5">
            {benefit.status === BenefitEligibilityStatus.Active ? (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-800">
                  {isSelfService
                    ? "This benefit is active for you automatically."
                    : "You are eligible for this benefit"}
                </p>
              </div>
            ) : isEligible ? (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-800">
                  You are eligible for this benefit
                </p>
              </div>
            ) : benefit.status === BenefitEligibilityStatus.Locked && failedRules.length > 0 ? (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="mb-2 text-sm font-semibold text-red-700">Дараах шаардлагуудыг хангаагүй байна:</p>
                <ul className="space-y-1.5">
                  {failedRules.map((r) => (
                    <li key={r.ruleType} className="flex items-start gap-2 text-sm text-red-600">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                      <span>{r.reason}</span>
                    </li>
                  ))}
                </ul>
                {benefit.failedRule?.errorMessage && (
                  <p className="mt-2 text-xs text-red-500">{benefit.failedRule.errorMessage}</p>
                )}
              </div>
            ) : benefit.status === BenefitEligibilityStatus.Pending ? (
              <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                <Clock className="h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-sm font-medium text-amber-800">Хүсэлт хянагдаж байна.</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex items-center gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
          {benefit.status === BenefitEligibilityStatus.Eligible && !isSelfService && (
            <>
              {onRequestBenefit ? (
                <button
                  type="button"
                  onClick={() => onRequestBenefit(benefit.benefitId)}
                  className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-gray-800 hover:shadow-lg active:scale-[0.99]"
                >
                  Request
                </button>
              ) : (
                <a
                  href={`/employee-panel/benefits/${benefit.benefitId}/request`}
                  className="inline-flex rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-gray-800 hover:shadow-lg active:scale-[0.99]"
                >
                  Request
                </a>
              )}
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-gray-900 hover:shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
