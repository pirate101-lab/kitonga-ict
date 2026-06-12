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
 * Navbar — minimal Azure light theme.
 * White bar · 1px bottom border · no shadow · no blur.
 * Azure-blue active states. Single primary CTA.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const fastOrderHref = buildWhatsAppUrl(DEFAULT_FAST_ORDER_MESSAGE);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200/30">
      <div className="container-narrow">
        <nav className="flex items-center justify-between gap-4 h-[56px]">

          {/* Brand */}
          <Link href="/" aria-label="KITONGA-ICT — home" className="shrink-0 flex items-center gap-2.5">
            <Image
              src="/brand/logo-round.png"
              alt=""
              width={34}
              height={34}
              priority
              quality={60}
              sizes="40px"
              className="rounded-full object-cover shrink-0"
              style={{ width: 34, height: 34 }}
            />
            <span
              className="whitespace-nowrap select-none"
              style={{
                fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: "15px",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#0a0a0a",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              KITONGA-ICT
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[13px] transition-colors duration-150",
                      active
                        ? "bg-[#e8f0fb] text-[#0067b8] font-semibold"
                        : "text-[#333] hover:text-[#0a0a0a] hover:bg-gray-100 font-medium",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Link
              href="/login"
              className={cn(
                "px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors border",
                isActive("/login")
                  ? "bg-[#e8f0fb] text-[#0067b8] border-transparent"
                  : "text-[#333] hover:text-[#0a0a0a] border-transparent hover:border-[#9ca3af]",
              )}
            >
              Sign in
            </Link>
            <a
              href={fastOrderHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white bg-[#0067b8] hover:bg-[#005a9e] border border-[#0067b8] hover:border-[#005a9e] transition-colors"
            >
              Fast Order
            </a>
          </div>

          {/* Mobile right */}
          <div className="flex items-center gap-2 lg:hidden">
            <WhatsAppButton href={fastOrderHref} size="sm" className="px-3 py-1.5 text-xs rounded-lg">
              Order
            </WhatsAppButton>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-[#9ca3af] text-[#333] hover:text-[#0067b8] transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile panel */}
      <div
        className={cn(
          "lg:hidden fixed inset-x-0 top-[56px] bottom-0 z-40 transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-slate-900/15" onClick={() => setOpen(false)} />
        <div
          className={cn(
            "absolute inset-x-3 top-2 rounded-2xl bg-white border border-[#9ca3af] transition-transform duration-200",
            open ? "translate-y-0" : "-translate-y-2",
          )}
        >
          <div className="py-3 px-3">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block px-3 py-2 text-[13.5px] font-medium rounded-lg",
                        active
                          ? "bg-[#e8f0fb] text-[#0067b8] font-semibold"
                          : "text-[#111] hover:bg-gray-50",
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
                  className="block px-3 py-2 text-[13.5px] font-medium text-[#111] rounded-lg hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
              </li>
            </ul>
            <a
              href={fastOrderHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-[13.5px] font-semibold text-white bg-[#0067b8] hover:bg-[#005a9e] transition-colors"
              onClick={() => setOpen(false)}
            >
              Start a Fast Order
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
