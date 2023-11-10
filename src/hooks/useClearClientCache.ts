"use client";

import { testLocalStorage } from "@/functions/client/localStorage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// ! Link must be used with prefetch false
// * next js caches pages on the client for 30 secondes even if its dynamically rendered on request
// * to overcome this hook clears the route cache if last time that user came to this page less than 30 secondes
// * which re-fetches the page
// ! sometimes it still does not work

export default function useClearClientCache(pageName: string) {
  const router = useRouter();

  useEffect(() => {
    if (!testLocalStorage()) {
      router.refresh();
    } else {
      const lastAccessed = localStorage.getItem("lastAccessed" + pageName);

      if (lastAccessed !== null) {
        const timeBetween = (Date.now() - JSON.parse(lastAccessed)) as number;

        if (timeBetween < 30000) {
          router.refresh();
        }
      } else {
        router.refresh();
      }

      localStorage.setItem(
        "lastAccessed" + pageName,
        JSON.stringify(Date.now())
      );
    }
  }, []);
}
