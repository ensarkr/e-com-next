"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./profilePart.module.css";
import { starScrolling, stopScrolling } from "@/functions/client/qualityOfLife";
import { getSession, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import closeIcon from "@/assets/bx-x.svg";
import Image from "next/image";
import { Session } from "next-auth";
import logOutIcon from "../../../assets/bx-log-out.svg";
import editIcon from "../../../assets/bx-edit.svg";
import logInIcon from "@/assets/bx-log-in.svg";
import newUserIcon from "@/assets/bxs-user-plus.svg";
import cargoIcon from "@/assets/bx-package.svg";
import { useSnackbar } from "@/contexts/SnackbarContextProvider";
import Skeleton from "@/components/skeleton/Skeleton";
import userIcon from "@/assets/bx-user-circle.svg";

export default function ProfilePart({
  buttonClassName,
}: {
  buttonClassName: string;
}) {
  const [showProfile, setShowProfile] = useState(false);
  const [session, setSession] = useState<Session | null | "loading">("loading");

  const openProfileSidebar = useCallback(() => {
    setShowProfile(true);
    stopScrolling();
  }, []);

  const closeProfileSidebar = useCallback(() => {
    setShowProfile(false);
    starScrolling();
  }, []);

  const informUser = useSnackbar();

  useEffect(() => {
    const fetchSession = async () => {
      setSession(await getSession());
    };

    // * it fetches user data every time user opens profileSidebar

    if (showProfile) {
      fetchSession();
    }
  }, [showProfile]);

  return (
    <>
      <button
        className={buttonClassName}
        onClick={() => {
          openProfileSidebar();
        }}
      >
        <Image src={userIcon} alt="" priority={true}></Image>
      </button>

      <div
        className={[styles.profile, showProfile ? styles.showProfile : ""].join(
          " "
        )}
      >
        <div className={styles.topPart}>
          <h3 className={styles.title}>PROFILE</h3>

          <button
            className={styles.profileButton}
            onClick={() => {
              closeProfileSidebar();
            }}
          >
            <Image src={closeIcon} alt="close button"></Image>
          </button>
        </div>

        <div className={styles.contentPart}>
          {session === "loading" ? (
            <>
              <Skeleton width="50px" height="1rem"></Skeleton>
              <Skeleton
                width="150px"
                height="1.2rem"
                marginLeft="1rem"
                marginBottom="1rem"
              ></Skeleton>
              <Skeleton width="50px" height="1rem"></Skeleton>
              <Skeleton
                width="150px"
                height="1.2rem"
                marginLeft="1rem"
                marginBottom="1rem"
              ></Skeleton>
              <hr></hr>
              <Skeleton width="100%" height="35px"></Skeleton>
              <hr></hr>
              <Skeleton width="100%" height="35px"></Skeleton>
              <hr></hr>
              <Skeleton width="100%" height="35px"></Skeleton>
              <hr></hr>
            </>
          ) : session !== null && session.user !== undefined ? (
            <>
              <h4 className={styles.contentTitle}>Name</h4>
              <p className={styles.contentSubTitle}> {session.user.name} </p>
              <h4 className={styles.contentTitle}>Email</h4>
              <p className={styles.contentSubTitle}> {session.user.email} </p>
              <hr></hr>
              <Link
                className={styles.wideButton}
                href="/orders"
                onClick={() => closeProfileSidebar()}
              >
                <Image src={cargoIcon} alt={""}></Image>
                orders
              </Link>
              <hr></hr>
              <Link
                className={styles.wideButton}
                href="/editProfile"
                prefetch={false}
                onClick={() => closeProfileSidebar()}
              >
                <Image src={editIcon} alt={""}></Image>
                edit profile
              </Link>
              <hr></hr>
              <button
                className={styles.wideButton}
                onClick={() => {
                  signOut({ redirect: false });
                  closeProfileSidebar();
                  informUser("success", "Successfully logged out");
                }}
              >
                <Image src={logOutIcon} alt={""}></Image>
                sign out
              </button>
              <hr></hr>
            </>
          ) : (
            <>
              <hr></hr>
              <Link
                className={styles.wideButton}
                href="/signIn"
                onClick={() => {
                  closeProfileSidebar();
                }}
              >
                <Image src={logInIcon} alt={""}></Image>
                sign in
              </Link>
              <hr></hr>

              <Link
                className={styles.wideButton}
                href="/signUp"
                onClick={() => {
                  closeProfileSidebar();
                }}
              >
                <Image src={newUserIcon} alt={""}></Image>
                sign up
              </Link>
              <hr></hr>
            </>
          )}
        </div>
      </div>

      {showProfile && (
        <div
          className={[styles.fullScreen].join(" ")}
          onClick={() => {
            closeProfileSidebar();
          }}
        ></div>
      )}
    </>
  );
}
