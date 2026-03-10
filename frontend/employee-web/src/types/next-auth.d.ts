import type { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    workerToken: string;
    user: DefaultSession["user"] & {
      id: string;
      role: string;
    };
  }

  interface User {
    role: string;
    workerToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    workerToken?: string;
  }
}
