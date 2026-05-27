import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICES } from "@/lib/services";
import { buildWhatsAppUrl } from "@/lib/site";

export function Services() {
 return (
 <section className="relative pt-8 pb-12 md:pt-10 md:pb-16 bg-background" id="services">
 <div className="container-narrow">
 <Reveal>
 <div className="flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
 <SectionHeading
 align="left"
 eyebrow="What we craft"
 title={
 <>
 Twelve service lines.{" "}
 <span className="text-primary">Zero compromise.</span>
 </>
 }
 description="A focused studio operating across print, digital, brand and motion. Every deliverable ships ready to publish, post, or print."
 />
 <Link
 href="/portfolio"
 className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary"
 >
 Explore the full gallery
 <ArrowUpRight size={15} aria-hidden />
 </Link>
 </div>
 </Reveal>

 <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {SERVICES.map((service) => {
 const Icon = service.icon;
 // Preserve dynamic WhatsApp pre-fill per service.
 const orderUrl = buildWhatsAppUrl(
 `Hello KITONGA-ICT! I'd like to start a ${service.title} project. Can we talk through the brief?\n\n— Sent from kitongaict.tech`,
 );

 return (
 <article
 key={service.id}
 className="group relative flex h-full flex-col rounded-2xl border border-card-border bg-card p-5 transition-colors hover:border-primary"
 >
 <div className="flex items-start gap-3">
 <span
 className="grid h-10 w-10 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary"
 aria-hidden
 >
 <Icon size={17} />
 </span>
 </div>

 <h3 className="font-display mt-4 text-base md:text-lg font-bold text-foreground">
 {service.title}
 </h3>
 <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
 {service.short}
 </p>

 <ul className="mt-3 space-y-1.5">
 {service.bullets.map((b) => (
 <li
 key={b}
 className="flex items-start gap-2 text-[12.5px] text-muted-foreground"
 >
 <Check
 size={12}
 className="mt-0.5 shrink-0 text-primary"
 aria-hidden
 />
 <span>{b}</span>
 </li>
 ))}
 </ul>

 <div className="mt-auto pt-4 flex items-center justify-end border-t border-primary/15">
 <a
 href={orderUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary transition-colors"
 >
 Request a quote
 <ArrowUpRight size={13} aria-hidden />
 </a>
 </div>
 </article>
 );
 })}
 </div>

 <Link
 href="/portfolio"
 className="md:hidden mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-card px-4 py-2.5 text-sm font-semibold text-primary "
 >
 Explore the full gallery
 <ArrowUpRight size={15} aria-hidden />
 </Link>
 </div>
 </section>
 );
}
