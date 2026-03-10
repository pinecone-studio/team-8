export interface AccessPreviewResponse {
  summary: {
    total: number;
    employees: number;
    hr: number;
    finance: number;
  };
  featuredAccounts: Array<{
    employeeId: string;
    email: string;
    name: string;
    department: string;
    role: "employee" | "hr_admin" | "finance_manager";
  }>;
}

function getWorkerPreviewUrl() {
  const explicitUrl = process.env.WORKER_PREVIEW_URL?.trim();

  if (explicitUrl) {
    return explicitUrl;
  }

  const graphQlUrl = process.env.WORKER_GRAPHQL_URL?.trim();

  if (graphQlUrl?.endsWith("/graphql")) {
    return `${graphQlUrl.slice(0, -"/graphql".length)}/auth/preview`;
  }

  return "http://localhost:8787/auth/preview";
}

export async function loadAccessPreview() {
  const response = await fetch(getWorkerPreviewUrl(), {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Access preview request failed with ${response.status}`);
  }

  const payload = (await response.json()) as { ok?: boolean } & AccessPreviewResponse;

  if (!payload.ok) {
    throw new Error("Access preview returned an invalid payload.");
  }

  return payload;
}
