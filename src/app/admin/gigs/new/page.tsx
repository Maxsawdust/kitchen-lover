import Link from "next/link";
import GigForm from "../GigForm";

export default function NewGigPage() {
  return (
    <div className="max-w-xl">
      <Link
        href="/admin/gigs"
        className="text-xs text-[#888] hover:text-white transition-colors uppercase tracking-widest"
      >
        ← Back to Gigs
      </Link>

      <h2 className="text-3xl font-[oswald] uppercase tracking-widest text-white mt-2 mb-8">
        Add New Gig
      </h2>

      <GigForm />
    </div>
  );
}
