/**
 * Transactional email via Gmail API (OAuth 2.0 refresh-token flow).
 *
 * Required env vars (all four must be present to send email; any missing var
 * silently disables email without throwing):
 *   GMAIL_CLIENT_ID      – Google OAuth 2.0 client ID
 *   GMAIL_CLIENT_SECRET  – Google OAuth 2.0 client secret
 *   GMAIL_REFRESH_TOKEN  – Long-lived refresh token for the sender Gmail account
 *   GMAIL_SENDER_EMAIL   – The Gmail address to send from (must match OAuth account)
 *
 * How to obtain a refresh token:
 *   1. Create a Google Cloud project with the Gmail API enabled.
 *   2. Create OAuth 2.0 credentials (Desktop app or Web app).
 *   3. Use the OAuth Playground (https://developers.google.com/oauthplayground)
 *      or a one-off script to complete the OAuth flow with scope
 *      https://www.googleapis.com/auth/gmail.send and capture the refresh token.
 *   4. Set the four env vars above in Cloudflare Workers secrets / .dev.vars.
 */

import type { Benefit, Employee } from "../db";
import type { Env } from "../graphql/context";
import { fetchWithRetry } from "../lib/retry";
import { truncateForLog } from "../lib/pii";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

// ---------------------------------------------------------------------------
// Gmail config / auth helpers
// ---------------------------------------------------------------------------

function hasGmailConfig(env: Env): boolean {
  return Boolean(
    env.GMAIL_CLIENT_ID?.trim() &&
      env.GMAIL_CLIENT_SECRET?.trim() &&
      env.GMAIL_REFRESH_TOKEN?.trim() &&
      env.GMAIL_SENDER_EMAIL?.trim(),
  );
}

/**
 * Exchange a refresh token for a short-lived access token.
 * Retries up to 3 times on 5xx / network errors; returns null on all failures.
 */
