import { jwtVerify, SignJWT } from "jose";

import type { Env } from "./types";

export type AppRole = "employee" | "hr_admin" | "finance_manager" | "system";

export interface AuthContext {
  userId: string;
  role: AppRole;
  email: string | null;
}

const allowedRoles = new Set<AppRole>(["employee", "hr_admin", "finance_manager", "system"]);

function parseBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

export async function authenticateRequest(
  request: Request,
  env: Env
): Promise<AuthContext | null> {
  const token = parseBearerToken(request);

  if (!token) {
    return null;
  }

  const secret = env.AUTH_JWT_SECRET?.trim();

  if (!secret) {
    throw new Error("AUTH_JWT_SECRET is not configured.");
  }

  const verification = await jwtVerify(token, new TextEncoder().encode(secret), {
    algorithms: ["HS256"]
  });

  const userId = verification.payload.sub;
  const role = verification.payload.role;
  const email = typeof verification.payload.email === "string" ? verification.payload.email : null;

  if (typeof userId !== "string" || typeof role !== "string" || !allowedRoles.has(role as AppRole)) {
    return null;
  }

  return {
    userId,
    role: role as AppRole,
    email
  };
}

export async function issueWorkerToken(
  input: { userId: string; role: AppRole; email: string | null },
  env: Env
): Promise<string> {
  const secret = env.AUTH_JWT_SECRET?.trim();

  if (!secret) {
    throw new Error("AUTH_JWT_SECRET is not configured.");
  }

  return new SignJWT({
    role: input.role,
    email: input.email
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(input.userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(secret));
}

export function hasRequiredRole(auth: AuthContext, roles: AppRole[]): boolean {
  return roles.includes(auth.role);
}
