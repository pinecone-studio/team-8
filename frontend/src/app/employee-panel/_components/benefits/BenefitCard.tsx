import Link from "next/link";
import StatusBadge from "./StatusBadge";
import type {
  BenefitEligibility,
  BenefitEligibilityStatus,
} from "@/graphql/generated/graphql";

type Props = {
  benefit: BenefitEligibility;
};

export default function BenefitCard({ benefit }: Props) {
  const status = benefit.status as BenefitEligibilityStatus;
  const subsidyLabel = `${benefit.benefit.subsidyPercent}%`;
  const vendor = benefit.benefit.vendorName ?? "Vendor";
  const description =
    benefit.benefit.optionsDescription ?? "Benefit details are not available.";

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
        <StatusBadge status={status} />
        <span className="text-sm uppercase tracking-wide text-gray-400">
          {benefit.benefit.category}
        </span>
      </div>

      <p className="mt-5 text-base leading-7 text-gray-600">
        {description}
      </p>

      <p className="mt-5 text-lg font-semibold text-gray-900">
        {subsidyLabel} subsidy
      </p>
    </Link>
  );
}
