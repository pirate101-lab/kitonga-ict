"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  Box,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  Sliders,
  UserCog,
  Users,
  Cloud,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import {
  clearAdminToken,
  getAdminToken,
} from "@/lib/cloudinary-client";

type SafeAdmin = {
  id: string;
  username: string;
  role: "owner" | "manager";
};

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  ownerOnly?: boolean;
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/media", label: "Media library", icon: Cloud },
  { href: "/admin/sliders", label: "Hero sliders", icon: Sliders },
  { href: "/admin/portfolio", label: "Portfolio", icon: ImageIcon },
  { href: "/admin/services", label: "Services & pricing", icon: Box },
  { href: "/admin/before-after", label: "Before / after", icon: Sparkles },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/orders", label: "Orders inbox", icon: Package },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/team", label: "Team", icon: UserCog, ownerOnly: true },
  { href: "/admin/settings", label: "Site settings", icon: SettingsIcon },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [me, setMe] = useState<SafeAdmin | null>(null);

  useEffect(() => {
    const token = getAdminToken();
    let cancelled = false;
    (async () => {
      setChecking(true);
      try {
        const headers: HeadersInit = token
          ? { Authorization: `Bearer ${token}` }
          : {};
        const res = await fetch("/api/admin/me", {
          headers,
          cache: "no-store",
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          admin?: SafeAdmin;
        };
        if (!cancelled && res.ok && data.ok && data.admin) {
          setMe(data.admin);
          setSignedIn(true);
        } else if (!cancelled) {
          // Stale or missing session - clear it and send the admin back
          // to the studio sign-in with this route preserved.
          clearAdminToken();
          setSignedIn(false);
          setMe(null);
          const next = encodeURIComponent(pathname || "/admin");
          router.replace(`/studio?next=${next}`);
        }
      } catch {
        if (!cancelled) {
          clearAdminToken();
          setSignedIn(false);
          setMe(null);
          const next = encodeURIComponent(pathname || "/admin");
          router.replace(`/studio?next=${next}`);
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  function onSignOut() {
    const token = getAdminToken();
    // Fire-and-forget; even if the server is unreachable, we still
    // clear the local token so the browser cannot keep acting as admin.
    fetch("/api/admin/logout", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).catch(() => {});
    clearAdminToken();
    router.push("/studio");
    router.refresh();
  }

  const visibleNav = NAV.filter(
    (item) => !item.ownerOnly || me?.role === "owner",
  );

  if (checking) {
    return (
      <div className="min-h-screen bg-background pt-10 pb-16">
        <div className="container-narrow">
          <div className="rounded-2xl border border-card-border bg-card p-6 text-sm text-muted-foreground">
            Verifying admin session...
          </div>
        </div>
      </div>
    );
  }

  if (!signedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-10 pb-16">
      <div className="container-narrow grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
          <div className="rounded-2xl border border-card-border bg-card p-5">
            <div className="flex items-center justify-between">
              <Logo />
              <span className="rounded-full border border-card-border bg-secondary px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                Admin
              </span>
            </div>

            {me ? (
              <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-card-border bg-secondary px-3 py-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
                  <ShieldCheck size={14} aria-hidden />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-foreground">
                    {me.username}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-primary">
                    {me.role}
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                Live content control. Media uploads stream straight to
                Cloudinary; other edits write to your browser&apos;s storage so
                you can preview before pushing live.
              </p>
            )}

            <nav className="mt-5 flex flex-col gap-1" aria-label="Admin">
              {visibleNav.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors border",
                      isActive
                        ? "bg-secondary text-primary border-primary/30"
                        : "text-muted-foreground hover:text-primary hover:bg-secondary border-transparent",
                    )}
                  >
                    <Icon size={16} aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 rounded-2xl border border-card-border bg-secondary p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity size={14} className="text-primary" aria-hidden />
                Studio status
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">Open for briefs</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Mon – Sat · 8:00 — 20:00 EAT
              </p>
            </div>

            {signedIn ? (
              <button
                type="button"
                onClick={onSignOut}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-card-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-destructive hover:text-destructive"
              >
                <LogOut size={14} aria-hidden />
                Sign out of studio
              </button>
            ) : (
              <Link
                href="/studio"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Sign in to studio
              </Link>
            )}
          </div>
        </aside>

        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
