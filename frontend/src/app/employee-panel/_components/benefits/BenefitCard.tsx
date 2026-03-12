import Link from "next/link";
import StatusBadge from "./StatusBadge";

export type DashboardBenefitCard = {
  category: string;
  description: string;
  id: string;
  name: string;
  status: "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING";
  subsidy: string;
  vendor: string;
};

type Props = {
  benefit: DashboardBenefitCard;
};

export default function BenefitCard({ benefit }: Props) {
  return (
    <Link
      href={`/employee-panel/benefits/${benefit.id}`}
      className="block rounded-2xl border border-gray-200 bg-white p-6 transition hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">
            {benefit.name}
          </h3>
          <p className="mt-1 text-base text-gray-500">{benefit.vendor}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <StatusBadge status={benefit.status} />
        <span className="text-sm uppercase tracking-wide text-gray-400">
          {benefit.category}
        </span>
      </div>

      <p className="mt-5 text-base leading-7 text-gray-600">
        {benefit.description}
      </p>

      <p className="mt-5 text-lg font-semibold text-gray-900">
        {benefit.subsidy} subsidy
      </p>
    </Link>
  );
}
