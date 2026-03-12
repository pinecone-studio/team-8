import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search benefits, requests..."
          className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button className="ml-4 rounded-full p-2 hover:bg-gray-100">
        <Bell className="h-5 w-5 text-gray-600" />
      </button>
    </header>
  );
}
