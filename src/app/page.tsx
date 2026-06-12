import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { ServicesMini } from "@/components/sections/ServicesMini";
import { BeforeAfterShowcase } from "@/components/sections/BeforeAfterShowcase";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";

/**
 * Home — full section flow:
 * Hero → Marquee → TrustedBy → WhyChooseUs → ServicesMini
 *      → BeforeAfter → Testimonials → FinalCTA
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <TrustedBy />
      <WhyChooseUs />
      <ServicesMini />
      <BeforeAfterShowcase />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
