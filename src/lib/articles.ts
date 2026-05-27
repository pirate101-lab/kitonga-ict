/**
 * Studio Insights — short articles surfaced in the homepage `Insights`
 * section and in their own `/insights/<slug>` reader pages.
 *
 * The existing `Insights` component on the homepage already links each
 * card to `/insights/<id>`, so the slugs here MUST match the `id`
 * values in `src/components/sections/Insights.tsx`.
 *
 * Content is plain prose split into paragraphs — no MDX, no markdown
 * parser. The `/insights/[slug]` page renders each paragraph as a
 * `<p>` so we keep the lightweight studio aesthetic.
 */

export type Article = {
  /** URL slug — also the Insights card id. */
  slug: string;
  category: string;
  title: string;
  /** One-line summary used in lists / opengraph descriptions. */
  excerpt: string;
  /** Plain-prose paragraphs rendered as <p> blocks. */
  paragraphs: string[];
  /** Display strings — already pre-formatted, no Date math required. */
  readTime: string;
  date: string;
  /** Friendly byline shown above the title. */
  author: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "frequency-separation",
    category: "Photo Edit",
    title: "Frequency separation, the studio way",
    excerpt:
      "How we keep skin texture intact while still getting magazine-quality smoothness. Three Photoshop tricks we use every day.",
    readTime: "6 min read",
    date: "May 02, 2026",
    author: "KITONGA-ICT Studio",
    paragraphs: [
      "Frequency separation is a retouching technique that splits a photograph into two layers — one carrying the colour and tone, the other carrying the fine texture. Once they're separate, you can soften skin or even out a backdrop without losing any of the grain that makes a photograph feel real. The trap most people fall into is going too soft on the texture layer; that's when faces start looking like wax. The version we run in the studio keeps the skin pores readable at print resolution.",
      "Our default recipe is a high-pass-radius around 4 px on a 24 MP file. We work with two duplicates: a Gaussian-blurred low-frequency layer for tone, and an Apply-Image-derived high-frequency layer for detail. Healing and clone are restricted to the low-frequency layer; we never touch texture with a stamp tool. If a blemish has carried through to the high-frequency layer, we use a small soft brush at 25–40% opacity instead of erasing — the goal is to reduce noise, not delete it.",
      "The last 10% is colour. Once tone and texture are clean, we always finish with a Selective Colour adjustment to pull the warmth back into mid-tones. Skin reads as plastic the moment you crush the reds; a +3 / +5 nudge on cyan-to-red on neutrals is usually enough. Print the final at A4 and look at it from arm's length — if anything reads as smooth instead of soft, you went too far on the high-frequency layer.",
    ],
  },
  {
    slug: "deck-storyline",
    category: "Strategy",
    title: "Pitch decks: write the story before you design the slides",
    excerpt:
      "The structural template we hand every founder before we open Keynote. Story arc first, design second.",
    readTime: "8 min read",
    date: "Apr 18, 2026",
    author: "KITONGA-ICT Studio",
    paragraphs: [
      "Most pitch decks fail because the design starts before the story does. Founders open Keynote, drop a logo on slide one, and start filling boxes — and by the time they reach the financials, the narrative has stalled three slides earlier. Before we ever open a design tool, we ask the founder to write the deck as a single page of plain prose: ten sentences, one per slide, in the voice you'd use over coffee. If the prose doesn't flow, no amount of typography is going to save it.",
      "The structural template we use is opinionated. Slide one is a single sentence: who the company is and the change it's making in the world. Slide two is the problem, but written as a person, not a market — \"Naomi spends three hours every Friday reconciling invoices\" lands harder than \"the SME segment lacks integrated finance tooling\". Slides three through six are the product, the wedge, the moat, and the proof — in that order. By the time you reach traction, ask, and team, the reader is already nodding.",
      "Once the prose is locked, the design job is mostly restraint. One typeface, two weights. Two accent colours, no more. White-space is not negotiable. The single most-effective edit we make on every deck is removing every bullet point that isn't load-bearing — if the slide reads with the bullet deleted, the bullet didn't belong there. Investors read decks at a meeting cadence, not a textbook cadence; design accordingly.",
    ],
  },
  {
    slug: "print-ready",
    category: "Print Production",
    title: "Print-ready in five minutes — every export, every time",
    excerpt:
      "Bleed, trim, safe zone, color profile, total ink limits — the export checklist we run before any file leaves the studio.",
    readTime: "5 min read",
    date: "Apr 04, 2026",
    author: "KITONGA-ICT Studio",
    paragraphs: [
      "A print-ready file isn't a vibe; it's a checklist. Every artwork that leaves the studio has bleed, has trim, has a safe zone for live copy, has a known colour profile, and respects the print shop's total ink limit. Skip any one of those and you'll either reprint at your own cost or watch a client's logo bleed off the trim. The list itself is short and stays the same whether you're sending a poster, a card, or a roll-up.",
      "Bleed is 3 mm on every side for press work in Kenya, 5 mm for billboards. Live copy stays 4 mm inside the trim — anything closer risks getting shaved by a slightly off-register cutter. Convert the document to CMYK before exporting; we keep a master InDesign profile that pre-applies the press's ICC, with rich-black set to 60/40/40/100 so deep blacks don't go muddy. Total ink limit (TIL) is 280% on coated stock, 240% on uncoated. We use Acrobat's Output Preview to check TIL on every page before we send.",
      "Export PDF/X-1a or PDF/X-4 depending on what the printer prefers, with all fonts embedded and transparency flattened. Run a final preflight in Acrobat Pro: bleed present, no spot colours unless intentional, no images below 280 DPI at final size. Five minutes from press, every time — it sounds tedious until the first time you avoid a 200-poster reprint because the safe zone caught a number that would otherwise have been cut in half.",
    ],
  },
];

const BY_SLUG: Map<string, Article> = new Map(ARTICLES.map((a) => [a.slug, a]));

export function getArticleBySlug(slug: string): Article | null {
  return BY_SLUG.get(slug) ?? null;
}
