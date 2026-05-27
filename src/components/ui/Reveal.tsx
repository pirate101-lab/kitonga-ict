"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
 children: ReactNode;
 className?: string;
 /** Pixels to translate from on the way in. Defaults to 24. */
 y?: number;
 /** Stagger delay in ms. */
 delay?: number;
 /** Animation duration in ms. */
 duration?: number;
 /** Only run once (default true). If false, the element re-animates on re-entry. */
 once?: boolean;
 /** IntersectionObserver root margin — controls how early the reveal triggers. */
 rootMargin?: string;
 as?: keyof React.JSX.IntrinsicElements;
};

// useLayoutEffect on the client, useEffect on the server (no warning).
const useIsoLayoutEffect =
 typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Lightweight scroll-reveal wrapper. Uses IntersectionObserver with
 * `prefers-reduced-motion` short-circuit. Applies a transform + opacity
 * transition once the element enters the viewport.
 *
 * Important: SSR + the first client paint always render the content
 * **fully visible** (no hidden state). The hidden / animated state is only
 * applied on the next paint, and only for elements that are still off-
 * screen. This avoids the "blank page until scroll" flash that comes from
 * starting all Reveals at opacity:0.
 */
export function Reveal({
 children,
 className,
 y = 24,
 delay = 0,
 duration = 700,
 once = true,
 rootMargin = "0px 0px -10% 0px",
 as = "div",
}: Props) {
 const ref = useRef<HTMLElement | null>(null);
 // `null` = not-yet-decided (rendered visible); true / false once mounted.
 const [visible, setVisible] = useState<boolean | null>(null);

 useIsoLayoutEffect(() => {
 const node = ref.current;
 if (!node) return;

 const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 if (reduce) {
 setVisible(true);
 return;
 }

 // Decide initial state from real geometry — anything already on screen
 // (or above) starts visible; only off-screen-below content animates in.
 const rect = node.getBoundingClientRect();
 const vh = window.innerHeight || document.documentElement.clientHeight;
 const alreadyOnScreen = rect.top < vh * 0.95;
 if (alreadyOnScreen) {
 setVisible(true);
 return;
 }

 setVisible(false);

 const obs = new IntersectionObserver(
 (entries) => {
 for (const entry of entries) {
 if (entry.isIntersecting) {
 setVisible(true);
 if (once) obs.unobserve(node);
 } else if (!once) {
 setVisible(false);
 }
 }
 },
 { rootMargin, threshold: 0.05 },
 );
 obs.observe(node);
 return () => obs.disconnect();
 }, [once, rootMargin]);

 const Tag = as as "div";
 // While `visible` is still null (SSR / first paint) render with no
 // animation classes so the content is immediately readable.
 const animated = visible !== null;
 return (
 <Tag
 ref={ref as React.Ref<HTMLDivElement>}
 className={cn(
 animated && "reveal",
 animated && visible && "reveal-in",
 className,
 )}
 style={
 animated
 ? {
 transitionDuration: `${duration}ms`,
 transitionDelay: `${delay}ms`,
 ["--reveal-y" as string]: `${y}px`,
 }
 : undefined
 }
 >
 {children}
 </Tag>
 );
}
