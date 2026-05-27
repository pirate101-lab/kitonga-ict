"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import {
  NAV_LINKS,
  buildWhatsAppUrl,
  DEFAULT_FAST_ORDER_MESSAGE,
} from "@/lib/site";

/**
 * Sticky editorial light navbar with a 1px slate hairline at the bottom
 * and the canonical WhatsApp green Fast Order button on the right.
 *
 * The brand block on the left is a flat editorial wordmark — circular
 * logo + "KITONGA-ICT" text at `text-xl md:text-2xl`, plain black slate
 * (text-slate-900). No 3D, no text-shadow, no blur. The text is forced
 * to a single line via `whitespace-nowrap` so it never wraps on mobile.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const fastOrderHref = buildWhatsAppUrl(DEFAULT_FAST_ORDER_MESSAGE);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 supports-[backdrop-filter]:backdrop-blur text-foreground border-b border-card-border">
      <div className="container-narrow">
        <nav className="flex items-center justify-between gap-3 py-3">
          <Link
            href="/"
            aria-label="KITONGA-ICT — home"
            className="shrink-0"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/brand/logo-round.png"
                alt=""
                width={36}
                height={36}
                priority={true}
                quality={60}
                sizes="40px"
                className="rounded-full object-cover shrink-0"
                style={{ width: 36, height: 36 }}
              />
              <span className="font-display text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase whitespace-nowrap">
                KITONGA-ICT
              </span>
            </div>
          </Link>

          <ul className="hidden lg:flex items-center gap-1 text-sm">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "px-3 py-1.5 rounded-lg font-semibold transition-colors",
                      active
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground hover:text-primary hover:bg-secondary",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/login"
              className={cn(
                "px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors",
                isActive("/login")
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-secondary",
              )}
            >
              Sign in
            </Link>
            <WhatsAppButton href={fastOrderHref} size="sm">
              Fast Order
            </WhatsAppButton>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <WhatsAppButton href={fastOrderHref} size="sm" className="px-3 py-1.5 text-xs">
              Order
            </WhatsAppButton>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-card-border bg-card text-foreground hover:text-primary hover:border-primary transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile sheet */}
      <div
        className={cn(
          "lg:hidden fixed inset-x-0 top-[52px] bottom-0 z-40 transition-opacity duration-200",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-foreground/30"
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-x-3 top-2 rounded-2xl bg-card border border-card-border transition-transform duration-200",
            open ? "translate-y-0" : "-translate-y-2",
          )}
        >
          <div className="py-4 px-4">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block px-2 py-2.5 text-base font-semibold rounded-lg",
                        active
                          ? "bg-secondary text-primary"
                          : "text-foreground hover:bg-secondary hover:text-primary",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/login"
                  className="block px-2 py-2.5 text-base font-semibold text-foreground rounded-lg hover:bg-secondary hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
              </li>
            </ul>
            <WhatsAppButton
              href={fastOrderHref}
              size="md"
              className="mt-3 w-full"
              onClick={() => setOpen(false)}
            >
              Start a Fast Order
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </header>
  );
}
