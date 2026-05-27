"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  buildWhatsAppUrl,
  DEFAULT_FAST_ORDER_MESSAGE,
  SITE,
} from "@/lib/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * Editorial light-theme hero with a strict mobile / desktop split.
 *
 *   Mobile  (< lg)  — clean single column on the global light surface.
 *                     No background image, no wash, no blur. The H1
 *                     keeps its gradient; the paragraph reads as dark
 *                     slate on the light theme so contrast is perfect.
 *
 *   Desktop (lg+)   — strict 2-column split with `lg:items-start` so the
 *                     "KITONGA-ICT · Premium Design Studio" badge in the
 *                     left column sits at exactly the same y-coordinate
 *                     as the top edge of the right-column image. The
 *                     text column has NO background and NO overlay. The
 *                     image column renders a bounded 1:1 portrait in a
 *                     `h-[600px] lg:h-[70vh] rounded-3xl shadow-2xl`
 *                     container with a floating glassmorphism badge
 *                     anchored to its bottom-RIGHT corner.
 *
 * The desktop `<Image>` is `priority={true}` + `quality={75}` so the
 * LCP image renders quickly without exploding the optimizer cache.
 *
 * The H1 + paragraph are intentionally duplicated across mobile and
 * desktop blocks (each gated by `block lg:hidden` / `hidden lg:block`)
 * so the desktop layout — which is perfectly tuned — stays untouched
 * while the mobile keeps its own simple, image-free typography stack.
 */
export function Hero() {
  const fastOrderHref = buildWhatsAppUrl(DEFAULT_FAST_ORDER_MESSAGE);

  return (
    <section className="relative bg-background text-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:items-start max-w-7xl mx-auto mt-4">
        {/* ── Left column ── */}
        <div className="w-full pb-12 px-4">
          <span className="cyber-pill w-fit">
            {SITE.name} · Premium Design Studio
          </span>

          {/* MOBILE-ONLY (< lg): clean H1 + paragraph stack on the global
              light surface. No background image, no overlay, no blur —
              the headline gradient + slate-900/800 type carry all the
              contrast on their own. */}
          <div className="block lg:hidden mt-6 mb-8">
            <h1 className="text-5xl font-serif font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-slate-900 block">Your All-time</span>
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent block pb-2">
                ICT Partner.
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-800">
              Posters, identities, retouching, decks, packaging, motion and small
              web builds. Brief us on WhatsApp, get a reply in the hour, get the
              work back inside a day.
            </p>
          </div>

          {/* DESKTOP-ONLY (lg+): H1 + paragraph, no background. PRESERVED
              EXACTLY as the previously-tuned desktop layout. */}
          <div className="hidden lg:block">
            <h1 className="text-5xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.1] mb-6 mt-6">
              <span className="text-slate-900 block">Your All-time</span>
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent block pb-2">
                ICT Partner.
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-800 mb-6">
              Posters, identities, retouching, decks, packaging, motion and small
              web builds. Brief us on WhatsApp, get a reply in the hour, get the
              work back inside a day.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 mt-6 lg:mt-0">
            <WhatsAppButton
              href={fastOrderHref}
              size="lg"
              className="w-full sm:w-auto"
              order={{ service: "Fast Order (homepage hero)" }}
            >
              Start a Fast Order
              <ArrowRight size={16} aria-hidden />
            </WhatsAppButton>
            <Link href="/portfolio" className="btn-ghost w-full sm:w-auto">
              <Sparkles size={15} aria-hidden />
              View our gallery
            </Link>
          </div>
        </div>

        {/* ── Right column — desktop-only bounded portrait + badge. ──── */}
        <div className="hidden lg:block relative w-full h-[600px] lg:h-[70vh] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/brand/hero-mobile.webp"
            alt="KITONGA-ICT studio at work"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority={true}
            quality={75}
          />

          <div className="absolute bottom-6 right-6 backdrop-blur-md bg-white/20 border border-white/30 p-4 rounded-2xl shadow-xl z-10">
            <p className="text-white font-bold text-lg tracking-wide">
              Digital Excellence
            </p>
            <p className="text-white/90 text-sm">⭐ 5.0 Rated Studio</p>
          </div>
        </div>
      </div>
    </section>
  );
}
