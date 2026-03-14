import { createClerkClient, verifyToken } from "@clerk/backend";
import { eq } from "drizzle-orm";
import type { Database, Employee } from "./db";
import { schema } from "./db";
import type { Env } from "./graphql/context";

export type AccessLevel = "anonymous" | "employee" | "admin";

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

export function isAdminEmployee(employee: Employee | null | undefined): boolean {
  if (!employee) return false;

  const dept = normalizeDepartment(employee.department);
  const isHr =
    dept === "human resources" ||
    dept === "human resource" ||
    dept === "hr" ||
    dept === "people" ||
    dept === "people operations";
  const isFinance =
    dept === "finance" ||
    dept === "finance & accounting" ||
    dept === "financial operations";

  return (isHr || isFinance) && (employee.responsibilityLevel ?? 0) >= 2;
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
