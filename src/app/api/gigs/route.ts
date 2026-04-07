import { NextResponse } from "next/server";
import { getAllGigs } from "@/lib/db";

export async function GET(): Promise<NextResponse> {
  const gigs = await getAllGigs();
  return NextResponse.json(gigs);
}
