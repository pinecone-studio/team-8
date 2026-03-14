type Props = {
  label: string;
  value: number;
  valueClassName?: string;
};

export default function SummaryCard({ label, value, valueClassName }: Props) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white px-3 py-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`mt-1 text-xl font-semibold tabular-nums text-gray-900 ${valueClassName ?? ""}`}>
        {value}
      </p>
    </div>
  );
}
