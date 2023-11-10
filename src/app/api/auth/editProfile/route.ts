import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import {
  removeCSRFToken,
  verifyDoubleSignedSubmit,
} from "@/functions/server/csrf";
import { cookies } from "next/headers";
import {
  createUser,
  doesUserExist,
  editUser,
  fetchUser,
  userPartial,
  user_FD,
  user_JWT,
} from "@/functions/server/database";
import {
  convertToObject,
  validateFalsify,
} from "@/functions/server/formDataValidation";
import { doubleReturn } from "@/typings/globalTypes";

export type editProfileResponse = doubleReturn<"success">;

export async function POST(req: NextRequest, res: NextResponse) {
  // * csrf and authorize protected route
  // * used for editing user profile expect password

  const verifyResult = verifyDoubleSignedSubmit(
    cookies().get("csrf_token_guest")?.value,
    req.headers.get("X-CSRF-HASHED-TOKEN-GUEST")
  );

  if (!verifyResult) {
    return new NextResponse(
      JSON.stringify({ status: false, message: "csrf token mismatch" }),
      { status: 400, headers: { ...removeCSRFToken() } }
    );
  }

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

  let formData;

  try {
    formData = await req.formData();
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ status: false, message: "no FormData" }),
      { status: 400 }
    );
  }

  if (
    !validateFalsify(formData, [
      "fullName",
      "email",
      "country",
      "city",
      "address",
    ])
  ) {
    return new NextResponse(
      JSON.stringify({ status: false, message: "empty input" }),
      { status: 400 }
    );
  }

  const formDataObject = convertToObject(formData) as userPartial;

  const editProfileResponse = await editUser(
    formDataObject,
    session.user.email
  );

  if (editProfileResponse.status) {
    return new NextResponse(
      JSON.stringify({
        status: true,
        value: "success",
      } as editProfileResponse),
      {
        status: 200,
      }
    );
  } else {
    return new NextResponse(
      JSON.stringify({ status: false, message: editProfileResponse.message }),
      { status: 400 }
    );
  }
}
