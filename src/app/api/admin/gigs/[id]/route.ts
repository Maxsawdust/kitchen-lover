import { NextRequest, NextResponse } from "next/server";
import { getGigById, updateGig, deleteGig } from "@/lib/db";
import { verifyJwt, getTokenFromRequest } from "@/lib/auth";

async function requireAuth(request: NextRequest): Promise<boolean> {
  const token = getTokenFromRequest(request);
  if (!token) return false;
  const payload = await verifyJwt(token);
  return payload !== null;
}

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: idStr } = await context.params;
  const id = Number(idStr);

  if (!getGigById(id)) {
    return NextResponse.json({ error: "Gig not found" }, { status: 404 });
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

  const updated = updateGig(id, { date, title, location, link, promo });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: idStr } = await context.params;
  const id = Number(idStr);

  if (!getGigById(id)) {
    return NextResponse.json({ error: "Gig not found" }, { status: 404 });
  }

  deleteGig(id);
  return NextResponse.json({ ok: true });
}
