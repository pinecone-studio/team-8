import Dashboard from "./_components/Dashboard";
import Sidebar from "./_components/SideBar";

export default function AdminPanelPage() {
  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Dashboard />
      </div>
    </div>
  );
}
