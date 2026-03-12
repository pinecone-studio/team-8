"use client";
import Header from "@/app/_features/Header";
import Sidebar from "../_components/SideBar";
import {
  Dumbbell,
  Heart,
  Brain,
  Laptop,
  TrendingUp,
  Lock,
  UniversityIcon,
  HomeIcon,
  PlaneIcon,
} from "lucide-react";
import { GymIcon } from "@/app/icons/Gym";
import { HeartIcon } from "@/app/icons/Heart";
import { BrainIcon } from "@/app/icons/Brain";
import { MacbookIcon } from "@/app/icons/Macbook";
import { StockIcon } from "@/app/icons/Stock";
import { HatIcon } from "@/app/icons/Hat";
import Link from "next/link";

export default function Mybenefits() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f8f9]">
      <Sidebar />

      <div className="flex min-h-0 flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto bg-white text-[#1a1a1a] pt-8 pb-0 pl-8 pr-[47px] md:pt-12 md:pb-0 md:pl-12 md:pr-[47px] lg:pt-16 lg:pb-0 lg:pl-16 lg:pr-[47px]">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <header className="mb-10">
              <h1 className="text-[24px] font-bold mb-1">Benefits Catalog</h1>
              <p className="text-gray-500 text-sm">
                Explore all company benefits grouped by category
              </p>
            </header>

            <div className="space-y-12">
              {/* --- Wellness Category --- */}
              <section>
                <h2 className="text-lg font-bold mb-6">Wellness</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Link
                    href="/employee-panel/Mybenefits/Gym
                    "
                    className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-blue-200 block flex flex-col h-full"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-blue-50 transition-colors">
                        <GymIcon />
                      </div>
                      <div>
                        <h3 className="font-bold text-base transition-colors">
                          Gym Membership
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">
                          PineFit
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-bold">
                        ACTIVE
                      </span>
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded text-[10px] font-bold">
                        WELLNESS
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Access to premium gym facilities with personal training
                      sessions
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      50% subsidy
                    </p>
                  </Link>

                  <Link
                    href="/employee-panel/Mybenefits/PrivateHealth"
                    className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer block flex flex-col h-full"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
                        <HeartIcon />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">
                          Private Health Insurance
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">
                          HealthPlus
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-bold">
                        ACTIVE
                      </span>
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded text-[10px] font-bold">
                        WELLNESS
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Comprehensive health coverage including dental and vision
                    </p>
                    <p className="text-sm font-bold">50% subsidy</p>
                  </Link>

                  <Link
                    href="/employee-panel/Mybenefits/DigitalWellnes"
                    className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer block flex flex-col h-full"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
                        <BrainIcon />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">
                          Digital Wellness
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">
                          Calm & Headspace
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-bold">
                        ACTIVE
                      </span>
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded text-[10px] font-bold">
                        WELLNESS
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Meditation and mental health apps subscription
                    </p>
                    <p className="text-sm font-bold">100% subsidy</p>
                  </Link>
                </div>
              </section>

              {/* --- Equipment Category --- */}
              <section>
                <h2 className="text-lg font-bold mb-6">Equipment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Link
                    href="/employee-panel/Mybenefits/MacbookSubsidy"
                    className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer block flex flex-col h-full"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
                        <MacbookIcon />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">MacBook Subsidy</h3>
                        <p className="text-xs text-gray-400 font-medium">
                          Apple
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">
                        ELIGIBLE
                      </span>
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded text-[10px] font-bold">
                        EQUIPMENT
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      One-time subsidy for purchasing a MacBook Pro
                    </p>
                    <p className="text-sm font-bold">50% subsidy</p>
                  </Link>
                </div>
              </section>

              {/* --- Financial Category --- */}
              <section>
                <h2 className="text-lg font-bold mb-6">Financial</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Link
                    href="/employee-panel/Mybenefits/StockOption"
                    className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer block flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
                          <StockIcon />
                        </div>
                        <div>
                          <h3 className="font-bold text-base">Stock Options</h3>
                          <p className="text-xs text-gray-400 font-medium">
                            Company
                          </p>
                        </div>
                      </div>
                      <Lock size={16} className="text-gray-400" />
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold">
                        LOCKED
                      </span>
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded text-[10px] font-bold">
                        FINANCIAL
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Employee stock ownership plan participation
                    </p>
                    <p className="text-sm font-bold">50% subsidy</p>
                  </Link>

                  <Link
                    href="/employee-panel/Mybenefits/Professional"
                    className="border border-gray-100 rounded-xl hover:shadow-md p-6 shadow-sm transition-all cursor-pointer block flex flex-col h-full"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
                        <HatIcon />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">
                          Professional Development
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">
                          Udemy & Coursera
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold">
                        ELIGIBLE
                      </span>
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded text-[10px] font-bold">
                        CAREER DEVELOPMENT
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Annual budget for online courses and certifications
                    </p>
                    <p className="text-sm font-bold">50% subsidy</p>
                  </Link>
                </div>
              </section>

              {/* --- Flexibility Category --- */}
              <section>
                <h2 className="text-lg font-bold mb-6">Flexibility</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Link
                    href="/employee-panel/Mybenefits/RemoteWork"
                    className="border border-gray-100 hover:shadow-md rounded-xl p-6 shadow-sm transition-all cursor-pointer block flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
                          <HomeIcon />
                        </div>
                        <div>
                          <h3 className="font-bold text-base">
                            Remote Work Stipend
                          </h3>
                          <p className="text-xs text-gray-400 font-medium">
                            Company
                          </p>
                        </div>
                      </div>
                      <Lock size={16} className="text-gray-400" />
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold">
                        Active
                      </span>
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded text-[10px] font-bold">
                        FLEXIBILITY
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Monthly allowance for home office setup and internet
                    </p>
                    <p className="text-sm font-bold">100% subsidy</p>
                  </Link>

                  <Link
                    href="/employee-panel/Mybenefits/Travel"
                    className="border border-gray-100 rounded-xl hover:shadow-md p-6 shadow-sm transition-all cursor-pointer block flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
                          <PlaneIcon />
                        </div>
                        <div>
                          <h3 className="font-bold text-base">
                            Travel Insurance
                          </h3>
                          <p className="text-xs text-gray-400 font-medium">
                            Company
                          </p>
                        </div>
                      </div>
                      <Lock size={16} className="text-gray-400" />
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold">
                        Active
                      </span>
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded text-[10px] font-bold">
                        FLEXIBILITY
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Monthly allowance for home office setup and internet
                    </p>
                    <p className="text-sm font-bold">100% subsidy</p>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
