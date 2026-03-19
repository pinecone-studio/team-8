"use client";

import { use, useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, FileText, X } from "lucide-react";
import Sidebar from "../_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import { getContractProxyUrl } from "@/lib/contracts";

type ContractRow = {
  id: string;
  benefitId: string;
  benefitName?: string | null;
  vendorName: string;
  version: string;
  effectiveDate: string;
  expiryDate: string;
  isActive: boolean;
  viewUrl?: string | null;
};

function formatDate(raw: string | null | undefined) {
  if (!raw) return "—";
  try {
    return new Date(raw).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return raw;
  }
}

// ── Skeleton components ───────────────────────────────────────────────────────

function HistoricalVersionsSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Header row — mirrors real thead: Benefit / Vendor / Version / Effective / Expired / action */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="grid grid-cols-[2fr_1.5fr_80px_140px_140px_60px] items-center gap-4 px-5 py-3">
          {["w-14", "w-12", "w-14", "w-16", "w-12"].map((w, i) => (
            <div
              key={i}
              className={`h-2.5 ${w} rounded-full bg-slate-200/80 animate-pulse`}
            />
          ))}
          <div className="h-2.5 w-8 rounded-full bg-slate-200/80 animate-pulse justify-self-end" />
        </div>
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[2fr_1.5fr_80px_140px_140px_60px] items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0"
        >
          {/* Benefit name — medium-long bar */}
          <div className="h-3.5 w-40 rounded-full bg-slate-200/80 animate-pulse" />
          {/* Vendor — medium bar */}
          <div className="h-3 w-28 rounded-full bg-slate-200/80 animate-pulse" />
          {/* Version pill */}
          <div className="h-5 w-10 rounded-full bg-slate-200/80 animate-pulse" />
          {/* Effective date */}
          <div className="h-3 w-24 rounded-full bg-slate-200/80 animate-pulse" />
          {/* Expired date */}
          <div className="h-3 w-24 rounded-full bg-slate-200/80 animate-pulse" />
          {/* View link text */}
          <div className="h-3 w-8 rounded-full bg-slate-200/80 animate-pulse justify-self-end" />
        </div>
      ))}
    </div>
  );
}

function ContractCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Top row: icon circle + title/vendor + Active badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Icon circle */}
          <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-slate-200/80 animate-pulse" />
          <div className="flex-1 space-y-1.5">
            {/* Benefit title — medium-wide bar */}
            <div className="h-4 w-3/5 rounded-full bg-slate-200/80 animate-pulse" />
            {/* Vendor name — shorter bar */}
            <div className="h-3 w-2/5 rounded-full bg-slate-200/80 animate-pulse" />
          </div>
        </div>
        {/* Active status badge */}
        <div className="h-5 w-14 shrink-0 rounded-full bg-slate-200/80 animate-pulse" />
      </div>

      {/* Info grid: Version / Effective / Expires
          Each cell = LABEL row (tiny uppercase) + VALUE row (larger) */}
      <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-gray-100 bg-gray-50/60">
        {[
          { label: "w-12", value: "w-8" } /* Version */,
          { label: "w-16", value: "w-20" } /* Effective */,
          { label: "w-12", value: "w-20" } /* Expires */,
        ].map((col, i) => (
          <div key={i} className="px-4 py-3 space-y-2">
            {/* Column label e.g. "VERSION" — tiny bar */}
            <div
              className={`h-2 ${col.label} rounded-full bg-slate-200/80 animate-pulse`}
            />
            {/* Column value e.g. "v1.2" or "Jan 1, 2025" — larger bar */}
            <div
              className={`h-3.5 ${col.value} rounded-full bg-slate-200/80 animate-pulse`}
            />
          </div>
        ))}
      </div>

      {/* View Contract button: icon placeholder + text bar */}
      <div className="mt-4">
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2">
          <div className="h-4 w-4 rounded-sm bg-slate-200/80 animate-pulse shrink-0" />
          <div className="h-3.5 w-24 rounded-full bg-slate-200/80 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ── Contract Preview Modal ───────────────────────────────────────────────────

