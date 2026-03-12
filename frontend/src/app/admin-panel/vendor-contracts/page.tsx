import Header from "@/app/_features/Header";
import Sidebar from "../_components/SideBar";
import VendorContracts from "../_components/VendorContracts";

export default function VendorContractsPage() {
  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />
        <VendorContracts />
      </div>
    </div>
  );
}
