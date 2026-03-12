type Props = {
  label: string;
  value: number;
  valueClassName?: string;
};

export default function SummaryCard({ label, value, valueClassName }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <h3
        className={`mt-2 text-4xl font-bold text-gray-900 ${valueClassName ?? ""}`}
      >
        {value}
      </h3>
    </div>
  );
}
