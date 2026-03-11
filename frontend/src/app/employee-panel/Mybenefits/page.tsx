"use client";
import Header from "@/app/_features/Header";
import Sidebar from "../_components/SideBar";

export default function Mybenefits() {
  return (
    <div className="flex min-h-screen bg-[#f8f8f9]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />
        <main className="p-8">
          <h1 className="text-3xl font-semibold text-gray-900"> Mybenefits</h1>
          <p className="mt-2 text-gray-500">This is the dashboard page.</p>
        </main>
      </div>
    </div>
  );
}
