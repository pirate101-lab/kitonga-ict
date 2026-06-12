import { Hero } from "@/components/sections/Hero";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { BeforeAfterShowcase } from "@/components/sections/BeforeAfterShowcase";

/**
 * Home — minimal flow:
 * Hero → Why us → Before/after → CTA
 * Marquee and TrustedBy counters removed per design brief.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <BeforeAfterShowcase />
    </>
  );
}