async function getAccessToken(env: Env): Promise<string | null> {
  try {
    const res = await fetchWithRetry(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: env.GMAIL_CLIENT_ID!.trim(),
          client_secret: env.GMAIL_CLIENT_SECRET!.trim(),
          refresh_token: env.GMAIL_REFRESH_TOKEN!.trim(),
          grant_type: "refresh_token",
        }),
      },
    );
    if (!res.ok) {
      const body = await res.text();
      console.error(`[email] Gmail token refresh failed (${res.status}): ${truncateForLog(body)}`);
      return null;
    }
    const data = (await res.json()) as { access_token?: string };
    if (!data.access_token) {
      console.error("[email] Gmail token response missing access_token.");
      return null;
    }
    return data.access_token;
  } catch (err) {
    console.error("[email] Gmail token refresh error:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// MIME construction
// ---------------------------------------------------------------------------

/**
 * Encode a UTF-8 string to base64url (RFC 4648 §5).
 * Compatible with Cloudflare Workers (no Node.js Buffer available).
 */
function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Build a multipart/alternative RFC 5322 MIME message with both plain-text
 * and HTML parts. Returns the raw string ready for base64url encoding.
 */
function buildMimeMessage(from: string, payload: EmailPayload): string {
  const boundary = "pq_ebms_boundary_v1";
  const parts: string[] = [
    `MIME-Version: 1.0`,
    `From: ${from}`,
    `To: ${payload.to}`,
    `Subject: ${payload.subject}`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=UTF-8`,
    ``,
    payload.text,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    ``,
    payload.html,
    ``,
    `--${boundary}--`,
  ];
  return parts.join("\r\n");
}

// ---------------------------------------------------------------------------
// Core send function (best-effort — never throws, never blocks the caller)
// ---------------------------------------------------------------------------

async function sendEmail(env: Env, payload: EmailPayload): Promise<void> {
  if (!hasGmailConfig(env)) {
    // Gmail env vars not configured. Email is disabled; this is not an error.
    return;
  }

  const senderEmail = env.GMAIL_SENDER_EMAIL!.trim();
  const accessToken = await getAccessToken(env);
  if (!accessToken) {
    console.error("[email] Skipping send: could not obtain Gmail access token.");
    return;
  }

  const raw = toBase64Url(buildMimeMessage(senderEmail, payload));

  try {
    // fetchWithRetry re-tries on 5xx / network errors (up to 3 attempts).
    const res = await fetchWithRetry(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
      },
    );
    if (!res.ok) {
      const body = await res.text();
      console.error(`[email] Gmail send failed (${res.status}): ${truncateForLog(body)}`);
    }
  } catch (err) {
    console.error("[email] Gmail send request error:", err);
  }
}

// ---------------------------------------------------------------------------
// Helpers shared by templates
// ---------------------------------------------------------------------------

function employeeName(employee: Employee): string {
  return employee.nameEng?.trim() || employee.name.trim() || employee.email;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function shell(title: string, body: string): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin: 0 0 16px;">${escapeHtml(title)}</h2>
      <p style="margin: 0 0 12px;">${body}</p>
      <p style="margin: 16px 0 0; color: #6b7280; font-size: 14px;">PineQuest EBMS</p>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Transactional email templates
// ---------------------------------------------------------------------------

export async function sendBenefitRequestSubmittedEmail(
  env: Env,
  employee: Employee,
  benefit: Benefit,
  status: string,
): Promise<void> {
  const name = employeeName(employee);

  if (status === "awaiting_contract_acceptance") {
    const subject = `PineQuest: review contract for ${benefit.name}`;
    const text =
      `Hi ${name},\n\n` +
      `Your request for ${benefit.name} requires contract review before processing can continue.\n` +
      "Please sign in to PineQuest EBMS and review the contract in your requests/contracts area.\n\n" +
      "PineQuest EBMS";
    await sendEmail(env, {
      to: employee.email,
      subject,
      text,
      html: shell(
        subject,
        `${escapeHtml(name)}, your request for <strong>${escapeHtml(benefit.name)}</strong> requires contract review before processing can continue. Please sign in to PineQuest EBMS and review the contract in your requests/contracts area.`,
      ),
    });
    return;
  }

  const reviewTeam = status === "awaiting_finance_review" ? "Finance" : "HR";
  const subject = `PineQuest: request submitted for ${benefit.name}`;
  const text =
    `Hi ${name},\n\n` +
    `Your request for ${benefit.name} was submitted successfully and is now awaiting ${reviewTeam} review.\n\n` +
    "PineQuest EBMS";
  await sendEmail(env, {
    to: employee.email,
    subject,
    text,
    html: shell(
      subject,
      `${escapeHtml(name)}, your request for <strong>${escapeHtml(benefit.name)}</strong> was submitted successfully and is now awaiting ${escapeHtml(reviewTeam)} review.`,
    ),
  });
}

/**
 * Notify HR managers that a new benefit request has been submitted.
 * Called best-effort from requestBenefit — never throws.
 */
export async function sendHrNewBenefitRequestEmail(
  env: Env,
  hrEmail: string,
  requestingEmployeeName: string,
  benefitName: string,
): Promise<void> {
  const subject = `PineQuest: New benefit request — ${benefitName}`;
  const text =
    `Hi,\n\n` +
    `A new benefit request has been submitted:\n\n` +
    `• Employee: ${requestingEmployeeName}\n` +
    `• Benefit: ${benefitName}\n\n` +
    `Sign in to PineQuest EBMS › Admin Panel to review and approve.\n\n` +
    `PineQuest EBMS`;
  await sendEmail(env, {
    to: hrEmail,
    subject,
    text,
    html: shell(
      "New benefit request",
      `<strong>${escapeHtml(requestingEmployeeName)}</strong> has submitted a new request for <strong>${escapeHtml(benefitName)}</strong>. Sign in to PineQuest EBMS › Admin Panel to review and approve.`,
    ),
  });
}

export async function sendBenefitRequestApprovedEmail(
  env: Env,
  employee: Employee,
  benefit: Benefit,
): Promise<void> {
  const name = employeeName(employee);
  const subject = `PineQuest: approved - ${benefit.name}`;
  const text =
    `Hi ${name},\n\n` +
    `Your request for ${benefit.name} has been approved.\n` +
    "You can now view it in PineQuest EBMS.\n\n" +
    "PineQuest EBMS";

  await sendEmail(env, {
    to: employee.email,
    subject,
    text,
    html: shell(
      subject,
      `${escapeHtml(name)}, your request for <strong>${escapeHtml(benefit.name)}</strong> has been approved. You can now view it in PineQuest EBMS.`,
    ),
  });
}

/** After HR + Finance approve a down_payment benefit: employee must sign & upload contract. */
export async function sendDownPaymentReadyForSignedContractEmail(
  env: Env,
  employee: Employee,
  benefit: Benefit,
): Promise<void> {
  const name = employeeName(employee);
  const subject = `PineQuest: sign contract for ${benefit.name}`;
  const text =
    `Hi ${name},\n\n` +
    `HR and Finance have approved your request for ${benefit.name}.\n` +
    "Open the benefit in PineQuest EBMS, download the HR contract, sign it, and upload your signed copy to finish enrollment.\n\n" +
    "PineQuest EBMS";

  await sendEmail(env, {
    to: employee.email,
    subject,
    text,
    html: shell(
      subject,
      `${escapeHtml(name)}, HR and Finance have approved your request for <strong>${escapeHtml(benefit.name)}</strong>. Open the benefit in PineQuest EBMS, download the HR contract, sign it, and upload your signed copy to finish enrollment.`,
    ),
  });
}

/** Notify HR / Finance that an employee uploaded a signed contract (down_payment completion). */
export async function sendSignedContractUploadedToAdminsEmail(
  env: Env,
  toEmail: string,
  employeeName: string,
  benefitName: string,
): Promise<void> {
  const subject = `PineQuest: Signed contract uploaded — ${benefitName}`;
  const text =
    `Hi,\n\n` +
    `${employeeName} uploaded a signed contract for ${benefitName}.\n` +
    "Sign in to PineQuest EBMS › Admin Panel to review if needed.\n\n" +
    "PineQuest EBMS";

  await sendEmail(env, {
    to: toEmail,
    subject,
    text,
    html: shell(
      "Signed contract uploaded",
      `<strong>${escapeHtml(employeeName)}</strong> uploaded a signed contract for <strong>${escapeHtml(benefitName)}</strong>. Sign in to PineQuest EBMS › Admin Panel to review if needed.`,
    ),
  });
}

export async function sendBenefitRequestRejectedEmail(
  env: Env,
  employee: Employee,
  benefit: Benefit,
  reason?: string | null,
): Promise<void> {
  const name = employeeName(employee);
  const subject = `PineQuest: declined - ${benefit.name}`;
  const reasonText = reason?.trim() ? ` Reason: ${reason.trim()}` : "";
  const text =
    `Hi ${name},\n\n` +
    `Your request for ${benefit.name} was declined.${reasonText}\n\n` +
    "PineQuest EBMS";

  await sendEmail(env, {
    to: employee.email,
    subject,
    text,
    html: shell(
      subject,
      `${escapeHtml(name)}, your request for <strong>${escapeHtml(benefit.name)}</strong> was declined.${reason?.trim() ? ` Reason: ${escapeHtml(reason.trim())}` : ""}`,
    ),
  });
}
