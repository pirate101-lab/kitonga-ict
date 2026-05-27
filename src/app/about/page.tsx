import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Insights } from "@/components/sections/Insights";
import { Testimonials } from "@/components/sections/Testimonials";

export const metadata: Metadata = {
  title: "About the studio",
  description:
    "How KITONGA-ICT operates: a small team, on purpose. Studio principles, client testimonials, frequently asked questions, and field notes from the studio bench.",
};

export default function AboutPage() {
  return (
    <>
      <header className="relative bg-background pt-10 pb-6 md:pt-14 border-b border-card-border">
        <div className="container-narrow text-center">
          <span className="eyebrow">The studio, behind the curtain</span>
          <h1 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight text-foreground">
            A small team.{" "}
            <span className="text-accent-gradient">Studio standard, every time.</span>
          </h1>
          <p className="mt-3 mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
            Three creatives, one printer, and a quiet WhatsApp inbox — read on
            for principles, testimonials, FAQs and short reads from the bench.
          </p>
        </div>
      </header>

      <About />
      <Testimonials />
      <Insights />
      <FAQ />
      <FinalCTA />
    </>
  );
}
