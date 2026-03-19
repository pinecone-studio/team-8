import { auth } from "@clerk/nextjs/server";

const BENEFITS_QUERY = `
  query GetBenefits {
    benefits {
      id
      name
      description
      nameEng
      category
      subsidyPercent
      employeePercent
      unitPrice
      vendorName
      requiresContract
      isActive
      flowType
      optionsDescription
      approvalPolicy
      amount
      location
      imageUrl
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
      query: BENEFITS_QUERY,
    }),
    cache: "no-store",
  });

  let json:
    | {
        data?: { benefits?: unknown[] };
        errors?: Array<{ message?: string }>;
      }
    | null = null;

  try {
    json = await upstream.json();
  } catch {
    return Response.json(
      { error: "Benefits upstream did not return valid JSON." },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    return Response.json(
      {
        error:
          json?.errors?.[0]?.message ||
          "Failed to fetch benefits from upstream.",
      },
      { status: upstream.status },
    );
  }

  if (json?.errors?.length) {
    return Response.json(
      { error: json.errors[0]?.message || "Failed to fetch benefits." },
      { status: 500 },
    );
  }

  return Response.json({
    data: json?.data?.benefits ?? [],
  });
}
