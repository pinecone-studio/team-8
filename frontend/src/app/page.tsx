"use client";

import { use } from "react";
import Header from "./_features/Header";
import Sidebar from "./employee-panel/_components/SideBar";

type PageProps = { params?: Promise<Record<string, string | string[]>> };
export default function Home({ params }: PageProps) {
  if (params) use(params);
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
