"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
 ReactNode,
 useCallback,
 useEffect,
 useRef,
 useState,
} from "react";
import { cn } from "@/lib/utils";

export type CoverflowItem = {
 id: string;
 title: string;
 subtitle?: string;
 category?: string;
 href?: string;
 badge?: string;
 /** Image URL used as the slide background. Admin-editable. */
 image: string;
 /** Optional CSS background fallback used while the image loads. */
 background?: string;
 /** Optional foreground content rendered inside the slide (rarely used). */
 foreground?: ReactNode;
 /** Optional caption shown over the image bottom-left. */
 caption?: string;
 /** Optional CTA label / href shown over the active slide. */
 cta?: { label: string; href: string };
};

type Props = {
 items: CoverflowItem[];
 autoplayMs?: number;
 className?: string;
 /**
 * Card aspect-ratio fraction (h/w). Pass 0 or omit when fullBleed=true.
 * Defaults to 0.5 → 2:1 aspect.
 */
 aspect?: number;
 /**
 * When true the slider fills its containing block completely — no
 * inner padding-top trick. Used when the slider is a background layer.
 */
 fullBleed?: boolean;
 /** Hide the bottom prev/next/dots controls (used in background mode). */
 hideControls?: boolean;
};

/**
 * Flat image slider used in two modes:
 *
 * 1. Standalone (fullBleed=false, default): renders at a fixed aspect
 * ratio inside a container, with prev/next buttons and dot scrubber.
 *
 * 2. Background (fullBleed=true, hideControls=true): fills its parent
 * absolutely with no controls — used under the Hero text overlay.
 *
 * All slider logic (state, autoplay, keyboard, tab-visibility) is unchanged.
 */
export function CoverflowSlider({
 items,
 autoplayMs = 6500,
 className,
 aspect = 0.5,
 fullBleed = false,
 hideControls = false,
}: Props) {
 const total = items.length;
 const [index, setIndex] = useState(0);
 const [paused, setPaused] = useState(false);
 const containerRef = useRef<HTMLDivElement>(null);

 const go = useCallback(
 (delta: number) => {
 if (total === 0) return;
 setIndex((i) => (i + delta + total) % total);
 },
 [total],
 );

 const goTo = useCallback(
 (next: number) => {
 if (total === 0) return;
 setIndex(((next % total) + total) % total);
 },
 [total],
 );

 useEffect(() => {
 if (paused || total <= 1) return;
 const id = window.setInterval(() => go(1), autoplayMs);
 return () => window.clearInterval(id);
 }, [go, paused, autoplayMs, total]);

 useEffect(() => {
 const onVisibility = () => setPaused(document.hidden);
 document.addEventListener("visibilitychange", onVisibility);
 return () => document.removeEventListener("visibilitychange", onVisibility);
 }, []);

 useEffect(() => {
 const node = containerRef.current;
 if (!node) return;
 const onKey = (e: KeyboardEvent) => {
 if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
 else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
 };
 node.addEventListener("keydown", onKey);
 return () => node.removeEventListener("keydown", onKey);
 }, [go]);

 if (total === 0) return null;

 return (
 <div
 ref={containerRef}
 tabIndex={0}
 role="region"
 aria-roledescription="carousel"
 aria-label="Featured studio work"
 onMouseEnter={() => setPaused(true)}
 onMouseLeave={() => setPaused(false)}
 onFocus={() => setPaused(true)}
 onBlur={() => setPaused(false)}
 className={cn("relative select-none focus:outline-none", className)}
 >
 {/* Slide viewport */}
 {fullBleed ? (
 /* Full-bleed: fill parent absolutely */
 <div className="absolute inset-0 overflow-hidden">
 {items.map((item, i) => (
 <SlideContent
 key={item.id}
 item={item}
 active={i === index}
 showCaption={false}
 />
 ))}
 </div>
 ) : (
 /* Aspect-ratio box mode */
 <div
 className="relative w-full overflow-hidden rounded-2xl border border-primary/25 bg-card "
 style={{ paddingTop: `${aspect * 100}%` }}
 >
 {items.map((item, i) => (
 <SlideContent
 key={item.id}
 item={item}
 active={i === index}
 showCaption
 />
 ))}
 </div>
 )}

 {/* Controls — shown only in standalone mode */}
 {!hideControls && (
 <div className="mt-4 flex items-center justify-between gap-3">
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => go(-1)}
 aria-label="Previous slide"
 className="grid h-9 w-9 place-items-center rounded-xl border border-primary/20 bg-white text-foreground transition hover:border-primary/50 hover:text-primary"
 >
 <ChevronLeft size={15} aria-hidden />
 </button>
 <button
 type="button"
 onClick={() => go(1)}
 aria-label="Next slide"
 className="grid h-9 w-9 place-items-center rounded-xl border border-primary/20 bg-white text-foreground transition hover:border-primary/50 hover:text-primary"
 >
 <ChevronRight size={15} aria-hidden />
 </button>
 </div>

 <div className="flex items-center gap-1.5">
 {items.map((item, i) => {
 const isActive = i === index;
 return (
 <button
 key={item.id}
 type="button"
 onClick={() => goTo(i)}
 aria-label={`Go to slide ${i + 1}: ${item.title}`}
 className={cn(
 "h-1.5 rounded-full transition-all",
 isActive ? "w-7 bg-primary" : "w-2.5 bg-secondary hover:bg-secondary",
 )}
 />
 );
 })}
 </div>

 <div className="hidden sm:block min-w-[9rem] text-right">
 <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
 {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
 </p>
 <p className="text-xs font-bold text-foreground truncate">
 {items[index]?.title}
 </p>
 </div>
 </div>
 )}
 </div>
 );
}

