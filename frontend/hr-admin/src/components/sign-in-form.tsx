"use client";

export function SignInForm() {
  const employeeAppUrl =
    process.env.NEXT_PUBLIC_EMPLOYEE_APP_URL?.trim() || "http://localhost:3000";

  return (
    <div className="panel auth-panel">
      <div className="eyebrow">Company Access</div>
      <h1>HR console uses the shared access portal.</h1>
      <p className="panel-copy">
        Single-login flow дээр admin users employee access hub дээр email болон password-оор
        нэвтэрч, дараа нь role-оороо энэ console руу автоматаар орно.
      </p>

      <div className="workspace-band">
        <div className="workspace-band-copy">
          <strong>Why this changed</strong>
          <p>
            Employee ба HR app хоёр тусдаа login page биш, нэг session contract ашиглаж Cloudflare
            deploy дээр shared domain cookie-р ажиллана.
          </p>
        </div>
        <a className="ghost-button link-button" href={employeeAppUrl}>
          Open access portal
        </a>
      </div>

      <div className="auth-inline-note">
        <span className="pill status-approved">Shared auth</span>
        <p>
          HR болон finance operator-ууд company access portal дээр email/password-аар орж,
          session-ээрээ энэ console руу redirect хийгдэнэ.
        </p>
      </div>
    </div>
  );
}
