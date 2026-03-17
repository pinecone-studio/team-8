"use client";

import React, { useMemo } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@clerk/nextjs";
import { createHttpLink } from "./apollo-client";
import PineconeLogo from "@/app/_components/_icons/PineconeLogo";

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
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 shadow-lg">
            <PineconeLogo width={28} height={24} />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-sm font-semibold text-gray-800">
              Loading your account
            </p>
            <p className="text-xs text-gray-400">Just a moment…</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-gray-300 animate-bounce" />
        </div>
      </div>
    );
  }

  return (
    <ApolloProvider client={client} key={userId ?? "anonymous"}>
      {children}
    </ApolloProvider>
  );
}
