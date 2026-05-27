"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { normaliseKenyanPhone } from "@/lib/phone";

const MIN_PASSWORD_LENGTH = 6;

export default function SignupPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const e164 = normaliseKenyanPhone(phone);
      if (!e164 || password.length < MIN_PASSWORD_LENGTH) {
        toast.error("Enter a valid Kenyan number and a password of at least 6 characters.");
        return;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: e164, password }),
      });

      if (res.status === 409) {
        toast.error("An account with that number already exists.");
        return;
      }
      if (!res.ok) {
        toast.error("Could not create account. Please try again.");
        return;
      }

      toast.success("Account created.");
      router.replace("/dashboard");
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
            One studio.
            <br />
            <span className="text-accent-gradient">Every brief, organised.</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create an account to keep all your work in one place — or skip it
            and use Fast Order on WhatsApp anytime.
          </p>
          <ul className="mt-1 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              No credit card. Free forever for clients.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Each project archived with full revision history
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Fast Order link pre-fills your account on WhatsApp
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-card-border bg-card p-5 md:p-7 max-w-md w-full mx-auto">
          <h2 className="font-display text-xl font-bold text-foreground">
            Create an account
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your phone number and a password to get started.
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
              placeholder="Create a password"
              autoComplete="new-password"
              className="w-full rounded-xl border border-card-border bg-card px-3 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
            />

            <button
              type="submit"
              className="btn-indigo mt-1 py-2.5"
              aria-label="Create account"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" aria-hidden />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={14} aria-hidden />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
