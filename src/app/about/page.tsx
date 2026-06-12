import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { FAQ } from "@/components/sections/FAQ";

export const metadata: Metadata = {
  title: "About",
  description:
    "KITONGA-ICT — a small, focused studio in Nairobi. How we work and what we stand for.",
};

export default function AboutPage() {
  return (
    <>
      <About />
      <FAQ />
    </>
  );
}
