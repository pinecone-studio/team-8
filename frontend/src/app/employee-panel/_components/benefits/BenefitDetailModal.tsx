"use client";

import { X, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { BenefitEligibility } from "@/graphql/generated/graphql";
import { BenefitEligibilityStatus } from "@/graphql/generated/graphql";

type Props = {
  benefit: BenefitEligibility;
  onClose: () => void;
  onRequestBenefit?: (benefitId: string) => void;
};

function formatRuleLabel(value: string) {
  return value
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

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
  const description =
    b.description ??
    b.optionsDescription ??
    `Company covers ${b.subsidyPercent}%. Employee share ${b.employeePercent}%.`;
  const category = formatCategory(b.category ?? "Other");
  const passedCount = benefit.ruleEvaluation.filter((r) => r.passed).length;
  const totalRules = benefit.ruleEvaluation.length;

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

        <div className="px-6 py-5">
          {/* Description */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Description</p>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-700">{description}</p>
          </div>

          {/* Category & Subsidy */}
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Category</p>
              <div className="mt-1.5 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-800 ring-1 ring-gray-100">
                {category}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Subsidy</p>
              <div className="mt-1.5 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
                {b.subsidyPercent}%
              </div>
            </div>
          </div>

          {/* Eligibility */}
          {totalRules > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Eligibility</p>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  {passedCount}/{totalRules}
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {benefit.ruleEvaluation.map((item) => (
                  <li
                    key={item.ruleType}
                    className="flex items-center gap-3 rounded-lg py-2 px-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    {item.passed ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                    )}
                    {formatRuleLabel(item.ruleType)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Status message when not eligible */}
          {benefit.status === BenefitEligibilityStatus.Locked && benefit.failedRule?.errorMessage && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">
              {benefit.failedRule.errorMessage}
            </p>
          )}
          {benefit.status === BenefitEligibilityStatus.Active && (
            <p className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 ring-1 ring-emerald-100">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              You are enrolled in this benefit.
            </p>
          )}
          {benefit.status === BenefitEligibilityStatus.Pending && (
            <p className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-100">
              <Clock className="h-4 w-4 shrink-0 text-amber-600" />
              Awaiting approval.
            </p>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex items-center gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
          {benefit.status === BenefitEligibilityStatus.Eligible && (
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

