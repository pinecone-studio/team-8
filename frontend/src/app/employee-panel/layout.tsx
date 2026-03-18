import Sidebar from "./_components/SideBar";

export default function EmployeePanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
