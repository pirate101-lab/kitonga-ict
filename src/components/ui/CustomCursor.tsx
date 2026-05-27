"use client";

import { useEffect, useRef, useState } from "react";

const HOVER_SELECTOR =
 'a, button, [role="button"], summary, label[for], input[type="checkbox"], input[type="radio"], select, [data-cursor="hover"]';

/**
 * Subtle premium cursor — a small dot + larger ring that lerps toward the
 * pointer. Scales up on interactive elements. Disabled on touch devices and
 * when the user prefers reduced motion (we fall back to the native cursor).
 */
export function CustomCursor() {
 const [enabled, setEnabled] = useState(false);
 const dotRef = useRef<HTMLDivElement>(null);
 const ringRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 if (typeof window === "undefined") return;

 const fine = window.matchMedia("(pointer: fine)").matches;
 const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 if (!fine || reduce) return;

 setEnabled(true);
 document.documentElement.classList.add("cursor-custom");

 const dot = dotRef.current;
 const ring = ringRef.current;
 if (!dot || !ring) return;

 let mx = window.innerWidth / 2;
 let my = window.innerHeight / 2;
 let rx = mx;
 let ry = my;
 let raf = 0;
 let pressed = false;
 let hover = false;

 const onMove = (e: PointerEvent) => {
 mx = e.clientX;
 my = e.clientY;
 // Hard-snap the dot, lerp the ring.
 dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
 };

 const onDown = () => {
 pressed = true;
 ring.classList.add("cursor-pressed");
 };
 const onUp = () => {
 pressed = false;
 ring.classList.remove("cursor-pressed");
 };

 const onOver = (e: PointerEvent) => {
 const target = e.target as Element | null;
 const isHover = !!target?.closest?.(HOVER_SELECTOR);
 if (isHover !== hover) {
 hover = isHover;
 ring.classList.toggle("cursor-hover", isHover);
 }
 };

 const onLeave = () => {
 ring.classList.add("cursor-hidden");
 dot.classList.add("cursor-hidden");
 };
 const onEnter = () => {
 ring.classList.remove("cursor-hidden");
 dot.classList.remove("cursor-hidden");
 };

 const tick = () => {
 // Lerp ring toward pointer for a soft trail.
 const ease = pressed ? 0.32 : 0.18;
 rx += (mx - rx) * ease;
 ry += (my - ry) * ease;
 ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
 raf = requestAnimationFrame(tick);
 };

 window.addEventListener("pointermove", onMove, { passive: true });
 window.addEventListener("pointerover", onOver, { passive: true });
 window.addEventListener("pointerdown", onDown);
 window.addEventListener("pointerup", onUp);
 document.addEventListener("pointerleave", onLeave);
 document.addEventListener("pointerenter", onEnter);
 raf = requestAnimationFrame(tick);

 return () => {
 cancelAnimationFrame(raf);
 window.removeEventListener("pointermove", onMove);
 window.removeEventListener("pointerover", onOver);
 window.removeEventListener("pointerdown", onDown);
 window.removeEventListener("pointerup", onUp);
 document.removeEventListener("pointerleave", onLeave);
 document.removeEventListener("pointerenter", onEnter);
 document.documentElement.classList.remove("cursor-custom");
 };
 }, []);

 if (!enabled) return null;

 return (
 <>
 <div ref={ringRef} aria-hidden className="cursor-ring" />
 <div ref={dotRef} aria-hidden className="cursor-dot" />
 </>
 );
}
