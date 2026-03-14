import AuditLogs from "../_components/AuditLogs";
import Sidebar from "../_components/SideBar";

export default function AuditLogsPage() {
  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <AuditLogs />
      </div>
    </div>
  );
}
