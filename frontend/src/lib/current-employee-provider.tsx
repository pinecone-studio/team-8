"use client";

import {
  createContext,
  useContext,
  type PropsWithChildren,
} from "react";
import { useUser } from "@clerk/nextjs";
import {
  useGetEmployeeByEmailQuery,
  type GetEmployeeByEmailQuery,
} from "@/graphql/generated/graphql";

type CurrentEmployee = GetEmployeeByEmailQuery["getEmployeeByEmail"];

type CurrentEmployeeContextValue = {
  email: string | null;
  employee: CurrentEmployee;
  error: Error | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  loading: boolean;
};

const CurrentEmployeeContext = createContext<CurrentEmployeeContextValue | null>(
  null
);

export function CurrentEmployeeProvider({ children }: PropsWithChildren) {
  const { user, isLoaded, isSignedIn } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null;
  const { data, loading, error } = useGetEmployeeByEmailQuery({
    variables: { email: email ?? "" },
    skip: !email,
  });

  return (
    <CurrentEmployeeContext.Provider
      value={{
        email,
        employee: data?.getEmployeeByEmail ?? null,
        error: error ?? null,
        isLoaded,
        isSignedIn: Boolean(isSignedIn),
        loading: !isLoaded || (Boolean(email) && loading),
      }}
    >
      {children}
    </CurrentEmployeeContext.Provider>
  );
}

export function useCurrentEmployee() {
  const context = useContext(CurrentEmployeeContext);

  if (!context) {
    throw new Error(
      "useCurrentEmployee must be used within a CurrentEmployeeProvider"
    );
  }

  return context;
}
