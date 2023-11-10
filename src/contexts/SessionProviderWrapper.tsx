"use client";

import { marketProduct } from "@/functions/client/market";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";

export type setMarketT = React.Dispatch<React.SetStateAction<marketProduct[]>>;

export default function SessionProviderWrapper({
  session,
  children,
}: {
  session: Session | undefined | null;
  children: React.ReactNode;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

// * SessionProviderWrapper have not called on the highest layout
// * Cause it makes all pages to render on request
// * It is only called on specific pages
