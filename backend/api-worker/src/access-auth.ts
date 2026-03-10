import type { AppRole } from "./auth";
import { issueWorkerToken } from "./auth";
import type { Env } from "./types";

interface AccessLoginRow {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
  employment_status: string;
  password_hash: string;
  password_salt: string;
  password_iterations: number;
  password_algorithm: string;
  is_active: number;
}

export interface AccessPreview {
  summary: {
    total: number;
    employees: number;
    hr: number;
    finance: number;
  };
  featuredAccounts: Array<{
    employeeId: string;
    email: string;
    name: string;
    department: string;
    role: AppRole;
  }>;
}

export interface AccessLoginResult {
  id: string;
  email: string;
  name: string;
  department: string;
  role: AppRole;
  workerToken: string;
}

function deriveAccessRole(input: { role: string; department: string }): AppRole {
  const role = input.role.trim().toLowerCase();
  const department = input.department.trim().toLowerCase();

  if (role === "finance_manager") {
    return "finance_manager";
  }

  if (department === "hr" || role === "people_ops") {
    return "hr_admin";
  }

  return "employee";
}

function normalizeBase64(input: string) {
  const remainder = input.length % 4;

  if (remainder === 0) {
    return input;
  }

  return input.padEnd(input.length + (4 - remainder), "=");
}

function base64ToArrayBuffer(value: string) {
  const binary = atob(normalizeBase64(value));
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function constantTimeEqual(left: string, right: string) {
  const maxLength = Math.max(left.length, right.length);
  let mismatch = left.length ^ right.length;

  for (let index = 0; index < maxLength; index += 1) {
    mismatch |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }

  return mismatch === 0;
}

async function derivePasswordHash(password: string, salt: ArrayBuffer, iterations: number) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256"
    },
    key,
    256
  );

  return bytesToBase64(new Uint8Array(bits));
}

async function verifyPassword(password: string, row: AccessLoginRow) {
  if (row.password_algorithm !== "pbkdf2-sha256") {
    return false;
  }

  const derivedHash = await derivePasswordHash(
    password,
    base64ToArrayBuffer(row.password_salt),
    row.password_iterations
  );

  return constantTimeEqual(derivedHash, row.password_hash);
}

export async function loginWithCredentials(
  env: Env,
  input: { email: string; password: string }
): Promise<AccessLoginResult | null> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const password = input.password;

  if (!normalizedEmail || !password) {
    return null;
  }

  const row = await env.DB.prepare(
    `
      SELECT
        e.id,
        e.email,
        e.name,
        e.role,
        e.department,
        e.employment_status,
        ac.password_hash,
        ac.password_salt,
        ac.password_iterations,
        ac.password_algorithm,
        ac.is_active
      FROM employees e
      INNER JOIN access_credentials ac ON ac.employee_id = e.id
      WHERE lower(e.email) = ?
      LIMIT 1
    `
  )
    .bind(normalizedEmail)
    .first<AccessLoginRow>();

  if (!row || !row.is_active) {
    return null;
  }

  if (row.employment_status === "terminated") {
    return null;
  }

  const isValidPassword = await verifyPassword(password, row);

  if (!isValidPassword) {
    return null;
  }

  const accessRole = deriveAccessRole({
    role: row.role,
    department: row.department
  });

  await env.DB.prepare(
    `
      UPDATE access_credentials
      SET last_login_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE employee_id = ?
    `
  )
    .bind(row.id)
    .run();

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    department: row.department,
    role: accessRole,
    workerToken: await issueWorkerToken(
      {
        userId: row.id,
        role: accessRole,
        email: row.email
      },
      env
    )
  };
}

export async function loadAccessPreview(env: Env): Promise<AccessPreview> {
  const rows = await env.DB.prepare(
    `
      SELECT employees.id AS id, employees.email AS email, employees.name AS name, employees.role AS role, employees.department AS department
      FROM employees
      INNER JOIN access_credentials ac ON ac.employee_id = employees.id
      WHERE employment_status != 'terminated'
        AND ac.is_active = 1
      ORDER BY department ASC, responsibility_level DESC, hire_date ASC
    `
  ).all<{
    id: string;
    email: string;
    name: string;
    role: string;
    department: string;
  }>();

  const allRows = rows.results ?? [];
  const summary = {
    total: 0,
    employees: 0,
    hr: 0,
    finance: 0
  };

  for (const row of allRows) {
    const accessRole = deriveAccessRole(row);
    summary.total += 1;

    if (accessRole === "employee") {
      summary.employees += 1;
    } else if (accessRole === "hr_admin") {
      summary.hr += 1;
    } else if (accessRole === "finance_manager") {
      summary.finance += 1;
    }
  }

  const featuredAccounts: AccessPreview["featuredAccounts"] = [];
  const featuredRoles: AppRole[] = ["employee", "hr_admin", "finance_manager"];

  for (const featuredRole of featuredRoles) {
    const row = allRows.find((candidate) => deriveAccessRole(candidate) === featuredRole);

    if (!row) {
      continue;
    }

    featuredAccounts.push({
      employeeId: row.id,
      email: row.email,
      name: row.name,
      department: row.department,
      role: featuredRole
    });
  }

  return {
    summary,
    featuredAccounts
  };
}
