"use client";

import { useCurrentEmployee } from "@/lib/current-employee-provider";
import Sidebar from "./employee-panel/_components/SideBar";
import PineconeLoading from "./_components/PineconeLoading";

export default function Home() {
  const { employee, error, loading } = useCurrentEmployee();
  const displayName = employee?.name ?? "there";
  const subtitle = error
    ? "We couldn't load your employee profile."
    : "Here's an overview of your benefits";

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white">
        <PineconeLoading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
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
