import { cn } from "@/lib/utils";

/**
 * A single horizontal skeleton bar.
 * Pass Tailwind width + height classes to control size.
 * e.g. <SkeletonLine className="h-3 w-1/2" />
 */
export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-full bg-slate-200/80 animate-pulse", className)}
    />
  );
}

/**
 * A label-on-left / value-on-right skeleton row.
 * Mirrors content rows like "Director | Jon M. Chu".
 * Renders a flex row with a small left bar and a longer right bar.
 *
 * Pass `divider` to render a separator line below.
 */
export function SkeletonTextRow({
  labelWidth = "w-20",
  valueWidth = "w-36",
  divider = false,
  className,
}: {
  labelWidth?: string;
  valueWidth?: string;
  divider?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between gap-4 py-2.5">
        <div
          className={cn(
            "h-2.5 shrink-0 rounded-full bg-slate-200/80 animate-pulse",
            labelWidth,
          )}
        />
        <div
          className={cn(
            "h-3 rounded-full bg-slate-200/80 animate-pulse",
            valueWidth,
          )}
        />
      </div>
      {divider && <div className="h-px w-full bg-slate-100" />}
    </div>
  );
}

/**
 * A pill / badge shaped skeleton.
 * e.g. <SkeletonPill className="h-5 w-16" />
 */
export function SkeletonPill({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-full bg-slate-200/80 animate-pulse", className)}
    />
  );
}

/**
 * A circular skeleton for avatars and icon placeholders.
 * e.g. <SkeletonCircle className="h-8 w-8" />
 */
export function SkeletonCircle({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-full bg-slate-200/80 animate-pulse", className)}
    />
  );
}

/**
 * A button-shaped skeleton with a short inner text line.
 * Preserves button layout so no layout shift on load.
 * e.g. <SkeletonButton textWidth="w-20" />
 */
export function SkeletonButton({
  textWidth = "w-20",
  className,
}: {
  textWidth?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2",
        className,
      )}
    >
      <div
        className={cn(
          "h-3 rounded-full bg-slate-200/80 animate-pulse",
          textWidth,
        )}
      />
    </div>
  );
}
