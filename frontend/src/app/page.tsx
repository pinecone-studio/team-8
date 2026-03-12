"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useGetEmployeeByEmailQuery } from "@/graphql/generated/graphql";
import Header from "./_features/Header";
import AppSidebar from "./_components/AppSidebar";

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
      <AppSidebar />

      <div className="flex flex-1 flex-col">
        <main className="p-8">
          <h1 className="text-4xl font-semibold text-gray-900">
            Good to see you
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Use the sidebar to navigate. You have access to both your benefits
            and HR admin tools.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="/employee-panel/Mybenefits"
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow"
            >
              <h2 className="font-semibold text-gray-900">My Benefits</h2>
              <p className="mt-1 text-sm text-gray-500">
                View eligibility, request benefits, and track your requests
              </p>
            </a>
            <a
              href="/admin-panel"
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow"
            >
              <h2 className="font-semibold text-gray-900">HR Admin</h2>
              <p className="mt-1 text-sm text-gray-500">
                Review requests, upload contracts
              </p>
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