function ContractPreviewModal({
  contract,
  onClose,
}: {
  contract: ContractRow;
  onClose: () => void;
}) {
  const contractUrl = getContractProxyUrl(contract.viewUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-3xl flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {contract.benefitName ?? contract.benefitId}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span>{contract.vendorName}</span>
              <span className="text-gray-200">·</span>
              <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                v{contract.version}
              </span>
              <span className="text-gray-200">·</span>
              <span>Effective {formatDate(contract.effectiveDate)}</span>
              {contract.expiryDate && (
                <>
                  <span className="text-gray-200">·</span>
                  <span>Expires {formatDate(contract.expiryDate)}</span>
                </>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* PDF Viewer */}
        {contractUrl ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            <iframe
              src={contractUrl}
              className="flex-1 min-h-[500px] border-none bg-gray-50"
              title={`Contract: ${contract.benefitName}`}
            />
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
              <a
                href={contractUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Open in new tab
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 bg-gray-50">
            <div className="rounded-full bg-gray-100 p-5">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Contract preview unavailable
              </p>
              <p className="mt-1 text-xs text-gray-500 max-w-xs">
                The document preview link has not been generated yet. Please
                contact HR for a copy.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Active Contract Card ─────────────────────────────────────────────────────

function ActiveContractCard({
  contract,
  onPreview,
}: {
  contract: ContractRow;
  onPreview: (c: ContractRow) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-0.5 shrink-0 rounded-full bg-emerald-50 p-2 ring-1 ring-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-gray-900 leading-snug truncate">
              {contract.benefitName ?? contract.benefitId}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {contract.vendorName}
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
          Active
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 divide-x divide-gray-100 rounded-xl border border-gray-100 bg-gray-50/60">
        <div className="px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Version
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-800">
            v{contract.version}
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Effective
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-800">
            {formatDate(contract.effectiveDate)}
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Expires
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-800">
            {contract.expiryDate
              ? formatDate(contract.expiryDate)
              : "No expiry"}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => onPreview(contract)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
        >
          <FileText className="h-4 w-4 text-gray-400" />
          View Contract
        </button>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

type PageProps = { params?: Promise<Record<string, string | string[]>> };

export default function ContractsPage({ params }: PageProps) {
  if (params) use(params);
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [previousContracts, setPreviousContracts] = useState<ContractRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewContract, setPreviewContract] = useState<ContractRow | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadContracts() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/contracts", {
          method: "GET",
          cache: "no-store",
        });

        let data: { contracts?: ContractRow[]; error?: string } | null = null;
        try {
          data = await res.json();
        } catch {
          throw new Error("Contracts API did not return valid JSON.");
        }

        if (!res.ok) {
          throw new Error(data?.error || "Failed to fetch contracts");
        }

        console.log("contracts data:", data);

        const nextContracts = data?.contracts ?? [];
        if (!cancelled) {
          setPreviousContracts(nextContracts);
          setContracts(nextContracts);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch contracts",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadContracts();

    return () => {
      cancelled = true;
    };
  }, []);

  const active = contracts.filter((c) => c.isActive);
  const historical = contracts.filter((c) => !c.isActive);

  const activeSkeletonCount =
    active.length || previousContracts.filter((c) => c.isActive).length || 4;
  const historicalSkeletonRows =
    historical.length || previousContracts.filter((c) => !c.isActive).length || 3;

  // Only declare these states true once data has actually been received
  const dataReceived = !loading;
  const hasCurrentContracts = active.length > 0;
  const hasHistoricalVersions = historical.length > 0;
  const showEmptyState =
    !loading &&
    !error &&
    dataReceived &&
    !hasCurrentContracts &&
    !hasHistoricalVersions;

  return (
    <>
      {previewContract && (
        <ContractPreviewModal
          contract={previewContract}
          onClose={() => setPreviewContract(null)}
        />
      )}

      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <div className="flex flex-1 flex-col items-center">
          <main className="w-full max-w-5xl p-8">
            <h1 className="text-xl font-semibold text-gray-900">
              Vendor Contracts
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Active contracts for benefits you are enrolled in or have a
              pending request for.
            </p>

            {loading ? (
              <>
                {/* Current Contracts skeleton */}
                <section className="mt-8">
                  <div className="mb-4 h-3 w-32 rounded-full bg-slate-200/80 animate-pulse" />
                  <div className="grid gap-4 md:grid-cols-2">
                    {Array.from({ length: activeSkeletonCount }).map((_, i) => (
                      <ContractCardSkeleton key={i} />
                    ))}
                  </div>
                </section>

                {/* Historical Versions skeleton */}
                <section className="mt-8">
                  <div className="mb-4 h-3 w-36 rounded-full bg-slate-200/80 animate-pulse" />
                  <HistoricalVersionsSkeleton rows={historicalSkeletonRows} />
                </section>
              </>
            ) : error ? (
              <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {error}
              </div>
            ) : showEmptyState ? (
              <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600">
                  No contracts available
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  You have no active enrollments or pending requests with vendor
                  contracts attached. Once HR uploads a contract for a benefit
                  you are enrolled in or requesting, it will appear here.
                </p>
              </div>
            ) : (
              <>
                {/* Active contracts */}
                {active.length > 0 && (
                  <section className="mt-8">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                      Current Contracts
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {active.map((c) => (
                        <ActiveContractCard
                          key={c.id}
                          contract={c}
                          onPreview={setPreviewContract}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Historical contracts */}
                {historical.length > 0 && (
                  <section className="mt-8">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                      Historical Versions
                    </h2>
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <table className="min-w-full text-left">
                        <thead className="border-b border-slate-200 bg-slate-50">
                          <tr>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Benefit
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Vendor
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Version
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Effective
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Expired
                            </th>
                            <th className="px-5 py-3" />
                          </tr>
                        </thead>
                        <tbody>
                          {historical.map((row) => (
                            <tr
                              key={row.id}
                              className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                            >
                              <td className="px-5 py-4 text-sm font-medium text-slate-700">
                                {row.benefitName ?? row.benefitId}
                              </td>
                              <td className="px-5 py-4 text-sm text-slate-500">
                                {row.vendorName}
                              </td>
                              <td className="px-5 py-4">
                                <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                  v{row.version}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-sm text-slate-500">
                                {formatDate(row.effectiveDate)}
                              </td>
                              <td className="px-5 py-4 text-sm text-slate-500">
                                {formatDate(row.expiryDate)}
                              </td>
                              <td className="px-5 py-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => setPreviewContract(row)}
                                  className="text-xs font-medium text-blue-600 hover:underline"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
