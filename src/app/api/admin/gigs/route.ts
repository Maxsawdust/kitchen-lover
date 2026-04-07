import { NextRequest, NextResponse } from "next/server";
import { getAllGigs, createGig } from "@/lib/db";
import { verifyJwt, getTokenFromRequest } from "@/lib/auth";

async function requireAuth(request: NextRequest): Promise<boolean> {
  const token = getTokenFromRequest(request);
  if (!token) return false;
  const payload = await verifyJwt(token);
  return payload !== null;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getAllGigs());
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { date?: string; title?: string; location?: string; link?: string; promo?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { date, title = "", location, link = "", promo = "" } = body;

  if (!date || !location) {
    return NextResponse.json({ error: "date and location are required" }, { status: 400 });
  }

  const gig = await createGig({ date, title, location, link, promo });
  return NextResponse.json(gig, { status: 201 });
}
