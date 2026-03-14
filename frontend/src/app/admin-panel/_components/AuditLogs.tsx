import { ClipboardList } from "lucide-react";

export default function AuditLogs() {
  return (
    <main className="flex-1 px-8 py-9">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Audit Logs</h1>
          <p className="mt-1 text-sm text-gray-500">
            System activity and change history
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center">
          <ClipboardList className="h-10 w-10 text-slate-300" />
          <h2 className="mt-4 text-base font-semibold text-slate-700">
            Not yet implemented
          </h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Audit log recording has not been built yet. This page will show a
            chronological record of all administrative actions once the feature
            is live.
          </p>
        </div>
      </section>
    </main>
  );
}
