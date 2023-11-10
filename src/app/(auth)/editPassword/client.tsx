"use client";

import { ReturnButton, CustomButton } from "@/components/buttons/Buttons";
import { TextInput } from "@/components/textInput/TextInput";
import { useSnackbar } from "@/contexts/SnackbarContextProvider";
import { useRouter } from "next/navigation";
import styles from "../form.module.css";
import useCSRF from "@/hooks/useCSRF";
import { editPasswordResponse } from "@/app/api/auth/editPassword/route";

export default function EditPasswordClient() {
  const router = useRouter();

  const informUser = useSnackbar();

  const hashedCSRFTokenHeader = useCSRF();

  const submitHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (formData.get("newPassword") !== formData.get("reNewPassword")) {
      informUser("default", "New passwords do not match.");
      return;
    }

    const response: editPasswordResponse = await (
      await fetch("/api/auth/editPassword", {
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
      informUser("success", "Password successfully saved.");
      router.push("/");
    } else {
      informUser("error", response.message);
    }
  };

  return (
    <>
      <main className={styles.mainPart}>
        <form className={styles.mainForm} onSubmit={submitHandle}>
          <h1 className={styles.mainFormTitle}>EDIT PASSWORD</h1>

          <div className={styles.leanLeft}>
            <ReturnButton></ReturnButton>
          </div>

          <TextInput
            label="old password"
            name="oldPassword"
            type="password"
            required={true}
            marginTop="1rem"
            marginBottom="1rem"
          ></TextInput>

          <TextInput
            label="new password"
            name="newPassword"
            type="password"
            required={true}
            marginTop="1rem"
            marginBottom="1rem"
          ></TextInput>

          <TextInput
            label="repeat new password"
            name="reNewPassword"
            type="password"
            required={true}
            marginTop="1rem"
            marginBottom="1rem"
          ></TextInput>

          <div className={styles.leanRight}>
            <CustomButton title="save" type="submit"></CustomButton>
          </div>
        </form>
      </main>
    </>
  );
}
