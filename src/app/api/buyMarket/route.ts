import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import {
  createDoubleCSRF,
  removeCSRFToken,
  verifyDoubleSignedSubmit,
} from "@/functions/server/csrf";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { doubleReturn } from "@/typings/globalTypes";
import { marketProduct } from "@/functions/client/market";
import { addBoughtProducts } from "@/functions/server/database";

export type buyMarketResponse = doubleReturn<{ itemCount: number }>;

export type buyMarketRequestBody = {
  market: marketProduct[];
  country: string;
  city: string;
  address: string;
};

export async function POST(req: NextRequest, res: NextResponse) {
  // * csrf and authorize protected route
  // * used for buying products which comes from request body
  // ! not from cookies

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

  const requestBody: buyMarketRequestBody = await req.json();

  const addBoughtProductsResponse = await addBoughtProducts(
    session.user.email,
    requestBody
  );

  if (addBoughtProductsResponse.status) {
    return new NextResponse(
      JSON.stringify({
        status: true,
        value: { ...addBoughtProductsResponse.value },
      }),
      { status: 200 }
    );
  } else {
    return new NextResponse(
      JSON.stringify({
        status: false,
        message: addBoughtProductsResponse.message,
      }),
      { status: 400 }
    );
  }
}
