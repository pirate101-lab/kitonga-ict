import Link from "next/link";
import {
  buildWhatsAppUrl,
  DEFAULT_FAST_ORDER_MESSAGE,
} from "@/lib/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * FinalCTA — absolute minimum height.
 * Headline + two buttons + one small link. Nothing else.
 */
export function FinalCTA() {
  const fastOrderHref = buildWhatsAppUrl(DEFAULT_FAST_ORDER_MESSAGE);

  return (
    <section className="py-8 md:py-10 border-t border-[#9ca3af] bg-white" id="cta">
      <div className="container-narrow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          {/* Left: headline only */}
          <div>
            <h2 className="text-[15px] font-bold text-[#0a0a0a] leading-snug">
              Brief us on WhatsApp.
            </h2>
            <p className="text-[13px] text-[#333] mt-0.5">
              Reply within the hour, Mon – Sat.
            </p>
          </div>

          {/* Right: buttons */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <WhatsAppButton
              href={fastOrderHref}
              size="md"
              className="rounded-lg"
              order={{ service: "Fast Order (CTA)" }}
            >
              Open WhatsApp
            </WhatsAppButton>
            <Link
              href="/order"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-[#9ca3af] bg-white text-[13px] font-medium text-[#111] hover:border-[#0067b8] hover:text-[#0067b8] transition-colors"
            >
              Order form
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
