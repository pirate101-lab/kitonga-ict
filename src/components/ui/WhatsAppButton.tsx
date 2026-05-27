"use client";

import type { AnchorHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { logOrder } from "@/lib/order-tracker";

/**
 * Premium WhatsApp glyph (speech bubble + handset).
 * High-contrast, fills with `currentColor` so it inherits text colour.
 */
export function WhatsAppIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M16.001 0C7.165 0 0 7.165 0 16c0 2.832.74 5.6 2.146 8.04L0 32l8.18-2.135A15.953 15.953 0 0 0 16 32c8.835 0 16-7.164 16-16S24.836 0 16.001 0Zm0 29.27a13.247 13.247 0 0 1-6.748-1.85l-.483-.288-4.853 1.267 1.292-4.74-.314-.503A13.234 13.234 0 0 1 2.731 16C2.731 8.682 8.682 2.731 16 2.731c7.319 0 13.27 5.951 13.27 13.269 0 7.318-5.951 13.27-13.269 13.27Zm7.286-9.93c-.4-.2-2.366-1.166-2.733-1.299-.367-.133-.633-.2-.9.2-.265.4-1.033 1.299-1.266 1.566-.234.266-.467.3-.867.1-.4-.2-1.687-.621-3.213-1.984-1.187-1.06-1.99-2.367-2.224-2.767-.233-.4-.025-.616.176-.815.18-.18.4-.467.6-.7.2-.234.267-.4.4-.667.133-.267.067-.5-.034-.7-.1-.2-.9-2.166-1.232-2.967-.323-.776-.652-.671-.9-.683-.234-.012-.5-.014-.766-.014a1.476 1.476 0 0 0-1.067.5c-.367.4-1.4 1.367-1.4 3.333 0 1.967 1.434 3.866 1.633 4.133.2.267 2.823 4.31 6.84 6.044.955.412 1.7.658 2.281.842.957.305 1.829.262 2.518.16.768-.115 2.366-.967 2.7-1.9.333-.933.333-1.733.234-1.9-.1-.166-.367-.266-.767-.466Z" />
    </svg>
  );
}

type CommonProps = {
  /** Forwards as a `?text=` pre-filled WhatsApp deep link. */
  href: string;
  /** Visible label (defaults to "Fast Order"). */
  children?: ReactNode;
  className?: string;
  /** Visual size — controls padding. */
  size?: "sm" | "md" | "lg";
  /**
   * Optional order metadata. When provided, the click is logged into
   * the admin order-tracker so the WhatsApp brief shows up on the
   * /admin/orders Kanban automatically.
   */
  order?: {
    client?: string;
    service?: string;
    brief?: string;
    amount?: string;
  };
};

const sizes: Record<NonNullable<CommonProps["size"]>, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

/**
 * The canonical "Fast Order" button. WhatsApp green background, near-black
 * bold text, rounded-xl corners, WhatsApp glyph on the left. No drop-shadows.
 *
 * The `href` is expected to be a `https://wa.me/<number>?text=<encoded>`
 * URL — typically built via `buildWhatsAppUrl(...)`. Preserves the
 * existing Fast Order routing logic verbatim.
 */
export function WhatsAppButton({
  href,
  children = "Fast Order",
  className,
  size = "md",
  order,
  onClick,
  ...rest
}: CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps>) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (order) {
      logOrder({
        client: order.client ?? "Direct WhatsApp",
        service: order.service ?? "General brief",
        brief: order.brief ?? "(direct WhatsApp Fast Order)",
        amount: order.amount,
        channel: "WhatsApp",
      });
    }
    if (onClick) onClick(e);
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-bold text-foreground",
        "bg-[#25D366] hover:bg-[#1fb557] border border-[#1fb557] transition-colors",
        sizes[size],
        className,
      )}
      {...rest}
    >
      <WhatsAppIcon size={size === "lg" ? 18 : size === "sm" ? 14 : 16} />
      {children}
    </a>
  );
}

/**
 * Same WhatsApp pill but as a `<button>` element — used inside forms
 * (e.g. FastOrderForm) where a button rather than an anchor is needed.
 */
export function WhatsAppButtonButton({
  className,
  children = "Send via WhatsApp",
  size = "md",
  ...rest
}: { children?: ReactNode; className?: string; size?: "sm" | "md" | "lg" } &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children">) {
  return (
    <button
      type="submit"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-bold text-foreground",
        "bg-[#25D366] hover:bg-[#1fb557] border border-[#1fb557] transition-colors",
        sizes[size],
        className,
      )}
      {...rest}
    >
      <WhatsAppIcon size={size === "lg" ? 18 : size === "sm" ? 14 : 16} />
      {children}
    </button>
  );
}
