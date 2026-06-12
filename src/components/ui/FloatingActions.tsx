"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Floating back-to-top button only.
 * The WhatsApp Fast Order pill has been removed — it overlapped UI elements.
 */
export function FloatingActions() {
  const [topShown, setTopShown] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setTopShown(window.scrollY > 800);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6",
        "transition-opacity duration-200",
        topShown
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
      )}
      aria-hidden={!topShown}
    >
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className="grid h-10 w-10 place-items-center rounded-xl border border-[#cbd5e1] bg-white text-[#333] hover:text-[#0067b8] hover:border-[#0067b8] transition-colors"
      >
        <ArrowUp size={16} aria-hidden />
      </button>
    </div>
  );
}
