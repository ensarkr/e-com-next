"use client";

import { signIn } from "next-auth/react";
import styles from "../form.module.css";
import { CustomButton, ReturnButton } from "@/components/buttons/Buttons";
import { TextInput } from "@/components/textInput/TextInput";
import { useSnackbar } from "@/contexts/SnackbarContextProvider";
import { useRouter } from "next/navigation";

export default function SignInClient() {
  const router = useRouter();

  const informUser = useSnackbar();

  const submitHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await signIn("credentials", {
      username: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (response && response.ok) {
      router.push("/");
      informUser("success", "Successfully signed in.");
    } else {
      informUser("error", "Email or password is wrong.");
    }
  };

  return (
    <>
      <main className={styles.mainPart}>
        <form className={styles.mainForm} onSubmit={submitHandle}>
          <h1 className={styles.mainFormTitle}>SIGN IN</h1>

          <div className={styles.leanLeft}>
            <ReturnButton></ReturnButton>
          </div>

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

          <div className={styles.leanRight}>
            <CustomButton title="sign in" type="submit"></CustomButton>
          </div>
        </form>
      </main>
    </>
  );
}
