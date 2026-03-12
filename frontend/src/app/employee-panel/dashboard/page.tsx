"use client";

import Topbar from "../_components/layout/Topbar";
import Sidebar from "../_components/SideBar";
import SummaryCard from "../_components/benefits/SummaryCard";
import BenefitCard from "../_components/benefits/BenefitCard";
import { benefits, dashboardStats } from "@/lib/  mock-data";
import { useCurrentEmployee } from "@/lib/current-employee-provider";

export default function DashboardPage() {
  const { employee, error, loading } = useCurrentEmployee();
  const displayName = employee?.name ?? "there";
  const subtitle = error
    ? "We couldn't load your employee profile."
    : loading
      ? "Loading your employee profile..."
      : "Here's an overview of your benefits";

  return (
    <div className="flex min-h-screen bg-[#f6f7f9]">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Good to see you, {displayName}
            </h1>
            <p className="mt-2 text-lg text-gray-500">
              {subtitle}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <SummaryCard
              label="Active Benefits"
              value={dashboardStats.active}
            />
            <SummaryCard
              label="Eligible Benefits"
              value={dashboardStats.eligible}
              valueClassName="text-blue-600"
            />
            <SummaryCard
              label="Pending Requests"
              value={dashboardStats.pending}
              valueClassName="text-orange-500"
            />
          </div>

          <section className="mt-10">
            <h2 className="text-3xl font-semibold text-gray-900">
              Benefits Overview
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3 md:grid-cols-2">
              {benefits.map((benefit) => (
                <BenefitCard key={benefit.id} benefit={benefit} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
