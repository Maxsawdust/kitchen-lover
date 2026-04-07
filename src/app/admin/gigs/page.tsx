import Link from "next/link";
import { getAllGigs } from "@/lib/db";
import GigTable from "./GigTable";

export default function AdminGigsPage() {
  const gigs = getAllGigs();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/admin/dashboard"
            className="text-xs text-[#888] hover:text-white transition-colors uppercase tracking-widest"
          >
            ← Dashboard
          </Link>
          <h2 className="text-3xl font-[oswald] uppercase tracking-widest text-white mt-2">
            Gig List
          </h2>
          <p className="text-[#888] text-sm mt-1">
            {gigs.length} {gigs.length === 1 ? "show" : "shows"} in the database
          </p>
        </div>

        <Link
          href="/admin/gigs/new"
          className="bg-[#710711] hover:bg-[#9a0a17] text-white px-5 py-2.5 rounded font-semibold uppercase tracking-wider text-sm transition-colors"
        >
          + Add Gig
        </Link>
      </div>

      <GigTable gigs={gigs} />
    </div>
  );
}
