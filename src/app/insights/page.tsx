import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock } from "lucide-react";
import { ARTICLES } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Insights · KITONGA-ICT",
  description:
    "Short reads from the KITONGA-ICT studio bench — process notes, retouch journal, print receipts.",
};

export default function InsightsIndexPage() {
  return (
    <section className="relative bg-background pt-10 pb-16 md:pt-14">
      <div className="container-narrow">
        <header className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            From the studio
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight text-foreground">
            Process notes, print receipts,
            <br />
            retouch field journal.
          </h1>
          <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            Short reads from the studio bench — the things we wish someone had
            told us when we first opened Photoshop.
          </p>
        </header>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a) => (
            <article
              key={a.slug}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary/25 bg-card transition-transform hover:-translate-y-0.5"
            >
              <Link
                href={`/insights/${a.slug}`}
                className="relative block aspect-[16/9] bg-primary overflow-hidden"
                aria-label={a.title}
              >
                <span className="absolute left-3 top-3 rounded-full bg-white text-primary px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
                  {a.category}
                </span>
                <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 text-foreground text-[11px] font-semibold">
                  <BookOpen size={12} aria-hidden />
                  Read article
                </span>
              </Link>

              <div className="flex flex-1 flex-col gap-2 p-4">
                <h2 className="font-display text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                  <Link href={`/insights/${a.slug}`} className="line-clamp-2">
                    {a.title}
                  </Link>
                </h2>
                <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-3">
                  {a.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-primary/15 pt-3 text-xs">
                  <span className="text-muted-foreground font-mono font-bold uppercase tracking-[0.14em]">
                    {a.date}
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock size={11} aria-hidden /> {a.readTime}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-card-border bg-card p-6 sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Want a brief turned into a piece?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We move fast on WhatsApp during studio hours.
            </p>
          </div>
          <Link
            href="/order"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:mt-0"
          >
            Start a Fast Order <ArrowUpRight size={13} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
