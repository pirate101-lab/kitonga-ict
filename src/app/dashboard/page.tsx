import type { Metadata } from "next";
import Link from "next/link";
import {
 ArrowUpRight,
 Bell,
 Clock,
 Download,
 Image as ImageIcon,
 MessageCircle,
 Plus,
 Search,
 Settings,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
 title: "Dashboard",
 description:
 "Track ongoing revisions, view past order history, and download high-resolution finals from your KITONGA-ICT studio dashboard.",
};

const ORDERS = [
 {
 id: "ORD-2026-0421",
 title: "Q2 Campaign Posters · Series of 3",
 status: "In review",
 progress: 75,
 revision: 2,
 type: "Posters",
 eta: "Ships in 6h",
 },
 {
 id: "ORD-2026-0418",
 title: "Bara Capital · Premium Cards (Foil)",
 status: "Ready to ship",
 progress: 100,
 revision: 1,
 type: "Business Cards",
 eta: "Final delivered",
 },
 {
 id: "ORD-2026-0413",
 title: "Asili Fest '26 · Roll-up + Billboard",
 status: "Drafting",
 progress: 35,
 revision: 0,
 type: "Banners",
 eta: "Drafts due in 18h",
 },
];

const ACTIVITY = [
 {
 when: "12 min ago",
 text: "Studio uploaded round 2 of Q2 Campaign Posters.",
 href: "#",
 },
 {
 when: "2 h ago",
 text: "Final files for Bara Capital cards are ready to download.",
 href: "#",
 },
 {
 when: "Yesterday",
 text: "New brief for Asili Fest billboard kicked off — concept due tomorrow.",
 href: "#",
 },
];

