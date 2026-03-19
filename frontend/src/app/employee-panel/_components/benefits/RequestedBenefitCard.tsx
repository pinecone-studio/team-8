"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, X } from "lucide-react";
import type { Benefit } from "@/graphql/generated/graphql";
import { useCancelBenefitRequestMutation, GetBenefitRequestsDocument, GetMyBenefitsDocument } from "@/graphql/generated/graphql";

const requestStatusStyle: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200/80",
  awaiting_contract_acceptance: "bg-amber-50 text-amber-700 border-amber-200/80",
  awaiting_hr_review: "bg-amber-50 text-amber-700 border-amber-200/80",
  awaiting_finance_review: "bg-amber-50 text-amber-700 border-amber-200/80",
  awaiting_employee_decision: "bg-cyan-50 text-cyan-700 border-cyan-200/80",
  awaiting_employee_signed_contract:
    "bg-violet-50 text-violet-700 border-violet-200/80",
  awaiting_final_finance_approval:
    "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  awaiting_payment: "bg-blue-50 text-blue-700 border-blue-200/80",
  awaiting_payment_review: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  rejected: "bg-red-50 text-red-700 border-red-200/80",
  declined: "bg-red-50 text-red-700 border-red-200/80",
  cancelled: "bg-muted text-muted-foreground border-border",
};

const CANCELLABLE_STATUSES = new Set([
  "pending",
  "awaiting_contract_acceptance",
  "awaiting_hr_review",
  "awaiting_finance_review",
  "awaiting_employee_decision",
  "awaiting_employee_signed_contract",
  "awaiting_payment",
]);

type Props = {
  benefit: Benefit;
  requestStatus: string;
  requestId?: string;
};

export default function RequestedBenefitCard({ benefit, requestStatus, requestId }: Props) {
  const [cancelError, setCancelError] = useState<string | null>(null);
  const vendor = benefit.vendorName ?? "Internal Benefit";
  const statusKey = requestStatus.toLowerCase();
  const statusClass = requestStatusStyle[statusKey] ?? "bg-muted text-muted-foreground border-border";
  const canCancel = Boolean(requestId) && CANCELLABLE_STATUSES.has(statusKey);

  const [cancelRequest, { loading: cancelling }] = useCancelBenefitRequestMutation({
    refetchQueries: [
      { query: GetBenefitRequestsDocument },
      { query: GetMyBenefitsDocument },
    ],
    onError: () => setCancelError("Failed to cancel. Try again."),
  });

  const handleCancel = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requestId) return;
    if (!window.confirm("Cancel this benefit request?")) return;
    setCancelError(null);
    try {
      await cancelRequest({ variables: { requestId } });
    } catch {
      // onError sets cancelError
    }
  };

  return (
    <div className="block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition duration-200 hover:shadow-md">
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={`/employee-panel/benefits/${benefit.id}`}
            className="font-semibold text-foreground hover:text-primary hover:underline"
          >
            {benefit.name}
          </Link>
          <p className="mt-0.5 text-sm text-muted-foreground">{vendor}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/30 px-5 py-3">
        <span
          className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${statusClass}`}
        >
          Request: {requestStatus.charAt(0).toUpperCase() + requestStatus.slice(1).toLowerCase()}
        </span>
        <span className="text-xs text-muted-foreground">
          {benefit.subsidyPercent}% subsidy
        </span>
        {canCancel && (
          <div className="ml-auto flex flex-col items-end gap-1">
            {cancelError && (
              <span className="text-xs text-destructive">{cancelError}</span>
            )}
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
              {cancelling ? "Cancelling..." : "Cancel request"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
