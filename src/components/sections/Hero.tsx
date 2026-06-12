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
 * Hero — copy-first, no decorative tagline pill.
 */
export function Hero() {
  const fastOrderHref = buildWhatsAppUrl(DEFAULT_FAST_ORDER_MESSAGE);

  return (
    <section className="bg-[#f2f5f9]">
      <div className="container-narrow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 py-14 md:py-20 lg:items-center">

          {/* Left: text */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0a0a0a] tracking-tight leading-[1.08] mb-5">
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
