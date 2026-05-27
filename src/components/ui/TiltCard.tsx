"use client";

import {
 CSSProperties,
 ReactNode,
 useCallback,
 useEffect,
 useRef,
 useState,
} from "react";
import { cn } from "@/lib/utils";

type Props = {
 children: ReactNode;
 className?: string;
 /** Max tilt angle in degrees. Defaults to 8. */
 maxTilt?: number;
 /** Glare opacity at full tilt. Defaults to 0.18. */
 glare?: number;
 /** Optional accent color used by the spotlight highlight. */
 accent?: string;
 /** Disable the effect (e.g. on touch). */
 disabled?: boolean;
 style?: CSSProperties;
};

/**
 * Mouse-tracked 3D tilt wrapper with a soft moving spotlight + glare.
 * Falls back to a static element on touch devices and when
 * `prefers-reduced-motion: reduce` is set.
 */
export function TiltCard({
 children,
 className,
 maxTilt = 8,
 glare = 0.2,
 accent = "var(--accent)",
 disabled = false,
 style,
}: Props) {
 const ref = useRef<HTMLDivElement>(null);
 const [enabled, setEnabled] = useState(false);
 const [transform, setTransform] = useState<string>("");
 const [light, setLight] = useState<{ x: number; y: number; o: number }>({
 x: 50,
 y: 0,
 o: 0,
 });

 useEffect(() => {
 if (disabled) {
 setEnabled(false);
 return;
 }
 const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const touch = window.matchMedia("(pointer: coarse)").matches;
 setEnabled(!reduce && !touch);
 }, [disabled]);

 const handleMove = useCallback(
 (e: React.MouseEvent<HTMLDivElement>) => {
 if (!enabled) return;
 const node = ref.current;
 if (!node) return;
 const rect = node.getBoundingClientRect();
 const x = (e.clientX - rect.left) / rect.width;
 const y = (e.clientY - rect.top) / rect.height;
 const tiltX = (0.5 - y) * maxTilt * 2;
 const tiltY = (x - 0.5) * maxTilt * 2;
 setTransform(
 `perspective(900px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(0)`,
 );
 setLight({ x: x * 100, y: y * 100, o: glare });
 },
 [enabled, glare, maxTilt],
 );

 const handleLeave = useCallback(() => {
 setTransform("");
 setLight((s) => ({ ...s, o: 0 }));
 }, []);

 return (
 <div
 ref={ref}
 onMouseMove={handleMove}
 onMouseLeave={handleLeave}
 className={cn(
 "relative will-change-transform [transform-style:preserve-3d] transition-transform duration-150 ease-out",
 className,
 )}
 style={{
 ...style,
 transform: enabled ? transform : undefined,
 }}
 >
 {children}

 {/* Spotlight + glare overlays — non-interactive. */}
 {enabled ? (
 <>
 <span
 aria-hidden
 className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-200"
 style={{
 opacity: light.o,
 background: `radial-gradient(420px circle at ${light.x}% ${light.y}%, color-mix(in srgb, ${accent} 55%, transparent) 0%, transparent 60%)`,
 mixBlendMode: "screen",
 }}
 />
 <span
 aria-hidden
 className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
 >
 <span
 className="absolute -inset-y-2 w-1/3 rotate-12"
 style={{
 left: `${light.x - 50}%`,
 background:
 "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.10) 45%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.10) 55%, transparent 100%)",
 opacity: light.o,
 transition: "opacity 200ms ease, left 80ms linear",
 }}
 />
 </span>
 </>
 ) : null}
 </div>
 );
}
