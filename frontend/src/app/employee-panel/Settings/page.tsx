import Sidebar from "../_components/SideBar";
import Header from "../../_features/Header";

export default function SettingsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f8f9]">
      <Sidebar />

      <div className="flex min-h-0 flex-1 flex-col min-w-0">
        <Header />

        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-500">This is the settings page.</p>
        </main>
      </div>
    </div>
  );
}
