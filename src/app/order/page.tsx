import type { Metadata } from "next";
import { FastOrderForm } from "@/components/sections/FastOrderForm";

export const metadata: Metadata = {
  title: "Order",
  description:
    "Send a brief straight to KITONGA-ICT. We pre-fill WhatsApp with your project details so you can launch in one tap.",
};

export default function OrderPage() {
  return (
    <>
      <header className="bg-[#f2f5f9] pt-12 pb-8 md:pt-16">
        <div className="container-narrow">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0067b8] mb-2">
            Order
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight mb-2">
            Brief us. We start in minutes.
          </h1>
          <p className="text-[13.5px] text-[#333] max-w-md leading-relaxed">
            Fill in the form — it builds a pre-formatted WhatsApp message you can send in one tap.
          </p>
        </div>
      </header>

      <section className="py-10 md:py-14 bg-[#f2f5f9]">
        <div className="container-narrow">
          <FastOrderForm />
        </div>
      </section>
    </>
  );
}
