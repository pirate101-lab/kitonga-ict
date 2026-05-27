"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PortfolioMockup } from "@/components/ui/PortfolioMockup";

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

const TILE_SIZES =
  "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

type Filter = "All" | string;

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
      } catch (err) {
        console.error("[Portfolio] failed to load /api/portfolio", err);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["All", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    const base = active === "All" ? items : items.filter((p) => p.category === active);
    const sorted = [...base].sort((a, b) => b.year - a.year);
    return limit ? sorted.slice(0, limit) : sorted;
  }, [active, items, limit]);

  return (
    <section className="relative pt-8 pb-12 md:pt-8 md:pb-16 bg-background" id="portfolio">
      <div className="container-narrow">
        <div className="flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Selected Work"
            className="max-w-none lg:whitespace-nowrap"
            title={
              <span className="block leading-tight pb-2">
                A gallery built on{" "}
                <span className="text-primary">obsessive detail.</span>
              </span>
            }
            description="Posters, business cards, banners, résumés, photo composites, brand systems, pitch decks and social rollouts. Filter to focus on what matters."
          />
        </div>

        {/* Filter pills */}
        <div
          className="mt-8 mb-8 flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Portfolio filters"
        >
          {categories.map((f) => {
            const isActive = active === f;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(f)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-card-border bg-card text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: limit ?? 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl border border-card-border bg-card animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-card-border bg-card transition-colors hover:border-primary"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
                  {item.imageUrl ? (
                    <>
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes={TILE_SIZES}
                        quality={85}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      {/* Gradient overlay for caption legibility on dark photos */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
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
                <div className="flex items-start justify-between gap-3 p-3.5">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {item.client} · {item.year}
                    </p>
                  </div>
                  <span
                    className="ml-auto inline-flex items-center rounded-full border border-card-border bg-secondary px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-primary"
                    aria-hidden
                  >
                    {item.category}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-card-border bg-card p-10 text-center text-muted-foreground">
            No work in this category yet — let&apos;s be your first.
          </div>
        )}
      </div>
    </section>
  );
}
