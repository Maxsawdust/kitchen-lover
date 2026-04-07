"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Gig } from "@/lib/db";

export default function GigTable({ gigs }: { gigs: Gig[] }) {
  const router = useRouter();

  async function handleDelete(id: number, label: string) {
    if (!window.confirm(`Delete "${label || "this gig"}"? This cannot be undone.`)) return;

    const res = await fetch(`/api/admin/gigs/${id}`, { method: "DELETE" });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete gig. Please try again.");
    }
  }

  if (gigs.length === 0) {
    return (
      <p className="text-[#888] text-center py-16">
        No gigs yet.{" "}
        <Link href="/admin/gigs/new" className="text-[#f1b5db] hover:underline">
          Add one.
        </Link>
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[#3a3a3a]">
      <table className="w-full text-sm text-left">
        <thead className="bg-[#2a2a2a] text-[#aaa] uppercase text-xs tracking-widest">
          <tr>
            <th className="px-4 py-3 whitespace-nowrap">Date</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Promo</th>
            <th className="px-4 py-3">Link</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a]">
          {gigs.map((gig) => (
            <tr key={gig.id} className="bg-[#1e1e1e] hover:bg-[#242424] transition-colors">
              <td className="px-4 py-3 whitespace-nowrap font-mono text-[#f5e85e]">{gig.date}</td>
              <td className="px-4 py-3 text-white max-w-[220px]">
                <span className="line-clamp-2">{gig.title || <span className="text-[#666]">—</span>}</span>
              </td>
              <td className="px-4 py-3 text-[#ccc] max-w-[200px]">
                <span className="line-clamp-2">{gig.location}</span>
              </td>
              <td className="px-4 py-3">
                {gig.promo ? (
                  <span className="bg-[#710711] text-white px-2 py-0.5 rounded text-xs uppercase">
                    {gig.promo}
                  </span>
                ) : (
                  <span className="text-[#555]">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                {gig.link ? (
                  <a
                    href={gig.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f1b5db] hover:underline text-xs"
                  >
                    Link ↗
                  </a>
                ) : (
                  <span className="text-[#555]">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/gigs/${gig.id}/edit`}
                    className="px-3 py-1 text-xs bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] text-white rounded transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(gig.id, gig.title || gig.location)}
                    className="px-3 py-1 text-xs bg-[#3a0008] hover:bg-[#710711] border border-[#710711] text-white rounded transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
