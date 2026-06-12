"use client";

import { useCallback, useEffect, useState } from "react";
import {
  KeyRound,
  Loader2,
  PencilLine,
  ShieldCheck,
  Trash2,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import {
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
  AdminPage,
  AdminSelect,
} from "@/components/admin/AdminPage";
import { clearAdminToken, getAdminToken } from "@/lib/cloudinary-client";

type SafeAdmin = {
  id: string;
  username: string;
  role: "owner" | "manager";
  createdAt: string;
  updatedAt: string;
};

type RowMode = "view" | "edit" | "reset";

const USERNAME_PATTERN = /^[a-z0-9_-]{3,32}$/;

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

async function api<T>(
  url: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  const token = getAdminToken();
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init?.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(url, {
    ...init,
    headers,
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });
  const data = (await res.json().catch(() => ({}))) as T & {
    ok?: boolean;
    error?: string;
  };
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `Request failed (${res.status}).`);
  }
  return data;
}

/**
 * Studio Team management. Owner-only — managers visiting this page see
 * an "owner role required" panel because the underlying API rejects
 * their requests with 403.
 */
export default function AdminTeamPage() {
  const [admins, setAdmins] = useState<SafeAdmin[]>([]);
  const [me, setMe] = useState<SafeAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // create-admin form
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"owner" | "manager">("manager");
  const [creating, setCreating] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const meRes = await api<{ admin: SafeAdmin }>("/api/admin/me");
      setMe(meRes.admin);
      const listRes = await api<{ admins: SafeAdmin[] }>("/api/admins");
      setAdmins(listRes.admins);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not load team.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const u = newUsername.trim().toLowerCase();
    if (!USERNAME_PATTERN.test(u)) {
      toast.error("Username: 3–32 lowercase letters, digits, _ or -.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setCreating(true);
    try {
      await api("/api/admins", {
        method: "POST",
        json: { username: u, password: newPassword, role: newRole },
      });
      toast.success(`Admin "${u}" created.`);
      setNewUsername("");
      setNewPassword("");
      setNewRole("manager");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create admin.");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <AdminPage
        eyebrow="Studio team"
        title="Manage admins"
        description="Loading team…"
      >
        <AdminCard>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={14} className="animate-spin" aria-hidden /> Loading…
          </div>
        </AdminCard>
      </AdminPage>
    );
  }

  if (error) {
    return (
      <AdminPage
        eyebrow="Studio team"
        title="Manage admins"
        description="Owner-only section."
      >
        <AdminCard>
          <p className="text-sm text-destructive">
            {error.includes("Owner role required")
              ? "This page is only available to owners. Ask an existing owner to promote your account."
              : error}
          </p>
        </AdminCard>
      </AdminPage>
    );
  }

  return (
    <AdminPage
      eyebrow="Studio team"
      title="Manage admins"
      description="Add new studio admins, rename them, reset their passwords, or remove them entirely. Owner-only — managers can only change their own password and username."
    >
      <AdminCard>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Add new admin
        </h2>
        <p className="mt-1 text-sm text-foreground-muted">
          New admins default to the <strong>manager</strong> role. Promote them
          to <strong>owner</strong> only when they should also be able to
          manage the team.
        </p>
        <form
          onSubmit={onCreate}
          className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_180px_auto]"
        >
          <AdminField
            label="Username"
            hint="3–32 chars · lowercase letters, digits, _ or -"
          >
            <AdminInput
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              spellCheck={false}
              autoCapitalize="none"
              required
            />
          </AdminField>
          <AdminField label="Password" hint="At least 8 characters.">
            <AdminInput
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </AdminField>
          <AdminField label="Role">
            <AdminSelect
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as "owner" | "manager")}
            >
              <option value="manager">Manager</option>
              <option value="owner">Owner</option>
            </AdminSelect>
          </AdminField>
          <div className="flex items-end">
            <AdminButton type="submit" disabled={creating}>
              {creating ? (
                <>
                  <Loader2 size={14} className="animate-spin" aria-hidden /> Creating…
                </>
              ) : (
                <>
                  <UserPlus size={14} aria-hidden /> Add admin
                </>
              )}
            </AdminButton>
          </div>
        </form>
      </AdminCard>

      <AdminCard className="overflow-hidden">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Studio admins
        </h2>
        <p className="mt-1 text-sm text-foreground-muted">
          {admins.length} {admins.length === 1 ? "admin" : "admins"} ·{" "}
          {admins.filter((a) => a.role === "owner").length} owner(s).
        </p>

        <ul className="mt-5 flex flex-col gap-3">
          {admins.map((admin) => (
            <AdminRow
              key={admin.id}
              admin={admin}
              isMe={me?.id === admin.id}
              onChanged={refresh}
            />
          ))}
        </ul>
      </AdminCard>
    </AdminPage>
  );
}

