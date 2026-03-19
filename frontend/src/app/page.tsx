"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isAdminEmployee } from "@/app/admin-panel/_lib/access";
import PineconeLoading from "./_components/PineconeLoading";

export default function Home() {
  const router = useRouter();
  const { employee, loading } = useCurrentEmployee();
  const hasAdminAccess = isAdminEmployee(employee);

  useEffect(() => {
    if (loading) return;

    router.replace(hasAdminAccess ? "/admin-panel" : "/employee-panel/dashboard");
  }, [hasAdminAccess, loading, router]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white">
      <PineconeLoading />
    </div>
  );
}
