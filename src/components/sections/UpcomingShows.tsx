import { TicketListing } from "@/components";

export default function UpcomingShows() {
  const headerText = "UPCOMING SHOWS".split(" ");

  const showDetails = [
    {
      date: "30/11/25",
      title: "Slack City - Vince & Jo Have A Radio Show",
      location: "Daltons, Brighton",
      link: "",
      promo: "FREE ON DOOR",
    },
    {
      date: "2/12/25",
      title: "Supporting Le Lamb",
      location: "The Prince Albert, Brighton",
      link: "https://gotobeat.com/gig/le-lamb-live-in-brighton-64",
      promo: "",
    },
    {
      date: "4/12/25",
      title: "Shameless Nights",
      location: "The Owl And Hitchhiker",
      link: "",
      promo: "FREE ON DOOR",
    },
    {
      date: "6/12/25",
      title: "Kitchen Lover Live At Calamity Tank",
      location: "Calamity Tank, Brighton",
      link: "",
      promo: "FREE ON DOOR",
    },
    {
      date: "8/12/25",
      title: "Acid Box Promotions - Supporting Alpaca",
      location: "The Oak, Brighton",
      link: "https://dice.fm/event/xeka9k-alpaca-kitchen-lover-8th-dec-the-oak-brighton-tickets",
      promo: "TICKETS (free)",
    },
    {
      date: "17/12/25",
      title: "REVOLT - Supporting Chub",
      location: "Hope & Ruin, Brighton",
      link: "https://www.fatsoma.com/e/1dxze11i/revolt-presents-chub-kitchen-lover-brainface-numskull",
      promo: "",
    },
  ];

  return (
    <section className="h-fit w-full py-20 flex flex-col gap-20 items-center music-promo relative overflow-hidden">
      {/* HEADER */}
      <div className="w-full px-10">
        {headerText.map((text, index) => {
          return (
            <h1
              key={text}
              className="absolute text-5xl"
              style={
                index === 0
                  ? { transform: "translate(0, 0)" }
                  : { transform: "translate(140px, 50px)" }
              }
            >
              {text}
            </h1>
          );
        })}
      </div>

      <ul className="mt-15 flex flex-col gap-5">
        {showDetails.map((showInfo) => {
          return (
            <TicketListing
              {...showInfo}
              key={`${showInfo.date}, ${showInfo.location}`}
            />
          );
        })}
      </ul>
    </section>
  );
}
