"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Box,
  Cloud,
  Image as ImageIcon,
  MessageSquare,
  Package,
  Sliders,
  Sparkles,
  UserCog,
} from "lucide-react";
import { AdminCard } from "./AdminPage";

type Shortcut = {
  href: string;
  label: string;
  description: string;
  icon: typeof Cloud;
  primary?: boolean;
};

const SHORTCUTS: Shortcut[] = [
  {
    href: "/admin/media",
    label: "Studio Library",
    description: "Cloudinary uploads, asset previews, bulk delete.",
    icon: Cloud,
    primary: true,
  },
  {
    href: "/admin/portfolio",
    label: "Portfolio",
    description: "Add, edit and delete portfolio pieces.",
    icon: ImageIcon,
  },
  {
    href: "/admin/sliders",
    label: "Hero Sliders",
    description: "Manage the homepage hero deck.",
    icon: Sliders,
  },
  {
    href: "/admin/services",
    label: "Services & Pricing",
    description: "Toggle services and edit starting prices.",
    icon: Box,
  },
  {
    href: "/admin/before-after",
    label: "Before / After",
    description: "Add new retouching showcases.",
    icon: Sparkles,
  },
  {
    href: "/admin/testimonials",
    label: "Testimonials",
    description: "Curate the client quote wall.",
    icon: MessageSquare,
  },
  {
    href: "/admin/orders",
    label: "Orders Inbox",
    description: "Kanban for incoming briefs.",
    icon: Package,
  },
  {
    href: "/admin/team",
    label: "Team",
    description: "Invite admins, reset passwords, manage roles.",
    icon: UserCog,
  },
];

/**
 * Top-of-page "Quick studio access" card. Drops a tile grid of the
 * most-used admin destinations so the operator can pivot from /settings
 * to the Media Library / Portfolio CMS / Orders inbox in one click.
 */
export function StudioShortcuts() {
  return (
    <AdminCard>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Studio quick access
          </h2>
          <p className="mt-1 text-sm text-foreground-muted">
            Jump straight to the heaviest-used CMS areas. The Studio Library
            is highlighted because it&apos;s where uploaded media lives.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SHORTCUTS.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className={
                s.primary
                  ? "group relative flex items-start gap-3 rounded-2xl border border-primary bg-primary p-4 text-primary-foreground transition-colors hover:bg-primary/90"
                  : "group relative flex items-start gap-3 rounded-2xl border border-card-border bg-card p-4 text-foreground transition-colors hover:border-primary hover:text-primary"
              }
            >
              <span
                className={
                  s.primary
                    ? "grid h-9 w-9 place-items-center rounded-xl bg-white/20 text-primary-foreground shrink-0"
                    : "grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary shrink-0"
                }
              >
                <Icon size={16} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">{s.label}</span>
                  <ArrowUpRight
                    size={13}
                    aria-hidden
                    className="opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
                <p
                  className={
                    s.primary
                      ? "mt-0.5 text-[12px] text-primary-foreground/85"
                      : "mt-0.5 text-[12px] text-muted-foreground"
                  }
                >
                  {s.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </AdminCard>
  );
}
