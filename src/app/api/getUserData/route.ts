import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { fetchUserData, userPartial } from "@/functions/server/database";
import { doubleReturn } from "@/typings/globalTypes";

export type getUserDataResponse = doubleReturn<userPartial>;

export async function GET(req: NextRequest, res: NextResponse) {
  // * authorize protected route
  // * used for getting user data expect its password

  const session = await getServerSession();

  if (
    session === null ||
    session.user?.email === undefined ||
    session.user?.email === null
  ) {
    return new NextResponse(
      JSON.stringify({ status: false, message: "unauthorized" }),
      { status: 403 }
    );
  }

  const userData = await fetchUserData(session.user.email);

  return new NextResponse(JSON.stringify({ status: true, value: userData }), {
    status: 200,
  });
}
