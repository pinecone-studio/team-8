import type { BenefitEligibilityStatus } from "@/graphql/generated/graphql";

type Props = {
  status: BenefitEligibilityStatus;
};

const styles: Record<string, string> = {
  ACTIVE:   "bg-emerald-500 text-white",
  ELIGIBLE: "bg-emerald-500 text-white",
  PENDING:  "bg-amber-400 text-white",
  LOCKED:   "bg-gray-300 text-gray-700",
};

export default function StatusBadge({ status }: Props) {
  const key = String(status).toUpperCase();
  const style = styles[key] ?? "bg-gray-200 text-gray-600";
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${style}`}>
      {key}
    </span>
  );
}
