"use client";

import React, { useMemo } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@clerk/nextjs";
import { createHttpLink, graphqlUri } from "./apollo-client";
import PineconeLoading from "@/app/_components/PineconeLoading";

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded, userId } = useAuth();

  const client = useMemo(() => {
    const httpLink = createHttpLink();
    const isLocalGraphql =
      graphqlUri.includes("127.0.0.1") || graphqlUri.includes("localhost");
    const devEmail = process.env.NEXT_PUBLIC_DEV_EMPLOYEE_EMAIL;

    const authLink = setContext(async (_, { headers }) => {
      try {
        const nextHeaders: Record<string, string> = { ...(headers as Record<string, string>) };

        // Local dev: use x-dev-employee-email so the backend can resolve a user
        // without Clerk secrets. Also avoid attaching Authorization for localhost,
        // otherwise the backend will try (and fail) to verify the token first.
        if (isLocalGraphql && devEmail) {
          nextHeaders["x-dev-employee-email"] = devEmail;
          return { headers: nextHeaders };
        }

        const token = await getToken();

        if (!token) {
          return { headers: nextHeaders };
        }

        return {
          headers: {
            ...nextHeaders,
            Authorization: `Bearer ${token}`,
          },
        };
      } catch {
        return { headers };
      }
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }, [getToken]);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white">
        <PineconeLoading />
      </div>
    );
  }

  return (
    <ApolloProvider client={client} key={userId ?? "anonymous"}>
      {children}
    </ApolloProvider>
  );
}
