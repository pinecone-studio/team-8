import Sidebar from "../_components/SideBar";
import VendorContracts from "../_components/VendorContracts";

export default function VendorContractsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col items-center bg-[linear-gradient(180deg,#0a116d_0%,#ffffff_100%)]">
        <div className="w-full max-w-7xl">
          <VendorContracts />
        </div>
      </div>
    </div>
  );
}
