import { getAllGigs } from "@/lib/db";

export const dynamic = "force-dynamic";
import {
  MusicPromo,
  Landing,
  UpcomingShows,
  ShopButton,
} from "@/components";

export default async function Home() {
  const gigs = await getAllGigs();

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
