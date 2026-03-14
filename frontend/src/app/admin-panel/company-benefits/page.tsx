import Sidebar from "../_components/SideBar";
import CompanyBenefits from "../_components/CompanyBenefits";

export default function CompanyBenefitsPage() {
  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <CompanyBenefits />
      </div>
    </div>
  );
}
