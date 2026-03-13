"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, X } from "lucide-react";
import type { Benefit } from "@/graphql/generated/graphql";
import { useCancelBenefitRequestMutation, GetBenefitRequestsDocument, GetMyBenefitsDocument } from "@/graphql/generated/graphql";

const requestStatusStyle: Record<string, string> = {
  pending: "bg-orange-50 text-orange-600 border-orange-200",
  approved: "bg-green-50 text-green-600 border-green-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
  declined: "bg-red-50 text-red-600 border-red-200",
  cancelled: "bg-gray-100 text-gray-500 border-gray-200",
};

type Props = {
  benefit: Benefit;
  requestStatus: string;
  requestId?: string;
  employeeId?: string;
};

export default function RequestedBenefitCard({ benefit, requestStatus, requestId, employeeId }: Props) {
  const [cancelError, setCancelError] = useState<string | null>(null);
  const vendor = benefit.vendorName ?? "Internal Benefit";
  const statusKey = requestStatus.toLowerCase();
  const statusClass = requestStatusStyle[statusKey] ?? "bg-gray-100 text-gray-600 border-gray-200";
  const isPending = statusKey === "pending";
  const canCancel = isPending && requestId && employeeId;

  const [cancelRequest, { loading: cancelling }] = useCancelBenefitRequestMutation({
    refetchQueries: [
      { query: GetBenefitRequestsDocument, variables: { employeeId: employeeId ?? "" } },
      { query: GetMyBenefitsDocument, variables: { employeeId: employeeId ?? "" } },
    ],
    onError: () => setCancelError("Failed to cancel. Try again."),
  });

  const handleCancel = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requestId || !employeeId) return;
    if (!window.confirm("Cancel this benefit request?")) return;
    setCancelError(null);
    try {
      await cancelRequest({ variables: { requestId, employeeId } });
    } catch {
      // onError sets cancelError
    }
  };

  return (
    <div className="block rounded-2xl border border-gray-200 bg-white p-6 transition duration-200 hover:border-gray-300 hover:shadow-md hover:bg-gray-50/50">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
          <FileText className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/employee-panel/benefits/${benefit.id}`} className="hover:underline">
            <h3 className="text-lg font-semibold text-gray-900">{benefit.name}</h3>
          </Link>
          <p className="mt-1 text-sm text-gray-500">{vendor}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${statusClass}`}
            >
              Request: {requestStatus.charAt(0).toUpperCase() + requestStatus.slice(1).toLowerCase()}
            </span>
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {benefit.subsidyPercent}% subsidy
            </span>
            {canCancel && (
              <div className="ml-auto flex flex-col items-end gap-1">
                {cancelError && (
                  <span className="text-xs text-red-600">{cancelError}</span>
                )}
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="inline-flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  {cancelling ? "Cancelling..." : "Cancel request"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
