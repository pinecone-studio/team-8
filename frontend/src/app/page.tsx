"use client";

import { useCurrentEmployee } from "@/lib/current-employee-provider";
import Header from "./_features/Header";
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
    <div className="flex min-h-screen bg-[#f8f8f9]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="p-8">
          {loading ? (
            <PageLoading message="Loading your profile..." />
          ) : (
            <>
              <h1 className="text-4xl font-semibold text-gray-900">
                Good to see you, {displayName}
              </h1>
              <p className="mt-2 text-lg text-gray-500">{subtitle}</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
