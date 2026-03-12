"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
<<<<<<< Updated upstream
import {
  ClipboardList,
  FileBadge,
  FileText,
  LayoutGrid,
  LogOut,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

const navItems = [
  {
    href: "/admin-panel",
    label: "Dashboard",
    icon: LayoutGrid,
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

  const isActive = (href: string) => {
    if (href === "/admin-panel") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-screen w-[260px] flex-col justify-between border-r border-gray-200 bg-[#f8f8f9] px-4 py-4">
      <div>
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
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  isActive(item.href)
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>

      <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
        <LogOut className="h-5 w-5" />
        <span>Sign out</span>
      </button>
=======
import { LayoutGrid, Users, FileText, Package } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[260px] flex-col border-r border-gray-200 bg-[#f8f8f9] px-4 py-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">HR Admin</h2>
        <p className="text-sm text-gray-500">Benefits Management</p>
      </div>
      <nav className="space-y-1">
        <Link
          href="/admin-panel"
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
            pathname === "/admin-panel"
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <LayoutGrid className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/admin-panel/eligibility"
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
            pathname === "/admin-panel/eligibility"
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Eligibility Inspector</span>
        </Link>
        <Link
          href="/admin-panel/requests"
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
            pathname === "/admin-panel/requests"
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <FileText className="h-5 w-5" />
          <span>Request Review</span>
        </Link>
        <Link
          href="/admin-panel/benefits"
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
            pathname === "/admin-panel/benefits"
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Package className="h-5 w-5" />
          <span>Benefits</span>
        </Link>
      </nav>
>>>>>>> Stashed changes
    </aside>
  );
}
