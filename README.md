# KITONGA-ICT — Studio Website

> **Tagline:** Your All-Time ICT Partner.

A premium, high-conversion frontend for the **KITONGA-ICT** digital studio.
Built with Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion
and Lucide icons. Dark-mode-first, neon-cyan accented, glassmorphism-led.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint         # eslint
```

---

## What's inside

A polished, production-grade marketing site for a design studio:

- **Hero** with dual CTAs: WhatsApp Fast Order + portfolio scroll.
- **Services** grid (6 disciplines), per-service direct WhatsApp ordering.
- **Portfolio** with category filters and hand-rendered mock previews.
- **Before/After interactive sliders** (drag + keyboard accessible).
- **Process**, **About**, **Testimonials**, **FAQ**, **Final CTA** sections.
- **Fast Order** intake form at `/order` — wires to `wa.me` with a
  pre-formatted brief and live WhatsApp message preview.
- **Auth UI** at `/login` and `/signup` (UI scaffolding, ready for backend
  integration).
- **Client dashboard** placeholder at `/dashboard` (revisions, order history,
  downloads).
- Custom 404, fully responsive, reduced-motion aware.

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root: fonts, metadata, navbar+footer
│   ├── page.tsx            # Landing
│   ├── portfolio/page.tsx
│   ├── order/page.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── dashboard/page.tsx
│   ├── not-found.tsx
│   └── globals.css         # Design tokens, utilities, animations
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── sections/           # Hero, Services, Portfolio, …
│   └── ui/                 # Button, Logo, GlassCard, BeforeAfterSlider…
└── lib/
    ├── site.ts             # Constants + buildWhatsAppUrl helper
    ├── services.ts         # Service catalogue + value props
    ├── portfolio.ts        # Portfolio mock entries
    └── utils.ts
```

## Configuration

Single-source-of-truth constants live in [`src/lib/site.ts`](src/lib/site.ts):

```ts
export const SITE = {
  whatsappNumber: "254700000000", // ← replace with real number, no leading "+"
  contactEmail: "hello@kitonga-ict.com",
  // …
};
```

**Replace the placeholder WhatsApp number with the real one.** Every CTA on
the site (hero, navbar, services, fast-order form, dashboard, footer) uses
this single constant via the `buildWhatsAppUrl()` helper.

## Roadmap (next phases)

- [ ] Wire auth (`/login`, `/signup`) to a backend (NextAuth / Clerk / custom).
- [ ] Replace dashboard mock data with live orders & revisions.
- [ ] Build the Admin Panel (portfolio manager, before/after generator,
      service & pricing editor, analytics).
- [ ] Connect a CMS (Sanity / Payload / Strapi) for the portfolio.
- [ ] Hook analytics (PostHog / Plausible).

See [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) for the full product brief.
