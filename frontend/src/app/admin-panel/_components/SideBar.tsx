"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  ClipboardList,
  FileBadge,
  FileText,
  LayoutGrid,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  CheckCircle,
} from "lucide-react";

const navItems = [
  {
    href: "/admin-panel",
    label: "Dashboard",
    icon: LayoutGrid,
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
        <div className="mb-6 flex items-center gap-3 rounded-2xl p-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <User className="h-6 w-6 text-gray-500" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900">Username</h2>
            <p className="text-sm text-gray-500">Admin</p>
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

        <div className="my-6 border-t border-gray-200" />

        <Link
          href="/admin-panel/settings"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] active:bg-gray-200"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>

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
      <div className="w-[260px] shrink-0" aria-hidden />
    </>
  );
}
