"use client";

import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { buildWhatsAppUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

type Tier = {
 id: string;
 name: string;
 tagline: string;
 /** Monthly price in KSh. Set to null for "Custom". */
 priceMonthly: number | null;
 /** Yearly price in KSh (per month, billed annually). */
 priceYearly: number | null;
 features: string[];
 highlight?: boolean;
 badge?: string;
 ctaLabel: string;
 ctaMessage: string;
};

const TIERS: Tier[] = [
 {
 id: "starter",
 name: "Fast Order",
 tagline: "One-off briefs, shipped in a day.",
 priceMonthly: 1200,
 priceYearly: 1200,
 features: [
 "Single deliverable per order",
 "12 – 24 hour turnaround",
 "Two revision rounds included",
 "Print-ready + web exports",
 "WhatsApp brief flow",
 ],
 ctaLabel: "Send a Fast Order",
 ctaMessage:
 "Hi KITONGA-ICT! I'd like to send a Fast Order brief on the Starter rate.",
 },
 {
 id: "studio",
 name: "Studio Retainer",
 tagline: "An always-on partner for growing brands.",
 priceMonthly: 28000,
 priceYearly: 24500,
 features: [
 "Up to 8 deliverables a month",
 "Same-day priority lane",
 "Unlimited revision rounds",
 "Brand asset library",
 "Monthly creative review call",
 "Dedicated WhatsApp line",
 ],
 highlight: true,
 badge: "Most popular",
 ctaLabel: "Book the Studio plan",
 ctaMessage:
 "Hi KITONGA-ICT! I'd like to subscribe to the Studio Retainer — when can we kick off?",
 },
 {
 id: "studio-plus",
 name: "Studio+",
 tagline: "Full-stack creative team for ambitious launches.",
 priceMonthly: null,
 priceYearly: null,
 features: [
 "Embedded creative team",
 "Brand identity + web + motion",
 "Photography & retouch passes",
 "Print run coordination",
 "Roadmap & launch ops",
 "Quarterly strategy sprints",
 ],
 ctaLabel: "Talk to the studio",
 ctaMessage:
 "Hi KITONGA-ICT! I'd like to scope out a Studio+ engagement — let's chat.",
 },
];

function formatKsh(value: number) {
 return `KSh ${value.toLocaleString("en-KE")}`;
}

export function Pricing() {
 const [yearly, setYearly] = useState(true);

 return (
 <section
 className="relative py-12 md:py-16 bg-background border-t border-primary/15"
 id="pricing"
 >
 <div className="container-narrow">
 <Reveal>
 <SectionHeading
 eyebrow="Pricing"
 title={
 <>
 Three ways to work with the studio.
 <br />
 <span className="text-primary">No surprises.</span>
 </>
 }
 description="Pick a Fast Order for one-off briefs, the Studio Retainer for always-on creative, or scope out a Studio+ engagement when you've got a major launch coming up."
 />
 </Reveal>

 {/* Billing toggle — rounded segmented control */}
 <Reveal delay={80}>
 <div className="mt-6 flex items-center justify-center">
 <div
 role="tablist"
 aria-label="Billing period"
 className="inline-flex items-center rounded-xl border border-primary/25 bg-card p-1 text-sm "
 >
 <button
 role="tab"
 aria-selected={!yearly}
 type="button"
 onClick={() => setYearly(false)}
 className={cn(
 "rounded-lg px-3.5 py-1.5 font-semibold transition",
 !yearly
 ? "bg-primary text-foreground"
 : "text-foreground hover:text-primary",
 )}
 >
 Monthly
 </button>
 <button
 role="tab"
 aria-selected={yearly}
 type="button"
 onClick={() => setYearly(true)}
 className={cn(
 "rounded-lg px-3.5 py-1.5 font-semibold transition flex items-center gap-2",
 yearly
 ? "bg-primary text-foreground"
 : "text-foreground hover:text-primary",
 )}
 >
 Yearly
 <span
 className={cn(
 "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] border",
 yearly
 ? "border-white/60 text-foreground"
 : "border-primary/35 text-primary",
 )}
 >
 −12%
 </span>
 </button>
 </div>
 </div>
 </Reveal>

 <div className="mt-8 grid gap-4 md:grid-cols-3">
 {TIERS.map((tier, idx) => {
 const price = yearly ? tier.priceYearly : tier.priceMonthly;
 const ctaHref = buildWhatsAppUrl(tier.ctaMessage);

 return (
 <Reveal key={tier.id} delay={idx * 70} y={12}>
 <article
 className={cn(
 "relative flex h-full flex-col gap-4 rounded-2xl p-5 ",
 tier.highlight
 ? "bg-primary text-foreground border border-primary"
 : "bg-white border border-primary/25",
 )}
 >
 <header className="flex items-start justify-between gap-3">
 <div>
 <h3
 className={cn(
 "font-display text-lg font-bold",
 tier.highlight ? "text-foreground" : "text-foreground",
 )}
 >
 {tier.name}
 </h3>
 <p
 className={cn(
 "mt-1 text-xs max-w-xs",
 tier.highlight ? "text-foreground" : "text-muted-foreground",
 )}
 >
 {tier.tagline}
 </p>
 </div>
 {tier.badge ? (
 <span
 className={cn(
 "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em]",
 tier.highlight
 ? "bg-white text-primary"
 : "border border-primary/35 bg-primary/10 text-primary",
 )}
 >
 <Sparkles size={11} aria-hidden />
 {tier.badge}
 </span>
 ) : null}
 </header>

 <div className="flex items-baseline gap-2">
 {price === null ? (
 <span
 className={cn(
 "font-display text-3xl font-bold",
 tier.highlight ? "text-foreground" : "text-foreground",
 )}
 >
 Custom
 </span>
 ) : (
 <>
 <span
 className={cn(
 "font-display text-3xl font-bold tabular-nums",
 tier.highlight ? "text-foreground" : "text-foreground",
 )}
 >
 {formatKsh(price)}
 </span>
 <span
 className={cn(
 "text-xs",
 tier.highlight ? "text-foreground" : "text-muted-foreground",
 )}
 >
 / {tier.id === "starter" ? "brief" : "month"}
 </span>
 </>
 )}
 </div>

 <ul
 className={cn(
 "flex flex-col gap-2 border-t pt-3",
 tier.highlight ? "border-white/20" : "border-primary/15",
 )}
 >
 {tier.features.map((f) => (
 <li
 key={f}
 className={cn(
 "flex items-start gap-2 text-[13px]",
 tier.highlight ? "text-foreground" : "text-foreground",
 )}
 >
 <Check
 size={13}
 className={cn(
 "mt-0.5 shrink-0",
 tier.highlight ? "text-foreground" : "text-primary",
 )}
 strokeWidth={3}
 aria-hidden
 />
 <span>{f}</span>
 </li>
 ))}
 </ul>

 <a
 href={ctaHref}
 target="_blank"
 rel="noopener noreferrer"
 className={cn(
 "mt-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
 tier.highlight
 ? "bg-white text-primary hover:bg-primary/10"
 : "bg-primary text-foreground hover:bg-primary",
 )}
 >
 {tier.ctaLabel}
 <ArrowRight size={14} aria-hidden />
 </a>
 </article>
 </Reveal>
 );
 })}
 </div>

 <p className="mt-6 text-center text-xs text-muted-foreground">
 All prices in Kenyan Shillings (KSh) — VAT-exclusive. Print and
 third-party costs billed at-cost where applicable.
 </p>
 </div>
 </section>
 );
}
