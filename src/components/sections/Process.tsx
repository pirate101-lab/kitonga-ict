import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Brief",
    description: "WhatsApp or intake form. Tell us what you need — we ask only what's relevant.",
    duration: "5 min",
  },
  {
    n: "02",
    title: "First look",
    description: "Initial concepts in your inbox within hours — not days. Designed, not drafted.",
    duration: "12 – 24 hrs",
  },
  {
    n: "03",
    title: "Refine",
    description: "Direct feedback loop. Revisions stay inside the original brief scope.",
    duration: "Same day",
  },
  {
    n: "04",
    title: "Delivery",
    description: "Print-ready, social-ready, source files included. Yours to use immediately.",
    duration: "Final",
  },
];

/**
 * Process — minimal numbered list.
 * No cards, no borders on individual steps. Just a clean horizontal timeline.
 */
export function Process() {
  return (
    <section className="py-12 md:py-16 bg-white border-t border-black" id="process">
      <div className="container-narrow">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0067b8] mb-2">
            How it works
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight mb-10">
            Brief to delivery — four steps.
          </h2>
        </Reveal>

        <Reveal y={10} delay={80}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 divide-[#cbd5e1] border-2 border-black rounded-2xl overflow-hidden">
            {STEPS.map((step) => (
              <div key={step.n} className="flex flex-col gap-2 p-5 bg-white hover:bg-[#f7f9fc] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-[#0067b8]">{step.n}</span>
                  <span className="text-[10.5px] font-medium text-[#444] border-2 border-black rounded-full px-2 py-0.5">
                    {step.duration}
                  </span>
                </div>
                <h3 className="text-[14px] font-semibold text-[#0a0a0a]">{step.title}</h3>
                <p className="text-[12.5px] text-[#333] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
