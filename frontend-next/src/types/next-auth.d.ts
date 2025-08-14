import type { DefaultSession } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role: "user" | "admin";
    emailVerified?: Date | null;
  }

  interface Session extends DefaultSession {
    user:
      | (DefaultSession["user"] & {
          id: string;
          role: "user" | "admin";
        })
      | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    authUser?: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      role: "user" | "admin";
    };
  }
}
