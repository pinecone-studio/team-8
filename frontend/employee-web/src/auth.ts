import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const allowedRoles = new Set(["employee", "hr_admin", "finance_manager"]);
const adminRoles = new Set(["hr_admin", "finance_manager"]);
const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;
const cookieDomain = process.env.NEXTAUTH_COOKIE_DOMAIN?.trim() || undefined;
const cookiePrefix = process.env.NEXTAUTH_COOKIE_PREFIX?.trim() || "ebms";
const sharedCookieOptions = {
  sameSite: "lax" as const,
  path: "/",
  secure: useSecureCookies,
  ...(cookieDomain ? { domain: cookieDomain } : {})
};

export function isAdminRole(role: string | null | undefined): boolean {
  return typeof role === "string" && adminRoles.has(role);
}

function getWorkerAuthUrl() {
  const explicitUrl = process.env.WORKER_AUTH_URL?.trim();

  if (explicitUrl) {
    return explicitUrl;
  }

  const graphQlUrl = process.env.WORKER_GRAPHQL_URL?.trim();

  if (graphQlUrl?.endsWith("/graphql")) {
    return `${graphQlUrl.slice(0, -"/graphql".length)}/auth/login`;
  }

  return "http://localhost:8787/auth/login";
}

async function authenticateAgainstWorker(input: { email: string; password: string }) {
  const response = await fetch(getWorkerAuthUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(input),
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
      workerToken: string;
    };
  };

  return payload.user ?? null;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  cookies: {
    sessionToken: {
      name: useSecureCookies ? `__Secure-${cookiePrefix}.session-token` : `${cookiePrefix}.session-token`,
      options: {
        httpOnly: true,
        ...sharedCookieOptions
      }
    },
    callbackUrl: {
      name: useSecureCookies ? `__Secure-${cookiePrefix}.callback-url` : `${cookiePrefix}.callback-url`,
      options: {
        ...sharedCookieOptions
      }
    },
    csrfToken: {
      name:
        useSecureCookies && !cookieDomain
          ? `__Host-${cookiePrefix}.csrf-token`
          : useSecureCookies
            ? `__Secure-${cookiePrefix}.csrf-token`
            : `${cookiePrefix}.csrf-token`,
      options: {
        httpOnly: true,
        ...sharedCookieOptions
      }
    }
  },
  pages: {
    signIn: "/"
  },
  providers: [
    CredentialsProvider({
      name: "Company Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password ?? "";

        if (!email || !password) {
          return null;
        }

        const user = await authenticateAgainstWorker({
          email,
          password
        });

        if (!user || !allowedRoles.has(user.role)) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          workerToken: user.workerToken
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = typeof user.role === "string" ? user.role : "employee";
        token.workerToken = typeof user.workerToken === "string" ? user.workerToken : "";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = typeof token.role === "string" ? token.role : "employee";
      }

      session.workerToken = typeof token.workerToken === "string" ? token.workerToken : "";
      return session;
    }
  }
};
