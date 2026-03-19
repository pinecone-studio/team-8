"use client";

import { useMemo, useState, useCallback } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import Sidebar from "../_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { Bell, CalendarClock, Database, Mail, RefreshCw, ShieldCheck } from "lucide-react";

const GET_MY_SETTINGS = gql`
  query GetMySettings {
    mySettings {
      notificationEmail
      notificationEligibility
      notificationRenewals
      language
      timezone
    }
  }
`;

const UPDATE_MY_SETTINGS = gql`
  mutation UpdateMySettings($input: UpdateMySettingsInput!) {
    updateMySettings(input: $input) {
      notificationEmail
      notificationEligibility
      notificationRenewals
      language
      timezone
    }
  }
`;

type SettingsData = {
  notificationEmail: boolean;
  notificationEligibility: boolean;
  notificationRenewals: boolean;
  language: string;
  timezone: string;
};

const DEFAULTS: SettingsData = {
  notificationEmail: true,
  notificationEligibility: true,
  notificationRenewals: false,
  language: "English",
  timezone: "UTC",
};

const SYSTEM_ITEMS = [
  {
    Icon: CalendarClock,
    label: "Scheduled Cron",
    value: "0 9 * * * (daily at 09:00 UTC)",
    note: "Contract expiry alerts + OKR sync · Audit archive runs 1st of each month",
  },
  {
    Icon: Mail,
    label: "Email Dispatch",
    value: "Gmail API (OAuth 2.0)",
    note: "Requires GMAIL_CLIENT_ID · GMAIL_CLIENT_SECRET · GMAIL_REFRESH_TOKEN · GMAIL_SENDER_EMAIL",
  },
  {
    Icon: RefreshCw,
    label: "OKR Integration",
    value: "OKR_API_URL (env var)",
    note: "Polled daily by the scheduled handler · Requires OKR_WEBHOOK_SECRET for signature validation",
  },
  {
    Icon: Database,
    label: "Audit Archive",
    value: "R2 · audit-archive/{YYYY-MM}/batch-{ts}.ndjson",
    note: "Rows older than 12 months archived monthly · AUDIT_ARCHIVE_BUCKET binding required",
  },
  {
    Icon: ShieldCheck,
    label: "Eligibility Cache",
    value: "KV · eligibility:v1:{employeeId} · TTL 1 h",
    note: "Invalidated on recompute, HR override, and attendance/OKR import",
  },
];

const NOTIFICATION_ROWS: {
  key: keyof Pick<SettingsData, "notificationEmail" | "notificationEligibility" | "notificationRenewals">;
  label: string;
  description: string;
}[] = [
  {
    key: "notificationEmail",
    label: "Email notifications",
    description: "Receive email updates for benefit requests",
  },
  {
    key: "notificationEligibility",
    label: "Eligibility alerts",
    description: "Alerts when employee eligibility changes",
  },
  {
    key: "notificationRenewals",
    label: "Contract renewal reminders",
    description: "Receive alerts when vendor contracts are expiring",
  },
];

export default function AdminSettingsPage() {
  const { employee } = useCurrentEmployee();

  const { data, loading, refetch } = useQuery<{ mySettings: SettingsData }>(
    GET_MY_SETTINGS,
    {
      fetchPolicy: "cache-and-network",
    },
  );
  const [updateMySettings, { loading: saving }] = useMutation(UPDATE_MY_SETTINGS, {
    update(cache, { data: mutationData }) {
      if (!mutationData?.updateMySettings) return;
      cache.writeQuery({ query: GET_MY_SETTINGS, data: { mySettings: mutationData.updateMySettings } });
    },
  });

  const [localOverrides, setLocalOverrides] = useState<Partial<SettingsData>>({});
  const [saved, setSaved] = useState(false);

  const form = useMemo<SettingsData>(
    () => ({ ...(data?.mySettings ?? DEFAULTS), ...localOverrides }),
    [data, localOverrides],
  );

  const handleSave = useCallback(async () => {
    try {
      await updateMySettings({ variables: { input: form } });
      await refetch();
      setLocalOverrides({});
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save settings.");
    }
  }, [form, refetch, updateMySettings]);

  const handleCancel = useCallback(() => setLocalOverrides({}), []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl min-h-screen px-8 py-9">
          <section className="mx-auto max-w-3xl space-y-8">

            <div>
              <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
              <p className="mt-1 text-sm text-gray-500">Manage admin preferences and review system configuration</p>
            </div>

            {/* Admin profile */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-slate-700">Admin Profile</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Name</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-700">{employee?.nameEng ?? employee?.name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Role</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-700 capitalize">{employee?.role?.replace(/_/g, " ") ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Email</p>
                  <p className="mt-0.5 text-sm text-slate-500">{employee?.email ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Department</p>
                  <p className="mt-0.5 text-sm text-slate-500">{employee?.department ?? "—"}</p>
                </div>
              </div>
            </div>

            {/* Notification preferences */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <Bell className="h-4 w-4 text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-700">Notification Preferences</h2>
              </div>
              {loading && !data ? (
                <PageLoading inline message="Loading…" className="text-slate-400" />
              ) : (
                <div className="space-y-5">
                  {NOTIFICATION_ROWS.map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{label}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={form[key]}
                        onChange={(e) => setLocalOverrides((prev) => ({ ...prev, [key]: e.target.checked }))}
                        className="h-5 w-5 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                  <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                    {saved && <span className="text-xs text-green-600">Saved.</span>}
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving || Object.keys(localOverrides).length === 0}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving || Object.keys(localOverrides).length === 0}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* System configuration (read-only) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-sm font-semibold text-slate-700">System Configuration</h2>
              <p className="mb-5 text-xs text-slate-400">
                These values are set in{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-600">wrangler.toml</code>{" "}
                and Cloudflare environment secrets. Contact Engineering to change them.
              </p>
              <div className="space-y-5">
                {SYSTEM_ITEMS.map(({ Icon, label, value, note }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50">
                      <Icon className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                      <p className="mt-0.5 font-mono text-xs text-slate-700">{value}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>
        </main>
      </div>
    </div>
  );
}
