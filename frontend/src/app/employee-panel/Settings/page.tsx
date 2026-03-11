import Sidebar from "../_components/SideBar";
import Header from "../../_features/Header";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-[#f8f8f9]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="p-8">
          <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-500">This is the settings page.</p>
        </main>
      </div>
    </div>
  );
}
