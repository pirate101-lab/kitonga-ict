import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  withWordmark?: boolean;
  onDark?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
};

const PX = { sm: 32, md: 44, lg: 56, xl: 72 } as const;

/**
 * Per-size wordmark Tailwind classes. Mobile-first sizes are bumped at
 * the `md` breakpoint so the brand reads "massive" in the desktop navbar
 * while staying readable on phones.
 *
 *   sm: text-xl    md:text-2xl
 *   md: text-3xl   md:text-4xl     (← Navbar uses this)
 *   lg: text-4xl   md:text-5xl
 *   xl: text-5xl   md:text-6xl
 */
const WORDMARK_SIZE = {
  sm: "text-xl md:text-2xl",
  md: "text-3xl md:text-4xl",
  lg: "text-4xl md:text-5xl",
  xl: "text-5xl md:text-6xl",
} as const;

export function Logo({
  className,
  withWordmark = true,
  size = "md",
}: LogoProps) {
  const px = PX[size];
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src="/brand/logo-round.png"
        alt=""
        width={px}
        height={px}
        priority
        className={cn("rounded-full object-cover shrink-0")}
        style={{ width: px, height: px }}
      />
      {withWordmark ? (
        <span
          className={cn(
            "font-display font-black text-black select-none leading-none tracking-tighter",
            WORDMARK_SIZE[size],
          )}
        >
          KITONGA-ICT
        </span>
      ) : null}
    </span>
  );
}
