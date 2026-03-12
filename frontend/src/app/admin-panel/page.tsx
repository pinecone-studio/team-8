"use client";

import Link from "next/link";
import Header from "@/app/_features/Header";
import AppSidebar from "@/app/_components/AppSidebar";
import {
  useGetEmployeesQuery,
  usePendingBenefitRequestsQuery,
} from "@/graphql/generated/graphql";
import { Users, FileText, Package, ChevronRight } from "lucide-react";

export default function AdminPanel() {
  const { data: employeesData } = useGetEmployeesQuery();
  const { data: requestsData } = usePendingBenefitRequestsQuery();

  const employeeCount = employeesData?.getEmployees?.length ?? 0;
  const pendingCount = requestsData?.pendingBenefitRequests?.length ?? 0;

  return (
    <div className="flex min-h-screen bg-[#f8f8f9]">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <main className="p-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-500">
            HR control plane for benefits eligibility, requests, and
            configuration.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin-panel/eligibility"
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Eligibility Inspector
                  </h2>
                  <p className="text-sm text-gray-500">
                    View any employee&apos;s benefit eligibility breakdown
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>

            <Link
              href="/admin-panel/requests"
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Request Review
                  </h2>
                  <p className="text-sm text-gray-500">
                    {pendingCount} pending request
                    {pendingCount !== 1 ? "s" : ""} to review
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>

            <Link
              href="/admin-panel/benefits"
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                  <Package className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Benefits</h2>
                  <p className="text-sm text-gray-500">
                    Create or update benefits; upload contracts for
                    contract-based benefits
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          </div>

          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">Quick Stats</h2>
            <div className="mt-4 flex gap-8">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {employeeCount}
                </p>
                <p className="text-sm text-gray-500">Employees</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingCount}
                </p>
                <p className="text-sm text-gray-500">Pending Requests</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
