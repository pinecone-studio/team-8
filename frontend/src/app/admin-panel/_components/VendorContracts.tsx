"use client";

import { useState, useCallback } from "react";
import { gql, useQuery } from "@apollo/client";
import { useAuth } from "@clerk/nextjs";
import { Eye, Upload, X } from "lucide-react";
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

const GET_BENEFITS = gql`
  query GetBenefits {
    benefits {
      id
      name
      vendorName
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

function getUploadUrl(): string {
  const base =
    typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GRAPHQL_URL
      ? process.env.NEXT_PUBLIC_GRAPHQL_URL
      : "https://team8-api.team8pinequest.workers.dev/";
  return base.replace(/\/$/, "") + "/api/contracts/upload";
}

export default function VendorContracts() {
  const { getToken } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [form, setForm] = useState({
    benefitId: "",
    version: "",
    effectiveDate: "",
    expiryDate: "",
    vendorName: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const { data, loading, error, refetch } = useQuery<{ contracts: ContractRow[] }>(GET_CONTRACTS);
  const { data: benefitsData, loading: benefitsLoading } = useQuery<{ benefits: { id: string; name: string; vendorName?: string | null }[] }>(GET_BENEFITS);
  const contracts = data?.contracts ?? [];
  const benefits = benefitsData?.benefits ?? [];

  const openModal = useCallback(() => {
    setModalOpen(true);
    setUploadError(null);
    setForm({ benefitId: "", version: "", effectiveDate: "", expiryDate: "", vendorName: "" });
    setFile(null);
  }, []);

  const closeModal = useCallback(() => {
    if (!uploading) setModalOpen(false);
  }, [uploading]);

  const handleUpload = useCallback(async () => {
    if (!form.benefitId || !form.version || !form.effectiveDate || !form.expiryDate || !file?.size) {
      setUploadError("Please fill all required fields and select a PDF file.");
      return;
    }
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("benefitId", form.benefitId);
      fd.set("version", form.version);
      fd.set("effectiveDate", form.effectiveDate);
      fd.set("expiryDate", form.expiryDate);
      fd.set("vendorName", form.vendorName || "Vendor");
      fd.set("file", file);
      const token = await getToken();
      const res = await fetch(getUploadUrl(), {
        method: "POST",
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setUploadError(json?.error || `Upload failed (${res.status})`);
        return;
      }
      await refetch();
      closeModal();
      setModalOpen(false);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [closeModal, file, form, getToken, refetch]);

  return (
    <main className="flex-1 px-8 py-9">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Vendor Contract Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and upload vendor contracts for benefits
            </p>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98] active:bg-blue-800"
          >
            <Upload className="h-4 w-4" />
            Upload New Contract
          </button>
        </div>

        {/* Upload modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Upload New Contract</h2>
                <button type="button" onClick={closeModal} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 active:scale-95 active:bg-slate-200" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Benefit *</label>
                  <select
                    value={form.benefitId}
                    onChange={(e) => setForm((f) => ({ ...f, benefitId: e.target.value }))}
                    disabled={benefitsLoading}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 disabled:opacity-70"
                  >
                    <option value="">{benefitsLoading ? "Loading benefits..." : "Select benefit"}</option>
                    {benefits.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Version *</label>
                  <input
                    type="text"
                    value={form.version}
                    onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))}
                    placeholder="e.g. 1.0"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Effective date *</label>
                  <input
                    type="date"
                    value={form.effectiveDate}
                    onChange={(e) => setForm((f) => ({ ...f, effectiveDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry date *</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vendor name</label>
                  <input
                    type="text"
                    value={form.vendorName}
                    onChange={(e) => setForm((f) => ({ ...f, vendorName: e.target.value }))}
                    placeholder="Vendor"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">PDF file *</label>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  />
                </div>
                {uploadError && <p className="text-sm text-rose-600">{uploadError}</p>}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={closeModal} disabled={uploading} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] active:bg-slate-100 disabled:opacity-50">Cancel</button>
                <button type="button" onClick={handleUpload} disabled={uploading} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98] active:bg-blue-800 disabled:opacity-50">
                  {uploading ? "Uploading…" : "Upload"}
                </button>
              </div>
            </div>
          </div>
        )}

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
                    <td colSpan={7} className="px-5 py-8">
                      <PageLoading inline message="Loading contracts..." className="text-slate-500" />
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
