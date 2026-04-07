import { NextResponse } from "next/server";
import { getAllGigs } from "@/lib/db";

export function GET(): NextResponse {
  const gigs = getAllGigs();
  return NextResponse.json(gigs);
}
