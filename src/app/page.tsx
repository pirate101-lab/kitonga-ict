import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { ServicesMini } from "@/components/sections/ServicesMini";
import { BeforeAfterShowcase } from "@/components/sections/BeforeAfterShowcase";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";

/**
 * Home — section order differs by breakpoint via CSS flex order.
 *
 * Desktop (lg+): Hero → Marquee → TrustedBy → WhyChooseUs → ServicesMini
 *                → BeforeAfter → Testimonials → FinalCTA  (natural DOM order)
 *
 * Mobile (<lg):  Hero → ServicesMini → BeforeAfter → WhyChooseUs → FinalCTA
 *                Marquee, TrustedBy, Testimonials hidden on mobile.
 */
export default function Home() {
  return (
    <div className="flex flex-col">
      {/* 1 · Hero — always first */}
      <div className="order-1">
        <Hero />
      </div>

      {/* 2 · Marquee — desktop only */}
      <div className="hidden lg:block lg:order-none">
        <Marquee />
      </div>

      {/* 3 · TrustedBy — desktop only */}
      <div className="hidden lg:block lg:order-none">
        <TrustedBy />
      </div>

      {/* 4 desktop / 4 mobile · WhyChooseUs — moved to bottom on mobile */}
      <div className="order-4 lg:order-none">
        <WhyChooseUs />
      </div>

      {/* 5 desktop / 2 mobile · ServicesMini */}
      <div className="order-2 lg:order-none">
        <ServicesMini />
      </div>

      {/* 6 desktop / 3 mobile · BeforeAfterShowcase */}
      <div className="order-3 lg:order-none">
        <BeforeAfterShowcase />
      </div>

      {/* 7 · Testimonials — desktop only */}
      <div className="hidden lg:block lg:order-none">
        <Testimonials />
      </div>

      {/* 8 desktop / 5 mobile · FinalCTA — always last */}
      <div className="order-5 lg:order-none">
        <FinalCTA />
      </div>
    </div>
  );
}
