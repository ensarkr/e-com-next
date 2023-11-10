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
  fetchUser,
  user_FD,
} from "@/functions/server/database";
import {
  convertToObject,
  validateFalsify,
} from "@/functions/server/formDataValidation";
import { doubleReturn } from "@/typings/globalTypes";

export type signUpResponse = doubleReturn<"user created">;

export async function POST(req: NextRequest, res: NextResponse) {
  // * csrf protected route
  // * used for creating new user

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
      "password",
      "rePassword",
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

  const formDataObject = convertToObject(formData) as user_FD;

  if (formDataObject.password !== formDataObject.rePassword) {
    return new NextResponse(
      JSON.stringify({ status: false, message: "password mismatch" }),
      { status: 400 }
    );
  }

  const doesUserExistResponse = await doesUserExist(formDataObject.email);

  if (doesUserExistResponse.status === false) {
    return new NextResponse(
      JSON.stringify({ status: false, message: doesUserExistResponse.message }),
      { status: 400 }
    );
  } else {
    if (doesUserExistResponse.value === true) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "email already exist",
        }),
        { status: 400 }
      );
    } else {
      const createUserResponse = await createUser(formDataObject);

      if (createUserResponse.status) {
        return new NextResponse(
          JSON.stringify({
            status: true,
            message: "user created",
          }),
          { status: 200 }
        );
      } else {
        return new NextResponse(
          JSON.stringify({
            status: false,
            message: createUserResponse.message,
          }),
          { status: 400 }
        );
      }
    }
  }
}
