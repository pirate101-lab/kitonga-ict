import { BeforeAfterShowcase } from "@/components/sections/BeforeAfterShowcase";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";

/**
 * Home — focused editorial landing.
 *
 * Per the multi-page brief, this page is intentionally short:
 *   Hero → Marquee → TrustedBy stats → WhyChooseUs → BeforeAfter →
 *   FinalCTA.
 *
 * Services / Portfolio / About / Process / Testimonials / Insights / FAQ
 * each live on their own dedicated routes.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <TrustedBy />
      <WhyChooseUs />
      <BeforeAfterShowcase />
      <FinalCTA />
    </>
  );
}
