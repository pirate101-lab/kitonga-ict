"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  Box,
  ChevronDown,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquare,
  Package,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  // Sliders removed
  UserCog,
  Users,
  Cloud,
  X,
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
  { href: '/admin/whatsapp', label: 'WhatsApp Bot', icon: MessageCircle },
  { href: "/admin/portfolio", label: "Portfolio", icon: ImageIcon },
  { href: "/admin/services", label: "Services & pricing", icon: Box },
  { href: "/admin/before-after", label: "Before / after", icon: Sparkles },
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  function onSignOut() {
    const token = getAdminToken();
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
      <div className="min-h-screen bg-background pb-16">
        <div className="container-narrow pt-10">
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
    <div className="min-h-screen bg-background pb-16">

      {/* ── Mobile sticky header (hidden on lg+) ── */}
      <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-3 py-1.5 bg-card border-b border-card-border">
        {/* Logo + wordmark inline */}
        <div className="flex items-center gap-1.5">
          <Logo withWordmark={false} size="sm" />
          <span className="font-display text-[11px] font-bold tracking-tight text-foreground">
            Admin Studio
          </span>
        </div>
        <button
          type="button"
          aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((v) => !v)}
          className="grid h-7 w-7 place-items-center rounded-lg border border-card-border text-foreground hover:text-primary hover:border-primary/40 transition-colors"
        >
          {mobileNavOpen ? <X size={14} aria-hidden /> : <Menu size={14} aria-hidden />}
        </button>
      </header>

      {/* ── Mobile dropdown nav ── */}
      {mobileNavOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/20"
            aria-hidden
            onClick={() => setMobileNavOpen(false)}
          />
          {/* Panel — right-anchored, max half screen width, sits below header with gap */}
          <div className="lg:hidden fixed right-0 top-[45px] mt-1 z-40 w-[52vw] max-w-[240px] min-w-[180px] bg-card border border-card-border shadow-lg rounded-bl-2xl rounded-tl-2xl px-2 py-2">
            <nav className="flex flex-col gap-0.5" aria-label="Admin mobile">
              {visibleNav.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                      isActive
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground hover:text-primary hover:bg-secondary",
                    )}
                  >
                    <Icon size={13} aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <button
              type="button"
              onClick={onSignOut}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-destructive hover:bg-red-50"
            >
              <LogOut size={13} aria-hidden />
              Sign out
            </button>
          </div>
        </>
      )}

      {/* ── Main grid ── */}
      <div className="container-narrow grid gap-8 lg:grid-cols-[260px_1fr] pt-6 lg:pt-10">

        {/* ── Desktop sidebar (hidden below lg) ── */}
        <aside className="hidden lg:block lg:sticky lg:top-10 lg:max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="rounded-2xl border border-card-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Logo withWordmark={false} />
                <span className="font-display font-black text-foreground select-none leading-none tracking-tighter text-sm md:text-lg">
                  KITONGA-ICT
                </span>
              </div>
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
