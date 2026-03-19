import Sidebar from "../_components/SideBar";
import VendorContracts from "../_components/VendorContracts";

export default function VendorContractsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col items-center">
        <div className="w-full max-w-7xl">
          <VendorContracts />
        </div>
      </div>
    </div>
  );
}
