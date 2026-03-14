import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

export const graphqlUri =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GRAPHQL_URL) ||
  "https://team8-api.team8pinequest.workers.dev/";

// Global auth token getter — set by ApolloWrapper using Clerk's getToken
let _authTokenGetter: (() => Promise<string | null>) | null = null;
let _employeeEmailGetter: (() => string | null) | null = null;

export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  _authTokenGetter = getter;
}

export function setEmployeeEmailGetter(getter: () => string | null) {
  _employeeEmailGetter = getter;
}

const authLink = setContext(async (_, { headers }) => {
  const token = _authTokenGetter ? await _authTokenGetter() : null;
  const email = _employeeEmailGetter ? _employeeEmailGetter() : null;
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(email ? { "X-Employee-Email": email } : {}),
    },
  };
});

const httpLink = new HttpLink({ uri: graphqlUri });

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
