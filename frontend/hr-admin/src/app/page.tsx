import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions, isAllowedAdminRole } from "auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const employeeAppUrl =
    process.env.NEXT_PUBLIC_EMPLOYEE_APP_URL?.trim() || "http://localhost:3000";

  if (session && isAllowedAdminRole(session.user?.role)) {
    redirect("/dashboard");
  }

  if (session) {
    redirect(`${employeeAppUrl}/dashboard`);
  }

  redirect(employeeAppUrl);
}
