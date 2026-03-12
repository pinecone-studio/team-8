import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Local backend (D1 with seed) = http://localhost:8787. Remote = team8-api. Set NEXT_PUBLIC_GRAPHQL_URL in .env to choose.
export const graphqlUri =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8787"
    : "https://team8-api.team8pinequest.workers.dev/");

const httpLink = new HttpLink({ uri: graphqlUri });

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
