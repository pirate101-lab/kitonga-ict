/**
 * Hero slider scenes. Editable from the admin panel via the slider manager.
 * The frontend renders these as a clean image slider.
 */

export type HeroSlide = {
 id: string;
 category: string;
 title: string;
 subtitle?: string;
 caption?: string;
 badge?: string;
 /** Live sample image used as the slide background. */
 image: string;
  imagePublicId?: string;
 /**
 * Optional CSS background fallback used while the image is loading.
 * Kept for backward compatibility with the admin store.
 */
 background?: string;
 ctaLabel?: string;
 ctaHref?: string;
};

const UNSPLASH = (id: string) =>
 `https://images.unsplash.com/${id}?w=1600&q=80&auto=format&fit=crop`;

export const HERO_SLIDES: HeroSlide[] = [
 {
 id: "s-01",
 category: "Brand identity",
 title: "Identity systems that earn the shelf",
 subtitle: "Logo, palette, packaging and brand book",
 caption:
 "We build identity systems your team can actually use day to day.",
 badge: "Featured",
 image: UNSPLASH("photo-1554034483-04fda0d3507b"),
 ctaLabel: "View work",
 ctaHref: "/portfolio",
 },
 {
 id: "s-02",
 category: "Posters & campaigns",
 title: "Bold print and social rollouts",
 subtitle: "Posters · Social · Motion",
 caption: "Event launches and campaign systems built for print and screen.",
 image: UNSPLASH("photo-1611532736597-de2d4265fba3"),
 ctaLabel: "See examples",
 ctaHref: "/portfolio",
 },
 {
 id: "s-03",
 category: "Editorial photo",
 title: "High-end retouching and color grading",
 subtitle: "Frequency-separation retouch",
 caption:
 "Lighting balance, skin retouch and color grade for editorial and commercial work.",
 image: UNSPLASH("photo-1488161628813-04466f872be2"),
 ctaLabel: "Before / after",
 ctaHref: "#before-after",
 },
 {
 id: "s-04",
 category: "Web & landing pages",
 title: "Conversion-tuned websites",
 subtitle: "Next.js · Tailwind · CMS",
 caption:
 "Marketing sites and landing pages, built fast and tuned for performance.",
 image: UNSPLASH("photo-1542744173-8e7e53415bb0"),
 ctaLabel: "View work",
 ctaHref: "/portfolio",
 },
 {
 id: "s-05",
 category: "Packaging",
 title: "Packaging that speaks for the product",
 subtitle: "Apparel labels, lookbooks, dielines",
 caption: "Tags, sticker packs and full lookbooks for product launches.",
 image: UNSPLASH("photo-1607082348824-0a96f2a4b9da"),
 ctaLabel: "See the rollout",
 ctaHref: "/portfolio",
 },
 {
 id: "s-06",
 category: "Pitch decks & reports",
 title: "Investor-ready decks and reports",
 subtitle: "Story arc · Editable source files",
 caption:
 "Story-led structure first, then design — in Keynote, PowerPoint or Slides.",
 image: UNSPLASH("photo-1554224155-6726b3ff858f"),
 ctaLabel: "Explore",
 ctaHref: "/portfolio",
 },
];
