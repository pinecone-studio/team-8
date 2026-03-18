import EligibilityInspector from "../_components/EligibilityInspector";
import Sidebar from "../_components/SideBar";

export default function EligibilityInspectorPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col items-center bg-[linear-gradient(180deg,#0a116d_0%,#ffffff_100%)]">
        <div className="w-full max-w-7xl">
          <EligibilityInspector />
        </div>
      </div>
    </div>
  );
}
