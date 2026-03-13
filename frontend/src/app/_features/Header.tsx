"use client";

import { useRef, useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";

export default function Header() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
    }
    if (notificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [notificationOpen]);

  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Search */}
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search benefits, requests..."
          className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-700 outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Notifications */}
      <div className="relative ml-6 flex items-center" ref={panelRef}>
        <button
          type="button"
          onClick={() => setNotificationOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100 active:scale-95 active:bg-gray-200"
          aria-label="Notifications"
          aria-expanded={notificationOpen}
        >
          <Bell className="h-5 w-5 text-gray-600" />
        </button>
        {notificationOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
            <p className="px-4 py-2 text-sm font-semibold text-gray-900">Notifications</p>
            <div className="max-h-64 overflow-y-auto">
              <p className="px-4 py-6 text-center text-sm text-gray-500">No new notifications</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
