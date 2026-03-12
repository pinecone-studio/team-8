"use client";
import { use } from "react";
import Header from "@/app/_features/Header";
import AppSidebar from "@/app/_components/AppSidebar";

type PageProps = { params?: Promise<Record<string, string | string[]>> };
export default function Contracts({ params }: PageProps) {
  if (params) use(params);
  return (
    <div className="flex min-h-screen bg-[#f8f8f9]">
      <AppSidebar />

      <div className="flex flex-1 flex-col">
        <main className="p-8">
          <h1 className="text-3xl font-semibold text-gray-900"> Contracts</h1>
          <p className="mt-2 text-gray-500">This is the dashboard page.</p>
        </main>
      </div>
    </div>
  );
}
