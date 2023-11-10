"use client";

import { getUserDataResponse } from "@/app/api/getUserData/route";
import { userPartial } from "@/functions/server/database";
import { doubleReturn } from "@/typings/globalTypes";
import { useEffect, useState } from "react";

export default function useFetchUserData() {
  // * fetches user data

  const [userData, setUserData] = useState<doubleReturn<userPartial>>({
    status: false,
    message: "not initiated",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch("/api/getUserData", { method: "GET" });
      const resJSON = (await res.json()) as getUserDataResponse;
      setUserData(
        resJSON.status
          ? { status: true, value: resJSON.value }
          : { status: false, message: "failed to retrieve" }
      );
    };

    fetchUserData();
  }, []);

  console.log(userData);

  return userData;
}
