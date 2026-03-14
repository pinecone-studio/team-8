"use client";
import { use } from "react";
import { gql, useQuery } from "@apollo/client";
import { Eye } from "lucide-react";
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

type PageProps = { params?: Promise<Record<string, string | string[]>> };
export default function Contracts({ params }: PageProps) {
  if (params) use(params);
  const { data, loading, error } = useQuery<{ contracts: ContractRow[] }>(GET_CONTRACTS);
  const contracts = data?.contracts ?? [];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl p-8">
          <h1 className="text-xl font-semibold text-gray-900">Contracts</h1>
          <p className="mt-1 text-sm text-gray-500">
            View benefit vendor contracts and download or open them.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-slate-200 bg-white text-sm font-semibold text-slate-700">
                  <tr>
                    <th className="px-5 py-4">Benefit</th>
                    <th className="px-5 py-4">Vendor</th>
                    <th className="px-5 py-4">Version</th>
                    <th className="px-5 py-4">Effective</th>
                    <th className="px-5 py-4">Expiry</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">View</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8">
                        <PageLoading inline message="Loading contracts..." className="text-slate-500" />
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-6 text-sm text-rose-600">
                        Failed to load contracts. Please try again.
                      </td>
                    </tr>
                  ) : contracts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-6 text-sm text-slate-500">
                        No contracts found.
                      </td>
                    </tr>
                  ) : (
                    contracts.map((row) => (
                      <tr key={row.id} className="border-b border-slate-200 last:border-b-0">
                        <td className="px-5 py-5 text-sm font-medium text-slate-900">
                          {row.benefitName ?? row.benefitId}
                        </td>
                        <td className="px-5 py-5 text-sm text-slate-500">{row.vendorName}</td>
                        <td className="px-5 py-5">
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {row.version}
                          </span>
                        </td>
                        <td className="px-5 py-5 text-sm text-slate-500">{row.effectiveDate}</td>
                        <td className="px-5 py-5 text-sm text-slate-500">{row.expiryDate}</td>
                        <td className="px-5 py-5 text-sm text-slate-600">
                          {row.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="px-5 py-5">
                          {row.viewUrl ? (
                            <a
                              href={row.viewUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50 hover:text-blue-700 active:scale-95 active:bg-blue-100 active:text-blue-800"
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
