import { Metadata } from "next";
import SignUpClient from "./client";

export const metadata: Metadata = {
  title: "MODA - SIGN UP",
};

export default function SignUp() {
  // * Pre-renders on build time

  return <SignUpClient></SignUpClient>;
}
