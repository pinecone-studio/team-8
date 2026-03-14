"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, XCircle } from "lucide-react";
import PageLoading from "@/app/_components/PageLoading";
import {
  useGetEmployeesQuery,
  useGetEmployeeBenefitsQuery,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isAdminEmployee } from "@/app/admin-panel/_lib/access";

function StatusBadge({ passed, label }: { passed: boolean; label: string }) {
  if (passed) {
    return (
      <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
        <CheckCircle2 className="h-4 w-4" />
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-red-600">
      <XCircle className="h-4 w-4" />
      {label}
    </span>
  );
}

export default function EligibilityInspector() {
  const { employee: me } = useCurrentEmployee();
  const isAdmin = isAdminEmployee(me);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  const { data: employeesData, loading: employeesLoading } = useGetEmployeesQuery({
    skip: !isAdmin,
  });

  const { data: eligibilityData, loading: eligibilityLoading } =
    useGetEmployeeBenefitsQuery({
      variables: { employeeId: selectedEmployeeId },
      skip: !selectedEmployeeId || !isAdmin,
    });

  const employees = employeesData?.getEmployees ?? [];
  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);
  const eligibilities = eligibilityData?.getEmployeeBenefits ?? [];

  if (!isAdmin) {
    return (
      <main className="flex-1 px-8 py-9">
        <p className="text-gray-500">Admin access required.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 px-8 py-9">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">
            Employee Eligibility Inspector
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review employee benefit eligibility in real time
          </p>
        </div>

        <div className="mb-6 max-w-md">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Select Employee
          </label>
          <div className="relative">
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              disabled={employeesLoading}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 disabled:opacity-70"
            >
              <option value="">
                {employeesLoading ? "Loading employees…" : "Select an employee"}
              </option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} – {emp.role}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {selectedEmployee && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Employee Profile
            </h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Name", value: selectedEmployee.name },
                { label: "Role", value: selectedEmployee.role },
                { label: "Department", value: selectedEmployee.department },
                {
                  label: "Responsibility Level",
                  value: `Level ${selectedEmployee.responsibilityLevel}`,
                },
                {
                  label: "Status",
                  value: selectedEmployee.employmentStatus,
                },
                {
                  label: "OKR Submitted",
                  value: selectedEmployee.okrSubmitted ? "Yes" : "No",
                },
                {
                  label: "Late Arrivals",
                  value: String(selectedEmployee.lateArrivalCount),
                },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedEmployeeId && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Benefits Eligibility
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-slate-200 bg-white text-sm font-semibold text-slate-700">
                  <tr>
                    <th className="px-5 py-4">Benefit</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Blocking Rule</th>
                  </tr>
                </thead>
                <tbody>
                  {eligibilityLoading ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-8">
                        <PageLoading inline message="Loading eligibility…" />
                      </td>
                    </tr>
                  ) : eligibilities.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-6 text-sm text-slate-500">
                        No benefits found.
                      </td>
                    </tr>
                  ) : (
                    eligibilities.map((row) => {
                      const eligible = row.status === "ELIGIBLE" || row.status === "ACTIVE" || row.status === "PENDING";
                      const statusLabel =
                        row.status === "ACTIVE"
                          ? "Active"
                          : row.status === "PENDING"
                            ? "Pending"
                            : row.status === "ELIGIBLE"
                              ? "Eligible"
                              : "Not Eligible";
                      return (
                        <tr
                          key={row.benefitId}
                          className="border-b border-slate-200 last:border-b-0"
                        >
                          <td className="px-5 py-5 text-sm font-medium text-slate-900">
                            {row.benefit.name}
                          </td>
                          <td className="px-5 py-5">
                            <StatusBadge passed={eligible} label={statusLabel} />
                          </td>
                          <td className="px-5 py-5 text-sm text-slate-500">
                            {row.failedRule?.errorMessage ?? "—"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!selectedEmployeeId && !employeesLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Select an employee above to inspect their benefit eligibility.
          </div>
        )}
      </section>
    </main>
  );
}
