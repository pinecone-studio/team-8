export default function SummaryCardSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm">
      <div>
        {/* Label text row */}
        <div className="h-2.5 w-28 rounded-full bg-slate-200/80 animate-pulse" />
        {/* Big number placeholder */}
        <div className="mt-3 h-9 w-10 rounded-md bg-slate-200/80 animate-pulse" />
        {/* Sub-label row below number */}
        <div className="mt-1.5 h-2 w-16 rounded-full bg-slate-200/80 animate-pulse" />
      </div>
      {/* Icon circle */}
      <div className="h-10 w-10 rounded-full bg-slate-200/80 animate-pulse" />
    </div>
  );
}
