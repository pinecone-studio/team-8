import Dashboard from "./_components/Dashboard";
import Sidebar from "./_components/SideBar";

export default function AdminPanelPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col bg-[linear-gradient(180deg,#0a116d_0%,#ffffff_100%)]">
        <Dashboard />
      </div>
    </div>
  );
}
