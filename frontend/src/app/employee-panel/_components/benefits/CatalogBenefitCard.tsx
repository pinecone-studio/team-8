"use client";

import Link from "next/link";
import { Heart, Laptop, Lock, TrendingUp, Users } from "lucide-react";
import type { BenefitEligibility } from "@/graphql/generated/graphql";
import { BenefitEligibilityStatus } from "@/graphql/generated/graphql";
import StatusBadge from "./StatusBadge";

function CategoryIcon({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const key = category?.toLowerCase().replace(/\s+/g, "") ?? "default";
  if (key === "wellness") return <Heart className={className} />;
  if (key === "equipment") return <Laptop className={className} />;
  if (key === "financial") return <TrendingUp className={className} />;
  return <Users className={className} />;
}

function buildDescription(benefit: BenefitEligibility) {
  if (benefit.failedRule?.errorMessage) return benefit.failedRule.errorMessage;
  if (benefit.benefit.optionsDescription) return benefit.benefit.optionsDescription;
  if (benefit.benefit.requiresContract) {
    return `Requires contract acceptance. Employee share ${benefit.benefit.employeePercent}%.`;
  }
  return `Company covers ${benefit.benefit.subsidyPercent}%. Employee share ${benefit.benefit.employeePercent}%.`;
}

type Props = {
  benefit: BenefitEligibility;
};

export default function CatalogBenefitCard({ benefit }: Props) {
  const provider = benefit.benefit.vendorName ?? "Company";
  const isLocked = benefit.status === BenefitEligibilityStatus.Locked;

  return (
    <Link
      href={`/employee-panel/benefits/${benefit.benefitId}`}
      className="block rounded-2xl border border-gray-200 bg-white p-6 transition duration-200 hover:border-gray-300 hover:shadow-md hover:bg-gray-50/50 active:scale-[0.98] active:bg-gray-50 active:shadow-inner"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
          <CategoryIcon category={benefit.benefit.category ?? ""} className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {benefit.benefit.name}
            </h3>
            {isLocked && <Lock className="h-5 w-5 shrink-0 text-red-500" aria-hidden />}
          </div>
          <p className="mt-1 text-sm text-gray-500">{provider}</p>
          <div className="mt-4 flex items-center gap-3">
            <StatusBadge status={benefit.status} />
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {benefit.benefit.category?.toUpperCase() ?? "BENEFIT"}
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-600">
            {buildDescription(benefit)}
          </p>
          <p className="mt-4 text-base font-semibold text-gray-900">
            {benefit.benefit.subsidyPercent}% subsidy
          </p>
        </div>
      </div>
    </Link>
  );
}
