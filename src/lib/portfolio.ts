export type PortfolioCategory =
 | "Posters"
 | "Business Cards"
 | "Banners"
 | "Resumes"
 | "Branding"
 | "Photo Edits";

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
 "Posters",
 "Business Cards",
 "Banners",
 "Resumes",
 "Branding",
 "Photo Edits",
];

export type PortfolioItem = {
 id: string;
 title: string;
 client: string;
 category: PortfolioCategory;
 /** Tailwind gradient classes used to render a styled mock preview. */
 gradient: string;
 /** Short tagline displayed inside the mock preview. */
 preview: string;
 /** Tags shown on hover. */
 tags: string[];
 year: number;
};

/**
 * Hand-curated mock portfolio entries used to render a polished landing-page
 * gallery. Replace with real client work via the Admin Portfolio Manager.
 */
export const PORTFOLIO: PortfolioItem[] = [
 {
 id: "p-001",
 title: "Sahara Sound — Album Launch",
 client: "Sahara Sound Studios",
 category: "Posters",
 gradient: "from-primary/40 via-sky-500/30 to-indigo-700/40",
 preview: "ALBUM\nDROP\n08.24",
 tags: ["Event", "Music", "Print"],
 year: 2025,
 },
 {
 id: "p-002",
 title: "Mzizi Coffee — Identity",
 client: "Mzizi Coffee Roasters",
 category: "Branding",
 gradient: "from-amber-500/40 via-orange-500/30 to-rose-600/40",
 preview: "MZIZI\nROASTERS",
 tags: ["Logo", "Identity", "Packaging"],
 year: 2025,
 },
 {
 id: "p-003",
 title: "Bara Capital — Card System",
 client: "Bara Capital",
 category: "Business Cards",
 gradient: "from-zinc-700/60 via-zinc-900/60 to-black/60",
 preview: "BARA\nCAPITAL",
 tags: ["Foil", "Premium", "Spot UV"],
 year: 2025,
 },
 {
 id: "p-004",
 title: "Asili Fest — Festival Banner",
 client: "Asili Cultural Trust",
 category: "Banners",
 gradient: "from-fuchsia-500/40 via-purple-600/30 to-price/40",
 preview: "ASILI\nFEST '25",
 tags: ["Outdoor", "Festival", "X-Banner"],
 year: 2025,
 },
 {
 id: "p-005",
 title: "N. Mwangi — Senior PM CV",
 client: "Naomi Mwangi",
 category: "Resumes",
 gradient: "from-emerald-500/30 via-teal-600/30 to-cyan-700/40",
 preview: "Naomi\nMwangi\nPM, MBA",
 tags: ["ATS", "Executive", "PDF + Docx"],
 year: 2025,
 },
 {
 id: "p-006",
 title: "Editorial Beauty Retouch",
 client: "Studio Lumière",
 category: "Photo Edits",
 gradient: "from-rose-500/30 via-pink-600/30 to-purple-700/40",
 preview: "VOGUE\nKE / 24",
 tags: ["Beauty", "Frequency", "Color Grade"],
 year: 2025,
 },
 {
 id: "p-007",
 title: "Tatu Build — Roll-up Banner",
 client: "Tatu Build Co.",
 category: "Banners",
 gradient: "from-yellow-500/30 via-orange-600/30 to-red-700/40",
 preview: "BUILD\nBETTER\n2025",
 tags: ["Roll-up", "Trade", "Outdoor"],
 year: 2025,
 },
 {
 id: "p-008",
 title: "Kifaru Logistics — Pitch Poster",
 client: "Kifaru Logistics",
 category: "Posters",
 gradient: "from-blue-600/40 via-indigo-700/40 to-slate-900/60",
 preview: "MOVE\nMORE\nKIFARU",
 tags: ["Corporate", "Pitch", "Series"],
 year: 2024,
 },
 {
 id: "p-009",
 title: "Nuru Legal — Identity",
 client: "Nuru Legal Partners",
 category: "Branding",
 gradient: "from-slate-700/60 via-blue-900/60 to-cyan-900/60",
 preview: "NURU\nLEGAL",
 tags: ["Mark", "Stationery", "Guidelines"],
 year: 2025,
 },
 {
 id: "p-010",
 title: "J. Otieno — Creative CV",
 client: "Jamal Otieno",
 category: "Resumes",
 gradient: "from-primary/30 via-blue-600/30 to-violet-700/40",
 preview: "Jamal\nOtieno\nDesigner",
 tags: ["Creative", "Portfolio", "Cover Letter"],
 year: 2025,
 },
 {
 id: "p-011",
 title: "Heritage Auction — Card",
 client: "Heritage Auctioneers",
 category: "Business Cards",
 gradient: "from-amber-400/30 via-yellow-600/30 to-stone-800/60",
 preview: "HERITAGE\nAUCTIONS",
 tags: ["Foil Gold", "Embossed", "Premium"],
 year: 2024,
 },
 {
 id: "p-012",
 title: "Fashion Editorial Composite",
 client: "House of Asha",
 category: "Photo Edits",
 gradient: "from-violet-500/40 via-pink-600/30 to-amber-500/30",
 preview: "ASHA\nSS '25",
 tags: ["Composite", "Editorial", "Fashion"],
 year: 2025,
 },
];
