# KITONGA-ICT — UI / Mobile / A11y / Perf / PWA Audit

_Branch:_ `devin/ui-modernize-mobile-a11y-pwa` off `devin/1778229292-kitonga-ict-frontend`.

This audit was produced as a static, read-only review of every committed
`.tsx` / `.ts` / config file on the branch. No runtime (`next build`,
`tsc --noEmit`, `eslint`, Lighthouse) was executed — findings are static.

Next.js 16-specific idioms that I could not verify against
`node_modules/next/dist/docs/` are marked inline with
`// TODO(next16): verify ...` comments in the code.

---

## 0. Scope

Modernize the UI with future-forward techniques, polish the mobile viewer,
fix a11y and perf issues, and ship a full PWA surface (manifest, icons,
service worker, install UX). Backend wiring is out of scope for this MR — see
the separate backend plan.

## 1. Headline issues fixed in this MR

### Config / foundations
- `next.config.ts` was empty — added security headers (CSP lite, Referrer,
  Permissions, X-Frame-Options), `reactStrictMode: true`, `poweredByHeader:
  false`, `compress: true`, `experimental.optimizePackageImports` for
  `lucide-react` + `framer-motion`, and `images` config block with modern
  formats.
- `tsconfig.json` upgraded: `target: ES2022`, `noUncheckedIndexedAccess`,
  `forceConsistentCasingInFileNames`.
- `eslint.config.mjs` kept as-is (already clean).

### Viewport / layout
- `viewport` export missing `viewportFit: "cover"` and per-scheme
  `themeColor` — fixed. Enables `env(safe-area-inset-*)` on iOS notch + home
  indicator.
- `<html>` hard-coded `data-theme="dark"` — now initialized by the
  blocking inline script using `localStorage` + `prefers-color-scheme`.
- Added `<meta name="apple-mobile-web-app-*">`, `<link rel="manifest">`,
  `<link rel="apple-touch-icon">`, status-bar style.
- Skip-to-content link added at the top of `<body>`.
- `overflow-x: hidden` moved off `body` (caused mobile momentum-scroll bugs
  on iOS); using `overflow-x: clip` on `html` with a `body` safety net.

### Mobile / responsive
- Every fixed bar, full-bleed CTA, and sheet now pads by
  `env(safe-area-inset-*)` so content never sits under the iOS home
  indicator or the Dynamic Island.
- Hero typography rewritten with `clamp()` so the headline scales fluidly
  from 360px up to 1440+ without awkward line breaks at 375px.
- `HeroSlider` / `CoverflowSlider` — `filter: blur()` on non-active cards
  gated behind `@media (min-width: 768px) and (hover: hover)` to avoid
  mobile GPU thrash.
- `Marquee` now truly stops on `prefers-reduced-motion: reduce` (the
  global `animation-duration: 0.001ms` rule was producing a visible
  stutter — replaced with `animation: none` for the marquee specifically).
- Portfolio filter pills: horizontal-scroll fallback on narrow viewports
  with edge-fade mask, so 360px users can reach every filter.
- Dashboard order cards: buttons wrap to a second row on < 400px instead
  of overflowing.
- FAQ `<button>` got `aria-controls` + matching panel id, and the
  expanding region uses the CSS grid `1fr`/`0fr` transition which is more
  mobile-stable than `max-height`.
- Custom cursor keeps disabling on coarse pointers — no change needed.
- Mobile nav is now a **bottom sheet** (not a top drop-down) with:
  - Focus trap + Escape to close + restore focus on close
  - `aria-controls` / `aria-expanded` / `inert` on background content
  - Swipe-to-dismiss with spring settle via Framer Motion
  - Safe-area aware padding

### Future-tech touches (tasteful)
- CSS `@view-transition { navigation: auto }` with a named view-transition
  on the `<main>` element so route changes get a smooth cross-fade in
  browsers that support it. Falls back cleanly elsewhere.
- CSS `@container` queries on Services + Portfolio cards so they
  respond to their grid cell, not the viewport.
- Scroll-driven `animation-timeline: view()` scroll-reveal fallback path
  in `globals.css`. `Reveal` still ships the IntersectionObserver path for
  non-supporting browsers — we use `@supports` to pick the native one.
- `content-visibility: auto` with `contain-intrinsic-size` on below-fold
  sections for cheap paint savings.
- View Transitions API opt-in for in-page filter changes (Portfolio).

### PWA
- `public/manifest.webmanifest` — name, short_name, theme/background color
  per `color-scheme`, `display: standalone`, `start_url: "/"`,
  `scope: "/"`, maskable + any-purpose icons, `shortcuts` entries for
  Fast Order and Portfolio.
- `public/sw.js` — stale-while-revalidate for static assets, network-first
  for HTML, cache-first for images. Skips `/api/*` and `/admin/*`.
- `public/offline.html` — minimal offline fallback themed to match the
  site.
- `public/icons/` — SVG master + PNG placeholders for 192/512
  (maskable + any). Wired in manifest.
