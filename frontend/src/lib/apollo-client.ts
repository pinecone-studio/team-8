import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const graphqlUri = "https://team8-api.team8pinequest.workers.dev/";

const httpLink = new HttpLink({ uri: graphqlUri });

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
