import { eq } from "drizzle-orm";
import type { Database } from "./db";
import { schema } from "./db";

/** Parse a JWT payload without verifying the signature (pragmatic for Workers). */
function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (payload.length % 4 !== 0) payload += "=";
    const decoded = atob(payload);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Resolve the current employee from the request.
 * Tries Authorization Bearer JWT (email claim), then X-Employee-Email header.
 */
export async function resolveCurrentEmployee(
  request: Request,
  db: Database,
) {
  let email: string | null = null;

  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const payload = parseJwtPayload(token);
    if (payload && typeof payload.email === "string") {
      email = payload.email.trim().toLowerCase();
    }
  }

  // Fallback: X-Employee-Email header (set by frontend for backends that don't include email in JWT)
  if (!email) {
    const headerEmail = request.headers.get("X-Employee-Email");
    if (headerEmail) email = headerEmail.trim().toLowerCase();
  }

  if (!email) return null;

  const results = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.email, email));
  return results[0] ?? null;
}

export type CurrentEmployee = NonNullable<
  Awaited<ReturnType<typeof resolveCurrentEmployee>>
>;

/** Throw if there is no authenticated employee. */
export function requireAuth(
  currentEmployee: CurrentEmployee | null,
): CurrentEmployee {
  if (!currentEmployee) throw new Error("Authentication required.");
  return currentEmployee;
}

/**
 * Throw if the current employee is not an admin
 * (HR/Finance department + responsibilityLevel >= 2).
 */
export function requireAdmin(
  currentEmployee: CurrentEmployee | null,
): CurrentEmployee {
  if (!currentEmployee) throw new Error("Authentication required.");
  const dept = (currentEmployee.department ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  const isHrOrFinance = [
    "human resource",
    "human resources",
    "hr",
    "finance",
  ].includes(dept);
  if (!isHrOrFinance || currentEmployee.responsibilityLevel < 2) {
    throw new Error("Admin access required.");
  }
  return currentEmployee;
}
