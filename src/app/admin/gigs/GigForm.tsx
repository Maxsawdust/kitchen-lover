"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Gig } from "@/lib/db";

type GigFormProps = {
  /** When provided the form PUTs to update; otherwise POSTs to create */
  gig?: Gig;
};

export default function GigForm({ gig }: GigFormProps) {
  const router = useRouter();
  const isEditing = Boolean(gig);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement).value.trim();

    const payload = {
      date: getValue("date"),
      title: getValue("title"),
      location: getValue("location"),
      link: getValue("link"),
      promo: getValue("promo"),
    };

    try {
      const url = isEditing ? `/api/admin/gigs/${gig!.id}` : "/api/admin/gigs";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/gigs");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-6">
      {/* Date */}
      <Field
        id="date"
        label="Date"
        hint="Format: dd/mm/yy"
        required
        defaultValue={gig?.date}
      />

      {/* Title */}
      <Field
        id="title"
        label="Title"
        hint="Optional"
        defaultValue={gig?.title}
      />

      {/* Location */}
      <Field
        id="location"
        label="Location"
        hint="Required"
        required
        defaultValue={gig?.location}
      />

      {/* Ticket link */}
      <Field
        id="link"
        label="Ticket Link"
        hint="Optional"
        type="url"
        defaultValue={gig?.link}
      />

      {/* Promo */}
      <Field
        id="promo"
        label="Promo Badge"
        hint="Optional — e.g. free (shown as a badge next to the ticket button)"
        defaultValue={gig?.promo}
      />

      {error && (
        <p className="text-sm text-red-400 bg-red-950/40 border border-red-800 px-4 py-2 rounded">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#710711] hover:bg-[#9a0a17] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded font-semibold uppercase tracking-wider text-sm transition-colors cursor-pointer"
        >
          {loading ? "Saving…" : isEditing ? "Save Changes" : "Add Gig"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/gigs")}
          className="bg-transparent border border-[#444] hover:border-[#888] text-[#aaa] hover:text-white px-6 py-2.5 rounded font-semibold uppercase tracking-wider text-sm transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Shared field component — keeps the form DRY.
// ---------------------------------------------------------------------------
type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  type?: string;
  defaultValue?: string;
};

function Field({
  id,
  label,
  hint,
  required,
  type = "text",
  defaultValue,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm text-[#ccc] uppercase tracking-wider"
      >
        {label}
        {required && <span className="text-[#710711] ml-1">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="bg-[#2a2a2a] border border-[#444] text-white px-4 py-3 rounded focus:outline-none focus:border-[#710711] transition-colors placeholder:text-[#555]"
      />
      {hint && <p className="text-xs text-[#666]">{hint}</p>}
    </div>
  );
}
