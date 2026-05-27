import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Tool = {
 abbr: string;
 name: string;
 group: "Design" | "Motion" | "Web" | "Photo";
};

const TOOLS: Tool[] = [
 { abbr: "Ps", name: "Photoshop", group: "Photo" },
 { abbr: "Ai", name: "Illustrator", group: "Design" },
 { abbr: "Id", name: "InDesign", group: "Design" },
 { abbr: "Lr", name: "Lightroom", group: "Photo" },
 { abbr: "Fi", name: "Figma", group: "Design" },
 { abbr: "Ae", name: "After Effects", group: "Motion" },
 { abbr: "Pr", name: "Premiere Pro", group: "Motion" },
 { abbr: "Bl", name: "Blender", group: "Motion" },
 { abbr: "Nx", name: "Next.js", group: "Web" },
 { abbr: "Tw", name: "Tailwind", group: "Web" },
 { abbr: "Wf", name: "Webflow", group: "Web" },
 { abbr: "Ts", name: "TypeScript", group: "Web" },
];

export function Tools() {
 return (
 <section className="relative py-12 md:py-16 bg-background" id="tools">
 <div className="container-narrow">
 <Reveal>
 <SectionHeading
 eyebrow="The studio stack"
 title={
 <>
 Tools we live in.{" "}
 <span className="text-primary">Daily.</span>
 </>
 }
 description="The studio runs on a curated stack of best-in-class creative software — picked for craft, color fidelity, and printer compatibility."
 />
 </Reveal>

 <Reveal y={12}>
 <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
 {TOOLS.map((t) => (
 <article
 key={t.name}
 className="group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-primary/25 bg-card p-2.5 text-center transition-transform hover:-translate-y-0.5"
 >
 <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-foreground font-display text-sm font-bold">
 {t.abbr}
 </div>
 <h3 className="font-display text-[11px] font-bold text-foreground sm:text-xs">
 {t.name}
 </h3>
 <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
 {t.group}
 </span>
 </article>
 ))}
 </div>
 </Reveal>

 <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
 {(["Design", "Photo", "Motion", "Web"] as const).map((g) => (
 <span
 key={g}
 className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground "
 >
 <span className="h-1.5 w-1.5 rounded-full bg-primary" />
 {g}
 </span>
 ))}
 </div>
 </div>
 </section>
 );
}
