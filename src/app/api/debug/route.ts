import { NextResponse } from "next/server";
import { createClient } from "@libsql/client/web";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  const info = {
    TURSO_DATABASE_URL: url ? `set (${url.length} chars, starts: ${url.slice(0, 20)}...)` : "NOT SET",
    TURSO_AUTH_TOKEN: token ? `set (${token.length} chars)` : "NOT SET",
    JWT_SECRET: process.env.JWT_SECRET ? "set" : "NOT SET",
    ADMIN_USERNAME: process.env.ADMIN_USERNAME ?? "NOT SET",
    connectionTest: null as string | null,
  };

  if (url && token) {
    try {
      const client = createClient({ url, authToken: token });
      await client.execute("SELECT 1");
      info.connectionTest = "OK";
    } catch (e: unknown) {
      info.connectionTest = String(e);
    }
  } else {
    info.connectionTest = "skipped — env vars missing";
  }

  return NextResponse.json(info);
}
