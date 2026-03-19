"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2, ChevronDown, Clock3, Search, X } from "lucide-react";
import {
  type GetContractAcceptancesQuery,
  useGetAdminBenefitsQuery,
  useGetContractAcceptancesQuery,
  useGetContractsForBenefitQuery,
  useGetEmployeesQuery,
  useGetDepartmentsQuery,
  useGetEmployeeBenefitsQuery,
  useOverrideEligibilityMutation,
  GetEmployeeBenefitsDocument,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { getContractProxyUrl } from "@/lib/contracts";
import { isHrAdmin } from "@/app/admin-panel/_lib/access";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";

// ── Employee picker ───────────────────────────────────────────────────────────

type EmployeeOption = {
  id: string;
  avatarUrl?: string | null;
  name: string;
  nameEng?: string | null;
  email?: string | null;
  department?: string | null;
  role?: string | null;
  employmentStatus?: string | null;
};

type BenefitOption = {
  id: string;
  name: string;
};

function formatRoleLabel(role: string | null | undefined) {
  if (!role) return "—";

  const normalized = role.trim().replace(/_/g, " ");
  const words = normalized.split(/\s+/);

  return words
    .map((word) => {
      if (word.toLowerCase() === "hr") return "HR";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function formatDateLabel(value: string | null | undefined) {
  if (!value) return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value.split("T")[0] ?? value;
  }

  return parsed.toLocaleDateString("en-CA");
}

function EmployeePicker({
  selectedEmployee,
  selectedEmployeeImageUrl,
  onSelect,
  departments,
  onSelectionChange,
  selectedBenefitId,
  benefitOptions,
  benefitMenuOpen,
  onBenefitMenuToggle,
  onBenefitChange,
  benefitsFilterRef,
}: {
  selectedEmployee: EmployeeOption | null;
  selectedEmployeeImageUrl?: string | null;
  onSelect: (emp: EmployeeOption | null) => void;
  departments: string[];
  onSelectionChange?: () => void;
  selectedBenefitId: string;
  benefitOptions: BenefitOption[];
  benefitMenuOpen: boolean;
  onBenefitMenuToggle: () => void;
  onBenefitChange: (benefitId: string) => void;
  benefitsFilterRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [deptMenuOpen, setDeptMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce text search 300 ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Close filter menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDeptMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasSearch = debouncedSearch.length > 0;
  const hasDept = !!deptFilter;

  const { data, loading } = useGetEmployeesQuery({
    variables: {
      search: hasSearch ? debouncedSearch : undefined,
      department: hasDept ? deptFilter : undefined,
      benefitId: selectedBenefitId || undefined,
      limit: !hasSearch ? 100 : 30,
    },
    fetchPolicy: "cache-and-network",
  });

  const departmentOptions = Array.from(
    new Set(departments.map((department) => department.trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  const results = data?.getEmployees ?? [];
  const selectedBenefitName =
    benefitOptions.find((benefit) => benefit.id === selectedBenefitId)?.name ??
    "";

  // Group results by department for structured display
  const grouped = results.reduce<Record<string, EmployeeOption[]>>(
    (acc, emp) => {
      const key = emp.department ?? "Other";
      (acc[key] ??= []).push(emp);
      return acc;
    },
    {},
  );
  const groupKeys = Object.keys(grouped).sort();
  const resultCountLabel =
    results.length === 1
      ? "1 employee found"
      : `${results.length} employees found`;

  function formatStatus(s: string | null | undefined) {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
  }

  const handleSelect = (emp: EmployeeOption) => {
    onSelect(emp);
    onSelectionChange?.();
    setSearchInput("");
    setDebouncedSearch("");
    setDeptMenuOpen(false);
  };

  const handleClear = () => {
    onSelect(null);
    onSelectionChange?.();
    setSearchInput("");
    setDebouncedSearch("");
    setDeptFilter("");
    setDeptMenuOpen(false);
    onBenefitChange("");
  };

  // ── Search state ──────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl" ref={containerRef}>
      <div>
        {selectedEmployee && (
          <div className="mb-5 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 shadow-sm">
            <EmployeeAvatar
              name={selectedEmployee.name}
              imageUrl={selectedEmployeeImageUrl}
              className="h-11 w-11 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xl font-semibold text-slate-900">
                {selectedEmployee.name}
              </p>
              <p className="text-base text-slate-600">
                {selectedEmployee.email ?? "No email"}
                {selectedEmployee.department
                  ? ` · ${selectedEmployee.department}`
                  : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Clear selection"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {!selectedEmployee && (
          <div className="mb-4 flex flex-wrap gap-4">
            <div className="relative min-w-[320px] flex-[1.8]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search employee"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setDeptMenuOpen((prev) => !prev)}
                className="inline-flex min-w-[200px] items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                {deptFilter || "All Departments"}
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${deptMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {deptMenuOpen && (
                <div className="absolute left-0 top-full z-30 mt-1.5 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setDeptFilter("");
                      setDeptMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-slate-50 ${
                      !deptFilter
                        ? "bg-slate-50 text-slate-900"
                        : "text-slate-700"
                    }`}
                  >
                    <span className="font-medium">All Departments</span>
                    {!deptFilter && (
                      <span className="text-xs text-slate-400">Selected</span>
                    )}
                  </button>
                  <div className="max-h-72 overflow-y-auto py-1">
                    {departmentOptions.map((department) => (
                      <button
                        key={department}
                        type="button"
                        onClick={() => {
                          setDeptFilter(department);
                          setDeptMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-slate-50 ${
                          deptFilter === department
                            ? "bg-slate-50 text-slate-900"
                            : "text-slate-700"
                        }`}
                      >
                        <span className="truncate font-medium">
                          {department}
                        </span>
                        {deptFilter === department && (
                          <span className="text-xs text-slate-400">
                            Selected
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={benefitsFilterRef}>
              <button
                type="button"
                onClick={onBenefitMenuToggle}
                className="inline-flex min-w-[260px] items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <span className="truncate">
                  {selectedBenefitName || "All Benefits"}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${benefitMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {benefitMenuOpen && (
                <div className="absolute left-0 top-full z-30 mt-1.5 w-[360px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <button
                    type="button"
                    onClick={() => onBenefitChange("")}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-slate-50 ${
                      !selectedBenefitId
                        ? "bg-slate-50 text-slate-900"
                        : "text-slate-700"
                    }`}
                  >
                    <span className="font-medium">All Benefits</span>
                    {!selectedBenefitId && (
                      <span className="text-xs text-slate-400">Selected</span>
                    )}
                  </button>
                  <div className="max-h-80 overflow-y-auto py-1">
                    {benefitOptions.map((benefit) => (
                      <button
                        key={benefit.id}
                        type="button"
                        onClick={() => onBenefitChange(benefit.id)}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-slate-50 ${
                          selectedBenefitId === benefit.id
                            ? "bg-slate-50 text-slate-900"
                            : "text-slate-700"
                        }`}
                      >
                        <span className="truncate font-medium">
                          {benefit.name}
                        </span>
                        {selectedBenefitId === benefit.id && (
                          <span className="text-xs text-slate-400">
                            Selected
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {(searchInput || deptFilter || selectedBenefitId) && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500 shadow-sm transition hover:bg-slate-50"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {!selectedEmployee && (
        <div className="relative z-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="px-2 py-2 space-y-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border-b border-slate-100 px-2 py-2.5 last:border-b-0"
                >
                  <div className="h-7 w-7 rounded-full bg-slate-200/80 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-1/2 rounded-full bg-slate-200/80 animate-pulse" />
                    <div className="h-2.5 w-1/3 rounded-full bg-slate-200/80 animate-pulse" />
                  </div>
                  <div className="shrink-0">
                    <div className="h-4 w-14 rounded bg-slate-200/80 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="px-6 py-7 text-center">
              <p className="text-base font-semibold text-slate-800">
                No matching employee found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different name or clear the active department filter and
                search again.
              </p>
            </div>
          ) : (
            <div className="bg-white">
              <div className="relative z-[1] border-b border-slate-200 bg-white px-5 py-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {hasDept && !hasSearch
                        ? deptFilter
                        : !hasSearch && !hasDept
                            ? "Employee Directory"
                            : "Matching Employees"}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      {hasDept && !hasSearch
                        ? `Employees in the ${deptFilter} department`
                        : !hasSearch && !hasDept
                            ? "Browse and select an employee to inspect eligibility"
                            : "Employees that match your current filters"}
                    </p>
                  </div>
                  {results.length > 0 && (
                    <p className="text-xs text-slate-400">{resultCountLabel}</p>
                  )}
                </div>
              </div>

              <div className="relative z-0 overflow-x-auto border-t border-slate-200 bg-white">
                <table className="min-w-full text-left text-sm table-fixed">
                  <thead className="relative z-[1] border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Name</th>
                      <th className="px-5 py-3">Position</th>
                      <th className="px-5 py-3">Department</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupKeys.flatMap((dept) =>
                      grouped[dept].map((emp) => (
                        <tr
                          key={emp.id}
                          className="cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50"
                          onClick={() => handleSelect(emp)}
                        >
                          <td className="px-5 py-3 text-slate-700">
                            <div className="flex items-center gap-3">
                              <EmployeeAvatar
                                name={emp.name}
                                imageUrl={emp.avatarUrl}
                                className="h-8 w-8 shrink-0"
                              />
                              <div className="flex min-w-0 flex-col">
                                <span className="truncate font-medium text-slate-900">
                                  {emp.name}
                                </span>
                                <span className="truncate text-xs text-slate-400">
                                  {emp.email ?? "No email"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-slate-700">
                            {formatRoleLabel(emp.role)}
                          </td>
                          <td className="px-5 py-3 text-slate-700">
                            {emp.department ?? "—"}
                          </td>
                          <td className="px-5 py-3">
                            {emp.employmentStatus &&
                            emp.employmentStatus !== "active" ? (
                              <span className="inline-flex rounded px-2 py-0.5 text-xs font-medium text-orange-700 bg-orange-50">
                                {formatStatus(emp.employmentStatus)}
                              </span>
                            ) : (
                              <span className="inline-flex rounded px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700">
                                Active
                              </span>
                            )}
                          </td>
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
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

type ContractAcceptanceItem =
  GetContractAcceptancesQuery["contractAcceptances"][number];

function getMatchedContract(
  contractsData: ReturnType<typeof useGetContractsForBenefitQuery>["data"],
  contractAcceptance: ContractAcceptanceItem | undefined,
) {
  return (
    contractsData?.contracts.find(
      (contract) => contract.id === contractAcceptance?.contractId,
    ) ??
    contractsData?.contracts.find(
      (contract) => contract.version === contractAcceptance?.contractVersion,
    ) ??
    contractsData?.contracts.find((contract) => contract.isActive) ??
    null
  );
}

function SignedContractDetails({
  benefitId,
  contractAcceptance,
}: {
  benefitId: string;
  contractAcceptance: ContractAcceptanceItem | undefined;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { data: contractsData, loading: contractsLoading } =
    useGetContractsForBenefitQuery({
      variables: { benefitId },
      skip: false,
    });

  const matchingContract = getMatchedContract(
    contractsData,
    contractAcceptance,
  );
  const contractUrl = getContractProxyUrl(matchingContract?.viewUrl);

  if (!contractAcceptance) {
    return (
      <span className="inline-flex flex-col gap-1">
        <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
          Contract not signed yet
        </span>
      </span>
    );
  }

  return (
    <>
      <span className="inline-flex flex-col gap-1">
        {contractsLoading ? (
          <span className="text-xs text-slate-400">Loading contract...</span>
        ) : contractUrl ? (
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            Review contract
          </button>
        ) : (
          <span className="text-xs text-amber-600">
            Contract preview unavailable
          </span>
        )}
      </span>

      {previewOpen && contractUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-6"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="relative h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Signed Benefit Contract
                </p>
                <p className="text-xs text-slate-400">
                  {contractAcceptance.contractVersion
                    ? `Version ${contractAcceptance.contractVersion}`
                    : "Contract document"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={contractUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-900"
                >
                  Open full document
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <iframe
              src={contractUrl}
              className="h-[calc(85vh-57px)] w-full bg-slate-50"
              title={`Signed contract for benefit ${benefitId}`}
            />
          </div>
        </div>
      )}
    </>
  );
}

function ContractExpiryDetails({
  benefitId,
  contractAcceptance,
  failedRuleMessage,
  requiresContract,
}: {
  benefitId: string;
  contractAcceptance: ContractAcceptanceItem | undefined;
  failedRuleMessage: string | null | undefined;
  requiresContract: boolean;
}) {
  const { data: contractsData } = useGetContractsForBenefitQuery({
    variables: { benefitId },
    skip: !requiresContract,
  });
  const matchingContract = getMatchedContract(
    contractsData,
    contractAcceptance,
  );
  const expiryLabel = formatDateLabel(matchingContract?.expiryDate);

  if (!failedRuleMessage && !expiryLabel) {
    return <span>—</span>;
  }

  return (
    <div className="flex flex-col gap-1">
      {failedRuleMessage && <span>{failedRuleMessage}</span>}
      {contractAcceptance?.acceptedAt && (
        <span className="text-xs font-medium text-slate-500">
          Signed {formatDateLabel(contractAcceptance.acceptedAt)}
        </span>
      )}
      {expiryLabel && (
        <span className="text-xs font-medium text-slate-500">
          Contract ends {expiryLabel}
        </span>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function EligibilityInspector() {
  const { employee: me, loading: meLoading } = useCurrentEmployee();
  const isHr = isHrAdmin(me);
  const canOverride = isHr;

  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeOption | null>(null);
  const selectedEmployeeId = selectedEmployee?.id ?? "";

  const [overrideTarget, setOverrideTarget] =
    useState<OverrideFormState | null>(null);
  const [overrideStatus, setOverrideStatus] = useState("eligible");
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideExpiresAt, setOverrideExpiresAt] = useState("");
  const [overrideError, setOverrideError] = useState<string | null>(null);
  const [overrideSuccess, setOverrideSuccess] = useState(false);
  const [employeeBenefitIdFilter, setEmployeeBenefitIdFilter] = useState("");
  const [benefitSearch, setBenefitSearch] = useState("");
  const [benefitMenuOpen, setBenefitMenuOpen] = useState(false);
  const benefitsFilterRef = useRef<HTMLDivElement>(null);

  const { data: departmentsData } = useGetDepartmentsQuery({ skip: !isHr });
  const { data: adminBenefitsData } = useGetAdminBenefitsQuery({ skip: !isHr });

  const {
    data: eligibilityData,
    loading: eligibilityLoading,
    previousData: prevEligibilityData,
  } = useGetEmployeeBenefitsQuery({
    variables: { employeeId: selectedEmployeeId },
    skip: !selectedEmployeeId || !isHr,
  });
  const { data: contractAcceptancesData } = useGetContractAcceptancesQuery({
    variables: { employeeId: selectedEmployeeId },
    skip: !selectedEmployeeId || !isHr,
  });
  const eligibilitySkeletonCount =
    eligibilityData?.getEmployeeBenefits?.length ??
    prevEligibilityData?.getEmployeeBenefits?.length ??
    6;

  const [overrideEligibility, { loading: overriding }] =
    useOverrideEligibilityMutation({
      refetchQueries: [
        {
          query: GetEmployeeBenefitsDocument,
          variables: { employeeId: selectedEmployeeId },
        },
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
  const filteredEligibilities = benefitSearch
    ? sortedEligibilities.filter((row) =>
        row.benefit.name.toLowerCase().includes(benefitSearch.toLowerCase()),
      )
    : sortedEligibilities;
  const selectedEmployeeImageUrl = selectedEmployee?.avatarUrl ?? null;
  const benefitOptions: BenefitOption[] = (adminBenefitsData?.adminBenefits ?? [])
    .map((benefit) => ({
      id: benefit.id,
      name: benefit.name,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
  const latestContractAcceptanceByBenefit = (
    contractAcceptancesData?.contractAcceptances ?? []
  ).reduce<Record<string, ContractAcceptanceItem>>((acc, acceptance) => {
    const existing = acc[acceptance.benefitId];
    const existingTime = existing ? new Date(existing.acceptedAt).getTime() : 0;
    const nextTime = new Date(acceptance.acceptedAt).getTime();

    if (!existing || nextTime > existingTime) {
      acc[acceptance.benefitId] = acceptance;
    }

    return acc;
  }, {});

  const getEligibilityStatusDisplay = (status: string) => {
    if (status === "ACTIVE") {
      return {
        label: "Active",
        className: "text-emerald-600",
        icon: <CheckCircle2 className="h-5 w-5" />,
      };
    }

    if (status === "PENDING") {
      return {
        label: "Pending",
        className: "text-amber-500",
        icon: <Clock3 className="h-5 w-5" />,
      };
    }

    if (status === "ELIGIBLE") {
      return {
        label: "Eligible",
        className: "text-blue-600",
        icon: <CheckCircle2 className="h-5 w-5" />,
      };
    }

    return {
      label: "Not Eligible",
      className: "text-slate-500",
      icon: <X className="h-5 w-5" />,
    };
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        benefitsFilterRef.current &&
        !benefitsFilterRef.current.contains(event.target as Node)
      ) {
        setBenefitMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ── 1. Loading skeleton (no real text, no access banner) ──────────────────
  if (meLoading) {
    return (
      <main className="flex-1 px-8 py-9">
        <section className="mx-auto max-w-7xl">
          {/* Heading skeleton */}
          <div className="mb-8">
            <div className="h-7 w-64 rounded-full bg-white/30 animate-pulse" />
            <div className="mt-2 h-3.5 w-80 rounded-full bg-white/20 animate-pulse" />
          </div>

          {/* Search / filter row skeleton */}
          <div className="mb-6">
            <div className="mb-2 h-3.5 w-24 rounded-full bg-slate-200/80 animate-pulse" />
            <div className="flex max-w-2xl gap-2">
              <div className="h-10 flex-1 rounded-xl bg-slate-200/80 animate-pulse" />
              <div className="h-10 w-36 rounded-xl bg-slate-200/80 animate-pulse" />
            </div>
          </div>

          {/* Empty-state panel skeleton */}
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 flex flex-col items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-slate-200/80 animate-pulse" />
            <div className="h-3.5 w-64 rounded-full bg-slate-200/80 animate-pulse" />
          </div>
        </section>
      </main>
    );
  }

  // ── 2. Access denied (only shown after role is known) ──────────────────────
  if (!isHr) {
    return (
      <main className="flex-1 px-8 py-9">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-8 text-center max-w-md">
          <p className="text-sm font-semibold text-amber-800">
            HR access required
          </p>
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Employee Eligibility Inspector
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Review an employee&apos;s benefit eligibility from a clean search,
            department filter, and benefit search workflow.
          </p>
        </div>

        {/* Employee picker */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-semibold text-slate-700">
            Find employee
          </label>
          <EmployeePicker
            selectedEmployee={selectedEmployee}
            selectedEmployeeImageUrl={selectedEmployeeImageUrl}
            onSelect={setSelectedEmployee}
            departments={departments}
            selectedBenefitId={employeeBenefitIdFilter}
            benefitOptions={benefitOptions}
            benefitMenuOpen={benefitMenuOpen}
            onBenefitMenuToggle={() => setBenefitMenuOpen((prev) => !prev)}
            onBenefitChange={(benefitId) => {
              setEmployeeBenefitIdFilter(benefitId);
              setBenefitMenuOpen(false);
            }}
            benefitsFilterRef={benefitsFilterRef}
            onSelectionChange={() => {
              setBenefitSearch("");
            }}
          />
        </div>

        {overrideSuccess && (
          <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
            Eligibility override applied successfully.
          </div>
        )}

        {/* Employee profile */}
        {selectedEmployee && (
          <div className="mb-5 rounded-[28px] border border-slate-200 bg-white px-8 py-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Employee Profile
            </h2>
            {(() => {
              const nameValue = (
                <div className="flex items-center gap-2">
                  <EmployeeAvatar
                    name={selectedEmployee.name}
                    imageUrl={selectedEmployee.avatarUrl}
                    className="h-7 w-7 shrink-0"
                  />
                  <span>{selectedEmployee.name}</span>
                </div>
              );
              return (
                <div className="mt-5 grid gap-x-8 gap-y-5 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: "Name", value: nameValue },
                    { label: "Role", value: selectedEmployee.role ?? "—" },
                    {
                      label: "Department",
                      value: selectedEmployee.department ?? "—",
                    },
                    {
                      label: "Status",
                      value: selectedEmployee.employmentStatus ?? "—",
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-sm text-slate-400">{item.label}</p>
                      <div className="mt-1 text-base font-semibold text-slate-900">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* Benefits Eligibility */}
        {selectedEmployeeId && (
          <div
            key={selectedEmployeeId}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-in fade-in duration-300"
          >
            <div className="border-b border-slate-200/70 px-5 py-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Benefits Eligibility
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Search within the selected employee&apos;s available
                    benefits.
                  </p>
                </div>
                <div className="relative w-full md:max-w-sm">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={benefitSearch}
                    onChange={(event) => setBenefitSearch(event.target.value)}
                    placeholder="Search benefit"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                  />
                  {benefitSearch && (
                    <button
                      type="button"
                      onClick={() => setBenefitSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Clear benefit search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {eligibilityLoading ? (
                <div className="px-5 py-4">
                  {Array.from({ length: eligibilitySkeletonCount }).map(
                    (_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 border-b border-slate-100 py-4 last:border-b-0"
                      >
                        <div className="h-4 w-52 animate-pulse rounded-full bg-slate-200/80" />
                        <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200/80" />
                        <div className="h-4 w-16 animate-pulse rounded-full bg-slate-200/80" />
                        <div className="h-4 flex-1 animate-pulse rounded-full bg-slate-200/80" />
                        {canOverride && (
                          <div className="h-9 w-20 animate-pulse rounded-xl bg-slate-200/80" />
                        )}
                      </div>
                    ),
                  )}
                </div>
              ) : filteredEligibilities.length === 0 ? (
                <div className="px-5 py-6 text-sm text-slate-400">
                  No benefits match the current selection.
                </div>
              ) : (
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Benefit</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Contract Status</th>
                      <th className="px-5 py-4">Contract Expiry</th>
                      {canOverride && (
                        <th className="px-5 py-4 text-right">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEligibilities.map((row) => {
                      const statusDisplay = getEligibilityStatusDisplay(
                        row.status,
                      );
                      const hasOverride = !!row.overrideStatus;
                      const contractAcceptance =
                        latestContractAcceptanceByBenefit[row.benefitId];
                      return (
                        <tr
                          key={row.benefitId}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <td className="px-5 py-4 text-[15px] font-medium text-slate-900">
                            {row.benefit.name}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-2 text-sm font-semibold ${statusDisplay.className}`}
                            >
                              {statusDisplay.icon}
                              {statusDisplay.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-slate-500">
                            <div className="flex flex-col gap-2">
                              {hasOverride ? (
                                <span className="inline-flex flex-col gap-1">
                                  <span className="inline-flex w-fit rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-orange-700">
                                    {row.overrideStatus}
                                  </span>
                                  {row.overrideExpiresAt && (
                                    <span className="text-xs text-slate-400">
                                      Expires{" "}
                                      {formatDateLabel(row.overrideExpiresAt)}
                                    </span>
                                  )}
                                </span>
                              ) : null}

                              {row.benefit.requiresContract && (
                                <SignedContractDetails
                                  benefitId={row.benefitId}
                                  contractAcceptance={contractAcceptance}
                                />
                              )}
                            </div>
                          </td>
                          <td className="max-w-md px-5 py-4 text-slate-500">
                            <ContractExpiryDetails
                              benefitId={row.benefitId}
                              contractAcceptance={contractAcceptance}
                              failedRuleMessage={row.failedRule?.errorMessage}
                              requiresContract={row.benefit.requiresContract}
                            />
                          </td>
                          {canOverride && (
                            <td className="px-5 py-4 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setOverrideTarget({
                                    benefitId: row.benefitId,
                                    benefitName: row.benefit.name,
                                  })
                                }
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                              >
                                Override
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
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
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-semibold text-slate-900">
                Override Eligibility — {overrideTarget.benefitName}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                This override will take effect immediately and be recorded in
                the audit log.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Override Status
                  </label>
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

                {overrideError && (
                  <p className="text-sm text-red-600">{overrideError}</p>
                )}
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
