import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * About — minimal. New heading per brief: "KITONGA-ICT — Your all-time ICT Partner".
 * Paragraph kept to "We deal with..." only. Principles as a plain divide-y list.
 * All text near-black — differentiated by weight only.
 */
export function About() {
  return (
    <section className="bg-[#f2f5f9] pt-12 pb-16 md:pt-16 md:pb-20" id="about">
      <div className="container-narrow">

        <Reveal>
          <div className="mb-10 max-w-xl">
            {/* Blue label */}
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0067b8] mb-2">
              About
            </p>

            {/* Main heading — exactly as requested */}
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight leading-snug mb-3">
              KITONGA-ICT — Your all-time ICT Partner
            </h1>

            {/* Paragraph — "We deal with..." only */}
            <p className="text-[14px] text-[#222] leading-relaxed">
              We deal with design &amp; print, document formatting, image manipulation, and cyber services — all under one roof. One call, one team, everything handled.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-2.5 mt-5">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-black bg-white text-[13px] font-semibold text-[#111] hover:border-[#0067b8] hover:text-[#0067b8] transition-colors"
              >
                View our work
                <ArrowUpRight size={13} aria-hidden />
              </Link>
              <Link
                href="/order"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0067b8] text-[13px] font-semibold text-white hover:bg-[#005a9e] transition-colors"
              >
                Start a project
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Principles — plain text, divide-y, no cards */}
        <Reveal y={10} delay={80}>
          <div className="grid gap-0 divide-y divide-[#222] border-t border-b border-[#222]">
            {[
              {
                n: "01",
                title: "One bar for every brief",
                body: "A CV gets the same careful typesetting as a full brand rollout. No tiered quality.",
              },
              {
                n: "02",
                title: "Long-haul partner, not a one-off vendor",
                body: "Most clients stay two years or more. We learn the brand and cut hours off every future job.",
              },
              {
                n: "03",
                title: "Done means ready to use",
                body: "Print-ready PDFs, web-optimised exports, and source files. Nothing half-finished.",
              },
            ].map((p) => (
              <div key={p.n} className="py-5 flex gap-6 items-start">
                <span className="text-[11px] font-mono font-bold text-[#0067b8] mt-0.5 shrink-0">{p.n}</span>
                <div>
                  <h2 className="text-[14px] font-bold text-[#0a0a0a] mb-1">{p.title}</h2>
                  <p className="text-[13px] text-[#333] leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
