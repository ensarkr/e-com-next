import { fetchUserData, user, userPartial } from "@/functions/server/database";
import EditProfileClient from "./client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import SessionProviderWrapper from "@/contexts/SessionProviderWrapper";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MODA - EDIT PROFILE",
};

export default async function EditProfile() {
  // * Pre-renders on request
  // * It populates form with fetched userData on request

  const session = await getServerSession(authOptions);

  let userData: undefined | userPartial = undefined;

  if (
    session !== null &&
    session.user?.email !== undefined &&
    session.user?.email !== null
  ) {
    const getUserDataResponse = await fetchUserData(session.user.email);

    if (getUserDataResponse.status) userData = getUserDataResponse.value;
  }

  return (
    <SessionProviderWrapper session={session}>
      <EditProfileClient userData={userData}></EditProfileClient>
    </SessionProviderWrapper>
  );
}
