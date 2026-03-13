"use client";

import React, { useState, useCallback } from "react";
import SideBar from "../_components/SideBar";

const NOTIFICATIONS_KEY = "settings-notifications";
const PREFERENCES_KEY = "settings-preferences";

type NotificationsState = { email: boolean; eligibility: boolean; renewals: boolean };
type PreferencesState = { language: string; timezone: string };

function loadNotifications(): NotificationsState {
  if (typeof window === "undefined") return { email: true, eligibility: true, renewals: false };
  try {
    const s = localStorage.getItem(NOTIFICATIONS_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return { email: true, eligibility: true, renewals: false };
}

function loadPreferences(): PreferencesState {
  if (typeof window === "undefined") return { language: "English", timezone: "UTC" };
  try {
    const s = localStorage.getItem(PREFERENCES_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return { language: "English", timezone: "UTC" };
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<NotificationsState>(loadNotifications);
  const [preferences, setPreferences] = useState<PreferencesState>(loadPreferences);
  const [saved, setSaved] = useState(false);

  const handleNotificationChange = useCallback((key: keyof typeof notifications, checked: boolean) => {
    setNotifications((prev: NotificationsState) => ({ ...prev, [key]: checked }));
  }, []);

  const handleSave = useCallback(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save settings.");
    }
  }, [notifications, preferences]);

  const handleCancel = useCallback(() => {
    setNotifications(loadNotifications());
    setPreferences(loadPreferences());
  }, []);

  const handleChangePassword = useCallback(() => {
    window.open("https://accounts.clerk.dev", "_blank");
  }, []);

  const handleEnable2FA = useCallback(() => {
    alert("Two-factor authentication can be enabled in your account security settings (Clerk).");
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8f8f9]">
      <SideBar />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 bg-[#F9FAFB] min-h-screen py-10 px-6 sm:px-12 flex justify-center">
  <div className="w-full max-w-[800px] space-y-8">
    
    {/* Header Section */}
    <div>
      <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
      <p className="mt-1 text-sm text-gray-500">Manage your account and preferences</p>
    </div>

    <div className="space-y-6">
      
      {/* Profile Section - Зураасгүй, цэвэрхэн */}
      <section className="bg-white rounded-2xl border border-[#EAECF0] shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[14px] font-medium text-[#101828]">First Name</label>
              <input type="text" defaultValue="Alex" className="w-full px-4 py-2.5 bg-white border border-[#EAECF0] rounded-xl text-[15px] text-[#101828] outline-none shadow-sm focus:border-[#2970FF] focus:ring-1 focus:ring-[#2970FF]" />
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-medium text-[#101828]">Last Name</label>
              <input type="text" defaultValue="Johnson" className="w-full px-4 py-2.5 bg-white border border-[#EAECF0] rounded-xl text-[15px] text-[#101828] outline-none shadow-sm focus:border-[#2970FF] focus:ring-1 focus:ring-[#2970FF]" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-[#101828]">Email</label>
            <input type="email" defaultValue="alex.johnson@company.com" className="w-full px-4 py-2.5 bg-white border border-[#EAECF0] rounded-xl text-[15px] text-[#101828] outline-none shadow-sm focus:border-[#2970FF] focus:ring-1 focus:ring-[#2970FF]" />
          </div>
        </div>
      </section>

      {/* Notifications Section - Зураг дээрх цэнхэр checkbox-той */}
      <section className="bg-white rounded-2xl border border-[#EAECF0] shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-medium text-[#101828]">Email notifications</p>
                  <p className="text-[14px] text-[#475467] mt-0.5">Receive email updates about benefit requests</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => handleNotificationChange("email", e.target.checked)}
                  className="w-5 h-5 rounded border-[#D0D5DD] text-[#2970FF] focus:ring-[#2970FF] cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-medium text-[#101828]">Eligibility alerts</p>
                  <p className="text-[14px] text-[#475467] mt-0.5">Get notified when you become eligible for new benefits</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.eligibility}
                  onChange={(e) => handleNotificationChange("eligibility", e.target.checked)}
                  className="w-5 h-5 rounded border-[#D0D5DD] text-[#2970FF] focus:ring-[#2970FF] cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-medium text-[#101828]">Contract renewals</p>
                  <p className="text-[14px] text-[#475467] mt-0.5">Receive alerts when contracts are expiring</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.renewals}
                  onChange={(e) => handleNotificationChange("renewals", e.target.checked)}
                  className="w-5 h-5 rounded border-[#D0D5DD] text-[#2970FF] focus:ring-[#2970FF] cursor-pointer"
                />
              </div>
        </div>
      </section>

      {/* Security Section - Хоёр сонголтын дунд зураастай */}
      <section className="bg-white rounded-2xl border border-[#EAECF0] shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <h2 className="text-lg font-semibold text-gray-900">Security</h2>
        </div>
        <div className="flex flex-col">
          <button type="button" onClick={handleChangePassword} className="py-3 text-left text-[14px] font-medium text-[#2970FF] transition hover:underline active:opacity-80">Change password</button>
          <div className="border-t border-[#EAECF0]"></div>
          <button type="button" onClick={handleEnable2FA} className="py-3 text-left text-[14px] font-medium text-[#2970FF] transition hover:underline active:opacity-80">Enable two-factor authentication</button>
        </div>
      </section>

      {/* Preferences Section - Таны явуулсан зургуудтай яг адилхан */}
      <section className="bg-white rounded-2xl border border-[#EAECF0] shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
        </div>
        
        <div className="space-y-6">
          {/* Language Dropdown */}
          <div className="space-y-2">
            <label className="text-[15px] font-medium text-[#101828]">Language</label>
            <div className="relative">
              <select
                value={preferences.language}
                onChange={(e) => setPreferences((p: PreferencesState) => ({ ...p, language: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-[#EAECF0] rounded-xl text-[15px] text-[#101828] outline-none appearance-none cursor-pointer focus:border-[#2970FF] focus:ring-1 focus:ring-[#2970FF]"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>

          {/* Timezone Dropdown */}
          <div className="space-y-2">
            <label className="text-[15px] font-medium text-[#101828]">Timezone</label>
            <div className="relative">
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences((p: PreferencesState) => ({ ...p, timezone: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-[#EAECF0] rounded-xl text-[15px] text-[#101828] outline-none appearance-none cursor-pointer focus:border-[#2970FF] focus:ring-1 focus:ring-[#2970FF]"
              >
                <option>UTC</option>
                <option>EST (UTC-5)</option>
                <option>PST (UTC-8)</option>
                <option>CET (UTC+1)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-end items-center gap-3 pt-4 pb-12">
        {saved && <span className="text-sm text-green-600">Settings saved.</span>}
        <button type="button" onClick={handleCancel} className="px-5 py-2.5 text-[14px] font-medium text-[#344054] bg-white border border-[#D0D5DD] rounded-xl transition-all shadow-sm hover:bg-gray-50 active:scale-[0.98] active:bg-gray-100">Cancel</button>
        <button type="button" onClick={handleSave} className="px-6 py-2.5 text-[14px] font-medium text-white bg-[#2970FF] rounded-xl transition-all shadow-sm hover:bg-[#175CD3] active:scale-[0.98] active:bg-[#1557b8]">Save Changes</button>
      </div>
      
    </div>
  </div>
</main>
      </div>
    </div>
  );
}