import {
 Brush,
 Camera,
 CreditCard,
 Film,
 Flag,
 ImageIcon,
 Layers,
 Layout,
 Megaphone,
 Monitor,
 MousePointer2,
 Package,
 Palette,
 Presentation,
 Sparkles,
 Sticker,
 Type,
 type LucideIcon,
} from "lucide-react";

export type Service = {
 id: string;
 title: string;
 short: string;
 description: string;
 bullets: string[];
 startingPrice: string;
 turnaround: string;
 icon: LucideIcon;
 /** A pleasant accent for category chips and gradients. */
 accent: string;
};

export const SERVICES: Service[] = [
 {
 id: "photoshop",
 title: "Photoshop Retouching",
 short: "Frequency-separated retouching, color grading, and composites.",
 description:
 "Skin retouching, background swaps, lighting fixes, and high-end composite work for editorial, e-commerce, and personal portraits.",
 bullets: [
 "Beauty + product retouching",
 "Background removal & replacement",
 "Color grading and tonal balancing",
 "Composite & matte painting",
 ],
 startingPrice: "from KSh 1,500",
 turnaround: "12 – 24 hrs",
 icon: ImageIcon,
 accent: "#22d3ee",
 },
 {
 id: "posters",
 title: "Posters & Flyers",
 short: "Bold, scroll-stopping posters built for both screens and walls.",
 description:
 "Event launches, campaign rollouts, social blasts. Layouts that hold up at A2 print or as a 1080×1920 story.",
 bullets: [
 "Event, product & campaign posters",
 "Social-first variations included",
 "Print-ready CMYK at 300 DPI",
 "Bleed, trim, and safe zone marked",
 ],
 startingPrice: "from KSh 2,000",
 turnaround: "24 – 48 hrs",
 icon: Flag,
 accent: "#3b82f6",
 },
 {
 id: "business-cards",
 title: "Business Cards",
 short: "Premium card systems that command the room.",
 description:
 "Front + back layout systems with foil-ready specs, spot-UV markup, and brand-locked typography.",
 bullets: [
 "Front + back layout system",
 "Foil & spot-UV print specs",
 "3.5 × 2 in with bleed",
 "Up to four colorway variants",
 ],
 startingPrice: "from KSh 1,200",
 turnaround: "24 hrs",
 icon: CreditCard,
 accent: "#a855f7",
 },
 {
 id: "banners",
 title: "Banners & Out-of-Home",
 short: "Roll-ups, X-banners, and large-format outdoor that stay legible at speed.",
 description:
 "Vector-scaled artwork engineered with safe zones, viewing distance, and printer profiles in mind.",
 bullets: [
 "Roll-up, X-banner, billboard sizes",
 "Vector scaling — no quality loss",
 "Print-ready PDF/X-1a or TIFF",
 "Distance-tested legibility check",
 ],
 startingPrice: "from KSh 2,500",
 turnaround: "24 – 48 hrs",
 icon: Layout,
 accent: "#f97316",
 },
 {
 id: "resumes",
 title: "Resumes & Cover Letters",
 short: "ATS-friendly CVs with optional design-forward layouts.",
 description:
 "Polished typography, clean hierarchy, written for the role you're actually applying for. PDF + editable Word.",
 bullets: [
 "ATS base + design variant",
 "Cover letter & LinkedIn cover",
 "PDF + .docx delivered",
 "Tailored to your target role",
 ],
 startingPrice: "from KSh 1,000",
 turnaround: "12 – 24 hrs",
 icon: Brush,
 accent: "#10b981",
 },
 {
 id: "branding",
 title: "Brand Identity Systems",
 short: "Full identity systems — logo, palette, typography, guidelines.",
 description:
 "Positioning to stationery. Delivered as a brand book your team can actually use, not a thirty-page mood board.",
 bullets: [
 "Logo system (primary + variants)",
 "Color, typography & icon set",
 "Brand guidelines (PDF book)",
 "Stationery + social templates",
 ],
 startingPrice: "from KSh 18,000",
 turnaround: "5 – 10 days",
 icon: Palette,
 accent: "#d946ef",
 },
 {
 id: "logos",
 title: "Logo & Wordmark",
 short: "Marks built to scale from favicon to billboard.",
 description:
 "Three concept directions, focused refinement on the chosen route, full lock-up family with horizontal, stacked, and monogram variants.",
 bullets: [
 "3 concept routes",
 "Horizontal + stacked + monogram",
 "Vector master files (.ai/.svg)",
 "Black, white & full-color variants",
 ],
 startingPrice: "from KSh 7,500",
 turnaround: "3 – 6 days",
 icon: Type,
 accent: "#06b6d4",
 },
 {
 id: "web",
 title: "Web & Landing Pages",
 short: "Conversion-tuned landing pages and small business sites.",
 description:
 "Next.js + Tailwind, responsive across every device, on-page SEO and analytics wired in. We can ship to your domain or hand off the repo.",
 bullets: [
 "Next.js + Tailwind, fully responsive",
 "Lighthouse 95+ on mobile",
 "Analytics + on-page SEO",
 "Hand-off to your domain or team",
 ],
 startingPrice: "from KSh 35,000",
 turnaround: "2 – 4 weeks",
 icon: Monitor,
 accent: "#0ea5e9",
 },
 {
 id: "social",
 title: "Social Templates & Kits",
 short: "Reusable post / story / reel templates locked to your brand.",
 description:
 "A library of editable templates your team can drop into Canva, Figma, or Photoshop. Quote cards, carousels, story frames, ad creatives.",
 bullets: [
 "Quote cards + carousels + stories",
 "Editable in Canva / Figma / PSD",
 "Brand-locked colors & type",
 "Includes 30-day post grid plan",
 ],
 startingPrice: "from KSh 6,000",
 turnaround: "3 – 5 days",
 icon: Megaphone,
 accent: "#f43f5e",
 },
 {
 id: "decks",
 title: "Pitch Decks & Reports",
 short: "Investor-ready slides, annual reports, and proposal docs.",
 description:
 "Story-led structure first, then design. We work in Keynote, PowerPoint, or Google Slides — your team owns the deliverable.",
 bullets: [
 "Story arc + slide structure",
 "Editable PPTX / Keynote / Slides",
 "Charts, tables & infographics",
 "Optional founder coaching pass",
 ],
 startingPrice: "from KSh 9,500",
 turnaround: "4 – 7 days",
 icon: Presentation,
 accent: "#8b5cf6",
 },
 {
 id: "packaging",
 title: "Packaging & Labels",
 short: "Dielines, labels, and product packaging that earn the shelf.",
 description:
 "Coffee bags, cosmetic boxes, beverage labels — designed against real dielines with print specs the printer will actually thank you for.",
 bullets: [
 "Real dielines & technical drawings",
 "Mock-ups for marketing teams",
 "CMYK + Pantone print specs",
 "Sticker / label variants included",
 ],
 startingPrice: "from KSh 12,000",
 turnaround: "5 – 8 days",
 icon: Package,
 accent: "#fbbf24",
 },
 {
 id: "motion",
 title: "Motion & Short Video",
 short: "Logo stings, social motion, product cutdowns under 60 seconds.",
 description:
 "After Effects / Premiere — short-form motion content for TikTok, Reels, and YouTube Shorts. Built to feel native to the platform.",
 bullets: [
 "Logo sting / animated reveal",
 "15s / 30s / 60s social cutdowns",
 "Captions baked in",
 "MP4 + ProRes deliverables",
 ],
 startingPrice: "from KSh 8,000",
 turnaround: "4 – 7 days",
 icon: Film,
 accent: "#ec4899",
 },
 {
 id: "photography",
 title: "Product & Portrait Photography",
 short: "Studio-quality product, portrait, and brand photography in Nairobi.",
 description:
 "Half-day or full-day sessions. Includes shoot, selects, retouching, and final delivery in web + print formats.",
 bullets: [
 "Half-day / full-day rates",
 "Studio or on-location",
 "Selects + retouching included",
 "Web + print exports",
 ],
 startingPrice: "from KSh 15,000",
 turnaround: "3 – 6 days",
 icon: Camera,
 accent: "#34d399",
 },
 {
 id: "stickers",
 title: "Stickers, Apparel & Merch",
 short: "Stickers, T-shirt prints, mugs, and merch kit design.",
 description:
 "Die-cut stickers, screen-print-ready shirt artwork, mugs, lanyards, ID cards. Print-ready files plus printer-shop coordination if you need it.",
 bullets: [
 "Die-cut + kiss-cut stickers",
 "Screen-print T-shirt artwork",
 "ID cards & lanyards",
 "Optional printer coordination",
 ],
 startingPrice: "from KSh 1,800",
 turnaround: "24 – 72 hrs",
 icon: Sticker,
 accent: "#f97316",
 },
];

export const VALUE_PROPS: {
 title: string;
 description: string;
 icon: LucideIcon;
}[] = [
 {
 title: "Fast turnaround, on purpose",
 description:
 "Brief in via WhatsApp, work starts within the hour during studio time. Most jobs ship inside 24 hours — without rushing the craft.",
 icon: Sparkles,
 },
 {
 title: "Pixel-perfect, every time",
 description:
 "Print-ready specs, vector scaling, color-managed exports. Nothing leaves the studio half-baked or half-checked.",
 icon: Layers,
 },
 {
 title: "One studio, end-to-end",
 description:
 "From the first concept to the printer hand-off — one team handling design, retouch, motion and delivery. No hand-offs, no excuses.",
 icon: MousePointer2,
 },
];
