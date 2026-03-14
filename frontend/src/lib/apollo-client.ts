import { HttpLink } from "@apollo/client";

export const graphqlUri =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GRAPHQL_URL) ||
  "https://team8-api.team8pinequest.workers.dev/";

export function createHttpLink() {
  return new HttpLink({ uri: graphqlUri });
}
