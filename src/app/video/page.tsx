import MusicVideoListing from "@/components/structural/MusicVideoListing";
import musicVideoArr from "@/utils/musicVideoArr";

export default function VideoPage() {
  return (
    <div className="flex-1 flex flex-col gap-10 items-center py-10 md:pt-20">
      <h1 className="text-5xl font-bold text-[#f5e85e]">Music Videos</h1>
      
      <span
        className="w-[95%] border-2 border-kitchen-red"
        role="separator"
      />
      
      <div
        className="grid grid-cols-1 mb-15 md:grid-cols-2 lg:grid-cols-3 gap-10 w-[95%] max-w-[1400px]"
        role="video-container"
      >
        {musicVideoArr.map((listing) => (
          <MusicVideoListing listing={listing} key={listing.title} />
        ))}
      </div>
    </div>
  );
}
