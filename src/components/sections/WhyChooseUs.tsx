import { VALUE_PROPS } from "@/lib/services";

/**
 * WhyChooseUs — compact inline icon+title strip, same on all breakpoints.
 */
export function WhyChooseUs() {
  return (
    <section className="bg-[#f2f5f9] py-4 border-t border-[#e2e8f0]" id="why-us">
      <div className="container-narrow">
        <div className="flex flex-row flex-wrap items-center justify-around gap-x-4 gap-y-2 py-1">
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
      </div>
    </section>
  );
}
