import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ARTICLES } from "@/lib/articles";

export function Insights() {
 return (
 <section
 className="relative py-12 md:py-16 bg-background border-t border-primary/15"
 id="insights"
 >
 <div className="container-narrow">
 <Reveal>
 <div className="flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
 <SectionHeading
 align="left"
 eyebrow="From the studio"
 title="Process notes, print receipts, retouch field journal."
 description="Short reads from the studio bench — the things we wish someone had told us when we first opened Photoshop."
 />
 <Link
 href="/insights"
 className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-card px-3.5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 "
 >
 All articles
 <ArrowUpRight size={14} aria-hidden />
 </Link>
 </div>
 </Reveal>

 <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
 {ARTICLES.map((a, idx) => (
 <Reveal key={a.slug} delay={idx * 70} y={12}>
 <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary/25 bg-card transition-transform hover:-translate-y-0.5">
 {/* Blue cover banner as visual stand-in */}
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
 <h3 className="font-display text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
 <Link href={`/insights/${a.slug}`} className="line-clamp-2">
 {a.title}
 </Link>
 </h3>
 <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-3">
 {a.excerpt}
 </p>

 <div className="mt-auto flex items-center justify-between border-t border-primary/15 pt-3 text-xs">
 <span className="text-muted-foreground font-mono font-bold uppercase tracking-[0.14em]">
 {a.date}
 </span>
 <span className="inline-flex items-center gap-1 text-muted-foreground">
 <Clock size={11} aria-hidden />
 {a.readTime}
 </span>
 </div>
 </div>
 </article>
 </Reveal>
 ))}
 </div>
 </div>
 </section>
 );
}
