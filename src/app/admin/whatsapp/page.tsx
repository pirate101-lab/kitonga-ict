"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Save,
  ShieldOff,
  Smartphone,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
  AdminPage,
} from "@/components/admin/AdminPage";
import { getAdminToken } from "@/lib/cloudinary-client";

type BotStatus = {
  status: "online" | "offline" | "unknown";
  linkedNumber: string | null;
  displayName: string | null;
  lastSeen: string | null;
  portfolioCount: number;
  lastUpload?: string;
};

type EnvConfig = {
  COMPANION_ALLOWED_NUMBERS: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  COMPANION_DATA_DIR: string;
};

export default function WhatsAppAdminPage() {
  const [botStatus, setBotStatus] = useState<BotStatus>({
    status: "unknown",
    linkedNumber: null,
    displayName: null,
    lastSeen: null,
    portfolioCount: 0,
  });
  const [envConfig, setEnvConfig] = useState<Partial<EnvConfig>>({});
  const [cloudinarySecret, setCloudinarySecret] = useState("");
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const token = getAdminToken();
      const res = await fetch("/api/admin/whatsapp/status", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setBotStatus({
          status: data.status ?? "offline",
          linkedNumber: data.linkedNumber ?? null,
          displayName: data.displayName ?? null,
          lastSeen: data.lastSeen ?? null,
          portfolioCount: data.portfolioCount ?? 0,
          lastUpload: data.lastUpload,
        });
      }
    } catch { /* silently ignore poll errors */ }
  }, []);

  const fetchEnv = useCallback(async () => {
    try {
      const token = getAdminToken();
      const res = await fetch("/api/admin/whatsapp/env", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setEnvConfig(data.env ?? {});
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchEnv();
    pollRef.current = setInterval(fetchStatus, 10_000); // poll every 10s
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchStatus, fetchEnv]);

  async function saveEnv() {
    setLoading(true);
    setError(null);
    try {
      const token = getAdminToken();
      const payload: Record<string, string> = {
        COMPANION_ALLOWED_NUMBERS: envConfig.COMPANION_ALLOWED_NUMBERS ?? "",
      };
      if (useUrlMode && cloudinaryUrl) {
        payload.CLOUDINARY_URL = cloudinaryUrl;
      } else {
        if (envConfig.CLOUDINARY_CLOUD_NAME) payload.CLOUDINARY_CLOUD_NAME = envConfig.CLOUDINARY_CLOUD_NAME;
        if (envConfig.CLOUDINARY_API_KEY) payload.CLOUDINARY_API_KEY = envConfig.CLOUDINARY_API_KEY;
        if (cloudinarySecret) payload.CLOUDINARY_API_SECRET = cloudinarySecret;
      }
      if (envConfig.COMPANION_DATA_DIR) payload.COMPANION_DATA_DIR = envConfig.COMPANION_DATA_DIR;

      const res = await fetch("/api/admin/whatsapp/env", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError((d as { error?: string }).error ?? "Save failed");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchEnv();
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function resetSession() {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 5000);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = getAdminToken();
      const res = await fetch("/api/admin/whatsapp/session", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await res.json();
      if (!res.ok) setError(d.error ?? "Reset failed");
      else {
        setResetConfirm(false);
        fetchStatus();
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  const isOnline = botStatus.status === "online";

  return (
    <AdminPage
      eyebrow="WhatsApp Bot"
      title="Bot control & configuration"
      description="Monitor and control the WhatsApp companion bot. Configure Cloudinary, manage allowed numbers, and reset sessions — all without touching the server directly."
      actions={
        <AdminButton onClick={fetchStatus} type="button" variant="ghost">
          <RefreshCw size={14} aria-hidden /> Refresh
        </AdminButton>
      }
    >
      {/* ── Live status card ── */}
      <AdminCard>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">Bot status</h2>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.18em] ${
              isOnline
                ? "bg-[hsl(142_70%_49%/0.15)] text-[hsl(142_70%_36%)] border border-[hsl(142_70%_49%/0.3)]"
                : "bg-[hsl(0_84%_60%/0.1)] text-destructive border border-[hsl(0_84%_60%/0.25)]"
            }`}
          >
            {isOnline ? <Wifi size={12} aria-hidden /> : <WifiOff size={12} aria-hidden />}
            {botStatus.status}
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Linked number" value={botStatus.linkedNumber ?? "—"} />
          <Stat label="Display name" value={botStatus.displayName ?? "—"} />
          <Stat label="Portfolio items" value={String(botStatus.portfolioCount)} />
          <Stat label="Last seen" value={botStatus.lastSeen ? new Date(botStatus.lastSeen).toLocaleTimeString() : "—"} />
        </div>

        {botStatus.lastUpload && (
          <p className="mt-3 text-xs text-foreground-muted">
            Last upload: <span className="font-semibold text-foreground">{botStatus.lastUpload}</span>
          </p>
        )}
      </AdminCard>

      {/* ── Instructions card ── */}
      <AdminCard>
        <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <Smartphone size={18} aria-hidden /> How to link WhatsApp
        </h2>
        <ol className="mt-4 space-y-3 text-sm text-foreground-muted list-decimal list-inside">
          <li>Save your Cloudinary credentials and allowed numbers below, then click <strong className="text-foreground">Save config</strong>.</li>
          <li>On your server, run: <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-foreground">cd whatsapp-companion && npm install</code> (first time only)</li>
          <li>Start the bot: <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-foreground">bash scripts/start-companion.sh</code></li>
          <li>A QR code will appear in the server terminal. Open WhatsApp on your phone → Linked Devices → Link a Device → scan the QR.</li>
          <li>Once linked, this page auto-updates to show <strong className="text-foreground">online</strong> status (polls every 10 s).</li>
          <li>For production (auto-restart): <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-foreground">bash scripts/start-companion.sh --pm2</code></li>
        </ol>

        <div className="mt-4 rounded-xl border border-border bg-background-elev p-3">
          <p className="text-xs font-mono text-foreground-muted">
            <strong className="text-foreground">Command reference (send with image):</strong><br />
            <span className="text-primary">/portfolio Posters &quot;Title&quot;</span> · <span className="text-primary">/photoshop &quot;Title&quot;</span> · <span className="text-primary">/flyer &quot;Title&quot;</span><br />
            <span className="text-primary">/cv &quot;Title&quot;</span> · <span className="text-primary">/cards &quot;Title&quot;</span> · <span className="text-primary">!status</span> (text only)
          </p>
        </div>
      </AdminCard>

      {/* ── Cloudinary config ── */}
      <AdminCard>
        <h2 className="font-display text-lg font-semibold text-foreground">Cloudinary credentials</h2>
        <p className="mt-1 text-sm text-foreground-muted">
          These are stored in your server&apos;s <code className="font-mono text-xs">.env</code> file — never in the browser.
          The API secret is write-only for security.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={useUrlMode}
              onChange={e => setUseUrlMode(e.target.checked)}
              className="accent-primary"
            />
            Use CLOUDINARY_URL format
          </label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {useUrlMode ? (
            <AdminField
              label="CLOUDINARY_URL"
              hint="Format: cloudinary://API_KEY:API_SECRET@cloud_name"
            >
              <AdminInput
                type="password"
                value={cloudinaryUrl}
                onChange={e => setCloudinaryUrl(e.target.value)}
                placeholder="cloudinary://key:secret@cloud"
              />
            </AdminField>
          ) : (
            <>
              <AdminField label="Cloud name">
                <AdminInput
                  value={envConfig.CLOUDINARY_CLOUD_NAME ?? ""}
                  onChange={e => setEnvConfig(s => ({ ...s, CLOUDINARY_CLOUD_NAME: e.target.value }))}
                  placeholder="your-cloud-name"
                />
              </AdminField>
              <AdminField label="API key">
                <AdminInput
                  value={envConfig.CLOUDINARY_API_KEY ?? ""}
                  onChange={e => setEnvConfig(s => ({ ...s, CLOUDINARY_API_KEY: e.target.value }))}
                  placeholder="123456789012345"
                />
              </AdminField>
              <AdminField label="API secret (write-only)" hint="Leave blank to keep existing secret.">
                <AdminInput
                  type="password"
                  value={cloudinarySecret}
                  onChange={e => setCloudinarySecret(e.target.value)}
                  placeholder="Enter new secret to update"
                />
              </AdminField>
            </>
          )}
        </div>
      </AdminCard>

      {/* ── Bot config ── */}
      <AdminCard>
        <h2 className="font-display text-lg font-semibold text-foreground">Bot configuration</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <AdminField
            label="Allowed phone numbers"
            hint="Comma-separated, E.164 format, no + sign. Only these numbers can issue bot commands."
          >
            <AdminInput
              value={envConfig.COMPANION_ALLOWED_NUMBERS ?? ""}
              onChange={e => setEnvConfig(s => ({ ...s, COMPANION_ALLOWED_NUMBERS: e.target.value }))}
              placeholder="254715927114,254700000000"
            />
          </AdminField>
          <AdminField
            label="Data directory"
            hint="Absolute path to the data/ folder where portfolio.json lives."
          >
            <AdminInput
              value={envConfig.COMPANION_DATA_DIR ?? ""}
              onChange={e => setEnvConfig(s => ({ ...s, COMPANION_DATA_DIR: e.target.value }))}
              placeholder="/var/www/kitonga-ict/data"
            />
          </AdminField>
        </div>

        {error && (
          <p className="mt-3 flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle size={14} aria-hidden /> {error}
          </p>
        )}
        {saved && (
          <p className="mt-3 flex items-center gap-2 text-sm text-[hsl(142_70%_40%)]">
            <CheckCircle2 size={14} aria-hidden /> Config saved to .env
          </p>
        )}

        <div className="mt-5">
          <AdminButton onClick={saveEnv} type="button" disabled={loading}>
            <Save size={14} aria-hidden /> {loading ? "Saving..." : "Save config"}
          </AdminButton>
        </div>
      </AdminCard>

      {/* ── Danger zone: session reset ── */}
      <AdminCard>
        <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <ShieldOff size={18} className="text-destructive" aria-hidden /> Session management
        </h2>
        <p className="mt-1 text-sm text-foreground-muted">
          Reset the WhatsApp session to unlink the current number. The bot will show a new QR code on next startup.
          This deletes the <code className="font-mono text-xs">.wwebjs_auth</code> folder on the server.
        </p>
        <div className="mt-4">
          <AdminButton
            variant="danger"
            type="button"
            onClick={resetSession}
            disabled={loading}
          >
            <Trash2 size={14} aria-hidden />
            {resetConfirm ? "Confirm — this will unlink WhatsApp" : "Reset session / unlink"}
          </AdminButton>
          {resetConfirm && (
            <p className="mt-2 text-xs text-destructive">
              Click again to confirm. The bot must be restarted manually after reset.
            </p>
          )}
        </div>
      </AdminCard>
    </AdminPage>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background-elev p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-subtle">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground truncate" title={value}>{value}</p>
    </div>
  );
}
