import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const PRINCIPLES = [
 {
 title: "A small team, on purpose",
 body: "Three creatives, one printer, and a quiet WhatsApp inbox. We stay small so the work stays sharp — no agency hand-offs, no junior swap-outs mid-project.",
 },
 {
 title: "Studio standard, on every brief",
 body: "A single CV gets the same color-managed export, the same proof check, and the same hand-finishing as a full identity rollout. One bar, every time.",
 },
 {
 title: "Long-haul partner, not a vendor",
 body: "Most of our clients have been with us 2+ years. We learn the brand, build the templates, and end up shaving days off every future brief.",
 },
];

export function About() {
 return (
 <section
 className="relative py-12 md:py-16 bg-background"
 id="about"
 >
 <div className="container-narrow">
 <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
 <Reveal>
 <div className="flex flex-col gap-4">
 <span className="eyebrow">About KITONGA-ICT</span>
 <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.1] tracking-tight text-foreground">
 KITONGA-ICT — a premium studio,{" "}
 <span className="text-primary">
 obsessive about the small things.
 </span>
 </h2>
 <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
 KITONGA-ICT is a premium creative studio — your all-time ICT
 partner. We build visual identities, posters, retouched
 photography, pitch decks, packaging and web products for
 founders, marketing leads and creative directors who need
 studio-quality work without the agency wait time.
 </p>
 <div className="flex flex-wrap gap-2 pt-1">
 <Link
 href="/portfolio"
 className="btn-ghost text-sm py-2 px-4"
 >
 View the studio archive
 <ArrowUpRight size={14} aria-hidden />
 </Link>
 <Link href="/order" className="btn-primary text-sm py-2 px-4">
 Start a project
 </Link>
 </div>
 </div>
 </Reveal>

 <div className="flex flex-col gap-3">
 {PRINCIPLES.map((p, i) => (
 <Reveal key={p.title} delay={i * 70} y={12}>
 <div className="flex gap-4 items-start rounded-2xl border border-primary/25 bg-card p-4 ">
 <span
 className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-foreground font-mono text-xs font-bold"
 aria-hidden
 >
 {String(i + 1).padStart(2, "0")}
 </span>
 <div>
 <h3 className="font-display text-base font-bold text-foreground">
 {p.title}
 </h3>
 <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
 {p.body}
 </p>
 </div>
 </div>
 </Reveal>
 ))}
 </div>
 </div>
 </div>
 </section>
 );
}
