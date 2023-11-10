import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SnackbarContextProvider from "@/contexts/SnackbarContextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  description: "Fully functioning e-commerce site.",
  icons: "/favicon.svg",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // * General layout that wraps everything
  // * Pre-rendered on build
  // * It wraps content with snackbar context

  return (
    <html lang="en">
      <body className={inter.className}>
        <SnackbarContextProvider>{children}</SnackbarContextProvider>
      </body>
    </html>
  );
}
