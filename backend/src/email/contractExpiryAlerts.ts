/**
 * Contract expiry alert service.
 *
 * Queries D1 for active vendor contracts expiring within 60 days and sends
 * a summary email to HR/Finance managers so they can renew in time.
 *
 * This function is designed to be called from:
 *  - The Cloudflare Workers `scheduled` handler (cron trigger: "0 9 * * *")
 *  - A manual POST /admin/scheduled/contract-expiry endpoint for testing
 *
 * Email is best-effort: send failures are logged but never throw.
 *
 * TDD §6: "HR receives alerts when contracts are expiring"
 * TDD §6.4: "Contracts expiring within 60 days trigger an HR alert"
 */

import { and, eq, gt, lte } from "drizzle-orm";
import { schema } from "../db";
import type { Database } from "../db";
import type { Env } from "../graphql/context";
import { writeAuditLog } from "../graphql/resolvers/helpers/audit";
import { maskEmail } from "../lib/pii";
import { buildAdminPanelUrl } from "../lib/app-url";

// ---------------------------------------------------------------------------
// Types (local — no graphql generated types needed)
// ---------------------------------------------------------------------------

type ExpiringContract = {
  id: string;
  benefitId: string;
  benefitName: string;
  vendorName: string | null;
  version: string;
  expiryDate: string;
  daysRemaining: number;
};

// ---------------------------------------------------------------------------
// Email template (inline — avoids circular import with sendTransactionalEmail)
// ---------------------------------------------------------------------------

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildMimeMessage(from: string, to: string, subject: string, text: string, html: string): string {
  const boundary = "pq_ebms_boundary_v1";
  return [
    "MIME-Version: 1.0",
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "",
    text,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "",
    html,
    "",
    `--${boundary}--`,
  ].join("\r\n");
}

