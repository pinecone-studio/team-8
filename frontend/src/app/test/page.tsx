"use client";

import {
  useGetEmployeesQuery,
  useGetBenefitsQuery,
  useGetMyBenefitsQuery,
} from "@/graphql/generated/graphql";
import Sidebar from "@/app/employee-panel/_components/SideBar";
import PageLoading from "@/app/_components/PageLoading";
import { graphqlUri } from "@/lib/apollo-client";
import { use, useState } from "react";

type PageProps = { params?: Promise<Record<string, string | string[]>> };

const statusColor: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800",
  ELIGIBLE: "bg-sky-100 text-sky-800",
  LOCKED: "bg-amber-100 text-amber-800",
  PENDING: "bg-violet-100 text-violet-800",
};

export default function TestPage({ params }: PageProps) {
  if (params) use(params);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const { data: employeesData, loading: employeesLoading, error: employeesError } = useGetEmployeesQuery({
    fetchPolicy: "network-only", // Өгөгдлийн сангаас бүх ажилчдыг шинээр татна
  });
  const { data: benefitsData, loading: benefitsLoading, error: benefitsError } = useGetBenefitsQuery();
  const { data: myBenefitsData, loading: myBenefitsLoading } = useGetMyBenefitsQuery({
    skip: !selectedEmployeeId,
  });

  const employees = employeesData?.getEmployees ?? [];
  const benefits = benefitsData?.benefits ?? [];
  const myBenefits = myBenefitsData?.myBenefits ?? [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col items-center">
        <main className="w-full max-w-7xl p-8">
          <h1 className="mb-4 text-xl font-semibold text-gray-900">
            Employee & Benefits Test
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            Ажилтан болон benefit-ийн тест өгөгдөл. Нэг ажилтан сонгоход тухайн ажилтны benefit eligibility харагдана.
          </p>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Employees */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Ажилчид (Employees)</h2>
              {!employeesLoading && !employeesError && employees.length > 0 && (
                <p className="mb-3 text-sm text-gray-500">Өгөгдлийн сан: бүгд {employees.length} ажилчин</p>
              )}
              {employeesLoading && <PageLoading inline message="Уншиж байна..." />}
              {employeesError && (
                <div className="rounded-lg bg-red-50 p-4 text-red-700">
                  <p className="font-medium">Алдаа: {employeesError.message}</p>
                  <p className="mt-2 text-sm">
                    Backend ({process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "GRAPHQL URL"}) ажиллаж байгаа эсэх, CORS зөв эсэхийг шалгана уу.
                  </p>
                </div>
              )}
              {!employeesLoading && !employeesError && (
                <ul className="space-y-2">
                  {employees.length === 0 ? (
                    <li className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
                      <p className="font-medium">Ажилтан олдсонгүй.</p>
                      <p className="mt-1 text-sm">
                        D1 database хоосон байна. Backend-д <code className="rounded bg-amber-100 px-1">wrangler d1 migrations apply team8 --local</code> ажиллуулсан эсэхээ шалгана уу (seed migration орсон бол ажилчид гарна).
                      </p>
                    </li>
                  ) : (
                    employees.map((emp) => (
                      <li key={emp.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedEmployeeId(emp.id)}
                          className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                            selectedEmployeeId === emp.id
                              ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                              : "border-gray-200 hover:bg-gray-50 active:scale-[0.99] active:bg-gray-100"
                          }`}
                        >
                          <span className="font-medium">{emp.name}</span>
                          {emp.nameEng && (
                            <span className="ml-2 text-gray-500">({emp.nameEng})</span>
                          )}
                          <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                            {emp.role}
                          </span>
                          <span className="ml-2 text-xs text-gray-400">{emp.department}</span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </section>

            {/* All benefits */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Бүх benefit-ууд</h2>
              {benefitsLoading && <PageLoading inline message="Уншиж байна..." />}
              {benefitsError && (
                <div className="rounded-lg bg-red-50 p-4 text-red-700">
                  <p className="font-medium">Алдаа: {(benefitsError as Error).message}</p>
                  <p className="mt-2 text-sm">
                    Backend ({graphqlUri}) ажиллаж байгаа эсэх, CORS зөв эсэхийг шалгана уу.
                  </p>
                </div>
              )}
              {!benefitsLoading && !benefitsError && (
                <ul className="max-h-[400px] space-y-2 overflow-y-auto">
                  {benefits.length === 0 ? (
                    <li className="text-gray-500">Benefit олдсонгүй.</li>
                  ) : (
                    benefits.map((b) => (
                      <li
                        key={b.id}
                        className="rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-sm"
                      >
                        <span className="font-medium text-gray-900">{b.name}</span>
                        <span className="ml-2 text-gray-500">{b.category}</span>
                        <span className="ml-2 text-xs text-gray-400">
                          Company {b.subsidyPercent}% / Employee {b.employeePercent}%
                        </span>
                        {b.flowType && (
                          <span className="ml-2 rounded bg-gray-200 px-1.5 py-0.5 text-xs">
                            {b.flowType}
                          </span>
                        )}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </section>
          </div>

          {/* My benefits for selected employee */}
          {selectedEmployeeId && (
            <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Сонгосон ажилтны benefit eligibility (My Benefits)
              </h2>
              {myBenefitsLoading && <PageLoading inline message="Уншиж байна..." />}
              {!myBenefitsLoading && (
                <ul className="space-y-3">
                  {myBenefits.length === 0 ? (
                    <li className="text-gray-500">Энэ ажилтанд benefit тооцоогүй эсвэл олдсонгүй.</li>
                  ) : (
                    myBenefits.map((item) => (
                      <li
                        key={item.benefitId}
                        className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 p-4"
                      >
                        <span className="font-medium text-gray-900">{item.benefit.name}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            statusColor[item.status] ?? "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {item.status}
                        </span>
                        {item.benefit.flowType === "self_service" && item.benefit.optionsDescription && (
                          <span className="text-sm text-gray-600">
                            — {item.benefit.optionsDescription}
                          </span>
                        )}
                        {item.failedRule && (
                          <span className="w-full text-xs text-amber-700">
                            {item.failedRule.errorMessage}
                          </span>
                        )}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
