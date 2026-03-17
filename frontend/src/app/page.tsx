"use client";

import { useCurrentEmployee } from "@/lib/current-employee-provider";
import Sidebar from "./employee-panel/_components/SideBar";
import { Gift } from "lucide-react";

export default function Home() {
  const { employee, error, loading } = useCurrentEmployee();
  const displayName = employee?.name ?? "there";
  const subtitle = error
    ? "We couldn't load your employee profile."
    : "Here's an overview of your benefits";

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 shadow-lg">
            <Gift className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-sm font-semibold text-gray-800">Loading your account</p>
            <p className="text-xs text-gray-400">Just a moment…</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-gray-300 animate-bounce" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl p-8">
          <h1 className="text-xl font-semibold text-foreground">
            Good to see you, {displayName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </main>
      </div>
    </div>
  );
}
