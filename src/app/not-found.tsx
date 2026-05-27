import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
 return (
 <section className="relative grid min-h-[70vh] place-items-center overflow-hidden bg-background px-5 py-16">
 <div className="rounded-2xl border border-primary/25 bg-card p-8 text-center max-w-md ">
 <span className="eyebrow">Error 404</span>
 <h1 className="font-display mt-3 text-4xl sm:text-5xl font-bold leading-[1] tracking-tight text-foreground">
 Page not found.
 </h1>
 <p className="mt-3 text-sm text-muted-foreground">
 That page slipped out of the layout. Let&apos;s get you back to the
 work.
 </p>
 <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
 <Link href="/" className="btn-primary text-sm py-2 px-4">
 <ArrowLeft size={13} aria-hidden /> Back to home
 </Link>
 <Link href="/portfolio" className="btn-ghost text-sm py-2 px-4">
 <Compass size={13} aria-hidden /> Explore the gallery
 </Link>
 </div>
 </div>
 </section>
 );
}
