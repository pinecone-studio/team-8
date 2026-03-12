"use client";
import Header from "@/app/_features/Header";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import Sidebar from "../../_components/SideBar";
export default function RemoteWork() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f8f9]">
      <Sidebar />

      <div className="flex min-h-0 flex-1 flex-col min-w-0">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-16">
          {/* Back Button */}
          <Link
            href="/employee-panel/Mybenefits"
            className="flex items-center gap-2 text-gray-500 mb-6 hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Benefits
          </Link>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT CARD */}
            <div className="flex-1 bg-white border rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-semibold">Gym Membership</h1>
                  <p className="text-gray-500 mt-1">PineFit</p>
                </div>

                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium">
                  ACTIVE
                </span>
              </div>

              <p className="text-gray-600 mb-8">
                Access to premium gym facilities with personal training sessions
              </p>

              <div className="border-t pt-6 grid grid-cols-2 gap-10">
                <div>
                  <p className="text-gray-500 text-sm">Subsidy Percentage</p>
                  <p className="text-xl font-semibold mt-1">50%</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Contract Required</p>
                  <p className="text-xl font-semibold mt-1">Yes</p>
                </div>
              </div>

              <div className="border-t mt-8 pt-6 text-gray-500 text-sm flex items-center gap-2">
                <span>📄</span>
                This benefit requires contract acceptance before approval
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="w-full lg:w-[360px] bg-white border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-6">
                Eligibility Breakdown
              </h2>

              <div className="space-y-5">
                <Item
                  title="Employment Status"
                  desc="Must be a permanent employee"
                />
                <Item
                  title="OKR Submission"
                  desc="Must have submitted current quarter OKRs"
                />
                <Item
                  title="Attendance"
                  desc="Less than 3 late arrivals this month"
                />
                <Item title="Responsibility Level" desc="Level 2 or above" />
              </div>

              <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors">
                Request Benefit
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Item({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="text-green-600 mt-1">
        <Check size={18} />
      </div>

      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}