export default function DashboardPage() {
 return (
 <section className="relative bg-background pt-10 pb-16 md:pt-14">
 <div className="container-narrow">
 {/* Top bar */}
 <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
 <div className="flex flex-col gap-1.5">
 <Logo />
 <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight text-foreground">
 Welcome back, Naomi.
 </h1>
 <p className="text-sm text-muted-foreground">
 You have{" "}
 <span className="font-semibold text-primary">
 2 active briefs
 </span>{" "}
 and{" "}
 <span className="font-semibold text-primary">
 1 final ready to download
 </span>
 .
 </p>
 </div>
 <div className="flex items-center gap-2">
 <Link href="/order" className="btn-primary text-sm py-2.5 px-4">
 <Plus size={15} aria-hidden />
 New brief
 </Link>
 <button
 type="button"
 aria-label="Notifications"
 className="grid h-10 w-10 place-items-center rounded-xl border border-primary/25 bg-card text-foreground hover:border-primary/45 hover:text-primary"
 >
 <Bell size={15} />
 </button>
 <button
 type="button"
 aria-label="Settings"
 className="grid h-10 w-10 place-items-center rounded-xl border border-primary/25 bg-card text-foreground hover:border-primary/45 hover:text-primary"
 >
 <Settings size={15} />
 </button>
 </div>
 </div>

 {/* Search */}
 <div className="mt-6 flex items-center gap-3 rounded-xl border border-primary/25 bg-card px-4 py-2.5 text-sm text-foreground ">
 <Search size={15} aria-hidden />
 <input
 type="search"
 placeholder="Search orders, files, or briefs…"
 className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
 />
 <span className="hidden sm:inline-flex items-center rounded-md border border-primary/20 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
 ⌘ K
 </span>
 </div>

 {/* Stats */}
 <div className="mt-8 grid gap-3 sm:grid-cols-3">
 <Stat label="Active briefs" value="2" />
 <Stat label="Files in archive" value="146" />
 <Stat label="On-time delivery" value="100%" accent />
 </div>

 {/* Body grid */}
 <div className="mt-8 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
 {/* Orders */}
 <div className="flex flex-col gap-3">
 <div className="flex items-center justify-between">
 <h2 className="font-display text-lg font-bold text-foreground">
 Active orders
 </h2>
 <Link
 href="#"
 className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary"
 >
 View all <ArrowUpRight size={13} aria-hidden />
 </Link>
 </div>

 <div className="grid gap-3">
 {ORDERS.map((o) => (
 <article
 key={o.id}
 className="rounded-2xl border border-primary/25 bg-card p-4 transition-colors hover:border-primary/45"
 >
 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0">
 <div className="flex items-center gap-2 text-xs text-muted-foreground">
 <span className="font-mono">{o.id}</span>
 <span>·</span>
 <span>{o.type}</span>
 </div>
 <h3 className="mt-1 text-sm font-semibold text-foreground">
 {o.title}
 </h3>
 </div>
 <span
 className={`shrink-0 rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.12em] ${
 o.status === "Ready to ship"
 ? "border-primary bg-primary text-foreground"
 : o.status === "In review"
 ? "border-primary/35 bg-primary/10 text-primary"
 : "border-amber-300 bg-amber-50 text-amber-700"
 }`}
 >
 {o.status}
 </span>
 </div>

 {/* Progress */}
 <div className="mt-3">
 <div className="h-1 w-full overflow-hidden rounded-full bg-card">
 <div
 className="h-full rounded-full bg-primary"
 style={{ width: `${o.progress}%` }}
 />
 </div>
 <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
 <span className="flex items-center gap-1.5">
 <Clock size={11} aria-hidden /> {o.eta}
 </span>
 <span>Revision {o.revision}</span>
 </div>
 </div>

 <div className="mt-3 flex flex-wrap items-center gap-2">
 <button
 type="button"
 className="inline-flex items-center gap-1.5 rounded-lg border border-primary/25 bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground hover:border-primary/45 hover:text-primary"
 >
 <MessageCircle size={11} aria-hidden /> Chat
 </button>
 <button
 type="button"
 className="inline-flex items-center gap-1.5 rounded-lg border border-primary/25 bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground hover:border-primary/45 hover:text-primary"
 >
 <ImageIcon size={11} aria-hidden /> Preview
 </button>
 <button
 type="button"
 disabled={o.progress < 100}
 className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-primary disabled:opacity-40 disabled:bg-white disabled:text-muted-foreground disabled:border disabled:border-primary/25"
 >
 <Download size={11} aria-hidden /> Download
 </button>
 </div>
 </article>
 ))}
 </div>
 </div>

 {/* Activity + tips */}
 <aside className="flex flex-col gap-3">
 <div className="rounded-2xl border border-primary/25 bg-card p-4 ">
 <h3 className="font-display text-base font-bold text-foreground">
 Recent activity
 </h3>
 <ul className="mt-3 space-y-2.5">
 {ACTIVITY.map((a, i) => (
 <li
 key={i}
 className="flex items-start gap-3 border-b border-primary/15 last:border-0 pb-2.5 last:pb-0"
 >
 <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
 <div className="flex-1 min-w-0">
 <p className="text-sm text-foreground">{a.text}</p>
 <span className="text-[11px] text-muted-foreground">
 {a.when}
 </span>
 </div>
 </li>
 ))}
 </ul>
 </div>

 <div className="rounded-2xl bg-primary text-foreground p-4 ">
 <h3 className="font-display text-base font-bold text-foreground">
 Tip — skip the form, hop on chat.
 </h3>
 <p className="mt-1.5 text-xs text-foreground">
 Need a quick brief? Use Fast Order on WhatsApp and we&apos;ll
 start within minutes.
 </p>
 <Link
 href="/order"
 className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-foreground underline-offset-4 hover:underline"
 >
 Start a Fast Order <ArrowUpRight size={13} aria-hidden />
 </Link>
 </div>
 </aside>
 </div>
 </div>
 </section>
 );
}

function Stat({
 label,
 value,
 accent = false,
}: {
 label: string;
 value: string;
 accent?: boolean;
}) {
 return (
 <div className="rounded-2xl border border-primary/25 bg-card p-4 ">
 <div
 className={`font-display text-2xl font-bold ${accent ? "text-primary" : "text-foreground"}`}
 >
 {value}
 </div>
 <div className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
 {label}
 </div>
 </div>
 );
}
