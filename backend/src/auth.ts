import { createClerkClient, verifyToken } from "@clerk/backend";
import { eq } from "drizzle-orm";
import type { Database, Employee } from "./db";
import { schema } from "./db";
import type { Env } from "./graphql/context";

export type AccessLevel = "anonymous" | "employee" | "admin";

export type InternalRole =
  | "employee"
  | "hr_admin"
  | "hr_manager"
  | "finance_admin"
  | "finance_manager";

export interface CurrentUser {
  email: string | null;
  employee: Employee | null;
  accessLevel: AccessLevel;
  isAdmin: boolean;
}

function normalizeEmail(email: string | null | undefined): string | null {
  const normalized = email?.trim().toLowerCase();
  return normalized ? normalized : null;
}

async function resolveEmailFromClaims(
  claims: Record<string, unknown>,
  env: Env,
): Promise<string | null> {
  const directEmail =
    (typeof claims.emailAddress === "string" ? claims.emailAddress : undefined) ??
    (typeof claims.email === "string" ? claims.email : undefined) ??
    (Array.isArray(claims.emailAddresses)
      ? claims.emailAddresses.find(
          (value): value is string => typeof value === "string",
        )
      : undefined);

  const normalizedDirectEmail = normalizeEmail(directEmail);
  if (normalizedDirectEmail) {
    return normalizedDirectEmail;
  }

  const userId = typeof claims.sub === "string" ? claims.sub : null;
  if (!userId || !env.CLERK_SECRET_KEY) {
    return null;
  }

  try {
    const clerkClient = createClerkClient({
      secretKey: env.CLERK_SECRET_KEY,
    });
    const user = await clerkClient.users.getUser(userId);
    const primaryEmail =
      user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId,
      )?.emailAddress ?? user.emailAddresses[0]?.emailAddress;

    return normalizeEmail(primaryEmail);
  } catch {
    return null;
  }
}

function normalizeDepartment(department: string | null | undefined): string {
  return (department ?? "").trim().toLowerCase();
}

function isHrDepartment(dept: string): boolean {
  return (
    dept === "human resources" ||
    dept === "human resource" ||
    dept === "hr" ||
    dept === "people" ||
    dept === "people operations"
  );
}

function isFinanceDepartment(dept: string): boolean {
  return (
    dept === "finance" ||
    dept === "finance & accounting" ||
    dept === "financial operations"
  );
}

/** Derive the most specific internal role from employee record. */
export function getInternalRole(employee: Employee | null | undefined): InternalRole {
  if (!employee) return "employee";
  const dept = normalizeDepartment(employee.department);
  const level = employee.responsibilityLevel ?? 0;

  if (isHrDepartment(dept)) {
    if (level >= 3) return "hr_manager";
    if (level >= 2) return "hr_admin";
  }
  if (isFinanceDepartment(dept)) {
    if (level >= 3) return "finance_manager";
    if (level >= 2) return "finance_admin";
  }
  return "employee";
}

export function isAdminEmployee(employee: Employee | null | undefined): boolean {
  if (!employee) return false;
  const dept = normalizeDepartment(employee.department);
  return (isHrDepartment(dept) || isFinanceDepartment(dept)) &&
    (employee.responsibilityLevel ?? 0) >= 2;
}

// --- Role predicates ---

export function isHrAdmin(employee: Employee | null | undefined): boolean {
  const role = getInternalRole(employee);
  return role === "hr_admin" || role === "hr_manager";
}

export function isHrManager(employee: Employee | null | undefined): boolean {
  return getInternalRole(employee) === "hr_manager";
}

export function isFinanceAdmin(employee: Employee | null | undefined): boolean {
  const role = getInternalRole(employee);
  return role === "finance_admin" || role === "finance_manager";
}

export function isFinanceManager(employee: Employee | null | undefined): boolean {
  return getInternalRole(employee) === "finance_manager";
}

// --- Permission predicates ---

/** Any HR or Finance admin can review a benefit request (routing is enforced per-approval-policy). */
export function canReviewBenefitRequest(employee: Employee | null | undefined): boolean {
  return isAdminEmployee(employee);
}

