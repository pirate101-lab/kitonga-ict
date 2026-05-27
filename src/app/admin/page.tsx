"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
 ArrowUpRight,
 Box,
 Image as ImageIcon,
 MessageSquare,
 Package,
 Sliders,
 Sparkles,
 Users,
} from "lucide-react";
import { AdminCard, AdminPage } from "@/components/admin/AdminPage";
import {
 ADMIN_STORAGE_KEYS,
 readAdminStore,
 type AdminClient,
 type AdminOrder,
 type AdminTestimonial,
} from "@/lib/adminStore";
import { HERO_SLIDES } from "@/lib/slides";
import { PORTFOLIO } from "@/lib/portfolio";
import { SERVICES } from "@/lib/services";

type Counters = {
 slides: number;
 portfolio: number;
 services: number;
 testimonials: number;
 orders: number;
 clients: number;
 newOrders: number;
};

export default function AdminOverviewPage() {
 const [counters, setCounters] = useState<Counters>({
 slides: HERO_SLIDES.length,
 portfolio: PORTFOLIO.length,
 services: SERVICES.length,
 testimonials: 4,
 orders: 0,
 clients: 0,
 newOrders: 0,
 });

 useEffect(() => {
 const slides =
 readAdminStore<unknown[]>(ADMIN_STORAGE_KEYS.slides) ?? HERO_SLIDES;
 const portfolio =
 readAdminStore<unknown[]>(ADMIN_STORAGE_KEYS.portfolio) ?? PORTFOLIO;
 const services =
 readAdminStore<unknown[]>(ADMIN_STORAGE_KEYS.services) ?? SERVICES;
 const testimonials =
 readAdminStore<AdminTestimonial[]>(ADMIN_STORAGE_KEYS.testimonials) ??
 [];
 const orders =
 readAdminStore<AdminOrder[]>(ADMIN_STORAGE_KEYS.orders) ?? [];
 const clients =
 readAdminStore<AdminClient[]>(ADMIN_STORAGE_KEYS.clients) ?? [];

 setCounters({
 slides: slides.length,
 portfolio: portfolio.length,
 services: services.length,
 testimonials: testimonials.length || 4,
 orders: orders.length,
 clients: clients.length,
 newOrders: orders.filter((o) => o.status === "new").length,
 });
 }, []);

 const tiles = useMemo(
 () => [
 {
 href: "/admin/sliders",
 label: "Hero sliders",
 value: counters.slides,
 helper: "Active slides on the homepage",
 icon: Sliders,
 },
 {
 href: "/admin/portfolio",
 label: "Portfolio",
 value: counters.portfolio,
 helper: "Pieces in the live gallery",
 icon: ImageIcon,
 },
 {
 href: "/admin/services",
 label: "Services & pricing",
 value: counters.services,
 helper: "Service lines on the menu",
 icon: Box,
 },
 {
 href: "/admin/testimonials",
 label: "Testimonials",
 value: counters.testimonials,
 helper: "Quotes published on the site",
 icon: MessageSquare,
 },
 {
 href: "/admin/orders",
 label: "Orders inbox",
 value: counters.orders,
 helper:
 counters.newOrders > 0
 ? `${counters.newOrders} new awaiting reply`
 : "No unread briefs",
 icon: Package,
 },
 {
 href: "/admin/clients",
 label: "Clients",
 value: counters.clients,
 helper: "People in the studio book",
 icon: Users,
 },
 ],
 [counters],
 );

 return (
 <AdminPage
 eyebrow="Overview"
 title="Studio control deck"
 description="A quick read on what's live, what's queued, and where the next move is. Everything below links into the dedicated editor."
 >
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {tiles.map((tile) => {
 const Icon = tile.icon;
 return (
 <Link
 key={tile.href}
 href={tile.href}
 className="group rounded-[var(--radius-lg)] border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-strong"
 >
 <div className="flex items-start justify-between">
 <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
 <Icon size={18} aria-hidden />
 </span>
 <ArrowUpRight
 size={16}
 className="text-foreground-subtle transition group-hover:text-accent"
 aria-hidden
 />
 </div>
 <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground-subtle">
 {tile.label}
 </p>
 <p className="mt-1 font-display text-3xl font-semibold text-foreground">
 {tile.value}
 </p>
 <p className="mt-1 text-xs text-foreground-muted">
 {tile.helper}
 </p>
 </Link>
 );
 })}
 </div>

 <div className="grid gap-6 lg:grid-cols-2">
 <AdminCard>
 <div className="flex items-center justify-between">
 <h2 className="font-display text-lg font-semibold text-foreground">
 Quick actions
 </h2>
 <Sparkles size={16} className="text-accent" aria-hidden />
 </div>
 <ul className="mt-4 grid gap-2">
 <QuickAction
 href="/admin/sliders"
 label="Add a new hero slide"
 hint="Featured studio work above the fold"
 />
 <QuickAction
 href="/admin/before-after"
 label="Upload a before/after pair"
 hint="Feeds the interactive comparison module"
 />
 <QuickAction
 href="/admin/services"
 label="Update pricing or toggle a service"
 hint="Reflects instantly on the site"
 />
 <QuickAction
 href="/admin/orders"
 label="Reply to inbox briefs"
 hint="Match WhatsApp replies to dashboard items"
 />
 <QuickAction
 href="/admin/settings"
 label="Edit site settings"
 hint="WhatsApp number, email, social handles"
 />
 </ul>
 </AdminCard>

 <AdminCard>
 <h2 className="font-display text-lg font-semibold text-foreground">
 Studio rhythm
 </h2>
 <p className="mt-2 text-sm text-foreground-muted">
 Current week — content moves you should consider locking in.
 </p>
 <ul className="mt-5 space-y-4 text-sm">
 <li className="flex items-start gap-3">
 <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
 <div>
 <p className="text-foreground">
 Refresh the hero slider headline every 2 – 3 weeks.
 </p>
 <p className="text-foreground-muted text-xs">
 Keeps repeat visitors paying attention.
 </p>
 </div>
 </li>
 <li className="flex items-start gap-3">
 <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-electric" />
 <div>
 <p className="text-foreground">
 Promote two new portfolio pieces to the homepage grid.
 </p>
 <p className="text-foreground-muted text-xs">
 Use the &quot;featured&quot; toggle in the portfolio editor.
 </p>
 </div>
 </li>
 <li className="flex items-start gap-3">
 <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-magenta" />
 <div>
 <p className="text-foreground">
 Rotate testimonials so the most recent two sit on top.
 </p>
 <p className="text-foreground-muted text-xs">
 Sorts by &quot;date added&quot; in the testimonials editor.
 </p>
 </div>
 </li>
 </ul>
 </AdminCard>
 </div>
 </AdminPage>
 );
}

function QuickAction({
 href,
 label,
 hint,
}: {
 href: string;
 label: string;
 hint: string;
}) {
 return (
 <li>
 <Link
 href={href}
 className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background-elev px-4 py-3 transition hover:border-accent/40 hover:bg-surface-strong"
 >
 <div className="min-w-0">
 <p className="text-sm font-medium text-foreground">{label}</p>
 <p className="text-xs text-foreground-muted">{hint}</p>
 </div>
 <ArrowUpRight
 size={14}
 className="mt-1 text-foreground-subtle"
 aria-hidden
 />
 </Link>
 </li>
 );
}
