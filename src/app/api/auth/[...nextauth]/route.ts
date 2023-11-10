import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import { fetchUser, fetchUser_ID } from "@/functions/server/database";
import authOptions from "./authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
