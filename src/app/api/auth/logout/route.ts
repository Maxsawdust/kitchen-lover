import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export function POST(request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  clearAuthCookie(response);
  return response;
}
