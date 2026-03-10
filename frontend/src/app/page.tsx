"use client";

import { useGetEmployeesQuery } from "@/graphql/generated/graphql";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";

const GET_BENEFIT_ELIGIBILITY = gql`
  query GetBenefitEligibility($employeeId: String!, $requestedUnits: Int) {
    getBenefitEligibility(employeeId: $employeeId, requestedUnits: $requestedUnits) {
      benefit {
        id
        name
        category
        subsidyPercent
        isCore
      }
      status
      blockingMessages
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useGetEmployeesQuery();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [requestedUnits, setRequestedUnits] = useState<number>(1);

  useEffect(() => {
    if (!selectedEmployeeId && data?.getEmployees?.length) {
      setSelectedEmployeeId(data.getEmployees[0].id);
    }
  }, [data, selectedEmployeeId]);

  const selectedEmployee = useMemo(() => {
    return data?.getEmployees?.find((emp) => emp.id === selectedEmployeeId);
  }, [data, selectedEmployeeId]);

  const {
    loading: eligibilityLoading,
    error: eligibilityError,
    data: eligibilityData,
  } = useQuery(GET_BENEFIT_ELIGIBILITY, {
    variables: {
      employeeId: selectedEmployeeId,
      requestedUnits,
    },
    skip: !selectedEmployeeId,
  });

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}
      >
        Team 8
      </h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Employees</h2>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

        {data?.getEmployees && (
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {data.getEmployees.map((emp) => (
              <li
                key={emp.id}
                style={{
                  padding: "1rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
              >
                <p style={{ fontWeight: 600 }}>{emp.name}</p>
                {emp.nameEng && (
                  <p style={{ color: "#374151", fontSize: "0.875rem" }}>
                    {emp.nameEng}
                  </p>
                )}
                <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                  {emp.email}
                </p>
                <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                  {emp.role} &middot; {emp.department} &middot;{" "}
                  {emp.employmentStatus}
                </p>
              </li>
            ))}
          </ul>
        )}

        {data?.getEmployees?.length === 0 && (
          <p style={{ color: "#6b7280" }}>
            No employees found. Create one via the GraphQL API.
          </p>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
          Benefit Eligibility
        </h2>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          <label style={{ fontWeight: 600 }}>Employee</label>
          <select
            value={selectedEmployeeId}
            onChange={(event) => setSelectedEmployeeId(event.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              minWidth: "240px",
            }}
          >
            {data?.getEmployees?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.role})
              </option>
            ))}
          </select>

          <label style={{ fontWeight: 600 }}>Requested Units</label>
          <input
            type="number"
            min={1}
            value={requestedUnits}
            onChange={(event) =>
              setRequestedUnits(Number(event.target.value || 1))
            }
            style={{
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              width: "120px",
            }}
          />
        </div>

        {selectedEmployee && (
          <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
            {selectedEmployee.name} · {selectedEmployee.role} ·{" "}
            {selectedEmployee.employmentStatus}
          </p>
        )}

        {eligibilityLoading && <p>Loading eligibility...</p>}
        {eligibilityError && (
          <p style={{ color: "red" }}>Error: {eligibilityError.message}</p>
        )}

        {eligibilityData?.getBenefitEligibility && (
          <ul
            style={{
              listStyle: "none",
              display: "grid",
              gap: "0.75rem",
              padding: 0,
            }}
          >
            {(
              eligibilityData.getBenefitEligibility as Array<{
                benefit: {
                  id: string;
                  name: string;
                  category: string;
                  subsidyPercent: number;
                  isCore: number;
                };
                status: string;
                blockingMessages: string[];
              }>
            ).map((item) => (
              <li
                key={item.benefit.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  padding: "1rem",
                  background:
                    item.status === "eligible"
                      ? "#ecfdf3"
                      : item.status === "requires_approval"
                        ? "#fff7ed"
                        : "#fef2f2",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600 }}>{item.benefit.name}</p>
                    <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                      {item.benefit.category} · Subsidy{" "}
                      {item.benefit.subsidyPercent}%{" "}
                      {item.benefit.isCore ? "· Core" : ""}
                    </p>
                  </div>
                  <span
                    style={{
                      fontWeight: 600,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                {item.blockingMessages?.length > 0 && (
                  <div style={{ marginTop: "0.75rem", color: "#991b1b" }}>
                    {item.blockingMessages.map((msg: string, idx: number) => (
                      <p key={`${item.benefit.id}-msg-${idx}`}>{msg}</p>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
