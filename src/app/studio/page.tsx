"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";
import {
  clearAdminToken,
  getAdminToken,
  setAdminToken,
} from "@/lib/cloudinary-client";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin";
  }
  return value;
}

/**
 * Studio admin sign-in.
 *
 * Asks for a username + password and POSTs them to /api/admin/login.
 * On success the returned Bearer token is stashed in localStorage so
 * subsequent admin/media calls can include `Authorization: Bearer …`.
 *
 * Lives outside the /admin segment so the AdminShell sidebar doesn't
 * wrap the auth form. The public `/login` is reserved for the phone-
 * based client sign-in flow.
 */
function StudioLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNextPath(params.get("next"));

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getAdminToken();
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
        };
        if (!cancelled && res.ok && data.ok) {
          router.replace(next);
          router.refresh();
          return;
        }
        if (!cancelled && res.status === 401) {
          clearAdminToken();
        }
      } catch {
        /* let the sign-in form render */
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [next, router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Enter your username and password.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          password,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        token?: string;
        admin?: { username?: string; role?: string };
        error?: string;
      };
      if (!res.ok || !data.ok || !data.token) {
        throw new Error(data.error || `Login failed (${res.status})`);
      }
      setAdminToken(data.token);
      toast.success(
        data.admin?.username
          ? `Signed in as ${data.admin.username}.`
          : "Signed in.",
      );
      router.replace(next);
      router.refresh();
    } catch (err) {
      console.error("[studio-login]", err);
      toast.error(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputWrapClass =
    "flex items-stretch rounded-xl border border-card-border bg-card transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30";
  const iconWrapClass =
    "select-none flex items-center px-3 text-muted-foreground border-r border-card-border bg-secondary rounded-l-xl";
  const inputClass =
    "flex-1 bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground";

  if (checking) {
    return (
      <section className="relative bg-background min-h-[calc(100vh-6rem)] pt-10 pb-16 md:pt-14">
        <div className="container-narrow grid place-items-center">
          <div className="rounded-2xl border border-card-border bg-card p-6 text-sm text-muted-foreground">
            Checking studio access...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-background min-h-[calc(100vh-6rem)] pt-10 pb-16 md:pt-14">
      <div className="container-narrow grid place-items-center">
        <div className="rounded-2xl border border-card-border bg-card p-6 md:p-8 max-w-md w-full">
          <div className="flex items-center justify-between">
            <Logo />
            <span className="rounded-full border border-card-border bg-secondary px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Studio
            </span>
          </div>

          <h1 className="font-display text-xl font-bold text-foreground mt-5">
            Studio admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in with your studio username and password to manage briefs,
            sliders, the media library and your team.
          </p>

          <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3.5">
            <div className={inputWrapClass}>
              <span className={iconWrapClass} aria-hidden>
                <User size={15} />
              </span>
              <input
                type="text"
                autoComplete="username"
                aria-label="Username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                spellCheck={false}
                autoCapitalize="none"
                className={inputClass}
                autoFocus
              />
            </div>

            <div className={inputWrapClass}>
              <span className={iconWrapClass} aria-hidden>
                <Lock size={15} />
              </span>
              <input
                type="password"
                autoComplete="current-password"
                aria-label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              className="btn-indigo mt-1 py-2.5"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" aria-hidden />
                  Signing in…
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={14} aria-hidden />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function StudioLoginPage() {
  return (
    <Suspense fallback={<div className="container-narrow py-16">Loading…</div>}>
      <StudioLoginForm />
    </Suspense>
  );
}
