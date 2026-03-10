import { ApolloServer } from "@apollo/server";
import { startServerAndCreateCloudflareWorkersHandler } from "@as-integrations/cloudflare-workers";
import { createDb } from "./db";
import { typeDefs, resolvers, GraphQLContext } from "./graphql";

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
}

const corsHeaders = (request: Request) => {
  const origin = request.headers.get("Origin");
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
};

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateCloudflareWorkersHandler<Env, GraphQLContext>(server, {
  context: async ({ env }) => {
    const db = createDb(env.DB);
    return { db };
  },
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request),
      });
    }

    const response = await handler(request, env, ctx);
    const headers = new Headers(response.headers);
    const cors = corsHeaders(request);
    for (const [key, value] of Object.entries(cors)) {
      headers.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
