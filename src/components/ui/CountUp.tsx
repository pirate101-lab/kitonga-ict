"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Props = {
 /** Final numeric value the counter rolls to. */
 to: number;
 /** Optional starting value. Defaults to 0. */
 from?: number;
 /** Total animation duration in ms. */
 duration?: number;
 /** String prefix (e.g. "<", "$"). */
 prefix?: string;
 /** String suffix (e.g. "+", "h", "%"). */
 suffix?: string;
 /** How many decimals to show. Defaults to 0. */
 decimals?: number;
 /** Group thousands with `,`. Defaults to true. */
 separator?: boolean;
 /** Trigger only once (default). */
 once?: boolean;
 className?: string;
};

const useIsoLayoutEffect =
 typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Animated count-up. Renders the final value during SSR + first paint
 * (so search engines, no-JS visitors, and slow connections see the real
 * number), then on mount decides whether to animate:
 *
 * - already on screen → snap to `from` and roll up to `to` immediately
 * - off-screen below → wait for IntersectionObserver, then animate
 * - prefers-reduced-motion → never animate, leave at `to`
 */
export function CountUp({
 to,
 from = 0,
 duration = 1600,
 prefix = "",
 suffix = "",
 decimals = 0,
 separator = true,
 once = true,
 className,
}: Props) {
 const ref = useRef<HTMLSpanElement | null>(null);
 const [value, setValue] = useState<number>(to);
 const startedRef = useRef<boolean>(false);

 useIsoLayoutEffect(() => {
 const node = ref.current;
 if (!node) return;

 const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 if (reduce) {
 setValue(to);
 return;
 }

 let rafId: number | undefined;
 const start = (): void => {
 if (startedRef.current) return;
 startedRef.current = true;

 // Snap to `from` only at the start of the animation; this avoids the
 // visual jump that would happen if we did it during render.
 setValue(from);
 const t0 = performance.now();
 const tick = (now: number): void => {
 const elapsed = now - t0;
 const progress = Math.min(1, elapsed / duration);
 const eased = 1 - Math.pow(1 - progress, 3);
 const current = from + (to - from) * eased;
 setValue(current);
 if (progress < 1) rafId = requestAnimationFrame(tick);
 };
 rafId = requestAnimationFrame(tick);
 };

 const rect = node.getBoundingClientRect();
 const vh = window.innerHeight || document.documentElement.clientHeight;
 if (rect.top < vh * 0.95) {
 // Already on screen — animate now.
 start();
 return () => {
 if (rafId !== undefined) cancelAnimationFrame(rafId);
 };
 }

 const obs = new IntersectionObserver(
 (entries) => {
 for (const entry of entries) {
 if (entry.isIntersecting) {
 start();
 if (once) obs.unobserve(node);
 }
 }
 },
 { rootMargin: "0px 0px -10% 0px", threshold: 0.2 },
 );
 obs.observe(node);

 return () => {
 obs.disconnect();
 if (rafId !== undefined) cancelAnimationFrame(rafId);
 };
 }, [to, from, duration, once]);

 const formatted = value.toLocaleString(undefined, {
 minimumFractionDigits: decimals,
 maximumFractionDigits: decimals,
 useGrouping: separator,
 });

 return (
 <span ref={ref} className={className}>
 {prefix}
 {formatted}
 {suffix}
 </span>
 );
}
