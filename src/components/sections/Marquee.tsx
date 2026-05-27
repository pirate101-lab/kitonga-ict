const PHRASES = [
  "Photoshop Mastery",
  "Identity Systems",
  "Posters & Flyers",
  "Business Cards",
  "Roll-up Banners",
  "Resumes & CVs",
  "Photo Compositing",
  "Brand Guidelines",
  "Pitch Decks",
  "Social Templates",
];

/**
 * Editorial light marquee.
 *
 * The scrolling tape no longer touches the screen edges — it lives
 * inside a max-w-7xl, rounded-2xl pill that aligns with the rest of
 * the editorial layout. Inner overflow is clipped so the seamless
 * loop still works visually inside the rounded container.
 */
export function Marquee() {
  // Duplicate so the animation can loop seamlessly.
  const items = [...PHRASES, ...PHRASES];

  return (
    <section
      className="relative bg-background py-6 md:py-8"
      aria-label="What we craft"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="overflow-hidden rounded-2xl border border-card-border bg-card py-4">
          <div className="flex w-max animate-marquee gap-8 px-6 whitespace-nowrap">
            {items.map((phrase, i) => (
              <span
                key={`${phrase}-${i}`}
                className="font-display text-base sm:text-lg md:text-xl font-bold text-foreground"
              >
                {phrase}
                <span className="ml-8 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
