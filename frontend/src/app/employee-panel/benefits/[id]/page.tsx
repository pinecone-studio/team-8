import Link from "next/link";
import { notFound } from "next/navigation";
import Topbar from "../../_components/layout/Topbar";

import StatusBadge from "../../_components/benefits/StatusBadge";
import Sidebar from "../../_components/SideBar";
import { benefits } from "@/lib/  mock-data";

export default async function BenefitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const benefit = benefits.find((b) => b.id === id);

  if (!benefit) return notFound();

  return (
    <div className="flex min-h-screen bg-[#f6f7f9]">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <Link
            href="/employee-panel/Dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Benefits
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    {benefit.name}
                  </h1>
                  <p className="mt-2 text-2xl text-gray-500">
                    {benefit.vendor}
                  </p>
                </div>

                <StatusBadge status={benefit.status} />
              </div>

              <p className="mt-6 text-xl leading-8 text-gray-600">
                {benefit.description}
              </p>

              <div className="my-8 h-px bg-gray-200" />

              <div className="grid grid-cols-2 gap-10">
                <div>
                  <p className="text-sm text-gray-500">Subsidy Percentage</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {benefit.subsidy}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Contract Required</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {benefit.contractRequired ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div className="my-8 h-px bg-gray-200" />

              <p className="text-base text-gray-500">
                {benefit.contractRequired
                  ? "This benefit requires contract acceptance before approval"
                  : "This benefit does not require contract acceptance before approval"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Eligibility Breakdown
              </h2>

              <div className="mt-6 space-y-5">
                {benefit.eligibility.map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <span
                      className={`mt-1 text-lg ${
                        item.met ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {item.met ? "✓" : "✕"}
                    </span>

                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                {benefit.status === "ELIGIBLE" && (
                  <Link
                    href={`/employee-panel/benefits/${benefit.id}/request`}
                    className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-base font-medium text-white hover:bg-blue-700"
                  >
                    Request Benefit
                  </Link>
                )}

                {benefit.status === "LOCKED" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                      You don&apos;t meet all eligibility requirements for this
                      benefit.
                    </div>

                    {benefit.lockMessage && (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                        {benefit.lockMessage}
                      </div>
                    )}
                  </div>
                )}

                {benefit.status === "ACTIVE" && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    This benefit is already active for you.
                  </div>
                )}

                {benefit.status === "PENDING" && (
                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
                    Your request for this benefit is currently pending approval.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
