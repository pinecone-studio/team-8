"use client";

import { useState } from "react";
import Header from "@/app/_features/Header";
import AppSidebar from "@/app/_components/AppSidebar";
import { useBenefitsQuery } from "@/graphql/generated/graphql";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Upload } from "lucide-react";

const CONTRACT_BENEFITS = ["gym_pinefit", "private_insurance", "macbook", "travel"];

function getUploadUrl() {
  const base = process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8787/";
  const url = new URL(base);
  return `${url.origin}/api/contracts/upload`;
}

type ContractUploadFormProps = {
  benefitId: string;
  benefitName: string;
  vendorName: string | null;
  onSuccess: () => void;
};

function ContractUploadForm({
  benefitId,
  benefitName,
  vendorName,
  onSuccess,
}: ContractUploadFormProps) {
  const [version, setVersion] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [vendor, setVendor] = useState(vendorName ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!version || !effectiveDate || !expiryDate || !file?.size) {
      setMessage({ type: "error", text: "Please fill all required fields and select a file." });
      return;
    }

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.set("benefitId", benefitId);
    formData.set("version", version);
    formData.set("effectiveDate", effectiveDate);
    formData.set("expiryDate", expiryDate);
    formData.set("vendorName", vendor || "Vendor");
    formData.set("file", file);

    try {
      const res = await fetch(getUploadUrl(), { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `Upload failed: ${res.status}`);
      }
      setMessage({ type: "success", text: "Contract uploaded successfully." });
      setVersion("");
      setEffectiveDate("");
      setExpiryDate("");
      setFile(null);
      onSuccess();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <p className="text-sm font-medium text-gray-700">Upload contract (step inside create/update benefit)</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Version *</label>
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="e.g. 2025.1"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Vendor</label>
          <input
            type="text"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            placeholder="e.g. PineFit"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Effective Date *</label>
          <input
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Expiry Date *</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            required
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Contract PDF *</label>
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          required
        />
      </div>
      {message && (
        <div
          className={`rounded-lg p-2 text-sm ${
            message.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}
      <Button type="submit" size="sm" disabled={uploading}>
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? "Uploading…" : "Upload Contract"}
      </Button>
    </form>
  );
}

export default function BenefitsPage() {
  const [expandedBenefitId, setExpandedBenefitId] = useState<string | null>(null);

  const { data: benefitsData } = useBenefitsQuery();
  const benefits = benefitsData?.benefits ?? [];

  return (
    <div className="flex min-h-screen bg-[#f8f8f9]">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="p-8">
          <h1 className="text-3xl font-semibold text-gray-900">Benefits</h1>
          <p className="mt-2 text-gray-500">
            Create or update benefits. For contract-based benefits, upload the contract as part of the benefit setup.
          </p>

          <div className="mt-8 space-y-3">
            {benefits.map((benefit) => {
              const isContractBased = CONTRACT_BENEFITS.includes(benefit.id);
              const isExpanded = expandedBenefitId === benefit.id;

              return (
                <div
                  key={benefit.id}
                  className="rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedBenefitId(isExpanded ? null : benefit.id)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{benefit.name}</p>
                        <p className="text-sm text-gray-500">
                          {benefit.category} · {benefit.subsidyPercent}% subsidy
                          {benefit.duration && ` · ${benefit.duration}`}
                        </p>
                      </div>
                      {isContractBased && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          Contract required
                        </span>
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100 px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {benefit.nameEng && `${benefit.nameEng} · `}
                        {benefit.vendorName && `Vendor: ${benefit.vendorName}`}
                      </p>
                      {isContractBased && (
                        <ContractUploadForm
                          benefitId={benefit.id}
                          benefitName={benefit.name}
                          vendorName={benefit.vendorName}
                          onSuccess={() => {}}
                        />
                      )}
                      {!isContractBased && (
                        <p className="mt-4 text-sm text-gray-500">
                          This benefit does not require a contract. Rules are managed in eligibility config.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
