import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/lib/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * ServicesMini — compact 6-tile grid of top services.
 * Solid surface cards only — NO glassmorphism, NO backdrop-filter.
 */
export function ServicesMini() {
  const featured = SERVICES.slice(0, 6);

  return (
    <section className="relative pt-3 pb-10 md:py-14 bg-background" id="services-mini">
      <div className="container-narrow">
        <Reveal>
          <SectionHeading
            eyebrow="What we do"
            title={
              <>
                Our service lines.{" "}
                <span className="text-primary">One studio.</span>
              </>
            }
            align="left"
          />
        </Reveal>

        <Reveal y={12}>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {featured.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.id}
                  className="flex flex-col items-start gap-2.5 rounded-2xl border border-card-border bg-card p-4 transition-colors hover:border-primary/50"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Icon size={16} aria-hidden />
                  </span>
                  <p className="font-display text-sm font-bold text-foreground leading-tight">
                    {service.title}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {service.startingPrice}
                  </p>
                </article>
              );
            })}
          </div>
        </Reveal>

        <Reveal>
          <Link
            href="/services"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            All 14 services <ArrowUpRight size={14} aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
