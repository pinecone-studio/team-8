import Sidebar from "../_components/SideBar";
import CompanyBenefits from "../_components/page";

export default function CompanyBenefitsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col items-center">
        <div className="w-full max-w-7xl">
          <CompanyBenefits />
        </div>
      </div>
    </div>
  );
}
