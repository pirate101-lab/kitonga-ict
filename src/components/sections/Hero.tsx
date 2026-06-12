"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  buildWhatsAppUrl,
  DEFAULT_FAST_ORDER_MESSAGE,
} from "@/lib/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * Hero — copy-first, tighter mobile H1, inline stats strip on mobile.
 */
export function Hero() {
  const fastOrderHref = buildWhatsAppUrl(DEFAULT_FAST_ORDER_MESSAGE);

  return (
    <section className="bg-[#f2f5f9]">
      <div className="container-narrow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 pt-14 pb-6 md:py-20 lg:items-center">

          {/* Left: text */}
          <div className="pb-6 lg:pb-0">
            <h1 className="text-[2.75rem] leading-[1.05] sm:text-5xl lg:text-8xl font-bold text-[#0a0a0a] tracking-tight mb-5">
              Design work<br />
              <span className="text-[#0067b8]">done right.</span>
            </h1>
            <p className="text-[15px] text-[#333] leading-relaxed max-w-md mb-8">
              Flyers, CVs, business cards, photo editing, and cyber services. Brief us on WhatsApp — reply within the hour, delivery same day.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <WhatsAppButton
                href={fastOrderHref}
                size="lg"
                className="w-full sm:w-auto rounded-lg"
                order={{ service: "Fast Order (hero)" }}
              >
                Start a Fast Order
                <ArrowRight size={15} aria-hidden />
              </WhatsAppButton>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg border-2 border-black/30 bg-white text-[14px] font-medium text-[#111] hover:border-[#0067b8] hover:text-[#0067b8] transition-colors w-full sm:w-auto"
              >
                See all services
              </Link>
            </div>

            {/* Mobile-only stats strip */}
            <div className="lg:hidden flex flex-row items-center gap-5 mt-5 pt-4 border-t border-card-border">
              <span>
                <strong className="text-foreground font-black text-base">240+</strong>
                <span className="text-muted-foreground text-xs font-medium ml-1">Briefs</span>
              </span>
              <span className="text-card-border" aria-hidden>·</span>
              <span>
                <strong className="text-foreground font-black text-base">64+</strong>
                <span className="text-muted-foreground text-xs font-medium ml-1">Brands</span>
              </span>
              <span className="text-card-border" aria-hidden>·</span>
              <span>
                <strong className="text-foreground font-black text-base">5.0★</strong>
                <span className="text-muted-foreground text-xs font-medium ml-1">Rated</span>
              </span>
            </div>
          </div>

          {/* Right: image (desktop only) */}
          <div className="hidden lg:block relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-black/30">
            <Image
              src="/brand/hero-mobile.webp"
              alt="KITONGA-ICT studio work"
              fill
              sizes="50vw"
              className="object-cover"
              priority
              quality={75}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
