import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { VALUE_PROPS } from "@/lib/services";

export function WhyChooseUs() {
 return (
 <section
 className="relative py-12 md:py-16 bg-background border-y border-primary/15"
 id="why-us"
 >
 <div className="container-narrow">
 <Reveal>
 <SectionHeading
 eyebrow="Why KITONGA-ICT"
 title="Built for clients who need it perfect — and now."
 description="Three commitments shape every brief that leaves the studio."
 />
 </Reveal>

 <div className="mt-8 grid gap-4 md:grid-cols-3">
 {VALUE_PROPS.map((vp, i) => {
 const Icon = vp.icon;
 return (
 <Reveal key={vp.title} delay={i * 70} y={12}>
 <article className="flex h-full flex-col gap-3 rounded-2xl border border-primary/25 bg-card p-5 ">
 <div className="flex items-center justify-between">
 <span
 className="grid h-10 w-10 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary"
 aria-hidden
 >
 <Icon size={18} />
 </span>
 <span className="font-mono text-[11px] font-bold text-muted-foreground">
 0{i + 1}
 </span>
 </div>
 <div>
 <h3 className="font-display text-base md:text-lg font-bold text-foreground">
 {vp.title}
 </h3>
 <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
 {vp.description}
 </p>
 </div>
 </article>
 </Reveal>
 );
 })}
 </div>
 </div>
 </section>
 );
}
