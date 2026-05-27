import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
 {
 n: "01",
 title: "Brief",
 description:
 "Tell us what you need — a poster, a CV, a full identity. Use Fast Order on WhatsApp or our intake form.",
 duration: "5 min",
 },
 {
 n: "02",
 title: "Draft",
 description:
 "Within hours, you'll review your first concept directions. We move fast without skipping the craft.",
 duration: "12 – 24h",
 },
 {
 n: "03",
 title: "Refine",
 description:
 "Direct feedback loop — typography, color, composition. Unlimited revisions inside the brief.",
 duration: "Same day",
 },
 {
 n: "04",
 title: "Deliver",
 description:
 "Print-ready, social-ready, source files included. You leave with a polished asset, not just a draft.",
 duration: "Final",
 },
];

export function Process() {
 return (
 <section className="relative py-12 md:py-16 bg-background" id="process">
 <div className="container-narrow">
 <Reveal>
 <SectionHeading
 eyebrow="The Process"
 title="Four steps. From brief to delivery."
 description="A studio rhythm engineered for speed without ever sacrificing the polish."
 />
 </Reveal>

 <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
 {STEPS.map((step, idx) => (
 <Reveal key={step.n} delay={idx * 70} y={12}>
 <article className="flex h-full flex-col gap-3 rounded-2xl border border-primary/25 bg-card p-4 ">
 <div className="flex items-center justify-between">
 <span
 className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-foreground font-mono text-sm font-bold"
 aria-hidden
 >
 {step.n}
 </span>
 <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
 {step.duration}
 </span>
 </div>
 <h3 className="font-display text-lg font-bold text-foreground">
 {step.title}
 </h3>
 <p className="text-sm leading-relaxed text-muted-foreground">
 {step.description}
 </p>
 </article>
 </Reveal>
 ))}
 </div>
 </div>
 </section>
 );
}
