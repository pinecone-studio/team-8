"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useRef, useEffect, useState } from "react";
import { LayoutGrid, FileText, Settings, LogOut, User, ChevronDown, ShieldCheck } from "lucide-react";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isAdminEmployee } from "@/app/admin-panel/_lib/access";

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
  const hasAdminAccess = isAdminEmployee(employee);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const profileName = loading ? "Loading..." : employee?.name ?? "Employee";
  const profileRole = loading
    ? "Profile"
    : `${formatLabel(employee?.role)}${employee?.department ? ` · ${formatLabel(employee.department)}` : ""}`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [profileOpen]);

  return (
    <>
      <aside className="fixed left-0 top-0 z-10 flex h-screen w-[260px] flex-col justify-between border-r border-gray-200 bg-[#f8f8f9] px-4 py-4">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Profile - minimal dropdown */}
        <div className="relative mb-5" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 text-left transition hover:bg-gray-100/80 active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200/80">
              <User className="h-4 w-4 text-gray-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-800">{profileName}</p>
              <p className="truncate text-xs text-gray-500">{profileRole}</p>
            </div>
            <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
          </button>
          <div
            className={`absolute left-0 right-0 top-full z-20 mt-1.5 origin-top rounded-lg border border-gray-100 bg-white py-1 shadow-sm transition-all duration-200 ease-out ${
              profileOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0 pointer-events-none"
            }`}
          >
            <Link
              href="/employee-panel/settings"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
            {hasAdminAccess && (
              <Link
                href="/admin-panel"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Admin panel</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                setProfileOpen(false);
                signOut({ redirectUrl: "/sign-in" });
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
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
      </div>
      </aside>
      {/* Spacer so main content doesn't go under fixed sidebar */}
      <div className="w-[260px] shrink-0" aria-hidden />
    </>
  );
}
