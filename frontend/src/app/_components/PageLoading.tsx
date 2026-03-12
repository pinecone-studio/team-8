"use client";

/** Standard loading: spinner 8x8, text-sm. Use same everywhere. */
const SPINNER_SIZE = "h-8 w-8";
const SPINNER_SVG = (
  <svg
    className={`${SPINNER_SIZE} animate-spin text-gray-400`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

type Props = {
  message?: string;
  className?: string;
  /** Inline: no card, just spinner + text (e.g. inside table) */
  inline?: boolean;
};

export default function PageLoading({ message = "Loading...", className = "", inline = false }: Props) {
  if (inline) {
    return (
      <div className={`flex items-center justify-center gap-3 text-gray-500 ${className}`} role="status" aria-label="Loading">
        {SPINNER_SVG}
        <span className="text-sm">{message}</span>
      </div>
    );
  }
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 text-gray-500 ${className}`}
      role="status"
      aria-label="Loading"
    >
      {SPINNER_SVG}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
