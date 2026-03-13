import Link from "next/link";
import type { BenefitEligibility } from "@/graphql/generated/graphql";
import StatusBadge from "./StatusBadge";

type Props = {
  benefit: BenefitEligibility;
};

function buildDescription(benefit: BenefitEligibility) {
  if (benefit.failedRule?.errorMessage) return benefit.failedRule.errorMessage;
  if (benefit.benefit.optionsDescription) return benefit.benefit.optionsDescription;
  if (benefit.benefit.requiresContract) {
    return `Requires contract acceptance. Employee share ${benefit.benefit.employeePercent}%.`;
  }

  return `Company covers ${benefit.benefit.subsidyPercent}%. Employee share ${benefit.benefit.employeePercent}%.`;
}

export default function BenefitCard({ benefit }: Props) {
  const subsidyLabel = `${benefit.benefit.subsidyPercent}%`;
  const vendor = benefit.benefit.vendorName ?? "Internal Benefit";

  return (
    <Link
      href={`/employee-panel/benefits/${benefit.benefitId}`}
      className="block rounded-lg border border-gray-100 bg-white p-3 transition-colors hover:border-gray-200 hover:bg-gray-50/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">
            {benefit.benefit.name}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">{vendor}</p>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <StatusBadge status={benefit.status} />
        <span className="text-xs text-gray-400">{benefit.benefit.category}</span>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-gray-600 line-clamp-2">
        {buildDescription(benefit)}
      </p>

      <p className="mt-2 text-xs font-medium text-gray-700">{subsidyLabel} subsidy</p>
    </Link>
  );
}
