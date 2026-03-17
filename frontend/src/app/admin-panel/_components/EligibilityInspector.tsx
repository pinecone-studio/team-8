"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2, ChevronDown, Search, X, XCircle } from "lucide-react";
import PageLoading from "@/app/_components/PageLoading";
import {
  useGetEmployeesQuery,
  useGetDepartmentsQuery,
  useGetEmployeeBenefitsQuery,
  useOverrideEligibilityMutation,
  GetEmployeeBenefitsDocument,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { useUser } from "@clerk/nextjs";
import { isHrAdmin } from "@/app/admin-panel/_lib/access";

// ── Status badge ─────────────────────────────────────────────────────────────

function EligibilityBadge({ passed, label }: { passed: boolean; label: string }) {
  if (passed) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
        <CheckCircle2 className="h-4 w-4" />
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600">
      <XCircle className="h-4 w-4" />
      {label}
    </span>
  );
}

// ── Employee picker ───────────────────────────────────────────────────────────

type EmployeeOption = {
  id: string;
  name: string;
  nameEng?: string | null;
  email?: string | null;
  department?: string | null;
  role?: string | null;
  employmentStatus?: string | null;
};

function EmployeePicker({
  selectedEmployee,
  onSelect,
  departments,
}: {
  selectedEmployee: EmployeeOption | null;
  onSelect: (emp: EmployeeOption | null) => void;
  departments: string[];
}) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce text search 300 ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const minChars = 2;
  const hasSearch = debouncedSearch.length >= minChars;
  const hasDept = !!deptFilter;
  const shouldQuery = hasSearch || hasDept;

  const { data, loading } = useGetEmployeesQuery({
    variables: {
      search: hasSearch ? debouncedSearch : undefined,
      department: hasDept ? deptFilter : undefined,
      limit: 30,
    },
    skip: !shouldQuery,
    fetchPolicy: "cache-and-network",
  });

  const results = data?.getEmployees ?? [];

  // Group results by department for structured display
  const grouped = results.reduce<Record<string, EmployeeOption[]>>((acc, emp) => {
    const key = emp.department ?? "Other";
    (acc[key] ??= []).push(emp);
    return acc;
  }, {});
  const groupKeys = Object.keys(grouped).sort();

  function formatStatus(s: string | null | undefined) {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
  }

  const handleSelect = (emp: EmployeeOption) => {
    onSelect(emp);
    setSearchInput("");
    setDebouncedSearch("");
    setOpen(false);
  };

  const handleClear = () => {
    onSelect(null);
    setSearchInput("");
    setDebouncedSearch("");
    setDeptFilter("");
    setOpen(false);
  };

  // ── Selected state: show chip ─────────────────────────────────────────────
  if (selectedEmployee) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
            {selectedEmployee.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-blue-900">{selectedEmployee.name}</p>
            <p className="text-xs text-blue-600">
              {selectedEmployee.email ?? ""}
              {selectedEmployee.department ? ` · ${selectedEmployee.department}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="rounded p-0.5 text-blue-400 hover:bg-blue-100 hover:text-blue-600"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── Search state ──────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl" ref={containerRef}>
      <div className="flex gap-2">
        {/* Name / email search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search by name or email…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-300"
          />
        </div>

        {/* Department filter */}
        <div className="relative">
          <select
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setOpen(true);
            }}
            className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-300"
          >
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Results dropdown */}
      {open && (
        <div className="mt-1 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {!shouldQuery ? (
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              Type a name or pick a department to search employees…
            </div>
          ) : loading ? (
            <div className="px-4 py-6">
              <PageLoading inline message="Searching…" />
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              No employees match your search.
            </div>
          ) : (
            groupKeys.map((dept) => (
              <div key={dept}>
                {/* Department group header */}
                <div className="sticky top-0 border-b border-slate-100 bg-slate-50 px-4 py-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {dept}
                  </span>
                </div>
                {grouped[dept].map((emp) => (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => handleSelect(emp)}
                    className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-blue-50 transition"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">{emp.name}</p>
                      <p className="text-xs text-slate-500 truncate">{emp.email ?? ""}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      {emp.role && (
                        <span className="inline-flex rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          {emp.role}
                        </span>
                      )}
                      {emp.employmentStatus && emp.employmentStatus !== "active" && (
                        <span className="inline-flex rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium text-orange-600">
                          {formatStatus(emp.employmentStatus)}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── Override form state ───────────────────────────────────────────────────────

interface OverrideFormState {
  benefitId: string;
  benefitName: string;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function EligibilityInspector() {
  const { employee: me } = useCurrentEmployee();
  const { user, isLoaded: isUserLoaded } = useUser();
  const isHr = isHrAdmin(me);
  const canOverride = isHr;

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeOption | null>(null);
  const selectedEmployeeId = selectedEmployee?.id ?? "";

  const [overrideTarget, setOverrideTarget] = useState<OverrideFormState | null>(null);
  const [overrideStatus, setOverrideStatus] = useState("eligible");
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideExpiresAt, setOverrideExpiresAt] = useState("");
  const [overrideError, setOverrideError] = useState<string | null>(null);
  const [overrideSuccess, setOverrideSuccess] = useState(false);

  const { data: departmentsData } = useGetDepartmentsQuery({ skip: !isHr });

  const { data: eligibilityData, loading: eligibilityLoading } = useGetEmployeeBenefitsQuery({
    variables: { employeeId: selectedEmployeeId },
    skip: !selectedEmployeeId || !isHr,
  });

  const [overrideEligibility, { loading: overriding }] = useOverrideEligibilityMutation({
    refetchQueries: [
      { query: GetEmployeeBenefitsDocument, variables: { employeeId: selectedEmployeeId } },
    ],
    onCompleted: () => {
      setOverrideTarget(null);
      setOverrideReason("");
      setOverrideExpiresAt("");
      setOverrideError(null);
      setOverrideSuccess(true);
      setTimeout(() => setOverrideSuccess(false), 4000);
    },
    onError: (err) => setOverrideError(err.message),
  });

  const departments = departmentsData?.getDepartments ?? [];
  const eligibilities = eligibilityData?.getEmployeeBenefits ?? [];
  const STATUS_ORDER: Record<string, number> = {
    ACTIVE: 0,
    PENDING: 1,
    ELIGIBLE: 2,
    NOT_ELIGIBLE: 3,
  };
  const sortedEligibilities = [...eligibilities].sort((a, b) => {
    const aRank = STATUS_ORDER[a.status] ?? 99;
    const bRank = STATUS_ORDER[b.status] ?? 99;
    if (aRank !== bRank) return aRank - bRank;
    return a.benefit.name.localeCompare(b.benefit.name);
  });
  const clerkEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null;

  if (!isHr) {
    return (
      <main className="flex-1 px-8 py-9">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-8 text-center max-w-md">
          <p className="text-sm font-semibold text-amber-800">HR access required</p>
          <p className="mt-1 text-xs text-amber-700">
            The Eligibility Inspector is restricted to HR administrators.
          </p>
        </div>
      </main>
    );
  }

  const handleOverrideSubmit = () => {
    if (!overrideTarget || !selectedEmployeeId) return;
    if (!overrideReason.trim()) {
      setOverrideError("Reason is required.");
      return;
    }
    setOverrideError(null);
    overrideEligibility({
      variables: {
        input: {
          employeeId: selectedEmployeeId,
          benefitId: overrideTarget.benefitId,
          overrideStatus,
          reason: overrideReason,
          expiresAt: overrideExpiresAt || null,
        },
      },
    });
  };

  return (
    <main className="flex-1 px-8 py-9">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Employee Eligibility Inspector</h1>
          <p className="mt-1 text-sm text-gray-400">
            Search by name, email, or department to review an employee&apos;s benefit eligibility.
          </p>
        </div>

        {/* Employee picker */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">Find Employee</label>
          <EmployeePicker
            selectedEmployee={selectedEmployee}
            onSelect={setSelectedEmployee}
            departments={departments}
          />
        </div>

        {overrideSuccess && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
            Eligibility override applied successfully.
          </div>
        )}

        {/* Employee profile */}
        {selectedEmployee && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-6">
            <h2 className="text-sm font-semibold text-gray-900">Employee Profile</h2>
            {/*
              Clerk only exposes the signed-in user on the client. If the selected
              employee matches the signed-in user, show their Clerk avatar.
            */}
            {(() => {
              const matchesClerkUser =
                isUserLoaded &&
                !!clerkEmail &&
                selectedEmployee.email?.toLowerCase() === clerkEmail &&
                !!user?.imageUrl;
              const nameValue = (
                <div className="flex items-center gap-2">
                  {matchesClerkUser ? (
                    <img
                      src={user.imageUrl}
                      alt={selectedEmployee.name}
                      className="h-7 w-7 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                      {selectedEmployee.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{selectedEmployee.name}</span>
                </div>
              );
              return (
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Name",       value: nameValue },
                { label: "Role",       value: selectedEmployee.role ?? "—" },
                { label: "Department", value: selectedEmployee.department ?? "—" },
                { label: "Status",     value: selectedEmployee.employmentStatus ?? "—" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <div className="mt-0.5 text-sm font-medium text-slate-900">{item.value}</div>
                </div>
              ))}
            </div>
              );
            })()}
          </div>
        )}

        {/* Benefits table */}
        {selectedEmployeeId && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Benefits Eligibility</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Benefit</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Override</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Blocking Rule</th>
                    {canOverride && <th className="px-5 py-3" />}
                  </tr>
                </thead>
                <tbody>
                  {eligibilityLoading ? (
                    <tr>
                      <td colSpan={canOverride ? 5 : 4} className="px-5 py-8">
                        <PageLoading inline message="Loading eligibility…" />
                      </td>
                    </tr>
                  ) : eligibilities.length === 0 ? (
                    <tr>
                      <td colSpan={canOverride ? 5 : 4} className="px-5 py-6 text-sm text-slate-400">
                        No benefits found for this employee.
                      </td>
                    </tr>
                  ) : (
                    sortedEligibilities.map((row) => {
                      const eligible =
                        row.status === "ELIGIBLE" || row.status === "ACTIVE" || row.status === "PENDING";
                      const statusLabel =
                        row.status === "ACTIVE"
                          ? "Active"
                          : row.status === "PENDING"
                            ? "Pending"
                            : row.status === "ELIGIBLE"
                              ? "Eligible"
                              : "Not Eligible";
                      const hasOverride = !!row.overrideStatus;
                      return (
                        <tr key={row.benefitId} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50">
                          <td className="px-5 py-4 text-sm font-medium text-slate-900">
                            {row.benefit.name}
                          </td>
                          <td className="px-5 py-4">
                            <EligibilityBadge passed={eligible} label={statusLabel} />
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-500">
                            {hasOverride ? (
                              <span className="inline-flex flex-col gap-0.5">
                                <span className="inline-flex rounded bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                                  {row.overrideStatus}
                                </span>
                                {row.overrideExpiresAt && (
                                  <span className="text-xs text-slate-400">
                                    expires {row.overrideExpiresAt.split("T")[0]}
                                  </span>
                                )}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-500">
                            {row.failedRule?.errorMessage ?? "—"}
                          </td>
                          {canOverride && (
                            <td className="px-5 py-4">
                              <button
                                type="button"
                                onClick={() =>
                                  setOverrideTarget({
                                    benefitId: row.benefitId,
                                    benefitName: row.benefit.name,
                                  })
                                }
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                              >
                                Override
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!selectedEmployeeId && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
            <Search className="mx-auto mb-3 h-6 w-6 text-slate-300" />
            Search for an employee above to inspect their benefit eligibility.
          </div>
        )}

        {/* Override Modal */}
        {overrideTarget && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            role="dialog"
            aria-modal="true"
            onClick={() => setOverrideTarget(null)}
          >
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-base font-semibold text-slate-900">
                Override Eligibility — {overrideTarget.benefitName}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                This override will take effect immediately and be recorded in the audit log.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Override Status</label>
                  <select
                    value={overrideStatus}
                    onChange={(e) => setOverrideStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
                  >
                    <option value="eligible">Eligible</option>
                    <option value="active">Active</option>
                    <option value="locked">Locked</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    rows={3}
                    placeholder="Explain why this override is being applied…"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Expires At (optional)
                  </label>
                  <input
                    type="date"
                    value={overrideExpiresAt}
                    onChange={(e) => setOverrideExpiresAt(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
                  />
                </div>

                {overrideError && <p className="text-sm text-red-600">{overrideError}</p>}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOverrideTarget(null);
                    setOverrideError(null);
                    setOverrideReason("");
                    setOverrideExpiresAt("");
                  }}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleOverrideSubmit}
                  disabled={overriding}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {overriding ? "Applying…" : "Apply Override"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
