import { Hero } from "@/components/sections/Hero";
import { ServicesMini } from "@/components/sections/ServicesMini";
import { BeforeAfterShowcase } from "@/components/sections/BeforeAfterShowcase";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";

/**
 * Home — unified layout (same on all breakpoints).
 * Hero → ServicesMini → BeforeAfter → WhyChooseUs
 */
export default function Home() {
  return (
    <>
      <Hero />
      <ServicesMini />
      <BeforeAfterShowcase />
      <WhyChooseUs />
    </>
  );
}
