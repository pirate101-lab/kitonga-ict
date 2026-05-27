"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { buildWhatsAppUrl, DEFAULT_FAST_ORDER_MESSAGE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * Floating bottom-right stack:
 * - Persistent WhatsApp Fast-Order pill (visible after a short scroll).
 * - Back-to-top button (visible after scrolling past the fold).
 *
 * Preserves all scroll logic and the WhatsApp dynamic pre-fill link.
 */
export function FloatingActions() {
 const [shown, setShown] = useState(false);
 const [topShown, setTopShown] = useState(false);

 useEffect(() => {
 const onScroll = () => {
 const y = window.scrollY;
 setShown(y > 320);
 setTopShown(y > 800);
 };
 onScroll();
 window.addEventListener("scroll", onScroll, { passive: true });
 return () => window.removeEventListener("scroll", onScroll);
 }, []);

 const fastOrderHref = buildWhatsAppUrl(DEFAULT_FAST_ORDER_MESSAGE);

 return (
 <div
 className={cn(
 "fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6",
 "transition-opacity duration-200",
 shown
 ? "opacity-100 pointer-events-auto"
 : "opacity-0 pointer-events-none",
 )}
 aria-hidden={!shown}
 >
 <button
 type="button"
 onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
 aria-label="Back to top"
 className={cn(
 "grid h-10 w-10 place-items-center rounded-xl border border-primary/30 bg-card text-foreground hover:text-primary hover:border-primary transition ",
 topShown ? "opacity-100" : "opacity-0 pointer-events-none",
 )}
 >
 <ArrowUp size={16} aria-hidden />
 </button>

 <WhatsAppButton href={fastOrderHref} size="md" className="px-4" order={{ service: "Fast Order (floating)" }}>
 <span className="hidden sm:inline">Fast Order</span>
 </WhatsAppButton>
 </div>
 );
}
