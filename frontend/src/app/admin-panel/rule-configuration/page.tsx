import RuleConfiguration from "../_components/RuleConfiguration";
import Sidebar from "../_components/SideBar";

export default function RuleConfigurationPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col items-center">
        <div className="w-full max-w-7xl">
          <RuleConfiguration />
        </div>
      </div>
    </div>
  );
}
