"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FileText,
  Settings,
  LogOut,
  User,
  ClipboardList,
  ScrollText,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "My Benefits", href: "/dashboard", icon: FileText },
  { label: "Requests", href: "/requests", icon: ClipboardList },
  { label: "Contracts", href: "/dashboard", icon: ScrollText },
  { label: "Settings", href: "/dashboard", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[255px] flex-col justify-between border-r border-gray-200 bg-white">
      <div>
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <User className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Username</h2>
            <p className="text-sm text-gray-500">Senior Engineer</p>
          </div>
        </div>

        <nav className="px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`mb-1 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                  active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-200 p-3">
        <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">
          <LogOut className="h-5 w-5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
