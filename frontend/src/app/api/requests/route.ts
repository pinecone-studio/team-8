import { auth } from "@clerk/nextjs/server";

const REQUESTS_QUERY = `
  query GetBenefitRequests {
    benefitRequests {
      id
      employeeId
      benefitId
      status
      contractVersionAccepted
      contractAcceptedAt
      reviewedBy
      requestedAmount
      repaymentMonths
      employeeApprovedAt
      declineReason
      employeeContractKey
      createdAt
    }
  }
`;

function getGraphqlUrl(): string {
  return (
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    "https://team8-api.team8pinequest.workers.dev/"
  );
}

export async function GET(): Promise<Response> {
  const authState = await auth();
  const sessionToken = await authState.getToken();

  if (!authState.userId || !sessionToken) {
    return Response.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const upstream = await fetch(getGraphqlUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({
      query: REQUESTS_QUERY,
    }),
    cache: "no-store",
  });

  let json:
    | {
        data?: { benefitRequests?: unknown[] };
        errors?: Array<{ message?: string }>;
      }
    | null = null;

  try {
    json = await upstream.json();
  } catch {
    return Response.json(
      { error: "Requests upstream did not return valid JSON." },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    return Response.json(
      {
        error:
          json?.errors?.[0]?.message ||
          "Failed to fetch requests from upstream.",
      },
      { status: upstream.status },
    );
  }

  if (json?.errors?.length) {
    return Response.json(
      { error: json.errors[0]?.message || "Failed to fetch requests." },
      { status: 500 },
    );
  }

  return Response.json({
    data: json?.data?.benefitRequests ?? [],
  });
}
