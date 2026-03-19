import Link from "next/link";
import type { BenefitEligibility } from "@/graphql/generated/graphql";
import StatusBadge from "./StatusBadge";

type Props = {
  benefit: BenefitEligibility;
  onClick?: (benefit: BenefitEligibility) => void;
};

function buildDescription(benefit: BenefitEligibility) {
  if (benefit.benefit.flowType === "self_service") {
    if (benefit.failedRule?.errorMessage) return benefit.failedRule.errorMessage;
    return (
      benefit.benefit.description ??
      benefit.benefit.optionsDescription ??
      "This benefit is activated automatically when you meet the eligibility requirements."
    );
  }
  if (benefit.failedRule?.errorMessage) return benefit.failedRule.errorMessage;
  if (benefit.benefit.description) return benefit.benefit.description;
  if (benefit.benefit.optionsDescription) return benefit.benefit.optionsDescription;
  if (benefit.benefit.requiresContract) {
    return `Requires contract acceptance. Employee share ${benefit.benefit.employeePercent}%.`;
  }
  return `Company covers ${benefit.benefit.subsidyPercent}%. Employee share ${benefit.benefit.employeePercent}%.`;
}

export default function BenefitCard({ benefit, onClick }: Props) {
  const vendor = benefit.benefit.vendorName ?? "Internal Benefit";

  const content = (
    <div className="flex h-full flex-col">
      {/* Top */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 leading-snug">
          {benefit.benefit.name}
        </h3>
        <p className="mt-0.5 text-xs text-gray-400">{vendor}</p>
      </div>

      {/* Badges */}
      <div className="mt-3 flex items-center gap-2">
        <StatusBadge status={benefit.status} />
        <span className="text-[11px] font-medium capitalize text-gray-400">
          {benefit.benefit.category}
        </span>
      </div>

      {/* Description */}
      <p className="mt-3 text-xs leading-relaxed text-gray-500 line-clamp-2 flex-1">
        {buildDescription(benefit)}
      </p>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(benefit)}
        className="block h-full w-full min-w-0 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:border-gray-200 hover:shadow-md"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={`/employee-panel/benefits/${benefit.benefitId}`}
      className="block h-full w-full min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-gray-200 hover:shadow-md"
    >
      {content}
    </Link>
  );
}
