import { getAllGigs } from "@/lib/db";
import {
  MusicPromo,
  Landing,
  UpcomingShows,
  ShopButton,
} from "@/components";

export default function Home() {
  const gigs = getAllGigs();

  return (
    <>
      <ShopButton />

      <div className="flex-1">
        <Landing />

        <UpcomingShows gigs={gigs} />

        <MusicPromo />
      </div>
    </>
  );
}
