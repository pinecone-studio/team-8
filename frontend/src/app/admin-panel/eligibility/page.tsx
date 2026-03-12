"use client";

import { useState } from "react";
import Header from "@/app/_features/Header";
import AppSidebar from "@/app/_components/AppSidebar";
import {
  useGetEmployeesQuery,
  useGetEmployeeBenefitsQuery,
} from "@/graphql/generated/graphql";
import { ChevronDown, Info } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  wellness: "Wellness",
  equipment: "Equipment",
  financial: "Financial",
  career: "Career",
  flexibility: "Flexibility",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800",
  ELIGIBLE: "bg-sky-100 text-sky-800",
  LOCKED: "bg-amber-100 text-amber-800",
  PENDING: "bg-violet-100 text-violet-800",
};

const RULE_TYPE_LABELS: Record<string, string> = {
  employment_status: "Employment Status",
  okr_submitted: "OKR Gate",
  attendance: "Attendance Gate",
  tenure_days: "Tenure",
  responsibility_level: "Responsibility Level",
  role: "Role",
};

function formatCondition(ruleType: string, reason: string): string {
  const m = reason.match(/^Passed: (\w+) (\w+) (.+)$/);
  if (m) {
    const [, type, op] = m;
    const opMap: Record<string, string> = {
      eq: "==",
      neq: "!=",
      gte: ">=",
      gt: ">",
      lte: "<=",
      lt: "<",
    };
    const fieldMap: Record<string, string> = {
      employment_status: "status",
      okr_submitted: "okr_submitted",
      attendance: "late_arrival_count",
      tenure_days: "days_since_hire",
      responsibility_level: "responsibility_level",
      role: "role",
    };
    const field = fieldMap[type] ?? type;
    const sym = opMap[op] ?? op;
    return `${field} ${sym} ${m[3]}`;
  }
  return reason;
}

export default function EligibilityPage() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedBenefit, setExpandedBenefit] = useState<string | null>(null);

  const { data: employeesData } = useGetEmployeesQuery();
  const { data: benefitsData, loading } = useGetEmployeeBenefitsQuery({
    variables: { employeeId: selectedEmployeeId },
    skip: !selectedEmployeeId,
  });

  const employees = employeesData?.getEmployees ?? [];
  const eligibilities = benefitsData?.getEmployeeBenefits ?? [];

  const byCategory = eligibilities.reduce<Record<string, typeof eligibilities>>(
    (acc, item) => {
      const cat = item.benefit.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {},
  );
  const categories = Object.keys(byCategory).sort();

  return (
    <div className="flex min-h-screen bg-[#f8f8f9]">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <main className="p-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Eligibility Inspector
          </h1>
          <p className="mt-2 text-gray-500">
            View any employee&apos;s full benefit eligibility breakdown with
            rule evaluation.
          </p>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select employee
            </label>
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex min-w-[280px] items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left text-sm shadow-sm hover:bg-gray-50"
              >
                <span>
                  {selectedEmployeeId
                    ? (employees.find((e) => e.id === selectedEmployeeId)
                        ?.name ?? selectedEmployeeId)
                    : "Select employee"}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 top-full z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                  {employees.map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => {
                        setSelectedEmployeeId(emp.id);
                        setDropdownOpen(false);
                      }}
                      className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 ${
                        selectedEmployeeId === emp.id
                          ? "bg-indigo-50 text-indigo-900"
                          : ""
                      }`}
                    >
                      {emp.name}
                      {emp.nameEng && (
                        <span className="text-gray-500"> ({emp.nameEng})</span>
                      )}
                      <span className="ml-2 text-xs text-gray-400">
                        {emp.role}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {!selectedEmployeeId && (
            <p className="mt-8 text-gray-500">
              Select an employee to view their eligibility.
            </p>
          )}

          {selectedEmployeeId && loading && (
            <p className="mt-8 text-gray-500">Loading…</p>
          )}

          {selectedEmployeeId && !loading && eligibilities.length > 0 && (
            <div className="mt-8 space-y-6">
              {categories.map((cat) => (
                <section
                  key={cat}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <h2 className="mb-4 text-lg font-semibold text-gray-800">
                    {CATEGORY_LABELS[cat] ?? cat}
                  </h2>
                  <div className="space-y-3">
                    {byCategory[cat].map((item) => {
                      const isExpanded = expandedBenefit === item.benefitId;
                      return (
                        <div
                          key={item.benefitId}
                          className="rounded-lg border border-gray-100"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedBenefit(
                                isExpanded ? null : item.benefitId,
                              )
                            }
                            className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {item.benefit.name}
                              </span>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  STATUS_COLORS[item.status] ??
                                  "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <Info className="h-4 w-4 text-gray-400" />
                          </button>
                          {isExpanded && (
                            <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3">
                              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                                Conditions — eligible or not
                              </p>
                              <div className="overflow-hidden rounded-lg border border-gray-200">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      <th className="px-3 py-2 text-left font-medium text-gray-700">
                                        Rule Type
                                      </th>
                                      <th className="px-3 py-2 text-left font-medium text-gray-700">
                                        Condition
                                      </th>
                                      <th className="px-3 py-2 text-left font-medium text-gray-700">
                                        Status
                                      </th>
                                      <th className="px-3 py-2 text-left font-medium text-gray-700">
                                        Blocking Message
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.ruleEvaluation.map((r, i) => (
                                      <tr
                                        key={i}
                                        className={`border-t border-gray-100 ${
                                          r.passed
                                            ? "bg-emerald-50/50"
                                            : "bg-amber-50/50"
                                        }`}
                                      >
                                        <td className="px-3 py-2 font-medium text-gray-900">
                                          {RULE_TYPE_LABELS[r.ruleType] ??
                                            r.ruleType}
                                        </td>
                                        <td className="px-3 py-2 text-gray-700">
                                          {formatCondition(
                                            r.ruleType,
                                            r.reason,
                                          )}
                                        </td>
                                        <td className="px-3 py-2">
                                          <span
                                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                              r.passed
                                                ? "bg-emerald-100 text-emerald-800"
                                                : "bg-amber-100 text-amber-800"
                                            }`}
                                          >
                                            {r.passed
                                              ? "Eligible"
                                              : "Not eligible"}
                                          </span>
                                        </td>
                                        <td className="px-3 py-2 text-gray-600">
                                          {!r.passed &&
                                          item.failedRule?.ruleType ===
                                            r.ruleType
                                            ? item.failedRule.errorMessage
                                            : "—"}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              {item.benefit.requiresContract && (
                                <p className="mt-2 text-xs text-gray-500">
                                  Contract: Requires{" "}
                                  {item.benefit.vendorName ?? "vendor"} contract
                                  acceptance
                                </p>
                              )}
                              {item.failedRule && (
                                <p className="mt-2 text-sm font-medium text-amber-800">
                                  Blocking: {item.failedRule.errorMessage}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}

          {selectedEmployeeId && !loading && eligibilities.length === 0 && (
            <p className="mt-8 text-gray-500">
              No benefits data for this employee.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
