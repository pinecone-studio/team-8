"use client";

import { gql, useQuery } from "@apollo/client";
import { Eye, Upload } from "lucide-react";

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

export default function VendorContracts() {
  const { data, loading, error } = useQuery<{ contracts: ContractRow[] }>(GET_CONTRACTS);
  const contracts = data?.contracts ?? [];

  return (
    <main className="flex-1 px-8 py-9">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[2.25rem] font-semibold tracking-[-0.02em] text-slate-900">
              Vendor Contract Management
            </h1>
            <p className="mt-2 text-lg text-slate-500">
              Manage and upload vendor contracts for benefits
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            Upload New Contract
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-slate-200 bg-white text-sm font-semibold text-slate-700">
                <tr>
                  <th className="px-5 py-4">Benefit</th>
                  <th className="px-5 py-4">Vendor</th>
                  <th className="px-5 py-4">Contract Version</th>
                  <th className="px-5 py-4">Effective Date</th>
                  <th className="px-5 py-4">Expiry Date</th>
                  <th className="px-5 py-4">Actions</th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-6 text-sm text-slate-500"
                    >
                      Loading contracts...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-6 text-sm text-rose-600"
                    >
                      Failed to load contracts. Please try again.
                    </td>
                  </tr>
                ) : contracts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-6 text-sm text-slate-500"
                    >
                      No contracts found.
                    </td>
                  </tr>
                ) : (
                  contracts.map((row) => (
                    <tr key={row.id} className="border-b border-slate-200 last:border-b-0">
                      <td className="px-5 py-5 text-sm font-medium text-slate-900">
                        {row.benefitName ?? row.benefitId}
                      </td>
                      <td className="px-5 py-5 text-sm text-slate-500">
                        {row.vendorName}
                      </td>
                      <td className="px-5 py-5">
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {row.version}
                        </span>
                      </td>
                      <td className="px-5 py-5 text-sm text-slate-500">
                        {row.effectiveDate}
                      </td>
                      <td className="px-5 py-5 text-sm text-slate-500">
                        {row.expiryDate}
                      </td>
                      <td className="px-5 py-5">
                        {row.viewUrl ? (
                          <a
                            href={row.viewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-400">
                            <Eye className="h-4 w-4" />
                            View
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-5 text-sm font-medium text-slate-600">
                        {row.isActive ? "Active" : "Inactive"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
