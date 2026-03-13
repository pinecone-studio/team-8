"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { LayoutGrid, FileText, Settings, LogOut, User } from "lucide-react";
import { useCurrentEmployee } from "@/lib/current-employee-provider";

function formatLabel(value: string | null | undefined) {
  if (!value) return "Employee";

  return value
    .split("_")
    .join(" ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { employee, loading } = useCurrentEmployee();
  const profileName = loading ? "Loading..." : employee?.name ?? "Employee";
  const profileRole = loading
    ? "Profile"
    : `${formatLabel(employee?.role)}${employee?.department ? ` · ${formatLabel(employee.department)}` : ""}`;

  return (
    <>
      <aside className="fixed left-0 top-0 z-10 flex h-screen w-[260px] flex-col justify-between border-r border-gray-200 bg-[#f8f8f9] px-4 py-4">
        <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Top profile */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl p-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <User className="h-6 w-6 text-gray-500" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900">{profileName}</h2>
            <p className="text-sm text-gray-500">{profileRole}</p>
          </div>
        </div>

        {/* Main nav */}
        <nav className="space-y-1">
          <Link
            href="/employee-panel/dashboard"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition active:scale-[0.98] ${
              pathname === "/employee-panel/dashboard"
                ? "bg-gray-200 text-gray-900 active:bg-gray-300"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/employee-panel/mybenefits"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition active:scale-[0.98] ${
              pathname === "/employee-panel/mybenefits"
                ? "bg-gray-200 text-gray-900 active:bg-gray-300"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>My Benefits</span>
          </Link>

          <Link
            href="/employee-panel/requests"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition active:scale-[0.98] ${
              pathname === "/employee-panel/requests"
                ? "bg-gray-200 text-gray-900 active:bg-gray-300"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>Requests</span>
          </Link>

          <Link
            href="/employee-panel/contracts"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition active:scale-[0.98] ${
              pathname === "/employee-panel/contracts"
                ? "bg-gray-200 text-gray-900 active:bg-gray-300"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>Contracts</span>
          </Link>

          <Link
            href="/test"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition active:scale-[0.98] ${
              pathname === "/test"
                ? "bg-gray-200 text-gray-900 active:bg-gray-300"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>Test (Employee & Benefits)</span>
          </Link>
        </nav>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200" />

        {/* Settings */}
        <Link
          href="/employee-panel/settings"
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition active:scale-[0.98] ${
            pathname === "/employee-panel/settings"
              ? "bg-gray-200 text-gray-900 active:bg-gray-300"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
        </div>

        {/* Bottom sign out - үл хөдлөх */}
        <div className="shrink-0 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={() => signOut({ redirectUrl: "/sign-in" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] active:bg-gray-200"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      {/* Spacer so main content doesn't go under fixed sidebar */}
      <div className="w-[260px] shrink-0" aria-hidden />
    </>
  );
}
