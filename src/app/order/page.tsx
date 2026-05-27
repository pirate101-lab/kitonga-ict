import type { Metadata } from "next";
import { FastOrderForm } from "@/components/sections/FastOrderForm";

export const metadata: Metadata = {
 title: "Fast Order",
 description:
 "Send a brief straight to the KITONGA-ICT studio. We pre-fill WhatsApp with your project details so you can launch in one tap.",
};

export default function OrderPage() {
 return (
 <>
 <header className="relative bg-background pt-10 pb-8 md:pt-14 border-b border-primary/15">
 <div className="container-narrow text-center">
 <span className="eyebrow">Fast Order · Direct to studio</span>
 <h1 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight text-foreground">
 Brief us.{" "}
 <span className="text-primary">We&apos;ll start in minutes.</span>
 </h1>
 <p className="mt-3 mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
 Fill the brief, hit send, and we&apos;ll open WhatsApp with all the
 details perfectly formatted. No login. No waiting room.
 </p>
 </div>
 </header>

 <section className="py-10 md:py-14 bg-background">
 <div className="container-narrow">
 <FastOrderForm />
 </div>
 </section>
 </>
 );
}