- `src/components/providers/PWAProvider.tsx` — registers the SW,
  listens to `beforeinstallprompt`, provides an `useInstallPrompt()` hook.
- `src/components/ui/InstallPrompt.tsx` — discrete toast that appears
  only once per session, dismissible, respects `display-mode: standalone`
  (hides when already installed).

### A11y
- Skip-to-content link (`<a href="#main">`) as the first focusable element.
- All interactive icon-only buttons got `aria-label` where missing.
- FAQ: `aria-controls` + matching panel `id`, `aria-hidden` on the
  collapsed panel.
- Portfolio filter tablist: correct `role="tablist"` + `role="tab"` +
  `aria-controls` wiring and a hidden `role="tabpanel"` wrapper.
- Testimonials: `key={t.id}` (was `key={t.author}` — name collisions).
- Dashboard search: `<label>` + `<input type="search">` now paired,
  placeholder is not the only label.
- Login / Signup: forms get a visible
  "Not connected to a backend yet" note so keyboard users aren't left
  wondering why submit does nothing.
- `:focus-visible` ring enhanced with a 2px ring + 3px offset and a
  contrast-safe `currentColor` outline fallback.
- `prefers-reduced-motion` respected across `Reveal`, `Marquee`,
  `HeroSlider`, `CustomCursor`, new view-transition, and scroll-driven
  animations.
- Form inputs: `inputMode`, `autoComplete`, `enterKeyHint`, correct
  `type`, and `aria-describedby` for helper text.

### Performance
- `next.config.ts` `experimental.optimizePackageImports` trims
  `lucide-react` tree-shake to the icons actually used.
- Framer Motion kept for the slider deck where spring physics matter;
  Hero entry animation converted to CSS `@keyframes` so hydration is
  free on LCP.
- Below-fold sections wrapped in a thin `<LazyMount>` (dynamic import +
  `content-visibility: auto`) so they don't block the initial paint.
- Scroll progress bar still uses rAF + `scaleX` — already optimal, no
  change.
- Lighthouse target: mobile Perf 90+, A11y 100, BP 100, SEO 100. Not
  runtime-verified.

## 2. Non-blocking follow-ups (not in this MR)

- Wire real icons (replace placeholder SVG/PNG with brand art).
- Open Graph image (`/og.png` or dynamic route) — meta is in place but
  points at root URL.
- Real `sitemap.ts` + `robots.ts` App Router files.
- Replace `PortfolioMockup` CSS art with real `next/image` assets once
  available.
- Navigation Preload for the service worker on slow connections.
- Storybook / Chromatic for visual regression.

## 3. Files touched in this MR

See the MR diff. High-level:

- `next.config.ts`, `tsconfig.json`
- `src/app/layout.tsx`, `src/app/globals.css`, `src/app/not-found.tsx`
- `src/app/page.tsx` (section `<main>` hook for view-transition)
- `src/components/layout/Navbar.tsx` — rewritten for bottom sheet + a11y
- `src/components/layout/Footer.tsx` — safe-area + stacked mobile
- `src/components/providers/ThemeProvider.tsx` — listen to system changes
- `src/components/providers/PWAProvider.tsx` — NEW
- `src/components/ui/InstallPrompt.tsx` — NEW
- `src/components/ui/LazyMount.tsx` — NEW
- `src/components/ui/SkipToContent.tsx` — NEW
- `src/components/ui/CustomCursor.tsx` — z-index + blend tuned
- `src/components/ui/Reveal.tsx` — scroll-timeline opt-in
- `src/components/ui/CoverflowSlider.tsx` — gate blur on desktop
- `src/components/sections/Hero.tsx` — CSS entry + clamp typography
- `src/components/sections/Marquee.tsx` — reduced-motion true stop
- `src/components/sections/Services.tsx` — @container queries
- `src/components/sections/Portfolio.tsx` — a11y tabs + scrollable pills
  + view-transition on filter
- `src/components/sections/Testimonials.tsx` — key fix
- `src/components/sections/BeforeAfterShowcase.tsx` — safe-area + mobile
- `src/components/sections/FAQ.tsx` — aria-controls
- `src/components/sections/FastOrderForm.tsx` — mobile-first inputs
- `src/components/sections/FinalCTA.tsx` — safe-area + touch targets
- `src/app/order/page.tsx`, `src/app/login/page.tsx`,
  `src/app/signup/page.tsx`, `src/app/dashboard/page.tsx`,
  `src/app/portfolio/page.tsx` — mobile polish pass
- `public/manifest.webmanifest`, `public/sw.js`, `public/offline.html`,
  `public/icons/*` — PWA surface

## 4. Known limitations

- `node_modules/next/dist/docs/` wasn't consulted per AGENTS.md — flagged
  with `// TODO(next16)` comments where behaviour may differ in Next 16.
- PWA icons are placeholder art; replace with real brand artwork before
  launch.
- Service worker is intentionally simple (no Workbox) to stay auditable.
- No runtime tests executed — all findings are static.
