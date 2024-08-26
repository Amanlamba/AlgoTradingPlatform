// app/api/tokens/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCachedSupportedTokens } from "@/app/lib/tokenCache";

export async function GET(req: NextRequest) {
  const supportedTokens = await getCachedSupportedTokens();

  return NextResponse.json({
    supportedTokens
  });
}

