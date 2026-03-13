import type { GetEmployeeByEmailQuery } from "@/graphql/generated/graphql";

type CurrentEmployee = GetEmployeeByEmailQuery["getEmployeeByEmail"];

function normalizeDepartment(value: string | null | undefined) {
  return value?.trim().toLowerCase().replace(/\s+/g, " ") ?? "";
}

function isHrDepartment(department: string) {
  return (
    department === "human resource" ||
    department === "human resources" ||
    department === "hr"
  );
}

function isFinanceDepartment(department: string) {
  return department === "finance";
}

function formatLabel(value: string | null | undefined) {
  if (!value) return "";

  return value
    .split("_")
    .join(" ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export function isAdminEmployee(employee: CurrentEmployee) {
  if (!employee) return false;

  const department = normalizeDepartment(employee.department);
  const hasAdminDepartment =
    isHrDepartment(department) || isFinanceDepartment(department);

  return hasAdminDepartment && employee.responsibilityLevel >= 2;
}

export function getAdminRoleLabel(employee: CurrentEmployee) {
  if (!employee) return "Admin";

  const department = normalizeDepartment(employee.department);

  if (isHrDepartment(department)) {
    return "HR Admin";
  }

  if (isFinanceDepartment(department)) {
    return "Finance Admin";
  }

  return `${formatLabel(employee.role) || "Admin"} · Level ${employee.responsibilityLevel}`;
}

export function getAdminDashboardTitle(employee: CurrentEmployee) {
  if (!employee) return "Admin Dashboard";

  const department = normalizeDepartment(employee.department);

  if (isHrDepartment(department)) {
    return "HR Admin Dashboard";
  }

  if (isFinanceDepartment(department)) {
    return "Finance Admin Dashboard";
  }

  return "Admin Dashboard";
}

export function getAdminDashboardSubtitle(employee: CurrentEmployee) {
  if (!employee) {
    return "Overview of benefits management system";
  }

  return `${formatLabel(employee.department) || "Admin"} team overview and benefit activity`;
}
