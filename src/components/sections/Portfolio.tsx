"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PortfolioMockup } from "@/components/ui/PortfolioMockup";
import { buildWhatsAppUrl } from "@/lib/site";
import { SERVICE_CATEGORIES } from "@/lib/services";

type PortfolioRecord = {
  id: string;
  title: string;
  client: string;
  category: string;
  gradient: string;
  preview: string;
  tags: string[];
  year: number;
  imageUrl?: string;
};

const TILE_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

// Portfolio filter tabs — "All" + the actual service categories
const FILTERS = ["All", ...SERVICE_CATEGORIES] as const;
type Filter = (typeof FILTERS)[number];

/**
 * Portfolio — filtered grid.
 * Filter pills map directly to SERVICE_CATEGORIES.
 * Clean, minimal, no section heading text box.
 */
export function Portfolio({ limit }: { limit?: number }) {
  const [items, setItems] = useState<PortfolioRecord[]>([]);
  const [active, setActive] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/portfolio", { cache: "no-store" });
        const data = (await res.json()) as { ok: boolean; items: PortfolioRecord[] };
        if (!cancelled) setItems(Array.isArray(data.items) ? data.items : []);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Use API categories if they exist, otherwise fall back to service categories
  const availableCategories = useMemo(() => {
    const apiCats = new Set(items.map((i) => i.category));
    return FILTERS.filter((f) => f === "All" || apiCats.has(f) || apiCats.size === 0);
  }, [items]);

  const filtered = useMemo(() => {
    const base = active === "All" ? items : items.filter((p) => p.category === active);
    const sorted = [...base].sort((a, b) => b.year - a.year);
    return limit ? sorted.slice(0, limit) : sorted;
  }, [active, items, limit]);

  const fastOrderHref = buildWhatsAppUrl(
    "Hello KITONGA-ICT! I'd like to start a project after seeing your portfolio.\n\n— Sent from kitongaict.tech",
  );

  return (
    <section className="bg-[#f2f5f9] pt-12 pb-16 md:pt-16 md:pb-20" id="portfolio">
      <div className="container-narrow">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0067b8] mb-2">
            Portfolio
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight">
              Our work.
            </h1>
            <a
              href={fastOrderHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-[12.5px] font-medium text-[#0067b8] hover:text-[#005a9e] hover:underline underline-offset-2 transition-colors shrink-0"
            >
              Start a project
              <ArrowUpRight size={12} aria-hidden />
            </a>
          </div>
        </div>

        {/* Filter pills */}
        <div
          className="flex flex-wrap items-center gap-2 mb-8"
          role="tablist"
          aria-label="Filter portfolio by category"
        >
          {availableCategories.map((f) => {
            const isActive = active === f;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(f as Filter)}
                className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  isActive
                    ? "border-[#0067b8] bg-[#0067b8] text-white"
                    : "border-black bg-white text-[#333] hover:border-[#0067b8] hover:text-[#0067b8]"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: limit ?? 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl border border-black bg-white animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black bg-white p-12 text-center">
            <p className="text-[13.5px] text-[#444]">
              {items.length === 0
                ? "Portfolio items are uploaded from the admin panel."
                : "No work in this category yet."}
            </p>
            <a
              href={fastOrderHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#0067b8] hover:underline underline-offset-2"
            >
              Be our first in this category
              <ArrowUpRight size={13} aria-hidden />
            </a>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-black bg-white hover:border-[#0067b8]/25 transition-colors"
              >
                {/* Image / mockup */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
                  {item.imageUrl ? (
                    <>
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes={TILE_SIZES}
                        quality={85}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
                      />
                    </>
                  ) : (
                    <PortfolioMockup
                      title={item.title}
                      preview={item.preview}
                      client={item.client}
                      category={item.category}
                      gradient={item.gradient}
                    />
                  )}
                </div>

                {/* Caption */}
                <div className="flex items-start justify-between gap-2 px-4 py-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-[13px] font-semibold text-[#0a0a0a]">{item.title}</h2>
                    <p className="mt-0.5 truncate text-[11.5px] text-[#444]">
                      {item.client} · {item.year}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-black bg-[#f2f5f9] px-2.5 py-0.5 text-[10.5px] font-medium text-[#333] uppercase tracking-wide">
                    {item.category}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-6 sm:hidden text-center">
          <a
            href={fastOrderHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-[#0067b8] hover:underline underline-offset-2"
          >
            Start a project <ArrowUpRight size={13} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
