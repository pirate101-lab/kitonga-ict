import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
 children: ReactNode;
 /** Retained for backward-compatibility; no longer affects styling. */
 variant?: "default" | "strong";
 glow?: boolean;
};

/**
 * Previously a "glass" card. Refactored to a clean white card with a crisp
 * 1px blue-tinted border, rounded-2xl corners and a soft micro-shadow.
 * The component API is unchanged so every call-site keeps working.
 */
export function GlassCard({
 children,
 className,
 ...rest
}: GlassCardProps) {
 return (
 <div
 {...rest}
 className={cn(
 "relative rounded-2xl border border-primary/25 bg-card p-4 md:p-5 ",
 className,
 )}
 >
 {children}
 </div>
 );
}