/** Can review an HR-policy benefit request. */
export function canReviewHrBenefit(employee: Employee | null | undefined): boolean {
  return isHrAdmin(employee);
}

/** Can review a Finance-policy benefit request. */
export function canReviewFinanceBenefit(employee: Employee | null | undefined): boolean {
  return isFinanceAdmin(employee);
}

/** Override eligibility: HR admin or manager only. */
export function canOverrideEligibility(employee: Employee | null | undefined): boolean {
  return isHrAdmin(employee);
}

/** Upload contracts: HR admin only (governance action). */
export function canUploadContracts(employee: Employee | null | undefined): boolean {
  return isHrAdmin(employee);
}

/** Read audit logs: HR admin only (governance data). */
export function canReadAuditLogs(employee: Employee | null | undefined): boolean {
  return isHrAdmin(employee);
}

/** Approve eligibility rule changes: HR admin or manager. */
export function canApproveRuleChanges(employee: Employee | null | undefined): boolean {
  return isHrAdmin(employee);
}

/** Read HR review queue. */
export function canReadHrQueue(employee: Employee | null | undefined): boolean {
  return isHrAdmin(employee);
}

/** Read Finance review queue. */
export function canReadFinanceQueue(employee: Employee | null | undefined): boolean {
  return isFinanceAdmin(employee);
}

export function deriveAccessLevel(employee: Employee | null): AccessLevel {
  if (!employee) return "anonymous";
  if (isAdminEmployee(employee)) return "admin";
  return "employee";
}

export async function getCurrentUserFromRequest(
  request: Request,
  env: Env,
  db: Database,
): Promise<CurrentUser> {
  const authHeader = request.headers.get("Authorization") ?? "";
  const tokenMatch = authHeader.match(/^Bearer (.+)$/i);
  const token = tokenMatch?.[1];

  if (!token || !env.CLERK_SECRET_KEY) {
    return {
      email: null,
      employee: null,
      accessLevel: "anonymous",
      isAdmin: false,
    };
  }

  try {
    const verified = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
      ...(env.CLERK_JWT_KEY ? { jwtKey: env.CLERK_JWT_KEY } : {}),
    });

    const verifiedClaims = verified as Record<string, unknown>;
    const email = await resolveEmailFromClaims(verifiedClaims, env);

    let employee: Employee | null = null;
    if (email) {
      const rows = await db
        .select()
        .from(schema.employees)
        .where(eq(schema.employees.email, email));
      employee = rows[0] ?? null;
    }

    const accessLevel = deriveAccessLevel(employee);

    return {
      email,
      employee,
      accessLevel,
      isAdmin: accessLevel === "admin",
    };
  } catch {
    return {
      email: null,
      employee: null,
      accessLevel: "anonymous",
      isAdmin: false,
    };
  }
}

export type CurrentEmployee = Employee;

export function requireAuth(
  currentEmployee: CurrentEmployee | null,
): CurrentEmployee {
  if (!currentEmployee) {
    throw new Error("Authentication required.");
  }
  return currentEmployee;
}

export function requireAdmin(
  currentEmployee: CurrentEmployee | null,
): CurrentEmployee {
  if (!currentEmployee) {
    throw new Error("Authentication required.");
  }
  if (!isAdminEmployee(currentEmployee)) {
    throw new Error("Admin access required.");
  }
  return currentEmployee;
}

export function requireHrAdmin(
  currentEmployee: CurrentEmployee | null,
): CurrentEmployee {
  if (!currentEmployee) throw new Error("Authentication required.");
  if (!isHrAdmin(currentEmployee)) throw new Error("HR admin access required.");
  return currentEmployee;
}

export function requireFinanceAdmin(
  currentEmployee: CurrentEmployee | null,
): CurrentEmployee {
  if (!currentEmployee) throw new Error("Authentication required.");
  if (!isFinanceAdmin(currentEmployee)) throw new Error("Finance admin access required.");
  return currentEmployee;
}
