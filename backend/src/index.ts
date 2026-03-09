import { ApolloServer } from "@apollo/server";
import { startServerAndCreateCloudflareWorkersHandler } from "@as-integrations/cloudflare-workers";
import { createDb } from "./db";
import { typeDefs, resolvers, GraphQLContext } from "./graphql";

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
}

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
    return handler(request, env, ctx);
  },
};
