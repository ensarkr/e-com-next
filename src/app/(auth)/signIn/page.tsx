import { Metadata } from "next";
import SignInClient from "./client";

export const metadata: Metadata = {
  title: "MODA - SIGN IN",
};

// * I tried to make RSC with normal html forms by abiding next-auth documentation
// * But next-auth api endpoint /api/auth/callback/credentials did not work properly
// * I do not know if it caused by app router or something else
// * Therefore I had to use signIn method that comes from next-auth which needs interactivity

export default function SignIn() {
  // * Pre-renders on build time

  return <SignInClient></SignInClient>;
}
