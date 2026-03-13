import EligibilityInspector from "../_components/EligibilityInspector";
import Sidebar from "../_components/SideBar";

export default function EligibilityInspectorPage() {
  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <EligibilityInspector />
      </div>
    </div>
  );
}
