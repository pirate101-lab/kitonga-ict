import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";
type Size = "md" | "lg";

type CommonProps = {
 variant?: Variant;
 size?: Size;
 className?: string;
 children: ReactNode;
};

const sizeClasses: Record<Size, string> = {
 md: "text-sm py-3 px-5",
 lg: "text-base py-4 px-7",
};

function classes(variant: Variant, size: Size, className?: string) {
 const base = variant === "primary" ? "btn-primary" : "btn-ghost";
 return cn(base, sizeClasses[size], className);
}

type ButtonProps = CommonProps &
 Omit<ComponentProps<"button">, "className" | "children">;

export function Button({
 variant = "primary",
 size = "md",
 className,
 children,
 ...rest
}: ButtonProps) {
 return (
 <button {...rest} className={classes(variant, size, className)}>
 {children}
 </button>
 );
}

type LinkButtonProps = CommonProps &
 Omit<ComponentProps<typeof Link>, "className" | "children">;

export function LinkButton({
 variant = "primary",
 size = "md",
 className,
 children,
 ...rest
}: LinkButtonProps) {
 return (
 <Link {...rest} className={classes(variant, size, className)}>
 {children}
 </Link>
 );
}

type AnchorButtonProps = CommonProps &
 Omit<ComponentProps<"a">, "className" | "children">;

export function AnchorButton({
 variant = "primary",
 size = "md",
 className,
 children,
 ...rest
}: AnchorButtonProps) {
 return (
 <a {...rest} className={classes(variant, size, className)}>
 {children}
 </a>
 );
}
