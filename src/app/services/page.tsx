import type { Metadata } from "next";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";

export const metadata: Metadata = {
  title: "Services & process",
  description:
    "Twelve service lines — print, digital, brand and motion. Plus our six-step working process from brief to ship.",
};

export default function ServicesPage() {
  return (
    <>
      <Services />
      <Process />
      <FinalCTA />
    </>
  );
}
