"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Box,
  ExternalLink,
  Image as ImageIcon,
  LayoutDashboard,
  MessageCircle,
  Package,
  Settings,
  Sliders,
  Users,
  Layers,
  FileImage,
  Globe,
  RefreshCw,
} from "lucide-react";
import { AdminCard, AdminPage } from "@/components/admin/AdminPage";
import {
  ADMIN_STORAGE_KEYS,
  readAdminStore,
  type AdminOrder,
  type AdminClient,
} from "@/lib/adminStore";
import { PORTFOLIO } from "@/lib/portfolio";
import { SERVICES } from "@/lib/services";

type Counters = {
  portfolio: number;
  services: number;
  orders: number;
  clients: number;
  newOrders: number;
};

/** Admin dashboard — reflects current live site sections. */
export default function AdminOverviewPage() {
  const [counters, setCounters] = useState<Counters>({
    portfolio: PORTFOLIO.length,
    services: SERVICES.length,
    orders: 0,
    clients: 0,
    newOrders: 0,
  });

  useEffect(() => {
    const portfolio =
      readAdminStore<unknown[]>(ADMIN_STORAGE_KEYS.portfolio) ?? PORTFOLIO;
    const services =
      readAdminStore<unknown[]>(ADMIN_STORAGE_KEYS.services) ?? SERVICES;
    const orders =
      readAdminStore<AdminOrder[]>(ADMIN_STORAGE_KEYS.orders) ?? [];
    const clients =
      readAdminStore<AdminClient[]>(ADMIN_STORAGE_KEYS.clients) ?? [];

    setCounters({
      portfolio: portfolio.length,
      services: services.length,
      orders: orders.length,
      clients: clients.length,
      newOrders: orders.filter((o) => o.status === "new").length,
    });
  }, []);

  const tiles = useMemo(
    () => [
      {
        href: "/admin/portfolio",
        label: "Portfolio",
        value: counters.portfolio,
        helper: "Pieces in the live gallery",
        icon: ImageIcon,
        color: "#0067b8",
      },
      {
        href: "/admin/services",
        label: "Services & pricing",
        value: counters.services,
        helper: "Active service offerings",
        icon: Box,
        color: "#0067b8",
      },
      {
        href: "/admin/orders",
        label: "Orders inbox",
        value: counters.orders,
        helper:
          counters.newOrders > 0
            ? `${counters.newOrders} new — needs reply`
            : "No unread briefs",
        icon: Package,
        color: counters.newOrders > 0 ? "#b91c1c" : "#0067b8",
      },
      {
        href: "/admin/clients",
        label: "Clients",
        value: counters.clients,
        helper: "People in the studio book",
        icon: Users,
        color: "#0067b8",
      },
      {
        href: '/admin/whatsapp',
        label: 'WhatsApp bot',
        value: '●',
        helper: 'Link, unlink, configure bot',
        icon: MessageCircle,
        color: '#25D366',
      },
    ],
    [counters],
  );

  return (
    <AdminPage
      eyebrow="Dashboard"
      title="Site control panel"
      description="Manage every section of the live KITONGA-ICT website from here."
      actions={
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex items-center gap-1.5 rounded-lg border border-[#cbd5e1] bg-white px-3 py-1.5 text-[12px] font-medium text-[#333] hover:border-[#0067b8] hover:text-[#0067b8] transition-colors"
        >
          <RefreshCw size={12} aria-hidden />
          Refresh
        </button>
      }
    >
      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.href}
              href={tile.href}
              className="group rounded-xl border border-[#cbd5e1] bg-white p-4 transition hover:border-[#0067b8] hover:bg-[#f2f5f9]"
            >
              <div className="flex items-start justify-between">
                <span
                  className="grid h-9 w-9 place-items-center rounded-lg border border-[#cbd5e1]"
                  style={{ color: tile.color }}
                >
                  <Icon size={16} aria-hidden />
                </span>
                <ArrowUpRight
                  size={14}
                  className="text-[#9ca3af] group-hover:text-[#0067b8] transition-colors"
                  aria-hidden
                />
              </div>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#555]">
                {tile.label}
              </p>
              <p className="mt-0.5 text-2xl font-bold text-[#0a0a0a]">
                {tile.value}
              </p>
              <p className="mt-0.5 text-[11.5px] text-[#666]">{tile.helper}</p>
            </Link>
          );
        })}
      </div>

      {/* Site sections control */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="text-[15px] font-bold text-[#0a0a0a] mb-4 flex items-center gap-2">
            <Layers size={15} className="text-[#0067b8]" aria-hidden />
            Site sections
          </h2>
          <div className="flex flex-col gap-1.5">
            {[

              { href: "/admin/portfolio", label: "Portfolio gallery", hint: "All work — filtered by category" },
              { href: "/admin/services", label: "Services & pricing", hint: "6 live service cards" },
              { href: "/admin/before-after", label: "Before / After", hint: "Comparison showcase on homepage" },
              { href: "/admin/orders", label: "Orders inbox", hint: "Briefs submitted via order form" },
              { href: "/admin/clients", label: "Clients", hint: "Studio contact book" },
              { href: "/admin/team", label: "Team", hint: "Studio members (owner only)" },
              { href: "/admin/settings", label: "Site settings", hint: "WhatsApp, email, social handles, hours" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-lg border border-[#cbd5e1] bg-[#f9fafb] px-3.5 py-2.5 hover:border-[#0067b8] hover:bg-white transition-colors group"
              >
                <div>
                  <p className="text-[13px] font-semibold text-[#111]">{item.label}</p>
                  <p className="text-[11.5px] text-[#777]">{item.hint}</p>
                </div>
                <ArrowUpRight size={13} className="text-[#bbb] group-hover:text-[#0067b8] transition-colors shrink-0" aria-hidden />
              </Link>
            ))}
          </div>
        </AdminCard>

        <div className="flex flex-col gap-4">


          {/* Settings shortcut */}
          <AdminCard>
            <h2 className="text-[15px] font-bold text-[#0a0a0a] mb-3 flex items-center gap-2">
              <Settings size={15} className="text-[#0067b8]" aria-hidden />
              Quick settings
            </h2>
            <div className="flex flex-col gap-1.5">
              {[
                { href: "/admin/settings", label: "WhatsApp & contact" },
                { href: "/admin/settings", label: "Social media handles" },
                { href: "/admin/settings", label: "Studio hours" },
                { href: "/admin/settings", label: "Site identity & SEO" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg border border-[#cbd5e1] px-3.5 py-2 text-[13px] font-medium text-[#333] hover:border-[#0067b8] hover:text-[#0067b8] transition-colors group"
                >
                  {item.label}
                  <ArrowUpRight size={12} className="text-[#bbb] group-hover:text-[#0067b8] transition-colors" aria-hidden />
                </Link>
              ))}
            </div>
          </AdminCard>

          {/* Media */}
          <AdminCard>
            <h2 className="text-[15px] font-bold text-[#0a0a0a] mb-3 flex items-center gap-2">
              <LayoutDashboard size={15} className="text-[#0067b8]" aria-hidden />
              Media library
            </h2>
            <Link
              href="/admin/media"
              className="flex items-center justify-between rounded-lg border border-[#cbd5e1] bg-[#f9fafb] px-3.5 py-2.5 text-[13px] font-semibold text-[#333] hover:border-[#0067b8] hover:text-[#0067b8] hover:bg-white transition-colors group"
            >
              Manage uploads (Cloudinary)
              <ArrowUpRight size={13} className="text-[#bbb] group-hover:text-[#0067b8]" aria-hidden />
            </Link>
          </AdminCard>
        </div>
      </div>
    </AdminPage>
  );
}
