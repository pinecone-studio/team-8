"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  const employeeAppUrl = process.env.NEXT_PUBLIC_EMPLOYEE_APP_URL?.trim() || "http://localhost:3000";

  return (
    <button
      className="ghost-button"
      onClick={() => signOut({ callbackUrl: employeeAppUrl })}
      type="button"
    >
      Sign out
    </button>
  );
}
