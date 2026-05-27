"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
 ADMIN_STORAGE_KEYS,
 readAdminStore,
 type AdminTestimonial,
} from "@/lib/adminStore";

const DEFAULTS: AdminTestimonial[] = [
 {
 id: "t-001",
 quote:
 "Brief in at 9 AM on WhatsApp, print-ready poster by lunch. Twice. The turnaround alone makes them irreplaceable.",
 author: "Naomi Mwangi",
 role: "Marketing Director · Bara Capital",
 rating: 5,
 },
 {
 id: "t-002",
 quote:
 "We rebuilt our identity with KITONGA-ICT — logo, packaging, the lot. Every deliverable felt considered. The brand book ended up being the easiest hand-off our team has ever done.",
 author: "Jamal Otieno",
 role: "Founder · Mzizi Coffee Roasters",
 rating: 5,
 },
 {
 id: "t-003",
 quote:
 "I needed a CV that actually got opened. Three interview calls in the first two weeks. Worth every shilling and then some.",
 author: "Faith Wanjiru",
 role: "Senior Project Manager",
 rating: 5,
 },
 {
 id: "t-004",
 quote:
 "The retouch on our editorial shoot was unreal — they pulled detail out of frames I'd already given up on. Color grading at this level is rare anywhere, let alone over WhatsApp.",
 author: "Studio Lumière",
 role: "Editorial photography",
 rating: 5,
 },
];

export function Testimonials() {
 const [items, setItems] = useState<AdminTestimonial[]>(DEFAULTS);

 // Hydrate from admin store on mount — preserves CMS sync logic.
 useEffect(() => {
 const stored = readAdminStore<AdminTestimonial[]>(
 ADMIN_STORAGE_KEYS.testimonials,
 );
 if (stored && Array.isArray(stored) && stored.length > 0) {
 setItems(stored);
 }
 }, []);

 return (
 <section
 className="relative py-12 md:py-16 bg-background"
 id="testimonials"
 >
 <div className="container-narrow">
 <SectionHeading
 eyebrow="Words from the room"
 title="The clients we work with come back."
 description="Real briefs, real outcomes. Here's what they say."
 />

 <div className="mt-8 grid gap-4 md:grid-cols-2">
 {items.map((t) => (
 <article
 key={t.author}
 className="flex flex-col gap-3 rounded-2xl border border-primary/25 bg-card p-5 "
 >
 <Quote size={22} className="text-primary" aria-hidden />
 <p className="text-sm md:text-base leading-relaxed text-foreground">
 &ldquo;{t.quote}&rdquo;
 </p>
 <div className="mt-2 flex items-center gap-3 border-t border-primary/15 pt-3">
 <span
 className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-foreground font-mono text-xs font-bold"
 aria-hidden
 >
 {t.author
 .split(" ")
 .map((n) => n[0])
 .slice(0, 2)
 .join("")}
 </span>
 <div>
 <div className="text-sm font-semibold text-foreground">
 {t.author}
 </div>
 <div className="text-xs text-muted-foreground">{t.role}</div>
 </div>
 </div>
 </article>
 ))}
 </div>
 </div>
 </section>
 );
}
