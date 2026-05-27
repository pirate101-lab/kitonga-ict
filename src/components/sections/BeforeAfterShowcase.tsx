"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Reveal } from "@/components/ui/Reveal";

type Showcase = {
 id: string;
 category: string;
 title: string;
 description: string;
 before: React.ReactNode;
 after: React.ReactNode;
};

/**
 * "Before" — flat, muted neutral panel representing a raw, unretouched shot.
 */
function RawPhoto() {
 return (
 <div className="relative h-full w-full bg-secondary">
 <div className="absolute inset-0 grid place-items-center">
 <div className="flex flex-col items-center gap-3">
 <div className="h-24 w-24 rounded-full bg-card" />
 <div
 className="h-36 w-24 rounded-t-2xl bg-card"
 style={{ clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)" }}
 />
 </div>
 </div>
 <span className="absolute left-3 bottom-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground">
 Raw · Uncorrected
 </span>
 </div>
 );
}

/**
 * "After" — flat white panel with a crisp navy subject, showing the
 * polished, color-graded result.
 */
function PolishedPhoto() {
 return (
 <div className="relative h-full w-full bg-primary/10">
 <div className="absolute inset-0 grid place-items-center">
 <div className="flex flex-col items-center gap-3">
 <div className="h-24 w-24 rounded-full bg-primary" />
 <div
 className="h-36 w-24 rounded-t-2xl bg-primary"
 style={{ clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)" }}
 />
 </div>
 </div>
 <span className="absolute right-3 bottom-3 rounded-full bg-primary text-foreground px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] ">
 Color graded · Retouched
 </span>
 </div>
 );
}

function PosterBefore() {
 return (
 <div className="relative h-full w-full bg-card">
 <div className="absolute inset-6 rounded-xl border border-dashed border-primary/35 bg-card" />
 <div className="absolute left-10 top-10 right-10 space-y-2">
 <div className="h-3 w-2/3 rounded-full bg-secondary" />
 <div className="h-3 w-1/2 rounded-full bg-secondary" />
 </div>
 <div className="absolute bottom-10 left-10 right-10 space-y-2">
 <div className="h-2 w-3/4 rounded-full bg-secondary" />
 <div className="h-2 w-2/3 rounded-full bg-secondary" />
 <div className="h-2 w-1/3 rounded-full bg-secondary" />
 </div>
 <span className="absolute bottom-4 left-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
 Wireframe / draft v0
 </span>
 </div>
 );
}

function PosterAfter() {
 return (
 <div className="relative h-full w-full bg-primary">
 <div className="absolute inset-0 flex flex-col justify-between p-7 sm:p-8">
 <div className="space-y-2">
 <span className="inline-block rounded-full bg-white text-primary px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
 Album Drop · 2026
 </span>
 <div className="font-display text-4xl sm:text-5xl font-bold leading-[0.92] text-foreground tracking-tight">
 SAHARA
 <br />
 SOUND.
 </div>
 </div>
 <div className="flex items-end justify-between">
 <div className="space-y-1.5">
 <div className="h-0.5 w-10 rounded-full bg-white/70" />
 <div className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-foreground">
 Out 08 · 24 · 26
 </div>
 </div>
 <div className="h-10 w-10 rounded-full border-2 border-white/80" />
 </div>
 </div>
 </div>
 );
}

const SHOWCASES: Showcase[] = [
 {
 id: "photo",
 category: "Photo Edit",
 title: "Editorial portrait — frequency separation",
 description:
 "Raw studio capture before lighting balance, color grading, and high-end skin retouch.",
 before: <RawPhoto />,
 after: <PolishedPhoto />,
 },
 {
 id: "poster",
 category: "Poster Design",
 title: "Album launch poster — concept to ship",
 description:
 "From a flat wireframe brief to a fully composed, print-ready poster system.",
 before: <PosterBefore />,
 after: <PosterAfter />,
 },
];

export function BeforeAfterShowcase() {
 const [activeId, setActiveId] = useState<string>(SHOWCASES[0].id);
 const active = SHOWCASES.find((s) => s.id === activeId) ?? SHOWCASES[0];

 return (
 <section
 className="relative py-12 md:py-16 bg-background"
 id="before-after"
 aria-label="Before and after"
 >
 <div className="container-narrow">
 <Reveal>
 <SectionHeading
 eyebrow="Before · After"
 title="Drag to see the studio difference."
 description="A few of our recent transformations. Same brief — radically different outcome."
 />
 </Reveal>

 <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
 {SHOWCASES.map((s) => {
 const isActive = s.id === activeId;
 return (
 <button
 key={s.id}
 onClick={() => setActiveId(s.id)}
 className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
 isActive
 ? "border-primary bg-primary text-foreground"
 : "border-primary/20 bg-white text-foreground hover:border-primary/45 hover:text-primary"
 }`}
 >
 {s.category}
 </button>
 );
 })}
 </div>

 <Reveal y={12}>
 <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px] lg:items-center">
 <div className="aspect-[4/3] w-full sm:aspect-[16/10]">
 <BeforeAfterSlider
 before={active.before}
 after={active.after}
 ariaLabel={`Before and after for ${active.title}`}
 />
 </div>
 <div className="flex flex-col gap-2.5">
 <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
 {active.category}
 </span>
 <h3 className="font-display text-xl md:text-2xl font-bold leading-tight text-foreground">
 {active.title}
 </h3>
 <p className="text-sm leading-relaxed text-muted-foreground">
 {active.description}
 </p>
 <div className="mt-2 grid grid-cols-2 gap-3 rounded-2xl border border-primary/25 bg-card p-3.5 text-sm ">
 <div>
 <div className="text-muted-foreground text-[10.5px] font-bold uppercase tracking-[0.12em]">
 Turnaround
 </div>
 <div className="mt-0.5 text-sm font-semibold text-foreground">
 12 – 24 hrs
 </div>
 </div>
 <div>
 <div className="text-muted-foreground text-[10.5px] font-bold uppercase tracking-[0.12em]">
 Output
 </div>
 <div className="mt-0.5 text-sm font-semibold text-foreground">
 PSD · PDF · PNG
 </div>
 </div>
 </div>
 </div>
 </div>
 </Reveal>
 </div>
 </section>
 );
}
