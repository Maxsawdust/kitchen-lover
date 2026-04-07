import { TicketListing } from "@/components";
import type { Gig } from "@/lib/db";

export default function UpcomingShows({ gigs }: { gigs: Gig[] }) {
  return (
    <section className="w-full py-20 flex flex-col gap-12 items-center music-promo relative overflow-hidden">

      {/* Heading — staggered two-line style, constrained to content width */}
      <div className="w-full max-w-2xl px-6 mx-auto">
        <h1 className="font-[oswald] tracking-widest leading-none select-none">
          <span className="block text-5xl md:text-7xl text-white">UPCOMING</span>
          <span className="block text-5xl md:text-7xl text-kitchen-pink pl-6 md:pl-10">SHOWS</span>
        </h1>
      </div>

      {/* Gig list */}
      <ul className="w-full max-w-2xl px-6 mx-auto flex flex-col gap-5">
        {gigs.map((gig) => (
          <TicketListing
            date={gig.date}
            title={gig.title}
            location={gig.location}
            link={gig.link}
            promo={gig.promo}
            key={gig.id}
          />
        ))}
      </ul>

    </section>
  );
}
