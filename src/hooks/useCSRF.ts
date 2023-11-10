"use client";

import { useEffect, useState } from "react";

export default function useCSRF() {
  // * fetches csrf tokens

  const [hashedCSRFToken, setHashedCSRFToken] = useState<string>("");

  useEffect(() => {
    const fetchCSRFToken = async () => {
      const res = await fetch("/api/getCsrf", { method: "POST" });
      const obj = await res.json();
      setHashedCSRFToken(obj.hashedCSRFTokenGuest);
    };

    fetchCSRFToken();
  }, []);

  return { "X-CSRF-HASHED-TOKEN-GUEST": hashedCSRFToken };
}
