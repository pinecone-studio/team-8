"use client";

import React, { useMemo } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@clerk/nextjs";
import { createHttpLink } from "./apollo-client";
import PineconeLoading from "@/app/_components/PineconeLoading";

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded, userId } = useAuth();

  const client = useMemo(() => {
    const httpLink = createHttpLink();

    const authLink = setContext(async (_, { headers }) => {
      try {
        const token = await getToken();

        if (!token) {
          return { headers };
        }

        return {
          headers: {
            ...headers,
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
