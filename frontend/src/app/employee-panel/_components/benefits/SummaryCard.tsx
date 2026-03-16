type Props = {
  label: string;
  value: number;
  icon?: React.ReactNode;
};

export default function SummaryCard({ label, value, icon }: Props) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{label}</p>
        <p className="mt-2 text-3xl font-bold tabular-nums text-gray-900">{value}</p>
      </div>
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          {icon}
        </div>
      )}
    </div>
  );
}
