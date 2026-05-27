import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={cn("flex flex-col gap-3 max-w-3xl", alignment, className)}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight text-foreground pb-2">
        {title}
      </h2>
      {description ? (
        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl">
          {description}
        </p>
      ) : null}
    </div>
  );
}
