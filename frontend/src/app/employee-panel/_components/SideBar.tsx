"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRef, useEffect, useState } from "react";
import {
  LayoutGrid,
  FileText,
  LogOut,
  ChevronDown,
  ShieldCheck,
  ClipboardList,
  FlaskConical,
  Smartphone,
} from "lucide-react";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isAdminEmployee } from "@/app/admin-panel/_lib/access";
import NotificationBell from "@/app/_components/NotificationBell";
import PineconeLogo from "@/app/_components/_icons/PineconeLogo";

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

const mainNavItems = [
  { href: "/employee-panel/dashboard", label: "Dashboard", icon: LayoutGrid },
  {
    href: "/employee-panel/screen-time",
    label: "Screen Time",
    icon: Smartphone,
  },
  { href: "/employee-panel/requests", label: "Requests", icon: ClipboardList },
  { href: "/employee-panel/contracts", label: "Contracts", icon: FileText },
];

const devNavItems = [
  { href: "/test", label: "Test (Employee & Benefits)", icon: FlaskConical },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { employee, loading } = useCurrentEmployee();
  const hasAdminAccess = isAdminEmployee(employee);
  const [profileOpen, setProfileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const profileRef = useRef<HTMLDivElement>(null);

  const profileName = employee?.name ?? "Employee";
  const profileRole = `${formatLabel(employee?.role)}${employee?.department ? ` · ${formatLabel(employee.department)}` : ""}`;

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

  const isActive = (href: string) =>
    href === "/employee-panel/dashboard"
      ? pathname === href
      : pathname.startsWith(href);

  const navLinkClass = (href: string) =>
    `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition active:scale-[0.98] ${
      isActive(href)
        ? "bg-gray-100 text-gray-900"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    }`;

  const sidebarW = collapsed ? "w-[64px]" : "w-[260px]";

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-10 flex h-screen flex-col border-r border-gray-100 bg-white transition-all duration-200 ${sidebarW}`}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => {
          setCollapsed(true);
          setProfileOpen(false);
        }}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-4">
          <Link
            href="/employee-panel/dashboard"
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ">
              <PineconeLogo className="text-black" />
            </div>
            {!collapsed && (
              <span className="font-semibold text-gray-900">Employee</span>
            )}
          </Link>
          {!collapsed && <NotificationBell />}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-4">
          <nav className="space-y-0.5">
            {!collapsed && (
              <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                Menu
              </p>
            )}
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
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

          <nav className="mt-6 space-y-0.5 border-t border-gray-100 pt-4">
            {!collapsed && (
              <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                Dev
              </p>
            )}
            {devNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
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
                        <p className="truncate text-sm font-medium text-gray-900">
                          {profileName}
                        </p>
                        <p className="truncate text-xs text-gray-400">
                          {profileRole}
                        </p>
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
            >
              {hasAdminAccess && (
                <Link
                  href="/admin-panel"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
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
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
      <div
        className={`shrink-0 transition-all duration-200 ${sidebarW}`}
        aria-hidden
      />
    </>
  );
}
