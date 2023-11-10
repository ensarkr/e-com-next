import { fetchUser, fetchUser_ID } from "@/functions/server/database";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  pages: {
    signIn: "/signIn",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        if (
          credentials === undefined ||
          credentials.password.trim().length === 0 ||
          credentials.username.trim().length === 0
        )
          return null;

        const user = await fetchUser(
          credentials.username,
          credentials.password
        );

        if (user.status) {
          return {
            id: user.value.id.toString(),
            email: user.value.email,
            name: user.value.fullName,
          };
        } else {
          console.log(user.message);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  callbacks: {
    jwt: async ({ token, user, account, session, profile, trigger }) => {
      if (trigger === "update") {
        // * updates JWT with subject property, which is primary key userId
        // * called from client after successful profile edit
        if (token.sub === undefined) return token;

        const user = await fetchUser_ID(token.sub);

        if (user.status) {
          return {
            ...token,
            name: user.value.fullName,
            email: user.value.email,
          };
        }
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} as NextAuthOptions;

export default authOptions;
