import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICES, SERVICE_CATEGORIES } from "@/lib/services";
import { buildWhatsAppUrl } from "@/lib/site";

/**
 * Services — independent rounded cards per service, grouped by category.
 * No shared outer rectangle. Each card stands alone on #f2f5f9.
 * No shadows. Border only.
 */
export function Services() {
  return (
    <section
      className="pt-12 pb-16 md:pt-16 md:pb-20"
      id="services"
      style={{ background: "#f2f5f9" }}
    >
      <div className="container-narrow">

        {/* Section header */}
        <Reveal>
          <div className="mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0067b8] mb-2">
              Services
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight leading-snug">
              What we do — and what you get.
            </h1>
            <p className="mt-2 text-[13.5px] text-[#333] max-w-xl leading-relaxed">
              Six focused offerings. Every job ships complete — print-ready, web-ready, or portal-submitted.
            </p>
          </div>
        </Reveal>

        {/* Category groups */}
        {SERVICE_CATEGORIES.map((cat) => {
          const inCat = SERVICES.filter((s) => s.category === cat);
          if (inCat.length === 0) return null;
          return (
            <Reveal key={cat} y={10} delay={60}>
              <div className="mb-10">
                {/* Category label */}
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#444] mb-4">
                  {cat}
                </h2>

                {/* Cards grid — each card is independent */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {inCat.map((service) => {
                    const Icon = service.icon;
                    const orderUrl = buildWhatsAppUrl(
                      `Hello KITONGA-ICT! I'd like to enquire about ${service.title}.\n\n— Sent from kitongaict.tech`,
                    );

                    return (
                      <article
                        key={service.id}
                        className="group flex flex-col bg-white rounded-2xl border border-black p-5 hover:border-[#0067b8]/25 transition-colors duration-150"
                      >
                        {/* Icon + title */}
                        <div className="flex items-start gap-3 mb-3">
                          <span
                            className="grid h-8 w-8 place-items-center rounded-lg shrink-0 mt-0.5"
                            style={{ background: "#e8f0fb", color: "#0067b8" }}
                            aria-hidden
                          >
                            <Icon size={15} />
                          </span>
                          <div>
                            <h3 className="text-[13.5px] font-semibold text-[#0a0a0a] leading-tight">
                              {service.title}
                            </h3>
                            <p className="text-[12px] text-[#444] mt-0.5 leading-snug">
                              {service.short}
                            </p>
                          </div>
                        </div>

                        {/* Bullets */}
                        <ul className="space-y-1 flex-1 mb-4">
                          {service.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2 text-[12px] text-[#333]">
                              <span className="mt-[5px] h-1 w-1 rounded-full bg-[#0067b8] shrink-0" aria-hidden />
                              {b}
                            </li>
                          ))}
                        </ul>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#f0f3f8]">
                          <div>
                            <span className="text-[11.5px] font-semibold text-[#0067b8]">
                              {service.startingPrice}
                            </span>
                            <span className="mx-2 text-gray-300">·</span>
                            <span className="text-[11px] text-[#444]">{service.turnaround}</span>
                          </div>
                          <a
                            href={orderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0067b8] hover:text-[#005a9e] transition-colors"
                            aria-label={`Order ${service.title}`}
                          >
                            Order
                            <ArrowUpRight size={12} aria-hidden />
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          );
        })}

        {/* Bottom CTA */}
        <div className="pt-2 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-[#0067b8] hover:text-[#005a9e] hover:underline underline-offset-2 transition-colors"
          >
            View our work
            <ArrowUpRight size={13} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
