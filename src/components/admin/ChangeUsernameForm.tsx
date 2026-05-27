"use client";

import { useEffect, useState } from "react";
import { Loader2, AtSign } from "lucide-react";
import { toast } from "sonner";
import { AdminButton, AdminCard, AdminField, AdminInput } from "./AdminPage";
import { getAdminToken } from "@/lib/cloudinary-client";

const USERNAME_PATTERN = /^[a-z0-9_-]{3,32}$/;

type SafeAdmin = {
  id: string;
  username: string;
  role: "owner" | "manager";
};

/**
 * "Change my username" panel rendered on /admin/settings.
 *
 * Calls POST /api/admin/change-username with the current Bearer token
 * and the current password (as a safety check). On success the next
 * /api/admin/me fetch will return the new username; the AdminShell
 * sidebar refreshes naturally on the next route change.
 */
export function ChangeUsernameForm() {
  const [me, setMe] = useState<SafeAdmin | null>(null);
  const [next, setNext] = useState("");
  const [current, setCurrent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    let cancelled = false;
    (async () => {
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
          setNext(data.admin.username);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const u = next.trim().toLowerCase();
    if (!USERNAME_PATTERN.test(u)) {
      toast.error("Username: 3–32 lowercase letters, digits, _ or -.");
      return;
    }
    if (me && u === me.username) {
      toast.error("That's already your username.");
      return;
    }
    if (!current) {
      toast.error("Enter your current password.");
      return;
    }

    setSubmitting(true);
    try {
      const token = getAdminToken();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch("/api/admin/change-username", {
        method: "POST",
        headers,
        body: JSON.stringify({
          currentPassword: current,
          newUsername: u,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        admin?: SafeAdmin;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.admin) {
        throw new Error(data.error || `Could not update username (${res.status}).`);
      }
      setMe(data.admin);
      setCurrent("");
      toast.success(`Username updated to "${data.admin.username}".`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update username.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminCard>
      <h2 className="font-display text-lg font-semibold text-foreground">
        My username
      </h2>
      <p className="mt-1 text-sm text-foreground-muted">
        Change the username you sign in with. Your role and existing sessions
        are preserved.
      </p>

      <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:max-w-md">
        <AdminField
          label="New username"
          hint="3–32 chars · lowercase letters, digits, _ or -"
        >
          <div className="flex items-stretch rounded-xl border border-card-border bg-card transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
            <span
              aria-hidden
              className="select-none flex items-center px-3 text-sm text-muted-foreground border-r border-card-border bg-secondary rounded-l-xl"
            >
              <AtSign size={14} />
            </span>
            <input
              value={next}
              onChange={(e) => setNext(e.target.value)}
              spellCheck={false}
              autoCapitalize="none"
              className="flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </AdminField>
        <AdminField label="Current password" hint="Required for safety.">
          <AdminInput
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
          />
        </AdminField>
        <div className="flex items-center gap-2">
          <AdminButton type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" aria-hidden /> Updating…
              </>
            ) : (
              "Update username"
            )}
          </AdminButton>
        </div>
      </form>
    </AdminCard>
  );
}
