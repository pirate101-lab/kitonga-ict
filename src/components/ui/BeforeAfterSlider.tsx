"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type BeforeAfterSliderProps = {
 /** Rendered as the "before" view (e.g. raw photo or wireframe). */
 before: React.ReactNode;
 /** Rendered as the "after" view (final design). */
 after: React.ReactNode;
 /** Optional caption labels. */
 beforeLabel?: string;
 afterLabel?: string;
 /** Initial position (0 - 100). */
 initial?: number;
 className?: string;
 ariaLabel?: string;
};

/**
 * Draggable Before/After comparison slider. The underlying slider logic
 * (state, pointer/keyboard handlers, clip-path math) is UNCHANGED — only the
 * visual presentation has been flattened to a razor-thin line and a flat
 * circular handle.
 */
export function BeforeAfterSlider({
 before,
 after,
 beforeLabel = "Before",
 afterLabel = "After",
 initial = 50,
 className,
 ariaLabel = "Before and after comparison slider",
}: BeforeAfterSliderProps) {
 const containerRef = useRef<HTMLDivElement>(null);
 const [position, setPosition] = useState(initial);
 const [dragging, setDragging] = useState(false);

 const updateFromClientX = useCallback((clientX: number) => {
 const el = containerRef.current;
 if (!el) return;
 const rect = el.getBoundingClientRect();
 const pct = ((clientX - rect.left) / rect.width) * 100;
 setPosition(Math.max(0, Math.min(100, pct)));
 }, []);

 useEffect(() => {
 if (!dragging) return;

 const onMove = (e: PointerEvent) => {
 updateFromClientX(e.clientX);
 };
 const onUp = () => setDragging(false);

 window.addEventListener("pointermove", onMove);
 window.addEventListener("pointerup", onUp);
 window.addEventListener("pointercancel", onUp);

 return () => {
 window.removeEventListener("pointermove", onMove);
 window.removeEventListener("pointerup", onUp);
 window.removeEventListener("pointercancel", onUp);
 };
 }, [dragging, updateFromClientX]);

 const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
 e.preventDefault();
 setDragging(true);
 updateFromClientX(e.clientX);
 };

 const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
 if (e.key === "ArrowLeft") {
 e.preventDefault();
 setPosition((p) => Math.max(0, p - 4));
 } else if (e.key === "ArrowRight") {
 e.preventDefault();
 setPosition((p) => Math.min(100, p + 4));
 } else if (e.key === "Home") {
 e.preventDefault();
 setPosition(0);
 } else if (e.key === "End") {
 e.preventDefault();
 setPosition(100);
 }
 };

 return (
 <div
 ref={containerRef}
 className={cn(
 "relative w-full overflow-hidden rounded-2xl border border-primary/25 bg-card select-none touch-none",
 dragging && "cursor-ew-resize",
 className,
 )}
 role="slider"
 aria-label={ariaLabel}
 aria-valuemin={0}
 aria-valuemax={100}
 aria-valuenow={Math.round(position)}
 tabIndex={0}
 onPointerDown={onPointerDown}
 onKeyDown={onKeyDown}
 >
 {/* AFTER (full background) */}
 <div className="absolute inset-0">{after}</div>

 {/* BEFORE clipped on top */}
 <div
 className="absolute inset-0"
 style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
 >
 {before}
 </div>

 {/* Rounded pill labels */}
 <span className="absolute left-3 top-3 rounded-full bg-primary text-foreground px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] ">
 {beforeLabel}
 </span>
 <span className="absolute right-3 top-3 rounded-full bg-white text-primary border border-primary/35 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] ">
 {afterLabel}
 </span>

 {/* Razor-thin vertical line — Electronic Blue */}
 <div
 className="pointer-events-none absolute top-0 bottom-0 w-px bg-primary"
 style={{ left: `${position}%` }}
 />

 {/* Handle — rounded white circle with Electronic Blue border */}
 <button
 type="button"
 aria-label="Drag to compare"
 onPointerDown={onPointerDown}
 className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 grid h-10 w-10 place-items-center rounded-full border-2 border-primary bg-white text-primary transition hover:bg-primary hover:text-foreground cursor-ew-resize"
 style={{ left: `${position}%` }}
 tabIndex={-1}
 >
 <svg
 width="18"
 height="18"
 viewBox="0 0 20 20"
 fill="none"
 aria-hidden
 >
 <path
 d="M7 4l-4 6 4 6"
 stroke="currentColor"
 strokeWidth="1.8"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 <path
 d="M13 4l4 6-4 6"
 stroke="currentColor"
 strokeWidth="1.8"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 </svg>
 </button>
 </div>
 );
}
