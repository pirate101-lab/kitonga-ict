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
  pairingCode?: string | null;
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
  const [pairingNumber, setPairingNumber] = useState("");
  const [pairingLoading, setPairingLoading] = useState(false);
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
          pairingCode: data.pairingCode ?? null,
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

  async function requestPairingCode() {
    if (!pairingNumber) return;
    setPairingLoading(true);
    setError(null);
    try {
      const token = getAdminToken();
      await fetch("/api/admin/whatsapp/env", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ COMPANION_PAIRING_NUMBER: pairingNumber }),
      });
      await fetch("/api/admin/whatsapp/restart", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimeout(fetchStatus, 3000);
      setTimeout(fetchStatus, 6000);
      setTimeout(fetchStatus, 9000);
    } catch (e) {
      setError(String(e));
    } finally {
      setPairingLoading(false);
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

      {/* ── Instructions / Linking card ── */}
      <AdminCard>
        <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <Smartphone size={18} aria-hidden /> Link WhatsApp with Pairing Code
        </h2>
        
        {!isOnline && (
          <div className="mt-4 p-4 rounded-xl border border-border bg-secondary">
            {botStatus.pairingCode ? (
              <div className="text-center py-4">
                <p className="text-sm text-foreground-muted mb-3">Enter this 8-digit code in WhatsApp to link:</p>
                <div className="font-mono text-3xl font-bold tracking-[0.2em] text-primary bg-background-elev inline-block px-6 py-3 rounded-lg border border-primary/30">
                  {botStatus.pairingCode}
                </div>
                <p className="text-xs text-foreground-muted mt-4">Waiting for you to link on your phone...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-foreground-muted">
                  To link the bot, enter your WhatsApp phone number (with country code, e.g. 254700000000) and request a pairing code.
                </p>
                <AdminField label="Phone number for pairing">
                  <div className="flex gap-2">
                    <AdminInput
                      value={pairingNumber}
                      onChange={e => setPairingNumber(e.target.value)}
                      placeholder="254715927114"
                    />
                    <AdminButton onClick={requestPairingCode} disabled={pairingLoading || !pairingNumber} type="button">
                      {pairingLoading ? "Requesting..." : "Get Code"}
                    </AdminButton>
                  </div>
                </AdminField>
              </div>
            )}
          </div>
        )}


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
