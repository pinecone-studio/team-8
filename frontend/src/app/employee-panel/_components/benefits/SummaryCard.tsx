type Props = {
  label: string;
  value: number;
  valueClassName?: string;
};

export default function SummaryCard({ label, value, valueClassName }: Props) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-xl font-semibold tabular-nums text-card-foreground ${valueClassName ?? ""}`}>
        {value}
      </p>
    </div>
  );
}
