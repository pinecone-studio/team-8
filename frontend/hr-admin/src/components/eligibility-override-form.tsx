"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface EligibilityOverrideFormProps {
  employees: Array<{
    id: string;
    email: string;
  }>;
  benefits: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

const overrideStatuses = ["eligible", "locked", "active", "pending"] as const;

export function EligibilityOverrideForm({
  employees,
  benefits
}: EligibilityOverrideFormProps) {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState(employees[0]?.id ?? "");
  const [benefitId, setBenefitId] = useState(benefits[0]?.id ?? "");
  const [status, setStatus] = useState<(typeof overrideStatuses)[number]>("eligible");
  const [reason, setReason] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedEmployee = useMemo(
    () => employees.find((entry) => entry.id === employeeId),
    [employeeId, employees]
  );

  const selectedBenefit = useMemo(
    () => benefits.find((entry) => entry.id === benefitId),
    [benefitId, benefits]
  );

  async function handleSubmit() {
    if (!employeeId || !benefitId || !reason.trim() || isSubmitting) {
      setError("Employee, benefit, reason гурвыг заавал бөглөнө.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("/api/eligibility-overrides", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        employeeId,
        benefitId,
        status,
        reason,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
      })
    });

    const payload = (await response.json()) as {
      ok: boolean;
      message?: string;
      override?: {
        status: string;
      };
    };

    if (!response.ok || !payload.ok) {
      setError(payload.message ?? "Override failed.");
      setIsSubmitting(false);
      return;
    }

    setSuccess(
      `${selectedEmployee?.email ?? employeeId} дээр ${selectedBenefit?.name ?? benefitId} benefit ${payload.override?.status ?? status} болсон.`
    );
    setIsSubmitting(false);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <article className="admin-action-card">
      <div className="admin-action-head">
        <div>
          <strong>Eligibility override</strong>
          <p>Use only for controlled exceptions. Every change lands in the audit trail.</p>
        </div>
        <span className="pill">HR only</span>
      </div>

      <div className="auth-inline-note">
        <span className="pill status-pending">High trust</span>
        <p>
          Override should be time-bound whenever possible so the rule engine can resume normal
          control.
        </p>
      </div>

      <label className="inline-field">
        <span>Employee</span>
        <select onChange={(event) => setEmployeeId(event.target.value)} value={employeeId}>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.email}
            </option>
          ))}
        </select>
      </label>

      <label className="inline-field">
        <span>Benefit</span>
        <select onChange={(event) => setBenefitId(event.target.value)} value={benefitId}>
          {benefits.map((benefit) => (
            <option key={benefit.id} value={benefit.id}>
              {benefit.name} · {benefit.slug}
            </option>
          ))}
        </select>
      </label>

      <label className="inline-field">
        <span>Override status</span>
        <select onChange={(event) => setStatus(event.target.value as (typeof overrideStatuses)[number])} value={status}>
          {overrideStatuses.map((entry) => (
            <option key={entry} value={entry}>
              {entry.toUpperCase()}
            </option>
          ))}
        </select>
      </label>

      <label className="inline-field">
        <span>Reason</span>
        <textarea
          onChange={(event) => setReason(event.target.value)}
          placeholder="Жишээ: manual exception approved for pilot demo"
          rows={3}
          value={reason}
        />
      </label>

      <label className="inline-field">
        <span>Expires at</span>
        <input
          onChange={(event) => setExpiresAt(event.target.value)}
          type="datetime-local"
          value={expiresAt}
        />
      </label>

      {error ? <p className="error-text">{error}</p> : null}
      {success ? <p className="success-text">{success}</p> : null}

      <button className="primary-button" disabled={isSubmitting} onClick={handleSubmit} type="button">
        {isSubmitting ? "Applying..." : "Apply override"}
      </button>
    </article>
  );
}
