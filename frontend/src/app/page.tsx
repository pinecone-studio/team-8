"use client";

import { useCurrentEmployee } from "@/lib/current-employee-provider";
import Sidebar from "./employee-panel/_components/SideBar";
import PageLoading from "./_components/PageLoading";

export default function Home() {
  const { employee, error, loading } = useCurrentEmployee();
  const displayName = employee?.name ?? "there";
  const subtitle = error
    ? "We couldn't load your employee profile."
    : loading
      ? "Loading your employee profile..."
      : "Here's an overview of your benefits";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl p-8">
          {loading ? (
            <PageLoading message="Loading your profile..." />
          ) : (
            <>
              <h1 className="text-xl font-semibold text-foreground">
                Good to see you, {displayName}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
