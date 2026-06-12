"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Box,
  Image as ImageIcon,
  LayoutDashboard,
  Package,
  RefreshCw,
  Settings,
  Layers,
} from "lucide-react";
import { AdminCard, AdminPage } from "@/components/admin/AdminPage";
import {
  ADMIN_STORAGE_KEYS,
  readAdminStore,
  type AdminOrder,
} from "@/lib/adminStore";
import { PORTFOLIO } from "@/lib/portfolio";
import { SERVICES } from "@/lib/services";

type Counters = {
  portfolio: number;
  services: number;
  orders: number;
  newOrders: number;
};

/** Admin dashboard — reflects current live site sections. */
export default function AdminOverviewPage() {
  const [counters, setCounters] = useState<Counters>({
    portfolio: PORTFOLIO.length,
    services: SERVICES.length,
    orders: 0,
    newOrders: 0,
  });

  useEffect(() => {
    const portfolio =
      readAdminStore<unknown[]>(ADMIN_STORAGE_KEYS.portfolio) ?? PORTFOLIO;
    const services =
      readAdminStore<unknown[]>(ADMIN_STORAGE_KEYS.services) ?? SERVICES;
    const orders =
      readAdminStore<AdminOrder[]>(ADMIN_STORAGE_KEYS.orders) ?? [];

    setCounters({
      portfolio: portfolio.length,
      services: services.length,
      orders: orders.length,
      newOrders: orders.filter((o) => o.status === "new").length,
    });
  }, []);

  const tiles = useMemo(
    () => [
      {
        href: "/admin/portfolio",
        label: "Portfolio",
        value: counters.portfolio,
        helper: "Live gallery pieces",
        icon: ImageIcon,
        color: "#0067b8",
        svg: null,
      },
      {
        href: "/admin/services",
        label: "Services",
        value: counters.services,
        helper: "Active offerings",
        icon: Box,
        color: "#0067b8",
        svg: null,
      },
      {
        href: "/admin/orders",
        label: "Orders",
        value: counters.orders,
        helper: counters.newOrders > 0 ? `${counters.newOrders} new` : "No unread",
        icon: Package,
        color: counters.newOrders > 0 ? "#b91c1c" : "#0067b8",
        svg: null,
      },
      {
        href: "/admin/whatsapp",
        label: "WhatsApp Bot",
        value: "●",
        helper: "Link & configure",
        icon: null,
        color: "#25D366",
        svg: (
          <svg viewBox="0 0 32 32" width="16" height="16" fill="#25D366" aria-hidden>
            <path d="M16.001 0C7.165 0 0 7.165 0 16c0 2.832.74 5.6 2.146 8.04L0 32l8.18-2.135A15.953 15.953 0 0 0 16 32c8.835 0 16-7.164 16-16S24.836 0 16.001 0Zm0 29.27a13.247 13.247 0 0 1-6.748-1.85l-.483-.288-4.853 1.267 1.292-4.74-.314-.503A13.234 13.234 0 0 1 2.731 16C2.731 8.682 8.682 2.731 16 2.731c7.319 0 13.27 5.951 13.27 13.269 0 7.318-5.951 13.27-13.269 13.27Zm7.286-9.93c-.4-.2-2.366-1.166-2.733-1.299-.367-.133-.633-.2-.9.2-.265.4-1.033 1.299-1.266 1.566-.234.266-.467.3-.867.1-.4-.2-1.687-.621-3.213-1.984-1.187-1.06-1.99-2.367-2.224-2.767-.233-.4-.025-.616.176-.815.18-.18.4-.467.6-.7.2-.234.267-.4.4-.667.133-.267.067-.5-.034-.7-.1-.2-.9-2.166-1.232-2.967-.323-.776-.652-.671-.9-.683-.234-.012-.5-.014-.766-.014a1.476 1.476 0 0 0-1.067.5c-.367.4-1.4 1.367-1.4 3.333 0 1.967 1.434 3.866 1.633 4.133.2.267 2.823 4.31 6.84 6.044.955.412 1.7.658 2.281.842.957.305 1.829.262 2.518.16.768-.115 2.366-.967 2.7-1.9.333-.933.333-1.733.234-1.9-.1-.166-.367-.266-.767-.466Z"/>
          </svg>
        ),
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
      {/* Stat tiles — 4 cards, 2×2 on mobile */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.href}
              href={tile.href}
              className="group rounded-xl border border-[#cbd5e1] bg-white p-2.5 transition hover:border-[#0067b8] hover:bg-[#f2f5f9]"
            >
              <div className="flex items-center justify-between">
                <span
                  className="grid h-7 w-7 place-items-center rounded-lg border border-[#cbd5e1]"
                  style={{ color: tile.color }}
                >
                  {tile.svg ?? (Icon ? <Icon size={14} aria-hidden /> : null)}
                </span>
                <ArrowUpRight
                  size={12}
                  className="text-[#9ca3af] group-hover:text-[#0067b8] transition-colors"
                  aria-hidden
                />
              </div>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#555] truncate">
                {tile.label}
              </p>
              <p className="mt-0.5 text-lg font-bold text-[#0a0a0a] leading-none">
                {tile.value}
              </p>
              <p className="mt-0.5 text-[10.5px] text-[#666] truncate">{tile.helper}</p>
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
