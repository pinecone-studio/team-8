import type { BenefitEligibilityStatus } from "@/graphql/generated/graphql";

type Props = {
  status: BenefitEligibilityStatus;
};

const styles: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-600 border-green-200",
  ELIGIBLE: "bg-blue-50 text-blue-600 border-blue-200",
  PENDING: "bg-orange-50 text-orange-600 border-orange-200",
  LOCKED: "bg-red-50 text-red-600 border-red-200",
};

export default function StatusBadge({ status }: Props) {
  const key = String(status).toUpperCase();
  const style = styles[key] ?? "bg-gray-50 text-gray-600 border-gray-200";
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium capitalize ${style}`}
    >
      {key.charAt(0) + key.slice(1).toLowerCase()}
    </span>
  );
}
