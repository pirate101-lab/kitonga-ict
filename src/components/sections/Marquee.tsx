const PHRASES = [
  "Photoshop Edits",
  "Brand Identities",
  "Posters & Flyers",
  "Business Cards",
  "Roll-up Banners",
  "CVs & Cover Letters",
  "Pitch Decks",
  "Social Kits",
  "Web & Landing Pages",
  "Logo Design",
];

/**
 * Marquee — bare scrolling line of service names.
 * No card wrapper, no border. Just text on the background.
 */
export function Marquee() {
  const items = [...PHRASES, ...PHRASES];

  return (
    <section
      className="py-5 overflow-hidden border-y border-[#cbd5e1] bg-white"
      aria-label="Service types"
    >
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {items.map((phrase, i) => (
          <span
            key={`${phrase}-${i}`}
            className="text-[13px] font-medium text-gray-400 tracking-wide"
          >
            {phrase}
            <span className="ml-10 inline-block h-1 w-1 rounded-full bg-[#0067b8] align-middle" aria-hidden />
          </span>
        ))}
      </div>
    </section>
  );
}
