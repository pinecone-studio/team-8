"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useRef, useEffect, useState } from "react";
import {
  CheckCircle,
  ChevronDown,
  ClipboardList,
  FileBadge,
  FileText,
  Gift,
  LayoutGrid,
  LogOut,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { getAdminRoleLabel, isAdminEmployee } from "../_lib/access";

const navItems = [
  {
    href: "/admin-panel",
    label: "Dashboard",
    icon: LayoutGrid,
  },
  {
    href: "/admin-panel/company-benefits",
    label: "Company Benefits",
    icon: Gift,
  },
  {
    href: "/admin-panel/pending-requests",
    label: "Pending Requests",
    icon: CheckCircle,
  },
  {
    href: "/admin-panel/eligibility-inspector",
    label: "Eligibility Inspector",
    icon: FileText,
  },
  {
    href: "/admin-panel/rule-configuration",
    label: "Rule Configuration",
    icon: ClipboardList,
  },
  {
    href: "/admin-panel/vendor-contracts",
    label: "Vendor Contracts",
    icon: FileBadge,
  },
  {
    href: "/admin-panel/audit-logs",
    label: "Audit Logs",
    icon: ShieldCheck,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { employee, loading } = useCurrentEmployee();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const hasAdminAccess = isAdminEmployee(employee);
  const profileName = loading ? "Loading..." : employee?.name ?? "Employee";
  const profileRole = loading
    ? "Profile"
    : hasAdminAccess
      ? getAdminRoleLabel(employee)
      : "No admin access";

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

  const isActive = (href: string) => {
    if (href === "/admin-panel") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      <aside className="fixed left-0 top-0 z-10 flex h-screen w-[260px] flex-col justify-between border-r border-gray-200 bg-[#f8f8f9] px-4 py-4">
        <div className="min-h-0 flex-1 overflow-y-auto">
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
                href="/admin-panel/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              <Link
                href="/employee-panel/dashboard"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
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
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition active:scale-[0.98] ${
                    isActive(item.href)
                      ? "bg-gray-200 text-gray-900 active:bg-gray-300"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
                  }`}
                >
                  <Icon className="h-5 w-5" />
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
