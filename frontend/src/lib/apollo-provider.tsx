"use client";

import { useEffect } from "react";
import { ApolloProvider } from "@apollo/client";
import { useAuth, useUser } from "@clerk/nextjs";
import { apolloClient, setAuthTokenGetter, setEmployeeEmailGetter } from "./apollo-client";

function AuthSync() {
  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    setAuthTokenGetter(() => getToken());
    setEmployeeEmailGetter(
      () => user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null,
    );
  }, [getToken, user]);

  return null;
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthSync />
      {children}
    </ApolloProvider>
  );
}
