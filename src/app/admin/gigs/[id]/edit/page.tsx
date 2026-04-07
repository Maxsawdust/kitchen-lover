import Link from "next/link";
import { notFound } from "next/navigation";
import { getGigById } from "@/lib/db";
import GigForm from "../../GigForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditGigPage({ params }: Props) {
  const { id } = await params;
  const gig = await getGigById(Number(id));

  if (!gig) notFound();

  return (
    <div className="max-w-xl">
      <Link
        href="/admin/gigs"
        className="text-xs text-[#888] hover:text-white transition-colors uppercase tracking-widest"
      >
        ← Back to Gigs
      </Link>

      <h2 className="text-3xl font-[oswald] uppercase tracking-widest text-white mt-2 mb-2">
        Edit Gig
      </h2>
      <p className="text-[#888] text-sm mb-8">
        {gig.date} — {gig.location}
      </p>

      <GigForm gig={gig} />
    </div>
  );
}
