import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions, isAdminRole } from "auth";
import { SignInForm } from "components/sign-in-form";
import { loadAccessPreview } from "lib/worker-access";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const adminAppUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL?.trim() || "http://localhost:3001";

  if (session) {
    redirect(isAdminRole(session.user?.role) ? `${adminAppUrl}/dashboard` : "/dashboard");
  }

  let preview = null;

  try {
    preview = await loadAccessPreview();
  } catch {
    preview = null;
  }

  return (
    <main className="landing-shell">
      <section className="landing-copy">
        <div className="eyebrow">Company Access Portal</div>
        <h2>Work email in. Correct workspace out.</h2>
        <p>
          Энэ бол EBMS-ийн нэгтгэсэн entry point. Ажилтан, HR, Finance хэн ч байсан өөрийн company
          email болон password-оор орно. Дараа нь system role-оор нь employee portal эсвэл
          operations console руу автоматаар чиглүүлнэ.
        </p>
        <div className="landing-spotlight">
          <article className="landing-stat">
            <span>Directory seats</span>
            <strong>{preview?.summary.total ?? "..."}</strong>
            <p>D1 access directory дэх идэвхтэй ажилтны тоо.</p>
          </article>
          <article className="landing-stat">
            <span>People Ops access</span>
            <strong>{preview?.summary.hr ?? "..."}</strong>
            <p>HR overrides, queue review, and operational control.</p>
          </article>
          <article className="landing-stat">
            <span>Finance lane</span>
            <strong>{preview?.summary.finance ?? "..."}</strong>
            <p>Budget-gated approvals route into finance review automatically.</p>
          </article>
        </div>
        <ul className="signal-list">
          <li>Email + password login нь одоо worker auth endpoint-аар D1 дээр шалгагдана.</li>
          <li>Role routing нь employee row-оос сервер талд тооцогдоно.</li>
          <li>Password нь `employees` дээр биш, hash+salt credential store дээр хадгалагдана.</li>
          <li>HR ба employee workspace хоёр shared session ашиглаж Cloudflare deploy-д бэлэн болсон.</li>
        </ul>
        {preview?.featuredAccounts?.length ? (
          <div className="sample-strip">
            {preview.featuredAccounts.map((user) => (
              <div className="sample-account" key={user.employeeId}>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <SignInForm preview={preview} />
    </main>
  );
}
