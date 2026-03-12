type Props = {
  status: "ACTIVE" | "ELIGIBLE" | "PENDING" | "LOCKED";
};

const styles = {
  ACTIVE: "bg-green-50 text-green-600 border-green-200",
  ELIGIBLE: "bg-blue-50 text-blue-600 border-blue-200",
  PENDING: "bg-orange-50 text-orange-600 border-orange-200",
  LOCKED: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