async function getGmailAccessToken(env: Env): Promise<string | null> {
  if (!env.GMAIL_CLIENT_ID || !env.GMAIL_CLIENT_SECRET || !env.GMAIL_REFRESH_TOKEN) return null;
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.GMAIL_CLIENT_ID.trim(),
        client_secret: env.GMAIL_CLIENT_SECRET.trim(),
        refresh_token: env.GMAIL_REFRESH_TOKEN.trim(),
        grant_type: "refresh_token",
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

/**
 * Returns true if the email was delivered successfully, false on any failure.
 * Callers must check the return value — do not assume success.
 */
async function sendAlertEmail(env: Env, to: string, contracts: ExpiringContract[]): Promise<boolean> {
  if (!env.GMAIL_SENDER_EMAIL) return false;
  const adminUrl = buildAdminPanelUrl("/admin-panel/vendor-contracts");
  const accessToken = await getGmailAccessToken(env);
  if (!accessToken) {
    console.error("[contractExpiryAlerts] Could not obtain Gmail access token — skipping email.");
    return false;
  }

  const count = contracts.length;
  const subject = `PineQuest: ${count} vendor contract${count === 1 ? "" : "s"} expiring within 60 days`;

  const rows = contracts
    .map(
      (c) =>
        `• ${c.benefitName} (${c.vendorName ?? "no vendor"}) — version ${c.version} — expires ${c.expiryDate} (${c.daysRemaining} days)`,
    )
    .join("\n");

  const text =
    `Hi,\n\n` +
    `${count} vendor contract${count === 1 ? "" : "s"} will expire within the next 60 days. Please review and renew as needed:\n\n` +
    rows +
    `\n\nOpen Vendor Contracts: ${adminUrl}\n\nPineQuest EBMS`;

  const htmlRows = contracts
    .map(
      (c) =>
        `<tr>
          <td style="padding:6px 10px;">${escapeHtml(c.benefitName)}</td>
          <td style="padding:6px 10px;">${escapeHtml(c.vendorName ?? "—")}</td>
          <td style="padding:6px 10px;">${escapeHtml(c.version)}</td>
          <td style="padding:6px 10px;">${escapeHtml(c.expiryDate)}</td>
          <td style="padding:6px 10px;color:${c.daysRemaining <= 14 ? "#dc2626" : "#d97706"};">
            ${c.daysRemaining} days
          </td>
        </tr>`,
    )
    .join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
      <h2 style="margin:0 0 12px;">Vendor contracts expiring within 60 days</h2>
      <p style="margin:0 0 16px;">The following ${count} contract${count === 1 ? "" : "s"} require attention:</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px 10px;text-align:left;">Benefit</th>
            <th style="padding:8px 10px;text-align:left;">Vendor</th>
            <th style="padding:8px 10px;text-align:left;">Version</th>
            <th style="padding:8px 10px;text-align:left;">Expires</th>
            <th style="padding:8px 10px;text-align:left;">Days left</th>
          </tr>
        </thead>
        <tbody>${htmlRows}</tbody>
      </table>
      <p style="margin:16px 0 0;">
        Open <strong>Vendor Contracts</strong> to upload new versions.
      </p>
      <p style="margin:12px 0 0;">
        <a href="${escapeHtml(adminUrl)}" style="color:#2563eb;">${escapeHtml(adminUrl)}</a>
      </p>
      <p style="margin:12px 0 0;color:#6b7280;font-size:13px;">PineQuest EBMS</p>
    </div>`;

  const raw = toBase64Url(
    buildMimeMessage(env.GMAIL_SENDER_EMAIL.trim(), to, subject, text, html),
  );

  try {
    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ raw }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`[contractExpiryAlerts] Gmail send failed (${res.status}): ${body}`);
      return false;
    }
    console.log(`[contractExpiryAlerts] Alert sent to ${maskEmail(to)} (${count} contracts).`);
    return true;
  } catch (err) {
    console.error("[contractExpiryAlerts] Gmail send error:", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Query D1 for active contracts expiring within 60 days and email HR/Finance managers.
 * Called by the Cloudflare scheduled handler and the manual HTTP endpoint.
 * Never throws — all errors are logged.
 */
export async function checkAndSendContractExpiryAlerts(
  db: Database,
  env: Env,
): Promise<{ checked: number; expiring: number; emailsSent: number }> {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const sixtyDaysStr = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  try {
    // -- 1. Dedupe: skip if alerts were already sent today --------------------
    // Prevents repeated emails when cron fires multiple times in a day (e.g. retries, manual triggers).
    const batchKey = `expiry-alert-batch:${todayStr}`;
    const existingAlert = await db
      .select({ id: schema.auditLogs.id })
      .from(schema.auditLogs)
      .where(and(eq(schema.auditLogs.actionType, "CONTRACT_EXPIRY_ALERT"), eq(schema.auditLogs.entityId, batchKey)))
      .limit(1);

    if (existingAlert.length > 0) {
      console.log("[contractExpiryAlerts] Alerts already sent today — skipping.");
      return { checked: 0, expiring: 0, emailsSent: 0 };
    }

    // -- 2. Find expiring contracts -------------------------------------------
    const contractRows = await db
      .select({
        id: schema.contracts.id,
        benefitId: schema.contracts.benefitId,
        vendorName: schema.contracts.vendorName,
        version: schema.contracts.version,
        expiryDate: schema.contracts.expiryDate,
      })
      .from(schema.contracts)
      .where(
        and(
          eq(schema.contracts.isActive, true),
          gt(schema.contracts.expiryDate, todayStr),      // not already expired
          lte(schema.contracts.expiryDate, sixtyDaysStr), // within 60 days
        ),
      );

    if (contractRows.length === 0) {
      console.log("[contractExpiryAlerts] No contracts expiring within 60 days.");
      return { checked: 0, expiring: 0, emailsSent: 0 };
    }

    // -- 2. Enrich with benefit names -----------------------------------------
    const benefitIds = [...new Set(contractRows.map((c) => c.benefitId))];
    const benefitRows = await db
      .select({ id: schema.benefits.id, name: schema.benefits.name })
      .from(schema.benefits)
      .where(eq(schema.benefits.isActive, true));
    const benefitNameById = new Map(benefitRows.map((b) => [b.id, b.name]));

    const expiringContracts: ExpiringContract[] = contractRows
      .filter((c) => benefitIds.includes(c.benefitId))
      .map((c) => {
        const expiryMs = new Date(c.expiryDate ?? "").getTime();
        const daysRemaining = Math.ceil((expiryMs - now.getTime()) / (24 * 60 * 60 * 1000));
        return {
          id: c.id,
          benefitId: c.benefitId,
          benefitName: benefitNameById.get(c.benefitId) ?? c.benefitId,
          vendorName: c.vendorName,
          version: c.version,
          expiryDate: c.expiryDate ?? "",
          daysRemaining,
        };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);

    // -- 3. Find HR/Finance managers to notify --------------------------------
    const allEmployees = await db
      .select({ id: schema.employees.id, email: schema.employees.email, role: schema.employees.role })
      .from(schema.employees)
      .where(eq(schema.employees.employmentStatus, "active"));

    const recipients = allEmployees.filter(
      (e) => e.role === "hr_manager" || e.role === "finance_manager",
    );

    if (recipients.length === 0) {
      console.warn("[contractExpiryAlerts] No HR/Finance managers found to notify.");
      return { checked: contractRows.length, expiring: expiringContracts.length, emailsSent: 0 };
    }

    if (!env.GMAIL_SENDER_EMAIL) {
      console.log(
        "[contractExpiryAlerts] Gmail not configured — skipping email. Expiring contracts:",
        expiringContracts.map((c) => `${c.benefitName} (${c.expiryDate})`).join(", "),
      );
      return { checked: contractRows.length, expiring: expiringContracts.length, emailsSent: 0 };
    }

    // -- 4. Send one email per recipient (sequential to avoid rate limits) ----
    // Only count confirmed deliveries — Gmail failures return false.
    let emailsSent = 0;
    for (const recipient of recipients) {
      const sent = await sendAlertEmail(env, recipient.email, expiringContracts);
      if (sent) emailsSent++;
    }

    // -- 5. Record batch in audit log for daily dedupe -----------------------
    // Only write the dedupe marker when at least one email actually went through,
    // so a day where all sends failed will be retried on the next cron run.
    if (emailsSent > 0) {
      await writeAuditLog({
        db,
        actor: null,
        actionType: "CONTRACT_EXPIRY_ALERT",
        entityType: "contract",
        entityId: batchKey,
        reason: `Contract expiry alert sent to ${emailsSent} recipient(s). ${expiringContracts.length} expiring contract(s).`,
        metadata: {
          contractIds: expiringContracts.map((c) => c.id),
          // Store masked emails — raw addresses must not appear in audit_logs
          // or the R2 archive (TDD §8 PII requirement).
          recipients: recipients.map((r) => maskEmail(r.email)),
        },
      });
    }

    return { checked: contractRows.length, expiring: expiringContracts.length, emailsSent };
  } catch (err) {
    console.error("[contractExpiryAlerts] Unexpected error:", err);
    return { checked: 0, expiring: 0, emailsSent: 0 };
  }
}
