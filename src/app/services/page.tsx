import type { Metadata } from "next";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Flyer design, business cards, T-shirt printing, CVs, Photoshop editing, and cyber services. Six focused offerings — brief us on WhatsApp.",
};

export default function ServicesPage() {
  return (
    <>
      <Services />
      <Process />
    </>
  );
}
