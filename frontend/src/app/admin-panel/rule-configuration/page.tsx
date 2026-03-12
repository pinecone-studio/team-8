import Header from "@/app/_features/Header";
import RuleConfiguration from "../_components/RuleConfiguration";
import Sidebar from "../_components/SideBar";

export default function RuleConfigurationPage() {
  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />
        <RuleConfiguration />
      </div>
    </div>
  );
}
