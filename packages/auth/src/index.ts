import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export { AuthError } from "next-auth";

const result = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        if (
          email === process.env.DEMO_USER_EMAIL &&
          password === process.env.DEMO_USER_PASSWORD
        ) {
          return { id: "1", email, name: "ViTAH Admin" };
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isAuthenticated = !!session?.user;
      const isLoginPage = nextUrl.pathname === "/";
      const isAuthApi = nextUrl.pathname.startsWith("/api/auth");

      if (isAuthApi) return true;

      if (isLoginPage) {
        if (isAuthenticated) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      return isAuthenticated;
    },
  },
});

export const handlers = result.handlers;
export const auth = result.auth;
export const signIn = result.signIn;
export const signOut = result.signOut;
