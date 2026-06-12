"use client";

import { useState } from "react";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { AdminButton, AdminCard, AdminField, AdminInput } from "./AdminPage";
import {
  clearAdminToken,
  getAdminToken,
  setAdminToken,
} from "@/lib/cloudinary-client";

const MIN_NEW_PASSWORD = 8;

/**
 * Inline "Change admin password" panel rendered on /admin/settings.
 *
 * - Calls POST /api/admin/change-password with the current Bearer token.
 * - On success the server returns a brand-new token; we cache it via
 *   `setAdminToken` so the active session keeps working without a
 *   re-login.
 */
export function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (next.length < MIN_NEW_PASSWORD) {
      toast.error(`New password must be at least ${MIN_NEW_PASSWORD} characters.`);
      return;
    }
    if (next !== confirm) {
      toast.error("New passwords don't match.");
      return;
    }
    if (next === current) {
      toast.error("New password must be different from the current one.");
      return;
    }

    setSubmitting(true);
    try {
      const token = getAdminToken();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers,
        body: JSON.stringify({
          currentPassword: current,
          newPassword: next,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        token?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.token) {
        throw new Error(data.error || `Could not update password (${res.status}).`);
      }
      setAdminToken(data.token);
      setCurrent("");
      setNext("");
      setConfirm("");
      toast.success("Password updated. All other devices were signed out.");
    } catch (err) {
      console.error("[change-password]", err);
      toast.error(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setSubmitting(false);
    }
  }

  function onLogout() {
    const token = getAdminToken();
    // Fire-and-forget; even if the server fails, clear locally.
    fetch("/api/admin/logout", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).catch(() => {});
    clearAdminToken();
    window.location.assign("/studio");
  }

  return (
    <AdminCard>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Admin password
          </h2>
          <p className="mt-1 text-sm text-foreground-muted">
            Rotate your studio password. Any other devices currently signed in
            will be logged out.
          </p>
        </div>
        <AdminButton type="button" variant="ghost" onClick={onLogout}>
          Sign out
        </AdminButton>
      </div>

      <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:max-w-md">
        <AdminField label="Current password">
          <AdminInput
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
          />
        </AdminField>
        <AdminField
          label="New password"
          hint={`At least ${MIN_NEW_PASSWORD} characters.`}
        >
          <AdminInput
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
          />
        </AdminField>
        <AdminField label="Confirm new password">
          <AdminInput
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </AdminField>

        <div className="flex items-center gap-2">
          <AdminButton type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" aria-hidden />
                Updating…
              </>
            ) : (
              <>
                <KeyRound size={14} aria-hidden /> Update password
              </>
            )}
          </AdminButton>
        </div>
      </form>
    </AdminCard>
  );
}
