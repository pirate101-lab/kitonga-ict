"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const FAQS = [
 {
 q: "How fast can you actually deliver a design?",
 a: "Most photo retouching, posters, business cards and CVs ship within 12–24 hours of brief approval. Full identity systems run 5–10 working days. We confirm a precise timeline once we see the brief.",
 },
 {
 q: "How does the WhatsApp Fast Order flow work?",
 a: "Click any 'Start a Fast Order' button on the site, choose what you need, and we open a pre-filled WhatsApp chat with the studio admin. The brief, project type and any details are formatted for you — you just hit send.",
 },
 {
 q: "Do I need to create an account?",
 a: "No. Fast Orders go straight to WhatsApp without an account. If you want a dashboard with order history, revisions, and downloadable final files, you can create one in seconds at /signup.",
 },
 {
 q: "What about revisions?",
 a: "Every brief includes a collaborative revision window — fast feedback, faster turnarounds. Major scope changes outside the original brief are quoted transparently before any work continues.",
 },
 {
 q: "Will I get the source files?",
 a: "Yes. Final delivery includes all working files (.PSD / .AI / .INDD or relevant), print-ready PDFs (CMYK, with bleed), and web-optimized exports.",
 },
 {
 q: "Do you handle printing too?",
 a: "We partner with trusted print houses across East Africa. We can deliver to your printer of choice, or coordinate the entire print run on your behalf.",
 },
];

export function FAQ() {
 const [open, setOpen] = useState<number | null>(0);

 return (
 <section className="relative py-12 md:py-16 bg-background" id="faq">
 <div className="container-narrow">
 <Reveal>
 <SectionHeading
 eyebrow="FAQ"
 title="Answers, before you ask."
 description="The questions clients ask most. Need something specific? Send a Fast Order — we reply directly."
 />
 </Reveal>

 <Reveal y={12}>
 <div className="mx-auto mt-8 max-w-3xl divide-y divide-cyan-500/15 rounded-2xl border border-primary/25 bg-card overflow-hidden">
 {FAQS.map((item, i) => {
 const isOpen = open === i;
 return (
 <div key={item.q} className="px-4 md:px-5">
 <button
 type="button"
 onClick={() => setOpen(isOpen ? null : i)}
 className="flex w-full items-center justify-between gap-5 py-4 text-left"
 aria-expanded={isOpen}
 >
 <span className="font-display text-sm sm:text-base font-bold text-foreground">
 {item.q}
 </span>
 <span
 className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border transition-transform ${
 isOpen
 ? "rotate-45 border-primary bg-primary/10 text-primary"
 : "border-primary/20 text-foreground"
 }`}
 aria-hidden
 >
 <Plus size={14} />
 </span>
 </button>
 <div
 className={`grid overflow-hidden transition-all duration-200 ${
 isOpen
 ? "grid-rows-[1fr] pb-4 opacity-100"
 : "grid-rows-[0fr] opacity-0"
 }`}
 >
 <div className="overflow-hidden">
 <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl">
 {item.a}
 </p>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </Reveal>
 </div>
 </section>
 );
}
