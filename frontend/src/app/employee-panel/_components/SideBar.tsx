"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useRef, useEffect, useState } from "react";
import {
  LayoutGrid,
  FileText,
  Settings,
  LogOut,
  User,
  ChevronDown,
  ShieldCheck,
  Gift,
  ClipboardList,
  FlaskConical,
} from "lucide-react";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isAdminEmployee } from "@/app/admin-panel/_lib/access";
import NotificationBell from "@/app/_components/NotificationBell";

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
  { href: "/employee-panel/mybenefits", label: "My Benefits", icon: Gift },
  { href: "/employee-panel/requests", label: "Requests", icon: ClipboardList },
  { href: "/employee-panel/contracts", label: "Contracts", icon: FileText },
];

const devNavItems = [
  { href: "/test", label: "Test (Employee & Benefits)", icon: FlaskConical },
];

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

  const isActive = (href: string) =>
    href === "/employee-panel/dashboard" ? pathname === href : pathname.startsWith(href);

  const navLinkClass = (href: string) =>
    `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition active:scale-[0.98] border-l-2 ${
      isActive(href)
        ? "border-primary bg-sidebar-accent text-sidebar-accent-foreground"
        : "border-transparent text-sidebar-foreground hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    }`;

  return (
    <>
      <aside className="fixed left-0 top-0 z-10 flex h-screen w-[260px] flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/employee-panel/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Gift className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">Benefits</span>
          </Link>
          <NotificationBell />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <div className="relative mb-4" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-sidebar-accent active:scale-[0.99]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent">
                <User className="h-4 w-4 text-sidebar-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-sidebar-foreground">{profileName}</p>
                <p className="truncate text-xs text-muted-foreground">{profileRole}</p>
              </div>
              <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
            </button>
            <div
              className={`absolute left-0 right-0 top-full z-20 mt-1.5 origin-top rounded-lg border border-border bg-popover py-1 shadow-lg transition-all duration-200 ease-out ${
                profileOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0 pointer-events-none"
              }`}
            >
              <Link
                href="/employee-panel/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              {hasAdminAccess && (
                <Link
                  href="/admin-panel"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground"
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
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>

          <nav className="space-y-0.5">
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Menu</p>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <nav className="mt-6 space-y-0.5 border-t border-sidebar-border pt-4">
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Dev</p>
            {devNavItems.map((item) => {
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