function AdminRow({
  admin,
  isMe,
  onChanged,
}: {
  admin: SafeAdmin;
  isMe: boolean;
  onChanged: () => Promise<void>;
}) {
  const [mode, setMode] = useState<RowMode>("view");
  const [username, setUsername] = useState(admin.username);
  const [role, setRole] = useState<"owner" | "manager">(admin.role);
  const [resetPw, setResetPw] = useState("");
  const [busy, setBusy] = useState(false);

  async function saveEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      const patch: { username?: string; role?: "owner" | "manager" } = {};
      const u = username.trim().toLowerCase();
      if (u !== admin.username) {
        if (!USERNAME_PATTERN.test(u)) {
          toast.error("Username: 3–32 lowercase letters, digits, _ or -.");
          setBusy(false);
          return;
        }
        patch.username = u;
      }
      if (role !== admin.role) patch.role = role;
      if (Object.keys(patch).length === 0) {
        setMode("view");
        setBusy(false);
        return;
      }
      await api(`/api/admins/${admin.id}`, { method: "PATCH", json: patch });
      toast.success("Admin updated.");
      setMode("view");
      await onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update admin.");
    } finally {
      setBusy(false);
    }
  }

  async function saveReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (resetPw.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      await api(`/api/admins/${admin.id}`, {
        method: "PATCH",
        json: { newPassword: resetPw },
      });
      toast.success(
        `Reset password for "${admin.username}". Their other sessions were signed out.`,
      );
      setResetPw("");
      setMode("view");
      await onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reset password.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (
      !window.confirm(
        `Delete admin "${admin.username}"? This cannot be undone and revokes all their sessions.`,
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      await api(`/api/admins/${admin.id}`, { method: "DELETE" });
      toast.success(`Deleted admin "${admin.username}".`);
      // If we just deleted ourselves (last action of an owner removing
      // their own account after promoting someone else), clear the
      // local Bearer so we redirect to /studio cleanly on next route
      // transition.
      if (isMe) {
        clearAdminToken();
        window.location.assign("/studio");
        return;
      }
      await onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete admin.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="rounded-2xl border border-card-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary">
            <ShieldCheck size={16} aria-hidden />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground truncate">
                {admin.username}
              </span>
              {isMe ? (
                <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                  You
                </span>
              ) : null}
              <span
                className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] ${
                  admin.role === "owner"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-card-border bg-secondary text-foreground"
                }`}
              >
                {admin.role}
              </span>
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              Created {formatDate(admin.createdAt)} · Updated{" "}
              {formatDate(admin.updatedAt)}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AdminButton
            type="button"
            variant="ghost"
            onClick={() => setMode(mode === "edit" ? "view" : "edit")}
            disabled={busy}
          >
            <PencilLine size={13} aria-hidden /> Edit
          </AdminButton>
          <AdminButton
            type="button"
            variant="ghost"
            onClick={() => setMode(mode === "reset" ? "view" : "reset")}
            disabled={busy}
          >
            <KeyRound size={13} aria-hidden /> Reset password
          </AdminButton>
          <AdminButton
            type="button"
            variant="danger"
            onClick={onDelete}
            disabled={busy}
            title={
              isMe
                ? "Deletes your own account (only allowed when another owner exists)."
                : undefined
            }
          >
            <Trash2 size={13} aria-hidden /> Delete
          </AdminButton>
        </div>
      </div>

      {mode === "edit" ? (
        <form
          onSubmit={saveEdit}
          className="mt-4 grid gap-3 border-t border-card-border pt-4 sm:grid-cols-[1fr_180px_auto_auto]"
        >
          <AdminField label="Username">
            <AdminInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              spellCheck={false}
              autoCapitalize="none"
            />
          </AdminField>
          <AdminField label="Role">
            <AdminSelect
              value={role}
              onChange={(e) => setRole(e.target.value as "owner" | "manager")}
              disabled={isMe && admin.role === "owner"}
            >
              <option value="manager">Manager</option>
              <option value="owner">Owner</option>
            </AdminSelect>
          </AdminField>
          <div className="flex items-end gap-2">
            <AdminButton type="submit" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 size={14} className="animate-spin" aria-hidden /> Saving…
                </>
              ) : (
                "Save changes"
              )}
            </AdminButton>
            <AdminButton
              type="button"
              variant="ghost"
              onClick={() => {
                setUsername(admin.username);
                setRole(admin.role);
                setMode("view");
              }}
            >
              Cancel
            </AdminButton>
          </div>
          {isMe && admin.role === "owner" ? (
            <p className="sm:col-span-4 text-xs text-muted-foreground">
              You can&apos;t demote yourself here. Promote another admin to
              owner first, then come back.
            </p>
          ) : null}
        </form>
      ) : null}

      {mode === "reset" ? (
        <form
          onSubmit={saveReset}
          className="mt-4 grid gap-3 border-t border-card-border pt-4 sm:grid-cols-[1fr_auto_auto]"
        >
          <AdminField
            label="New password"
            hint="At least 8 characters. Other sessions for this admin will be signed out."
          >
            <AdminInput
              type="password"
              value={resetPw}
              onChange={(e) => setResetPw(e.target.value)}
              autoComplete="new-password"
            />
          </AdminField>
          <div className="flex items-end gap-2">
            <AdminButton type="submit" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 size={14} className="animate-spin" aria-hidden /> Resetting…
                </>
              ) : (
                "Reset password"
              )}
            </AdminButton>
            <AdminButton
              type="button"
              variant="ghost"
              onClick={() => {
                setResetPw("");
                setMode("view");
              }}
            >
              Cancel
            </AdminButton>
          </div>
        </form>
      ) : null}
    </li>
  );
}
