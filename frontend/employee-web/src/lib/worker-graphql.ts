interface GraphQLErrorShape {
  message: string;
}

export async function workerGraphQL<TData>(input: {
  query: string;
  workerToken: string;
  variables?: Record<string, unknown>;
}): Promise<TData> {
  const endpoint = process.env.WORKER_GRAPHQL_URL?.trim() || "http://localhost:8787/graphql";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${input.workerToken}`
    },
    body: JSON.stringify({
      query: input.query,
      variables: input.variables ?? {}
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Worker GraphQL request failed with ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: TData;
    errors?: GraphQLErrorShape[];
  };

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(", "));
  }

  if (!payload.data) {
    throw new Error("Worker GraphQL returned no data.");
  }

  return payload.data;
}
