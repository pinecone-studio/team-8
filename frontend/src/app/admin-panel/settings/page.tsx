import Header from "@/app/_features/Header";
import Sidebar from "../_components/SideBar";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 px-8 py-9">
          <section className="mx-auto max-w-6xl">
            <h1 className="text-[2.25rem] font-semibold tracking-[-0.02em] text-slate-900">
              Settings
            </h1>
            <p className="mt-2 text-lg text-slate-500">
              Manage admin panel settings
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
