type ShowInfo = {
  date: string;
  title: string;
  location: string;
  link: string;
  promo: string;
};

export default function TicketListing(showInfo: ShowInfo) {
  const { date, title, location, link, promo } = showInfo;
  const hasLink = link !== "";
  const hasPromo = promo !== "";

  return (
    <li className="pb-5 flex justify-between items-center text-xl border-b-2 border-[#940716]">
      <div className="max-w-[60%]">
        <p className="text-2xl">{date}</p>
        <p className="text-[#ddd]">{title}</p>
        <p className="italic text-[#baa]">{location}</p>
      </div>

      {(hasLink || hasPromo) && (
        <div className="flex flex-col items-center gap-2">
          {hasLink && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black rounded-full text-white px-3 py-2 font-semibold italic whitespace-nowrap">
              TICKETS
            </a>
          )}
          {hasPromo && (
            <span className="px-2 py-0.5 bg-[#940716] text-white text-sm font-semibold uppercase whitespace-nowrap">
              {promo}
            </span>
          )}
        </div>
      )}
    </li>
  );
}
