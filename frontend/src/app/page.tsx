"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useGetEmployeeByEmailQuery } from "@/graphql/generated/graphql";
import Header from "./_features/Header";
import Sidebar from "./employee-panel/_components/SideBar";

export default function Home() {
  const { user, isLoaded } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const { data, loading, error } = useGetEmployeeByEmailQuery({
    variables: { email: email ?? "" },
    skip: !email,
  });

  useEffect(() => {
    if (!isLoaded) return;

    console.log("[Clerk] current user email:", email ?? null);
  }, [email, isLoaded]);

  useEffect(() => {
    if (!email || loading) return;

    if (error) {
      console.error("[D1] employee lookup failed:", error);
      return;
    }

    console.log("[D1] employee by Clerk email:", data?.getEmployeeByEmail ?? null);
  }, [data, email, error, loading]);

  return (
    <div className="flex min-h-screen bg-[#f8f8f9]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="p-8">
          <h1 className="text-4xl font-semibold text-gray-900">
            Good to see you, Username
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Here&apos;s an overview of your benefits
          </p>
        </main>
      </div>
    </div>
  );
}
