import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: "admin" | "manager" | "viewer";
    tenantId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "manager" | "viewer";
    tenantId?: string;
  }
}
