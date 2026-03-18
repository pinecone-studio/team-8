import { auth } from "@clerk/nextjs/server";

function getBackendOrigin(): string {
  const graphqlUrl =
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    "https://team8-api.team8pinequest.workers.dev/";
  return new URL(graphqlUrl).origin;
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const submissionId = url.searchParams.get("id");

  if (!submissionId) {
    return Response.json({ error: "Missing id." }, { status: 400 });
  }

  const authState = await auth();
  const sessionToken = await authState.getToken();
  if (!authState.userId || !sessionToken) {
    return Response.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const backendUrl = new URL("/screen-time/submission-view", getBackendOrigin());
  backendUrl.searchParams.set("id", submissionId);

  const upstream = await fetch(backendUrl.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
    cache: "no-store",
  });

  const headers = new Headers();
  for (const headerName of [
    "Content-Type",
    "Content-Disposition",
    "Cache-Control",
  ]) {
    const headerValue = upstream.headers.get(headerName);
    if (headerValue) headers.set(headerName, headerValue);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
