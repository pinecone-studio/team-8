"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Gift,
  FileText,
  User,
  Users,
  ClipboardCheck,
  Package,
} from "lucide-react";

/** Unified sidebar for admin (who is also employee) — one place for everything */
export default function AppSidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
      isActive
        ? "bg-indigo-100 text-indigo-900"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;
  };

  return (
    <aside className="flex h-screen w-[280px] shrink-0 flex-col justify-between border-r border-gray-200 bg-white px-4 py-4 shadow-sm">
      <div>
        {/* Profile — admin is also employee */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100">
            <User className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">You</h2>
            <p className="text-xs text-gray-500">Employee & HR Admin</p>
          </div>
        </div>

        {/* Employee section */}
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          My Benefits
        </p>
        <nav className="space-y-0.5">
          <Link
            href="/employee-panel/Mybenefits"
            className={linkClass("/employee-panel/Mybenefits")}
          >
            <Gift className="h-5 w-5 shrink-0" />
            <span>My Benefits</span>
          </Link>
        </nav>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200" />

        {/* HR Admin section */}
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          HR Admin
        </p>
        <nav className="space-y-0.5">
          <Link href="/admin-panel" className={linkClass("/admin-panel")}>
            <LayoutGrid className="h-5 w-5 shrink-0" />
            <span>Admin Dashboard</span>
          </Link>
          <Link
            href="/admin-panel/eligibility"
            className={linkClass("/admin-panel/eligibility")}
          >
            <Users className="h-5 w-5 shrink-0" />
            <span>Eligibility Inspector</span>
          </Link>
          <Link
            href="/admin-panel/requests"
            className={linkClass("/admin-panel/requests")}
          >
            <ClipboardCheck className="h-5 w-5 shrink-0" />
            <span>Request Review</span>
          </Link>
          <Link
            href="/admin-panel/benefits"
            className={linkClass("/admin-panel/benefits")}
          >
            <Package className="h-5 w-5 shrink-0" />
            <span>Benefits</span>
          </Link>
        </nav>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200" />

        <Link href="/test" className={linkClass("/test")}>
          <FileText className="h-5 w-5 shrink-0" />
          <span>Test Data</span>
        </Link>
      </div>
    </aside>
  );
}
