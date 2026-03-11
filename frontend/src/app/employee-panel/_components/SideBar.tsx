"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FileText, Settings, LogOut, User } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[260px] flex-col justify-between border-r border-gray-200 bg-[#f8f8f9] px-4 py-4">
      <div>
        {/* Top profile */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl p-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <User className="h-6 w-6 text-gray-500" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900">Username</h2>
            <p className="text-sm text-gray-500">Senior Engineer</p>
          </div>
        </div>

        {/* Main nav */}
        <nav className="space-y-1">
          <Link
            href="/employee-panel/Dashboard"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
              pathname === "/employee-panel/Dashboard"
                ? "bg-gray-200 text-gray-900"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/employee-panel/Mybenefits"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
              pathname === "/employee-panel/Mybenefits"
                ? "bg-gray-200 text-gray-900"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>My Benefits</span>
          </Link>

          <Link
            href="/employee-panel/Requests"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
              pathname === "/employee-panel/Requests"
                ? "bg-gray-200 text-gray-900"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>Requests</span>
          </Link>

          <Link
            href="/employee-panel/Contracts"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
              pathname === "/employee-panel/Contracts"
                ? "bg-gray-200 text-gray-900"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>Contracts</span>
          </Link>
        </nav>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200" />

        {/* Settings */}
        <Link
          href="/employee-panel/Settings"
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
            pathname === "/employee-panel/settings"
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>

      {/* Bottom sign out */}
      <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
        <LogOut className="h-5 w-5" />
        <span>Sign out</span>
      </button>
    </aside>
  );
}
