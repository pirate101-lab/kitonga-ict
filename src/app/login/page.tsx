"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { normaliseKenyanPhone } from "@/lib/phone";

const MIN_PASSWORD_LENGTH = 6;

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Silent regex normalisation — no live validation hints in the UI.
      const e164 = normaliseKenyanPhone(phone);
      if (!e164 || password.length < MIN_PASSWORD_LENGTH) {
        toast.error("Invalid phone or password.");
        return;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: e164, password }),
      });

      if (!res.ok) {
        toast.error("Invalid phone or password.");
        return;
      }

      toast.success("Welcome back.");
      router.replace(next);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative bg-background min-h-[calc(100vh-6rem)] pt-10 pb-16 md:pt-14">
      <div className="container-narrow grid items-start gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div className="hidden lg:flex flex-col gap-4 max-w-lg">
          <Logo />
          <h1 className="font-display text-3xl xl:text-4xl font-bold leading-[1.1] tracking-tight text-foreground">
            Welcome back to the studio.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sign in with the phone number you placed your last brief on. Your
            studio, on demand.
          </p>
          <ul className="mt-1 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Live revision history with comments
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Re-order past projects in two clicks
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              High-res print + web exports, neatly archived
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-card-border bg-card p-5 md:p-7 max-w-md w-full mx-auto">
          <h2 className="font-display text-xl font-bold text-foreground">
            Sign in
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Continue with your phone number and password.
          </p>

          <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3.5">
            <PhoneInput
              value={phone}
              onChange={setPhone}
              ariaLabel="Phone number"
              size="lg"
              autoFocus
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
              placeholder="Password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-card-border bg-card px-3 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
            />

            <button
              type="submit"
              className="btn-indigo mt-1 py-2.5"
              aria-label="Continue"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" aria-hidden />
                  Continuing…
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={14} aria-hidden />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            New to KITONGA-ICT?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-narrow py-16">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
