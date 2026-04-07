import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByUsername } from "@/lib/db";
import { signJwt, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: { username?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  const user = getUserByUsername(username);

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signJwt({ userId: user.id, username: user.username });
  const response = NextResponse.json({ ok: true });
  setAuthCookie(response, token);

  return response;
}
