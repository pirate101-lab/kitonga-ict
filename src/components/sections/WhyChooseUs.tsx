import { Reveal } from "@/components/ui/Reveal";
import { VALUE_PROPS } from "@/lib/services";

/**
 * WhyChooseUs — compact strip on mobile, full layout on desktop.
 * Mobile: tight horizontal flex row, no heading, minimal padding.
 * Desktop: unchanged — heading + 3-column grid.
 */
export function WhyChooseUs() {
  return (
    <section className="bg-[#f2f5f9] py-4 md:py-12 lg:py-16" id="why-us">
      <div className="container-narrow">

        {/* Heading — desktop only */}
        <Reveal>
          <div className="hidden md:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0067b8] mb-2">
              Why us
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight mb-8">
              Fast. Precise. No back-and-forth.
            </h2>
          </div>
        </Reveal>

        {/* Mobile: compact inline strip */}
        <div className="flex md:hidden flex-row flex-wrap items-center justify-around gap-x-3 gap-y-2 py-1">
          {VALUE_PROPS.map((vp) => {
            const Icon = vp.icon;
            return (
              <div key={vp.title} className="flex items-center gap-1.5">
                <span
                  className="grid h-6 w-6 place-items-center rounded-md shrink-0"
                  style={{ background: "#e8f0fb", color: "#0067b8" }}
                  aria-hidden
                >
                  <Icon size={12} />
                </span>
                <span className="text-[12px] font-semibold text-[#0a0a0a] leading-none whitespace-nowrap">
                  {vp.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Desktop: full 3-column grid */}
        <Reveal y={10} delay={80}>
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#cbd5e1]">
            {VALUE_PROPS.map((vp, i) => {
              const Icon = vp.icon;
              return (
                <div key={vp.title} className="flex flex-col gap-2 py-6 md:py-0 md:px-8 first:md:pl-0 last:md:pr-0">
                  <span
                    className="grid h-8 w-8 place-items-center rounded-lg mb-1"
                    style={{ background: "#e8f0fb", color: "#0067b8" }}
                    aria-hidden
                  >
                    <Icon size={15} />
                  </span>
                  <span className="text-[11px] font-bold text-[#444] uppercase tracking-widest">0{i + 1}</span>
                  <h3 className="text-[14px] font-semibold text-[#0a0a0a] leading-snug">{vp.title}</h3>
                  <p className="text-[13px] text-[#333] leading-relaxed">{vp.description}</p>
                </div>
              );
            })}
          </div>
        </Reveal>

      </div>
    </section>
  );
}
