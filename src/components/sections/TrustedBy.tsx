import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";

type Stat = {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
};

const STATS: Stat[] = [
  { to: 240, suffix: "+", label: "Briefs delivered" },
  { to: 64, suffix: "+", label: "Brands served" },
  { to: 12, suffix: " yrs", label: "Studio history" },
  { to: 5.0, suffix: "★", decimals: 1, label: "Average rating" },
];

/**
 * Light "Trusted by" strip.
 *
 * The 8-tile brand wordmark grid that previously sat at the top of this
 * section has been removed per the layout brief — the section now
 * focuses on the impact-stats row and a single concise tagline.
 */
export function TrustedBy() {
  return (
    <section
      className="relative overflow-hidden border-y border-card-border bg-background py-10 md:py-12"
      id="trusted-by"
      aria-label="Studio impact at a glance"
    >
      <div className="container-narrow">
        <Reveal>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Trusted by founders, marketing leads, and creative directors
            </span>
            <span
              className="block h-0.5 w-14 rounded-full bg-primary mt-1"
              aria-hidden
            />
          </div>
        </Reveal>

        {/* Impact stats */}
        <Reveal y={12} delay={120}>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-card-border bg-card px-3.5 py-4 text-center"
              >
                <div className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-primary">
                  <CountUp
                    to={s.to}
                    suffix={s.suffix}
                    decimals={s.decimals ?? 0}
                    duration={1400}
                  />
                </div>
                <div className="mt-0.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
