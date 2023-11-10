"use client";

import { ReturnButton, CustomButton } from "@/components/buttons/Buttons";
import { TextInput } from "@/components/textInput/TextInput";
import { useSnackbar } from "@/contexts/SnackbarContextProvider";
import { useRouter } from "next/navigation";
import styles from "../form.module.css";
import useCSRF from "@/hooks/useCSRF";
import { signUpResponse } from "@/app/api/auth/signUp/route";

export default function SignUpClient() {
  const router = useRouter();

  const informUser = useSnackbar();

  const hashedCSRFTokenHeader = useCSRF();

  const submitHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (formData.get("password") !== formData.get("rePassword")) {
      informUser("default", "Passwords do not match.");
      return;
    }

    const response: signUpResponse = await (
      await fetch("/api/auth/signUp", {
        method: "POST",
        headers: { ...hashedCSRFTokenHeader },
        body: formData,
      })
    )
      .json()
      .catch((e) => informUser("error", "Error occurred while fetching."));

    if (response.status) {
      informUser("success", "User successfully created.");
      router.push("/signIn");
    } else {
      informUser("error", response.message);
    }
  };

  return (
    <>
      <main className={styles.mainPart}>
        <form className={styles.mainForm} onSubmit={submitHandle}>
          <h1 className={styles.mainFormTitle}>SIGN UP</h1>

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
          ></TextInput>

          <TextInput
            label="email"
            name="email"
            type="email"
            required={true}
            marginTop="1rem"
            marginBottom="1rem"
          ></TextInput>

          <TextInput
            label="password"
            name="password"
            type="password"
            required={true}
            marginTop="1rem"
            marginBottom="1rem"
          ></TextInput>

          <TextInput
            label="repeat password"
            name="rePassword"
            type="password"
            required={true}
            marginTop="1rem"
            marginBottom="1rem"
          ></TextInput>

          <TextInput
            label="country"
            name="country"
            type="text"
            required={true}
            marginTop="1rem"
            marginBottom="1rem"
          ></TextInput>

          <TextInput
            label="city"
            name="city"
            type="text"
            required={true}
            marginTop="1rem"
            marginBottom="1rem"
          ></TextInput>

          <TextInput
            label="address"
            name="address"
            type="text"
            required={true}
            marginTop="1rem"
            marginBottom="1rem"
          ></TextInput>

          <div className={styles.leanRight}>
            <CustomButton title="sign up" type="submit"></CustomButton>
          </div>
        </form>
      </main>
    </>
  );
}
