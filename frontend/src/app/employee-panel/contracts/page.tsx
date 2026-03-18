"use client";

import { use, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { CheckCircle2, ExternalLink, FileText, X } from "lucide-react";
import Sidebar from "../_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";

const GET_CONTRACTS = gql`
  query Contracts {
    contracts {
      id
      benefitId
      benefitName
      vendorName
      version
      effectiveDate
      expiryDate
      isActive
      viewUrl
    }
  }
`;

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

// ── Contract Preview Modal ───────────────────────────────────────────────────

function ContractPreviewModal({
  contract,
  onClose,
}: {
  contract: ContractRow;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="flex w-full max-w-3xl flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden max-h-[92vh]" onClick={(e) => e.stopPropagation()}>
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
        {contract.viewUrl ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            <iframe
              src={contract.viewUrl}
              className="flex-1 min-h-[500px] border-none bg-gray-50"
              title={`Contract: ${contract.benefitName}`}
            />
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
              <a
                href={contract.viewUrl}
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
              <p className="text-sm font-medium text-gray-700">Contract preview unavailable</p>
              <p className="mt-1 text-xs text-gray-500 max-w-xs">
                The document preview link has not been generated yet. Please contact HR for a copy.
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
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-emerald-100 p-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {contract.benefitName ?? contract.benefitId}
            </p>
            <p className="mt-0.5 text-sm text-gray-500">{contract.vendorName}</p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          ACTIVE
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 border-t border-emerald-100 pt-4">
        <div>
          <p className="text-xs text-gray-500">Version</p>
          <p className="mt-0.5 text-sm font-medium text-gray-900">v{contract.version}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Effective</p>
          <p className="mt-0.5 text-sm font-medium text-gray-900">{formatDate(contract.effectiveDate)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Expires</p>
          <p className="mt-0.5 text-sm font-medium text-gray-900">
            {contract.expiryDate ? formatDate(contract.expiryDate) : "No expiry"}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => onPreview(contract)}
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
        >
          <FileText className="h-4 w-4" />
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
  const { data, loading, error } = useQuery<{ contracts: ContractRow[] }>(GET_CONTRACTS);
  const [previewContract, setPreviewContract] = useState<ContractRow | null>(null);

  const contracts = data?.contracts ?? [];
  const active = contracts.filter((c) => c.isActive);
  const historical = contracts.filter((c) => !c.isActive);

  return (
    <>
      {previewContract && (
        <ContractPreviewModal
          contract={previewContract}
          onClose={() => setPreviewContract(null)}
        />
      )}

      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <div className="flex flex-1 flex-col items-center">
          <main className="w-full max-w-5xl p-8">
            <h1 className="text-xl font-semibold text-gray-900">Vendor Contracts</h1>
            <p className="mt-1 text-sm text-gray-500">
              Active contracts for benefits you are enrolled in or have a pending request for.
            </p>

            {loading ? (
              <div className="mt-8">
                <PageLoading inline message="Loading contracts…" className="text-slate-500" />
              </div>
            ) : error ? (
              <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                Failed to load contracts. Please try again.
              </div>
            ) : contracts.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600">No contracts available</p>
                <p className="mt-1 text-xs text-gray-400">
                  You have no active enrollments or pending requests with vendor contracts attached.
                  Once HR uploads a contract for a benefit you are enrolled in or requesting, it will appear here.
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
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Benefit</th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Vendor</th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Version</th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Effective</th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Expired</th>
                            <th className="px-5 py-3" />
                          </tr>
                        </thead>
                        <tbody>
                          {historical.map((row) => (
                            <tr key={row.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                              <td className="px-5 py-4 text-sm font-medium text-slate-700">
                                {row.benefitName ?? row.benefitId}
                              </td>
                              <td className="px-5 py-4 text-sm text-slate-500">{row.vendorName}</td>
                              <td className="px-5 py-4">
                                <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                  v{row.version}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-sm text-slate-500">{formatDate(row.effectiveDate)}</td>
                              <td className="px-5 py-4 text-sm text-slate-500">{formatDate(row.expiryDate)}</td>
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
