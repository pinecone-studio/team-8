 "use client";

import { Search, Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Search */}
      <div className="relative w-full max-w-[520px]">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search benefits, requests..."
          className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-700 outline-none transition focus:border-gray-300"
        />
      </div>

      {/* Right side */}
      <div className="ml-6 flex items-center">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-orange-500" />
        </button>
      </div>
    </header>
  );
}
