import Link from "next/link";
import {
  buildWhatsAppUrl,
  DEFAULT_FAST_ORDER_MESSAGE,
} from "@/lib/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * Editorial light final CTA — white panel with a soft indigo mesh
 * background, big serif gradient headline and the canonical WhatsApp
 * green Fast Order button. No drop-shadows.
 *
 * Preserves the dynamic WhatsApp pre-fill logic via buildWhatsAppUrl().
 */
export function FinalCTA() {
  const fastOrderHref = buildWhatsAppUrl(DEFAULT_FAST_ORDER_MESSAGE);

  return (
    <section className="relative py-12 md:py-16 bg-background" id="cta">
      <div className="container-narrow">
        <div className="relative overflow-hidden rounded-2xl bg-card border border-card-border text-foreground px-6 py-10 sm:px-10 sm:py-14">
          {/* Soft editorial indigo / electric-blue mesh */}
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-mesh opacity-70" />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            <span className="cyber-pill">Ready when you are</span>

            <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight text-foreground">
              <span className="block">Skip the form.</span>
              <span className="text-accent-gradient block">Go straight to studio.</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
              Tap below to open WhatsApp with a pre-filled brief. We&apos;ll
              reply with a quote, a timeline, and the first concept — usually
              within the hour.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              <WhatsAppButton
                href={fastOrderHref}
                size="lg"
                className="w-full sm:w-auto"
                order={{ service: "Fast Order (final CTA)" }}
              >
                Start a Fast Order
              </WhatsAppButton>
              <Link href="/order" className="btn-ghost w-full sm:w-auto">
                Use the intake form
              </Link>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Prefer a long-term partnership?{" "}
              <Link
                href="/signup"
                className="font-bold text-primary underline-offset-4 hover:underline"
              >
                Create an account
              </Link>{" "}
              to track revisions and downloads.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
