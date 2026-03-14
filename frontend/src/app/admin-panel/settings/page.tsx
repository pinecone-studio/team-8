import Sidebar from "../_components/SideBar";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl flex-1 px-8 py-9">
          <section className="w-full">
            <h1 className="text-xl font-semibold text-gray-900">
              Settings
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage admin panel settings
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
