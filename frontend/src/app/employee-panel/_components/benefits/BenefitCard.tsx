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
      className="block rounded-2xl border border-gray-200 bg-white p-6 transition hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">
            {benefit.benefit.name}
          </h3>
          <p className="mt-1 text-base text-gray-500">{vendor}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <StatusBadge status={benefit.status} />
        <span className="text-sm uppercase tracking-wide text-gray-400">
          {benefit.benefit.category}
        </span>
      </div>

      <p className="mt-5 text-base leading-7 text-gray-600">
        {buildDescription(benefit)}
      </p>

      <p className="mt-5 text-lg font-semibold text-gray-900">
        {subsidyLabel} subsidy
      </p>
    </Link>
  );
}
