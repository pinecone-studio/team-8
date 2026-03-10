"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

interface RequestBenefitCardProps {
  benefit: {
    id: string;
    name: string;
    slug: string;
    category: string;
    status: string;
    requiresContract: boolean;
    requiresFinanceApproval: boolean;
    blockingReason: string | null;
    activeRequestStatus: string | null;
  };
  contract:
    | {
        id: string;
        version: string;
        vendorName: string;
        effectiveDate: string;
        expiryDate: string;
        downloadUrl: string | null;
      }
    | undefined;
}

export function RequestBenefitCard({ benefit, contract }: RequestBenefitCardProps) {
  const router = useRouter();
  const [acceptContract, setAcceptContract] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isEligible = benefit.status === "ELIGIBLE";
  const hasActiveRequest =
    benefit.activeRequestStatus === "PENDING" || benefit.activeRequestStatus === "APPROVED";
  const contractReady = !benefit.requiresContract || Boolean(contract?.id);
  const canSubmit =
    isEligible &&
    !hasActiveRequest &&
    contractReady &&
    (!benefit.requiresContract || acceptContract);

  async function handleSubmit() {
    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("/api/benefit-requests", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        benefitId: benefit.id,
        contractId: contract?.id ?? null,
        acceptContract: benefit.requiresContract ? acceptContract : false
      })
    });

    const payload = (await response.json()) as {
      ok: boolean;
      message?: string;
      request?: {
        id: string;
        status: string;
      };
    };

    if (!response.ok || !payload.ok) {
      setError(payload.message ?? "Request submission failed.");
      setIsSubmitting(false);
      return;
    }

    setSuccess(`Request ${payload.request?.status ?? "submitted"}.`);
    setIsSubmitting(false);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <article className="request-card">
      <div className="request-card-head">
        <div>
          <strong>{benefit.name}</strong>
          <p>
            {benefit.category} · {benefit.slug}
          </p>
        </div>
        <span className={`pill status-${benefit.status.toLowerCase()}`}>{benefit.status}</span>
      </div>

      {benefit.blockingReason ? <p className="notice-text">{benefit.blockingReason}</p> : null}
      {benefit.activeRequestStatus ? (
        <p className="notice-text">
          Existing request status: <strong>{benefit.activeRequestStatus}</strong>
        </p>
      ) : null}

      {benefit.requiresContract ? (
        contract ? (
          <div className="contract-box">
            <div>
              <strong>
                Contract {contract.version} · {contract.vendorName}
              </strong>
              <p>
                Effective {new Date(contract.effectiveDate).toLocaleDateString()} until{" "}
                {new Date(contract.expiryDate).toLocaleDateString()}
              </p>
            </div>

            <div className="contract-actions">
              {contract.downloadUrl ? (
                <a className="ghost-button link-button" href={contract.downloadUrl} target="_blank">
                  View contract
                </a>
              ) : null}

              <label className="inline-check">
                <input
                  checked={acceptContract}
                  onChange={(event) => setAcceptContract(event.target.checked)}
                  type="checkbox"
                />
                <span>I accept this contract version.</span>
              </label>
            </div>
          </div>
        ) : (
          <p className="notice-text">Contract metadata is missing, so this request is blocked.</p>
        )
      ) : null}

      {benefit.requiresFinanceApproval ? (
        <p className="subtle-text">This benefit enters the finance review queue after submission.</p>
      ) : null}

      {error ? <p className="error-text">{error}</p> : null}
      {success ? <p className="success-text">{success}</p> : null}

      <button className="primary-button" disabled={!canSubmit || isSubmitting} onClick={handleSubmit}>
        {isSubmitting ? "Submitting..." : "Request benefit"}
      </button>
    </article>
  );
}
