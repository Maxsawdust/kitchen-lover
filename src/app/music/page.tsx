import { MusicPromo, MusicSingleListing } from "@/components";
import musicSingleArr from "@/utils/musicSingleArr";

export default function page() {
  return (
    <>
      <div className="flex-1 flex flex-col gap-10 items-center md:pt-16">
        {/* DEBUT ALBUM blah blah */}
        <MusicPromo />

        <span
          className="w-[95%] border-2 border-kitchen-red"
          role="separator"
        />
        {/* each of da singlz release ordah*/}

        <div
          className="grid grid-cols-1 mb-15 md:grid-cols-2 lg:grid-cols-3 gap-10 w-[95%] max-w-[1400px]"
          role="single-container"
        >
          {musicSingleArr.map((listing) => (
            <MusicSingleListing listing={listing} key={listing.title} />
          ))}
        </div>
        {/* something similar to main page but with link to vidya */}
      </div>
    </>
  );
}
