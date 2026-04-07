import kitchenAlbum from "@/assets/images/kitchen_album.jpg";
import Image from "next/image";
import { FaSpotify, FaAmazon } from "react-icons/fa";
import { SiApplemusic, SiYoutubemusic } from "react-icons/si";

export default function PromoImages() {
  return (
    <div className="flex flex-col items-center gap-0 w-56">

      {/* Album cover */}
      <Image
        src={kitchenAlbum}
        alt="The Circus Sideshow Dream album cover"
        width={224}
        height={224}
        className="w-56 h-56 object-cover"
      />

      {/* Info card sits flush below the cover */}
      <div className="w-56 py-4 px-3 flex flex-col gap-3 items-center bg-white text-black">
        <a
          href="https://kitchenlover.bandcamp.com/album/the-circus-sideshow-dream"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white bg-black rounded-md px-3 py-1.5 text-sm w-full text-center"
        >
          BUY THE ALBUM
        </a>

        <p className="text-xs font-semibold uppercase tracking-wider text-black/60">
          Stream
        </p>

        <div className="flex gap-4">
          <a href="https://open.spotify.com/album/2jA2m6rRhYZ4Pqq76fikAj" target="_blank" rel="noopener noreferrer" aria-label="Spotify">
            <FaSpotify size={26} />
          </a>
          <a href="https://music.apple.com/us/album/the-circus-sideshow-dream/1843353656" target="_blank" rel="noopener noreferrer" aria-label="Apple Music">
            <SiApplemusic size={26} />
          </a>
          <a href="https://music.amazon.co.uk/albums/B0FTG343NJ" target="_blank" rel="noopener noreferrer" aria-label="Amazon Music">
            <FaAmazon size={26} />
          </a>
          <a href="https://music.youtube.com/playlist?list=OLAK5uy_kLtvlvrjXIZSNgcm_aDMjMPQt33Miyz6o" target="_blank" rel="noopener noreferrer" aria-label="YouTube Music">
            <SiYoutubemusic size={26} />
          </a>
        </div>
      </div>

    </div>
  );
}