/**
 * Individual slide — the image, the gradient overlay and the caption.
 * Renders in both full-bleed and aspect-ratio contexts.
 */
function SlideContent({
 item,
 active,
 showCaption,
}: {
 item: CoverflowItem;
 active: boolean;
 showCaption: boolean;
}) {
 return (
 <div
 aria-hidden={!active}
 className={cn(
 "absolute inset-0 transition-opacity duration-700 ease-out",
 active ? "opacity-100" : "opacity-0 pointer-events-none",
 )}
 >
 {/* Admin-uploaded or default image */}
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img
 src={item.image}
 alt={item.title}
 loading={active ? "eager" : "lazy"}
 decoding="async"
 draggable={false}
 className="absolute inset-0 h-full w-full object-cover"
 />

 {/* Gradient for caption legibility */}
 <div
 aria-hidden
 className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
 />

 {/* Category + badge pills */}
 <div className="absolute left-3 top-3 flex items-center gap-2">
 {item.category ? (
 <span className="rounded-full bg-primary text-foreground px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
 {item.category}
 </span>
 ) : null}
 {item.badge ? (
 <span className="rounded-full bg-white text-primary border border-primary/30 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
 {item.badge}
 </span>
 ) : null}
 </div>

 {/* Bottom caption (standalone mode only) */}
 {showCaption && (
 <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
 <div className="flex items-end justify-between gap-4">
 <div className="min-w-0">
 {item.subtitle ? (
 <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground font-mono">
 {item.subtitle}
 </p>
 ) : null}
 <h3 className="font-display text-xl sm:text-2xl font-black text-foreground tracking-tight truncate hero-3d">
 {item.title}
 </h3>
 {item.caption ? (
 <p className="mt-0.5 text-sm text-foreground line-clamp-2 max-w-xl">
 {item.caption}
 </p>
 ) : null}
 </div>
 {item.cta ? (
 <a
 href={item.cta.href}
 className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-white text-primary hover:bg-primary/10 px-3.5 py-2 text-xs font-bold tracking-tight "
 >
 {item.cta.label}
 <ChevronRight size={13} aria-hidden />
 </a>
 ) : null}
 </div>
 </div>
 )}
 </div>
 );
}
