"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";

import type { AccessPreviewResponse } from "lib/worker-access";

function getAccessLaneLabel(role: "employee" | "hr_admin" | "finance_manager") {
  if (role === "hr_admin") {
    return "HR Console";
  }

  if (role === "finance_manager") {
    return "Finance Review";
  }

  return "Employee Portal";
}

interface SignInFormProps {
  preview: AccessPreviewResponse | null;
}

export function SignInForm({ preview }: SignInFormProps) {
  const employeeAppUrl = process.env.NEXT_PUBLIC_EMPLOYEE_APP_URL?.trim() || "http://localhost:3000";
  const [email, setEmail] = useState(preview?.featuredAccounts[0]?.email ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: employeeAppUrl
    });

    if (!result || result.error) {
      setError("Email эсвэл password буруу байна.");
      setIsSubmitting(false);
      return;
    }

    window.location.assign(result.url ?? employeeAppUrl);
  }

  return (
    <div className="panel auth-panel access-hub-card">
      <div className="eyebrow">Company Access</div>
      <h1>Work email-ээр орж role-доо таарсан workspace руу орно.</h1>
      <p className="panel-copy">
        Login, routing, session бүгд backend worker болон D1 directory-тэй холбогдсон. Frontend
        дээр role hardcode хийхгүй. Password нь `employees` table дээр биш, тусдаа credential
        store дээр hash+salt хэлбэрээр хадгалагдана.
      </p>

      <div className="directory-stat-grid">
        <article className="directory-stat">
          <span>Directory seats</span>
          <strong>{preview?.summary.total ?? "..."}</strong>
        </article>
        <article className="directory-stat">
          <span>Employee seats</span>
          <strong>{preview?.summary.employees ?? "..."}</strong>
        </article>
        <article className="directory-stat">
          <span>HR operators</span>
          <strong>{preview?.summary.hr ?? "..."}</strong>
        </article>
        <article className="directory-stat">
          <span>Finance approvers</span>
          <strong>{preview?.summary.finance ?? "..."}</strong>
        </article>
      </div>

      <div className="workspace-band">
        <div className="workspace-band-copy">
          <strong>{preview ? "D1 access directory live" : "Access preview unavailable"}</strong>
          <p>
            {preview
              ? "Employee, HR, Finance seat count-ууд D1-ээс ирж байна. Login success бол worker role-ийг тооцоод зөв app руу redirect хийнэ."
              : "API worker түр offline байна. Worker асмагц portal D1-ээс preview data татна."}
          </p>
        </div>
        <span className={`pill ${preview ? "status-approved" : "status-failed"}`}>
          {preview ? "db connected" : "worker offline"}
        </span>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          <span>Work email</span>
          <input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@pinequest.mn"
            type="email"
            value={email}
          />
        </label>

        <label>
          <span>Password</span>
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>

        <div className="auth-inline-note">
          <span className="pill">auto route</span>
          <p>
            Session үүссэний дараа employee user benefits portal руу, HR болон finance user
            operations console руу автоматаар орно.
          </p>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in..." : "Continue to EBMS"}
        </button>
      </form>

      {preview?.featuredAccounts?.length ? (
        <div className="directory-preview">
          <div className="directory-preview-head">
            <strong>Accounts from D1</strong>
            <p>Доорх email-үүд preview endpoint-оор DB-с ирж байна. Password preview гаргахгүй.</p>
          </div>

          <div className="directory-preview-grid">
            {preview.featuredAccounts.map((user) => (
              <button
                className="directory-card"
                key={user.employeeId}
                onClick={() => {
                  setEmail(user.email);
                  setPassword("");
                  setError(null);
                }}
                type="button"
              >
                <span>{getAccessLaneLabel(user.role)}</span>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
