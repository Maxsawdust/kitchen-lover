import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt, getTokenFromRequest } from "@/lib/auth";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Allow the login page through so users can actually authenticate.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const payload = await verifyJwt(token);

  if (!payload) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Forward the user id to downstream server components / route handlers.
  const response = NextResponse.next();
  response.headers.set("x-user-id", String(payload.userId));
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
