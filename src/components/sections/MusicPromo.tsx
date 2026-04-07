import PromoImages from "../structural/PromoImages";
import kitchenAlbum from "@/assets/images/kitchen_album.jpg";

export default function MusicPromo() {
  return (
    <section
      className="w-full py-20 flex flex-col items-center music-promo relative overflow-hidden"
      style={{ "--promo-bg-image": `url(${kitchenAlbum.src})` } as React.CSSProperties}
    >
      <div className="w-full max-w-2xl px-6 mx-auto flex flex-col gap-16 md:flex-row md:items-center md:gap-12">

        {/* Text block */}
        <div className="flex-1 min-w-0">
          <p className="text-sm uppercase tracking-widest text-white/60 mb-2">Debut Album</p>
          <h1 className="font-[oswald] text-4xl md:text-6xl font-semibold uppercase tracking-widest leading-tight">
            The Circus<br />Sideshow Dream
          </h1>
          <h2 className="italic text-2xl md:text-3xl font-light opacity-80 mt-3">
            Out Now
          </h2>
        </div>

        {/* Album artwork + links */}
        <div className="shrink-0">
          <PromoImages />
        </div>

      </div>
    </section>
  );
}
