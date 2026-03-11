"use client";

// import { useGetEmployeesQuery } from "@/graphql/generated/graphql";

// export default function Home() {
//   const { loading, error, data } = useGetEmployeesQuery();

//   return (
//     <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
//       <h1
//         style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}
//       >
//         Team 8
//       </h1>

//       <section>
//         <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Employees</h2>

//         {loading && <p>Loading...</p>}
//         {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

//         {data?.getEmployees && (
//           <ul
//             style={{
//               listStyle: "none",
//               display: "flex",
//               flexDirection: "column",
//               gap: "0.75rem",
//             }}
//           >
//             {data.getEmployees.map((emp) => (
//               <li
//                 key={emp.id}
//                 style={{
//                   padding: "1rem",
//                   border: "1px solid #e5e7eb",
//                   borderRadius: "0.5rem",
//                 }}
//               >
//                 <p style={{ fontWeight: 600 }}>{emp.name}</p>
//                 {emp.nameEng && (
//                   <p style={{ color: "#374151", fontSize: "0.875rem" }}>
//                     {emp.nameEng}
//                   </p>
//                 )}
//                 <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
//                   {emp.email}
//                 </p>
//                 <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
//                   {emp.role} &middot; {emp.department} &middot;{" "}
//                   {emp.employmentStatus}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         )}

//         {data?.getEmployees?.length === 0 && (
//           <p style={{ color: "#6b7280" }}>
//             No employees found. Create one via the GraphQL API.
//           </p>
//         )}
//       </section>
//     </main>
//   );
// }

export default function Home() {
  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}
        className="bg-green-500 text-white p-4 rounded-lg animate__animated animate__bounce"
      >
        Team 8
      </h1>
    </main>
  );
}
