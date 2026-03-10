"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewRequestCardProps {
  request: {
    id: string;
    employeeEmail: string;
    employeeId: string;
    benefitName: string;
    benefitSlug: string;
    status: string;
    createdAt: string;
    requiresFinanceApproval: boolean;
  };
  reviewerRole: string;
}

type ReviewAction = "APPROVED" | "REJECTED" | "CANCELLED";

export function ReviewRequestCard({ request, reviewerRole }: ReviewRequestCardProps) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<ReviewAction | null>(null);

  const isPending = request.status === "PENDING";
  const requiresFinanceReviewer =
    request.requiresFinanceApproval && reviewerRole !== "finance_manager";
  const ageInHours = Math.max(
    1,
    Math.round((Date.now() - new Date(request.createdAt).getTime()) / (1000 * 60 * 60))
  );

  async function submitReview(action: ReviewAction) {
    if (!isPending || requiresFinanceReviewer || activeAction) {
      return;
    }

    if ((action === "REJECTED" || action === "CANCELLED") && !reason.trim()) {
      setError("Reject or cancel хийхэд тайлбар заавал оруулна.");
      return;
    }

    setActiveAction(action);
    setError(null);
    setSuccess(null);

    const response = await fetch("/api/benefit-requests/review", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        requestId: request.id,
        status: action,
        reason: reason.trim() || null
      })
    });

    const payload = (await response.json()) as {
      ok: boolean;
      message?: string;
      request?: {
        status: string;
      };
    };

    if (!response.ok || !payload.ok) {
      setError(payload.message ?? "Review update failed.");
      setActiveAction(null);
      return;
    }

    setSuccess(`Request ${payload.request?.status ?? action} болсон.`);
    setActiveAction(null);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <article className="admin-action-card">
      <div className="admin-action-head">
        <div>
          <strong>{request.benefitName}</strong>
          <p>
            {request.employeeEmail} · {request.benefitSlug}
          </p>
          <p className="subtle-text">
            Opened {new Date(request.createdAt).toLocaleString()} · waiting {ageInHours}h
          </p>
        </div>

        <div className="stacked-pills">
          {request.requiresFinanceApproval ? <span className="pill status-pending">Finance</span> : null}
          <span className={`pill status-${request.status.toLowerCase()}`}>{request.status}</span>
        </div>
      </div>

      {request.requiresFinanceApproval ? (
        <p className="notice-text">
          Энэ хүсэлт finance queue-д орно.
          {requiresFinanceReviewer ? " Finance manager эрхтэй хэрэглэгч approve хийх ёстой." : null}
        </p>
      ) : null}

      <label className="inline-field">
        <span>Reason / note</span>
        <textarea
          onChange={(event) => setReason(event.target.value)}
          placeholder="Approval note, rejection reason, эсвэл cancellation тайлбар"
          rows={3}
          value={reason}
        />
      </label>

      {error ? <p className="error-text">{error}</p> : null}
      {success ? <p className="success-text">{success}</p> : null}

      <div className="action-row">
        <button
          className="primary-button"
          disabled={!isPending || requiresFinanceReviewer || Boolean(activeAction)}
          onClick={() => submitReview("APPROVED")}
          type="button"
        >
          {activeAction === "APPROVED" ? "Approving..." : "Approve"}
        </button>
        <button
          className="ghost-button danger-button"
          disabled={!isPending || requiresFinanceReviewer || Boolean(activeAction)}
          onClick={() => submitReview("REJECTED")}
          type="button"
        >
          {activeAction === "REJECTED" ? "Rejecting..." : "Reject"}
        </button>
        <button
          className="ghost-button"
          disabled={!isPending || requiresFinanceReviewer || Boolean(activeAction)}
          onClick={() => submitReview("CANCELLED")}
          type="button"
        >
          {activeAction === "CANCELLED" ? "Cancelling..." : "Cancel"}
        </button>
      </div>
    </article>
  );
}
