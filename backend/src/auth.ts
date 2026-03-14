import { verifyToken } from "@clerk/backend";
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

function normalizeDepartment(department: string | null | undefined): string {
  return (department ?? "").trim().toLowerCase();
}

export function isAdminEmployee(employee: Employee | null | undefined): boolean {
  if (!employee) return false;
  const dept = normalizeDepartment(employee.department);

  const isHr =
    dept === "human resources" ||
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

    const emailClaim =
      (verified.emailAddress as string | undefined) ??
      (Array.isArray((verified as unknown as { emailAddresses?: string[] }).emailAddresses)
        ? (verified as unknown as { emailAddresses?: string[] }).emailAddresses?.[0]
        : undefined);

    const email = emailClaim ? emailClaim.trim().toLowerCase() : null;

    let employee: Employee | null = null;
    if (email) {
      const rows = await db
        .select()
        .from(schema.employees)
        .where(eq(schema.employees.email, email));
      employee = rows[0] ?? null;
    }

    const accessLevel = deriveAccessLevel(employee);
    const isAdmin = accessLevel === "admin";

    return {
      email,
      employee,
      accessLevel,
      isAdmin,
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

