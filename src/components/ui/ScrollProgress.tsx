"use client";

import { useEffect, useRef } from "react";

/**
 * Thin gradient progress bar pinned to the top of the viewport. Reflects how
 * far the user has scrolled through the page. Uses requestAnimationFrame and
 * CSS scaleX so it stays cheap on the main thread.
 */
export function ScrollProgress() {
 const ref = useRef<HTMLDivElement>(null);

 useEffect(() => {
 if (typeof window === "undefined") return;
 const node = ref.current;
 if (!node) return;

 let raf = 0;
 const update = () => {
 const doc = document.documentElement;
 const max = doc.scrollHeight - window.innerHeight;
 const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
 node.style.transform = `scaleX(${ratio})`;
 raf = 0;
 };
 const onScroll = () => {
 if (raf) return;
 raf = requestAnimationFrame(update);
 };
 update();
 window.addEventListener("scroll", onScroll, { passive: true });
 window.addEventListener("resize", onScroll);
 return () => {
 window.removeEventListener("scroll", onScroll);
 window.removeEventListener("resize", onScroll);
 if (raf) cancelAnimationFrame(raf);
 };
 }, []);

 return (
 <div className="scroll-progress" aria-hidden>
 <div ref={ref} className="scroll-progress-bar" />
 </div>
 );
}
