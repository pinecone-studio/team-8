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
      className="block h-full w-full min-w-0 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30 hover:bg-accent/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-card-foreground">
            {benefit.benefit.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{vendor}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <StatusBadge status={benefit.status} />
        <span className="text-sm text-muted-foreground">{benefit.benefit.category}</span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {buildDescription(benefit)}
      </p>

      <p className="mt-3 text-sm font-medium text-foreground">{subsidyLabel} subsidy</p>
    </Link>
  );
}
