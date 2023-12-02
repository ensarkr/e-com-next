import { NextRequest, NextResponse } from "next/server";
import { sql, createClient } from "@vercel/postgres";
import bcrypt from "bcrypt";
import format from "pg-format";

export async function GET(req: NextRequest, res: NextResponse) {
  return new NextResponse("TEST", {
    status: 200,
  });
}
