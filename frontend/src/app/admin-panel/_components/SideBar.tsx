"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useRef, useEffect, useState } from "react";
import {
  CheckCircle,
  ChevronDown,
  FileText,
  Gift,
  LayoutGrid,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { getAdminRoleLabel, isAdminEmployee, isHrAdmin } from "../_lib/access";
import NotificationBell from "@/app/_components/NotificationBell";

const ALL_NAV_ITEMS = [
  {
    href: "/admin-panel",
    label: "Dashboard",
    icon: LayoutGrid,
    hrOnly: false,
  },
  {
    href: "/admin-panel/company-benefits",
    label: "Company Benefits",
    icon: Gift,
    hrOnly: false,
  },
  {
    href: "/admin-panel/pending-requests",
    label: "Pending Requests",
    icon: CheckCircle,
    hrOnly: false,
  },
  {
    href: "/admin-panel/eligibility-inspector",
    label: "Eligibility Inspector",
    icon: FileText,
    hrOnly: true,
  },
  {
    href: "/admin-panel/audit-logs",
    label: "Request History",
    icon: ShieldCheck,
    hrOnly: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { employee, loading } = useCurrentEmployee();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const hasAdminAccess = isAdminEmployee(employee);
  const hasHrAccess = isHrAdmin(employee);
  const profileName = employee?.name ?? "Employee";
  const profileRole = hasAdminAccess ? getAdminRoleLabel(employee) : "No admin access";

  // Finance-only admins must not see HR-governance pages
  const navItems = ALL_NAV_ITEMS.filter((item) => !item.hrOnly || hasHrAccess);

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

  const isActive = (href: string) =>
    href === "/admin-panel" ? pathname === href : pathname.startsWith(href);

  const navLinkClass = (href: string) =>
    `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition active:scale-[0.98] ${
      isActive(href)
        ? "bg-gray-100 text-gray-900"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    }`;

  return (
    <>
      <aside className="fixed left-0 top-0 z-10 flex h-screen w-[260px] flex-col border-r border-gray-100 bg-white">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-4">
          <Link href="/admin-panel" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            {loading ? (
              <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
            ) : (
              <span className="font-semibold text-gray-900">
                {hasAdminAccess ? getAdminRoleLabel(employee) : "Employee"}
              </span>
            )}
          </Link>
          <NotificationBell />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <div className="relative mb-4" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-gray-50 active:scale-[0.99]"
            >
              {loading ? (
                <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm font-semibold text-white">
                  {profileName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                {loading ? (
                  <>
                    <div className="h-3.5 w-24 rounded bg-gray-200 animate-pulse" />
                    <div className="mt-1.5 h-3 w-16 rounded bg-gray-200 animate-pulse" />
                  </>
                ) : (
                  <>
                    <p className="truncate text-sm font-medium text-gray-900">{profileName}</p>
                    <p className="truncate text-xs text-gray-400">{profileRole}</p>
                  </>
                )}
              </div>
              <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
            </button>
            <div
              className={`absolute left-0 right-0 top-full z-20 mt-1.5 origin-top rounded-lg border border-gray-100 bg-white py-1 shadow-lg transition-all duration-200 ease-out ${
                profileOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0 pointer-events-none"
              }`}
            >
<Link
                href="/employee-panel/dashboard"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <LayoutGrid className="h-4 w-4" />
                <span>My dashboard</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  signOut({ redirectUrl: "/sign-in" });
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>

          <nav className="space-y-0.5">
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-gray-400">Menu</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <div className="w-[260px] shrink-0" aria-hidden />
    </>
  );
}
