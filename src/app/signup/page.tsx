"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
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
    <div className="min-h-[calc(100vh-56px)] bg-[#f2f5f9] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Image
            src="/brand/logo-round.png"
            alt=""
            width={30}
            height={30}
            quality={60}
            sizes="36px"
            className="rounded-full object-cover"
            style={{ width: 30, height: 30 }}
          />
          <span className="text-[13px] font-black text-[#0a0a0a] uppercase tracking-tight">
            KITONGA-ICT
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl border-2 border-black/30 p-6">
          <h1 className="text-[18px] font-bold text-[#0a0a0a] mb-1">Create account</h1>
          <p className="text-[13px] text-[#333] mb-5">
            Phone number + password. No card required.
          </p>

          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-[11.5px] font-semibold text-[#222] uppercase tracking-wide mb-1.5">
                Phone number
              </label>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                ariaLabel="Phone number"
                size="lg"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold text-[#222] uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                className="w-full rounded-xl border-2 border-black/30 bg-white px-3.5 py-3 text-[14px] text-[#0a0a0a] outline-none transition-colors placeholder:text-[#888] focus:border-[#0067b8] focus:ring-2 focus:ring-[#0067b8]/20"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0067b8] px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-[#005a9e] disabled:opacity-60 transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" aria-hidden />
                  Creating…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={14} aria-hidden />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[12.5px] text-[#333]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#0067b8] hover:underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
