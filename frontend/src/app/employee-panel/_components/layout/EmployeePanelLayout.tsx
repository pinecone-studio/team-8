"use client";

import Sidebar from "../SideBar";

type EmployeePanelLayoutProps = {
  children: React.ReactNode;
};

export default function EmployeePanelLayout({ children }: EmployeePanelLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl p-8">{children}</main>
      </div>
    </div>
  );
}
