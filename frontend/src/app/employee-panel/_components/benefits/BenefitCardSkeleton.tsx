export default function BenefitCardSkeleton() {
  return (
    <div className="h-full w-full min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col">
      {/* Title */}
      <div className="h-4 w-3/5 rounded-full bg-slate-200/80 animate-pulse" />
      {/* Vendor / subtitle */}
      <div className="mt-1.5 h-2.5 w-2/5 rounded-full bg-slate-200/80 animate-pulse" />

      {/* Badge row: status pill + category text + subsidy % */}
      <div className="mt-3 flex items-center gap-2">
        <div className="h-5 w-16 rounded-full bg-slate-200/80 animate-pulse" />
        <div className="h-2.5 w-14 rounded-full bg-slate-200/80 animate-pulse" />
        <div className="h-2.5 w-10 rounded-full bg-slate-200/80 animate-pulse" />
      </div>

      {/* Description paragraph — 3 full-width rows like real body text */}
      <div className="mt-3 space-y-1.5 flex-1">
        <div className="h-2.5 w-full rounded-full bg-slate-200/80 animate-pulse" />
        <div className="h-2.5 w-11/12 rounded-full bg-slate-200/80 animate-pulse" />
        <div className="h-2.5 w-4/5 rounded-full bg-slate-200/80 animate-pulse" />
      </div>

      {/* Bottom action row — divider + status label + button */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="h-2.5 w-20 rounded-full bg-slate-200/80 animate-pulse" />
        <div className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5">
          <div className="h-2.5 w-16 rounded-full bg-slate-200/80 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
