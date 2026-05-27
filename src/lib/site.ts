/**
 * Site-wide constants for KITONGA-ICT.
 *
 * `whatsappNumber` is in international format, digits only, no leading "+".
 * Example: "254715927114" for +254 715 927 114.
 */
export const SITE = {
 name: "KITONGA-ICT",
 tagline: "Your all-time ICT partner.",
 description:
 "KITONGA-ICT — Your All-Time ICT Partner. Premium design studio delivering visual identities, print collateral, Photoshop retouching, branding, posters, business cards, web and motion.",
 url: "https://kitongaict.tech",
 whatsappNumber: "254715927114",
 whatsappDisplay: "+254 715 927 114",
 contactEmail: "hello@kitonga-ict.com",
 location: "Nairobi, Kenya · Working globally",
 hours: "Mon – Sat · 8:00 — 20:00 EAT",
 social: {
 instagram: "https://instagram.com/kitonga.ict",
 twitter: "https://twitter.com/kitongaict",
 behance: "https://behance.net/kitongaict",
 dribbble: "https://dribbble.com/kitongaict",
 },
} as const;

export const NAV_LINKS = [
 { label: "Home", href: "/" },
 { label: "Services", href: "/services" },
 { label: "Portfolio", href: "/portfolio" },
 { label: "About", href: "/about" },
 { label: "Order", href: "/order" },
] as const;

/**
 * Build a wa.me URL with a pre-filled, URL-encoded message.
 */
export function buildWhatsAppUrl(message: string, number = SITE.whatsappNumber) {
 const text = encodeURIComponent(message.trim());
 return `https://wa.me/${number}?text=${text}`;
}

/**
 * Default WhatsApp message used by the primary "Start a Fast Order" CTA.
 */
export const DEFAULT_FAST_ORDER_MESSAGE = `Hello KITONGA-ICT! 👋

I'd like to place a Fast Order. Could we start a quick brief?

— Sent from kitongaict.tech`;
