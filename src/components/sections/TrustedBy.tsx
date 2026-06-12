"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 240, suffix: "+", label: "Briefs delivered" },
  { value: 64, suffix: "+", label: "Brands served" },
  { value: 5, suffix: ".0★", label: "Client rating" },
  { value: 12, suffix: "h", label: "Avg. turnaround" },
];

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(target * ease));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-5 rounded-2xl border border-card-border bg-card">
      <span
        ref={ref}
        className="font-display text-3xl sm:text-4xl font-black text-foreground leading-none"
        aria-label={`${value}${suffix}`}
      >
        {count}{suffix}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground text-center">
        {label}
      </span>
    </div>
  );
}

/**
 * TrustedBy — animated stat counters. Solid surface cards only.
 */
export function TrustedBy() {
  return (
    <section
      className="py-10 md:py-14 bg-background border-b border-card-border"
      id="trusted-by"
      aria-label="Studio statistics"
    >
      <div className="container-narrow">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
