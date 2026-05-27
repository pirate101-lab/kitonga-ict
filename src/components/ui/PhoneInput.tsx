"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type PhoneInputProps = {
  value: string;
  onChange: (next: string) => void;
  /** Optional aria-label for screen readers. */
  ariaLabel?: string;
  /** Disabled state. */
  disabled?: boolean;
  /** Visual size — controls padding. */
  size?: "md" | "lg";
  /** Optional className passthrough. */
  className?: string;
  /** Auto-focus the field on mount. */
  autoFocus?: boolean;
  /** Optional inputmode override (defaults to "numeric"). */
  inputMode?: "numeric" | "tel";
};

/**
 * Kenyan phone number input.
 *
 * The "+254" country code is rendered as a fixed, locked prefix on the
 * left of the field; the user only ever types the local number. We do
 * NOT show floating labels, hints, or real-time validation feedback —
 * the brief asks for a perfectly clean UI. Sanitisation/normalisation
 * happens silently in the submit handler via `normaliseKenyanPhone()`.
 *
 * The visible portion strips non-digits as the user types, but
 * preserves whatever they pasted in the upstream value so we can
 * accept "0712...", "07 12 34..." etc. equally well.
 */
export function PhoneInput({
  value,
  onChange,
  ariaLabel = "Phone number",
  disabled,
  size = "md",
  className,
  autoFocus,
  inputMode = "numeric",
}: PhoneInputProps) {
  const id = useId();

  const padY = size === "lg" ? "py-3" : "py-2.5";

  return (
    <div
      className={cn(
        "flex items-stretch rounded-xl border border-card-border bg-card transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30",
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
    >
      {/* Locked country code */}
      <span
        className={cn(
          "select-none flex items-center px-3 text-sm font-semibold text-muted-foreground border-r border-card-border bg-secondary rounded-l-xl",
          padY,
        )}
        aria-hidden
      >
        +254
      </span>
      <input
        id={id}
        type="tel"
        inputMode={inputMode}
        autoComplete="tel-national"
        aria-label={ariaLabel}
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground",
          padY,
        )}
      />
    </div>
  );
}
