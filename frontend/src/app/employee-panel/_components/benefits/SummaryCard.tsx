type Props = {
  label: string;
  value: number;
  valueClassName?: string;
};

export default function SummaryCard({ label, value, valueClassName }: Props) {
  return (
    <div className="rounded-lg border border-border bg-card px-5 py-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums text-card-foreground ${valueClassName ?? ""}`}>
        {value}
      </p>
    </div>
  );
}
