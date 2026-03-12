import Topbar from "../_components/layout/Topbar";
import Sidebar from "../_components/SideBar";

const mockRequests = [
  {
    id: "REQ-001",
    benefit: "Travel Insurance",
    vendor: "TravelGuard",
    status: "Pending",
    date: "2026-03-11",
  },
  {
    id: "REQ-002",
    benefit: "Gym Membership",
    vendor: "PineFit",
    status: "Pending",
    date: "2026-03-11",
  },
];

export default function RequestsPage() {
"use client";
import { use } from "react";
import Header from "@/app/_features/Header";
import Sidebar from "../_components/SideBar";

type PageProps = { params?: Promise<Record<string, string | string[]>> };
export default function Requests({ params }: PageProps) {
  if (params) use(params);
  return (
    <div className="flex min-h-screen bg-[#f6f7f9]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <h1 className="text-4xl font-bold text-gray-900">Requests</h1>
          <p className="mt-2 text-lg text-gray-500">
            Track your submitted benefit requests
          </p>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-500">
                    <th className="pb-4 font-medium">Request ID</th>
                    <th className="pb-4 font-medium">Benefit</th>
                    <th className="pb-4 font-medium">Vendor</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-gray-100 text-base"
                    >
                      <td className="py-4 text-gray-700">{request.id}</td>
                      <td className="py-4 font-medium text-gray-900">
                        {request.benefit}
                      </td>
                      <td className="py-4 text-gray-700">{request.vendor}</td>
                      <td className="py-4">
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600">
                          {request.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-700">{request.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
