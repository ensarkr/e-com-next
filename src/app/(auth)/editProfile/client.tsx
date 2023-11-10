"use client";

import {
  ReturnButton,
  CustomButton,
  LinkButton,
} from "@/components/buttons/Buttons";
import { TextInput } from "@/components/textInput/TextInput";
import { useSnackbar } from "@/contexts/SnackbarContextProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "../form.module.css";
import useCSRF from "@/hooks/useCSRF";
import { userPartial } from "@/functions/server/database";
import { editProfileResponse } from "@/app/api/auth/editProfile/route";
import useClearClientCache from "@/hooks/useClearClientCache";

export default function EditProfileClient({
  userData,
}: {
  userData: undefined | userPartial;
}) {
  const router = useRouter();

  const informUser = useSnackbar();

  const hashedCSRFTokenHeader = useCSRF();

  const { update } = useSession();

  useClearClientCache("EditProfile");

  useEffect(() => {
    if (userData === undefined) {
      informUser("error", "Error occurred while verifying user.");
      router.push("/");
    }
  }, []);

  const submitHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const response: editProfileResponse = await (
      await fetch("/api/auth/editProfile", {
        method: "POST",
        headers: { ...hashedCSRFTokenHeader },
        body: formData,
      })
    )
      .json()
      .catch((e) => {
        informUser("error", "Error occurred while fetching.");
      });

    if (response.status) {
      update();
      informUser("success", "Profile successfully saved.");
      router.push("/");
    } else {
      informUser("error", response.message);
    }
  };

  return (
    <>
      <main className={styles.mainPart}>
        <form className={styles.mainForm} onSubmit={submitHandle}>
          <h1 className={styles.mainFormTitle}>EDIT PROFILE</h1>

          <div className={styles.leanLeft}>
            <ReturnButton></ReturnButton>
          </div>
          <TextInput
            label="full name"
            name="fullName"
            type="text"
            required={true}
            marginTop="1rem"
            marginBottom="1rem"
            defaultValue={userData?.fullName}
          ></TextInput>

          <TextInput
            label="email"
            name="email"
            type="email"
            required={true}
            marginTop="1rem"
            marginBottom="1rem"
            defaultValue={userData?.email}
          ></TextInput>

          <TextInput
            label="country"
            name="country"
            type="text"
            required={true}
            marginTop="1rem"
            marginBottom="1rem"
            defaultValue={userData?.country}
          ></TextInput>

          <TextInput
            label="city"
            name="city"
            type="text"
            required={true}
            marginTop="1rem"
            marginBottom="1rem"
            defaultValue={userData?.city}
          ></TextInput>

          <TextInput
            label="address"
            name="address"
            type="text"
            required={true}
            marginTop="1rem"
            marginBottom="1rem"
            defaultValue={userData?.address}
          ></TextInput>

          <div className={styles.leanRight}>
            <LinkButton title="edit password" href="/editPassword"></LinkButton>
            <CustomButton title="save" type="submit"></CustomButton>
          </div>
        </form>
      </main>
    </>
  );
}
