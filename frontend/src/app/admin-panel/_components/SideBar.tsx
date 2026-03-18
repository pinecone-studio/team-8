"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
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
import PineconeLogo from "@/app/_components/_icons/PineconeLogo";

const SIDEBAR_STORAGE_KEY = "ui.adminSidebarCollapsed.v1";

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
  const { user, isLoaded: isUserLoaded } = useUser();
  const { employee, loading } = useCurrentEmployee();
  const [profileOpen, setProfileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const hasAdminAccess = isAdminEmployee(employee);
  const hasHrAccess = isHrAdmin(employee);
  const profileName = employee?.name ?? "Employee";
  const profileRole = hasAdminAccess
    ? getAdminRoleLabel(employee)
    : "No admin access";

  // Finance-only admins must not see HR-governance pages
  const navItems = ALL_NAV_ITEMS.filter((item) => !item.hrOnly || hasHrAccess);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [profileOpen]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (saved === "1") setCollapsed(true);
      if (saved === "0") setCollapsed(false);
    } catch {
      // ignore storage errors (e.g. blocked)
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      // ignore
    }
  }, [collapsed]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setProfileOpen(false);
      }
    }
    if (mobileOpen) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/admin-panel" ? pathname === href : pathname.startsWith(href);

  const navLinkClass = (href: string) =>
    `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition active:scale-[0.98] ${
      isActive(href)
        ? "bg-gray-100 text-gray-900"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    }`;

  const sidebarW = collapsed ? "w-[64px]" : "w-[260px]";

  return (
    <>
      {/* Mobile: clickable left edge to open sidebar when closed */}
      {!mobileOpen && (
        <button
          type="button"
          className="fixed left-0 top-0 z-[9] hidden h-full w-5 cursor-pointer border-0 bg-transparent md:hidden"
          aria-label="Open sidebar"
          aria-expanded={false}
          onClick={() => {
            setMobileOpen(true);
            setCollapsed(false);
            setProfileOpen(false);
          }}
        />
      )}

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/40 backdrop-blur-[1px] md:hidden"
          onClick={() => {
            setMobileOpen(false);
            setProfileOpen(false);
          }}
          aria-hidden
        />
      )}

      <aside
        role={collapsed ? "button" : undefined}
        tabIndex={collapsed ? 0 : undefined}
        aria-label={collapsed ? "Expand sidebar" : undefined}
        onClick={collapsed ? () => { setCollapsed(false); setProfileOpen(false); } : undefined}
        onKeyDown={collapsed ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCollapsed(false); setProfileOpen(false); } } : undefined}
        className={`fixed left-0 top-0 z-[11] flex h-screen flex-col border-r border-gray-100 bg-white transition-all duration-200 ${sidebarW} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${collapsed ? "cursor-pointer" : ""}`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-4">
          <Link href="/admin-panel" className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0a116d]">
              <PineconeLogo />
            </div>
            {!collapsed && (
              loading ? (
                <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
              ) : (
                <span className="font-semibold text-gray-900">
                  {hasAdminAccess ? getAdminRoleLabel(employee) : "Employee"}
                </span>
              )
            )}
          </Link>
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-1"}`}>
            {!collapsed && <NotificationBell />}
            {!collapsed && (
              <button
                type="button"
                aria-label="Collapse sidebar"
                aria-pressed={false}
                onClick={() => {
                  setCollapsed(true);
                  setProfileOpen(false);
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 active:scale-[0.98]"
                title="Collapse"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
              </button>
            )}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-4">
          <nav className="space-y-0.5">
            {!collapsed && (
              <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-gray-400">Menu</p>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  onClick={() => {
                    setMobileOpen(false);
                    setProfileOpen(false);
                  }}
                  className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium transition active:scale-[0.98] ${collapsed ? "justify-center" : "gap-3"} ${
                    isActive(item.href)
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="shrink-0 border-t border-gray-100 px-2 py-3">
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className={`flex w-full items-center rounded-xl px-2 py-2.5 text-left transition hover:bg-gray-50 active:scale-[0.99] ${collapsed ? "justify-center" : "gap-2.5"}`}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
            >
              {loading || !isUserLoaded ? (
                <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200 animate-pulse" />
              ) : user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={profileName}
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm font-semibold text-white">
                  {profileName.charAt(0).toUpperCase()}
                </div>
              )}
              {!collapsed && (
                <>
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
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>
            <div
              className={`absolute bottom-full left-0 right-0 z-20 mb-1.5 origin-bottom rounded-lg border border-gray-100 bg-white py-1 shadow-lg transition-all duration-200 ease-out ${
                profileOpen
                  ? "visible scale-100 opacity-100"
                  : "invisible scale-95 opacity-0 pointer-events-none"
              }`}
              role="menu"
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
                role="menuitem"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
      <div className={`hidden shrink-0 transition-all duration-200 md:block ${sidebarW}`} aria-hidden />
    </>
  );
}
