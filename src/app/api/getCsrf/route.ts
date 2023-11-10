import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createDoubleCSRF } from "@/functions/server/csrf";

export async function POST(req: NextRequest, res: NextResponse) {
  // * unprotected route
  // * used for getting csrf tokens for double submit cookie method

  const { CSRFToken: CSRFTokenGuest, hashedCSRFToken: hashedCSRFTokenGuest } =
    createDoubleCSRF();

  const CSRFExpirationSecond = 60 * 60; // * 1 hour

  // * returns hashed csrf as response body
  // * and csrf as cookie
  return Response.json(
    { hashedCSRFTokenGuest },
    {
      headers: {
        "Set-Cookie": `csrf_token_guest=${CSRFTokenGuest}; SameSite=strict; HttpOnly; Secure; Max-Age=${CSRFExpirationSecond}`,
      },
    }
  );
}
