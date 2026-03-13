"use client";

import { useUser } from "@clerk/nextjs";
import { useGetEmployeeByEmailQuery } from "@/graphql/generated/graphql";

export function useCurrentEmployee() {
  const { user, isLoaded } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? "";

  const { data, loading, error } = useGetEmployeeByEmailQuery({
    variables: { email },
    skip: !email,
  });

  const employee = data?.getEmployeeByEmail ?? null;

  return {
    employee,
    employeeId: employee?.id ?? null,
    loading: !isLoaded || loading,
    error,
  };
}
