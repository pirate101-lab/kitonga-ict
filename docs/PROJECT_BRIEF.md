# KITONGA-ICT — Project Brief

> **Tagline:** Your All-Time ICT Partner.

A premium, high-conversion digital agency platform that bridges high-end
visual design and seamless user experience. Architecture is a **dual-funnel
customer journey** — comprehensive account creation **and** a frictionless,
zero-click "Fast Order" system routed directly through WhatsApp.

---

## 1 · UI/UX Design Language

| Pillar | Direction |
| --- | --- |
| **Mood** | First-class, dark-mode-first, editorial calm with neon energy. |
| **Color** | Deep charcoal `#050608` → onyx `#101319` accented with neon cyan `#22d3ee` and electric blue `#3b82f6`. Magenta accents for aurora highlights. |
| **Type** | **Display:** Space Grotesk (Clash Display alternative). **Body:** Inter. **Mono:** JetBrains Mono for eyebrows, system labels and orderIDs. |
| **Surface** | Glassmorphism: blur(18px) saturate(140%) over translucent gradients with hairline 1px borders. |
| **Interaction** | Smooth physics scroll, 200–300ms ease transitions, hover lifts (-1 to -2px), pulse-glow on primary CTAs, marquee + parallax aurora blobs. |
| **Iconography** | Lucide for utility icons, custom SVG for socials (X / Instagram), inline SVG for the wordmark. |
| **Motion** | Framer Motion for hero entrance, with full `prefers-reduced-motion` respect. |
| **Asset language** | Hand-rendered mockups via gradients + glass overlays — no placeholder images required for the launch. Replaceable later from the Admin Portfolio Manager. |

---

## 2 · Core Frontend Features

### 2.1 Hero

- **Headline:** _Elevating brands through precision design._
- **Subhead:** From striking Photoshop edits to professional corporate
  branding. KITONGA-ICT is your all-time ICT partner.
- **Primary CTA:** `Start a Fast Order` → opens WhatsApp with a pre-filled
  brief.
- **Secondary CTA:** `View our gallery` → scrolls to portfolio.
- **Trust strip:** 5★ rating + repeat-client metric.
- **Stats grid:** 500+ designs, <24h avg, 98% repeat, 12+ industries.

### 2.2 Dynamic Portfolio

- **Filterable grid** by category: Posters, Business Cards, Banners,
  Resumes, Branding, Photo Edits.
- **Mock previews** rendered with gradient + glass typography (no image
  hosting required for launch).
- **Hover micro-interactions** with a subtle lift + conic-gradient sheen.

### 2.3 Interactive Before / After Sliders

- Drag, touch, **and keyboard** controls (←/→, Home, End).
- ARIA-correct (`role="slider"`, `aria-valuenow`).
- Two demos out of the box (Editorial Photo Retouch, Album Poster) —
  composed with CSS-only "before/after" scenes so no images are needed at
  launch. Real assets plug into the same component.

### 2.4 Dual-Checkout System

#### Route A — Account creation (returning clients)

- `/login` — sign-in UI with email/password + OAuth slots.
- `/signup` — create-account UI with name/email/password + ToS checkbox.
- `/dashboard` — order list with progress bars, status pills (`In review`,
  `Ready to ship`, `Drafting`), revision counter, downloadable finals.

#### Route B — Direct Fast Orders (zero-click)

- `/order` — streamlined intake form: project type, name, brief, turnaround
  pills, budget select, optional reference link.
- **Live WhatsApp preview** alongside the form mirrors the message that will
  be sent.
- On submit, opens `wa.me/<number>?text=<encoded-brief>` with the message
  perfectly formatted, routed to the studio admin.

### 2.5 Supporting sections

- **Marquee** of disciplines for visual rhythm.
- **Why Choose Us** — three pillar cards.
- **Services** grid (six lines, each with starting price + turnaround +
  inline _Order now_ WhatsApp deep-link).
- **Process** — Brief → Draft → Refine → Deliver, with per-step durations.
- **About** — high-converting studio narrative + three principles.
- **Testimonials** — quote cards with consolidated authorship.
- **FAQ** — collapsible Q&A.
- **Final CTA** — repeats the dual CTA bottom of every long page.

---

## 3 · Admin Panel (deferred — phase 2)

Frictionless backend portal so the admin can update the site without code:

1. **Live Portfolio Manager** — drag-and-drop file upload, dynamic tagging
   (Corporate / Creative / CV…).
2. **Before/After Generator** — upload Image A and Image B, the backend
   compiles them into the slider component automatically.
3. **Service & Pricing Editor** — toggle services, edit descriptions and
   starting prices.
4. **Analytics Dashboard** — site visits, WhatsApp CTA clicks, account
   registrations.

The frontend's data layer is structured so admin endpoints can drop in
without restructuring the UI.

---

## 4 · Suggested Technical Architecture

| Layer | Choice |
| --- | --- |
| **Frontend** | **Next.js 16 (App Router) + TypeScript + Tailwind v4 + Framer Motion** ✅ shipped |
| **Backend** | Node.js (Express / Fastify) **or** Python (FastAPI). Stateless API for portfolio + orders. |
| **Auth** | NextAuth (Auth.js) with email/OAuth, or Clerk for fastest delivery. |
| **DB** | PostgreSQL via Prisma. PostgreSQL is preferred over MongoDB for relational integrity (orders ↔ revisions ↔ users). |
| **CMS** | Sanity or Payload for the Admin Portfolio Manager. |
| **File hosting** | Cloudflare R2 / S3 + signed URLs for high-res deliveries. |
| **Hosting** | Containerised deployment via Docker on a DigitalOcean Droplet, with Nginx reverse proxy + Cloudflare in front. |
| **CI** | GitLab CI runs `npm ci && npm run lint && npm run build`. |

---

## 5 · High-Converting Copy

### About

> At KITONGA-ICT, we don't just create designs; we architect visual
> identities. Whether you need a flawlessly retouched photograph, a business
> card that commands attention, or a professional CV that opens doors, our
> high-end studio delivers unparalleled quality. We are your all-time ICT
> partner — committed to transforming your digital and print footprint.

### Why choose us

- **Lightning-fast turnarounds.** Direct-to-WhatsApp ordering means we start
  working the second you reach out.
- **Pixel-perfect precision.** Expert-level Photoshop manipulation and
  vector scaling.
- **Seamless revisions.** A collaborative process ensuring the final product
  matches your exact vision.

---

## 6 · Configuration / Hand-off

A single source of truth lives in [`src/lib/site.ts`](../src/lib/site.ts):

```ts
export const SITE = {
  whatsappNumber: "254700000000", // ← replace with real number, no leading "+"
  contactEmail: "hello@kitonga-ict.com",
  // …
};
```

Every CTA across the site (navbar, hero, per-service, fast-order, footer,
dashboard) uses `buildWhatsAppUrl()` from this module. **One swap** of the
number rolls out everywhere.

## 7 · Definition of Done (frontend phase)

- [x] Pixel-perfect dark theme, neon-cyan accent, glassmorphism.
- [x] Hero, services, portfolio, before/after, process, about,
      testimonials, FAQ, final CTA.
- [x] Fast Order form with live WhatsApp preview.
- [x] Auth + dashboard UI.
- [x] Custom 404, accessible focus, reduced-motion aware.
- [x] `npm run lint` and `npm run build` clean.

Phase 2 (backend, admin, real auth) is scoped in the **Roadmap** in the
README.
