"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
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
  status: "online" | "offline" | "pairing" | "awaiting-pairing" | "auth-failed" | "unknown";
  linkedNumber: string | null;
  displayName: string | null;
  lastSeen: string | null;
  pairingCode: string | null;
  pairingPhone: string | null;
  pairingCodeAt: string | null;
  portfolioCount: number;
  lastUpload?: string;
};

type EnvConfig = {
  COMPANION_ALLOWED_NUMBERS: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  COMPANION_DATA_DIR: string;
};

const EMPTY_STATUS: BotStatus = {
  status: "unknown",
  linkedNumber: null,
  displayName: null,
  lastSeen: null,
  pairingCode: null,
  pairingPhone: null,
  pairingCodeAt: null,
  portfolioCount: 0,
};

export default function WhatsAppAdminPage() {
  const [botStatus, setBotStatus] = useState<BotStatus>(EMPTY_STATUS);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrAge, setQrAge]         = useState<string | null>(null);
  const [envConfig, setEnvConfig] = useState<Partial<EnvConfig>>({});
  const [pairPhone, setPairPhone] = useState("");
  const [pairLoading, setPairLoading] = useState(false);
  const [pairMsg, setPairMsg]     = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const token = getAdminToken();
      const res = await fetch("/api/admin/whatsapp/status", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) {
        const d = await res.json();
        setBotStatus({
          status: d.status ?? "offline",
          linkedNumber: d.linkedNumber ?? null,
          displayName: d.displayName ?? null,
          lastSeen: d.lastSeen ?? null,
          pairingCode: d.pairingCode ?? null,
          pairingPhone: d.pairingPhone ?? null,
          pairingCodeAt: d.pairingCodeAt ?? null,
          portfolioCount: d.portfolioCount ?? 0,
          lastUpload: d.lastUpload,
        });
      }
    } catch { /* silently ignore poll errors */ }
  }, []);

  const fetchQr = useCallback(async () => {
    try {
      const token = getAdminToken();
      const res = await fetch("/api/admin/whatsapp/qr", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) {
        const d = await res.json();
        setQrDataUrl(d.dataUrl ?? null);
        setQrAge(d.generatedAt ?? null);
      }
    } catch {}
  }, []);

  const fetchEnv = useCallback(async () => {
    try {
      const token = getAdminToken();
      const res = await fetch("/api/admin/whatsapp/env", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) {
        const d = await res.json();
        setEnvConfig(d.env ?? {});
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchQr();
    fetchEnv();
    pollRef.current = setInterval(() => {
      fetchStatus();
      fetchQr();
    }, 8_000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchStatus, fetchQr, fetchEnv]);

  async function requestPairingCode() {
    if (!pairPhone.trim()) { setPairMsg("Enter a phone number first."); return; }
    setPairLoading(true);
    setPairMsg(null);
    try {
      const token = getAdminToken();
      const res = await fetch("/api/admin/whatsapp/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ phone: pairPhone }),
      });
      const d = await res.json();
      if (res.ok) {
        setPairMsg(d.message ?? "Request queued — code will appear below in a few seconds.");
        // Poll quickly to pick up the new code
        setTimeout(fetchStatus, 3000);
        setTimeout(fetchStatus, 6000);
        setTimeout(fetchStatus, 10000);
      } else {
        setPairMsg(`Error: ${(d as { error?: string }).error ?? "Unknown error"}`);
      }
    } catch (e) {
      setPairMsg(`Error: ${String(e)}`);
    } finally {
      setPairLoading(false);
    }
  }

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
      if (!res.ok) setError((d as { error?: string }).error ?? "Reset failed");
      else {
        setResetConfirm(false);
        setBotStatus(EMPTY_STATUS);
        setQrDataUrl(null);
        fetchStatus();
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  const isOnline      = botStatus.status === "online";
  const isPairing     = botStatus.status === "pairing" || botStatus.status === "awaiting-pairing";
  const isNotLinked   = !isOnline;

  const statusColor = isOnline
    ? "bg-[hsl(142_70%_49%/0.15)] text-[hsl(142_70%_36%)] border-[hsl(142_70%_49%/0.3)]"
    : isPairing
      ? "bg-[hsl(38_92%_50%/0.12)] text-[hsl(38_92%_40%)] border-[hsl(38_92%_50%/0.3)]"
      : "bg-[hsl(0_84%_60%/0.1)] text-destructive border-[hsl(0_84%_60%/0.25)]";

  return (
    <AdminPage
      eyebrow="WhatsApp Bot"
      title="Bot control & pairing"
      description="Link your WhatsApp number via QR code or 8-digit pairing code — entirely from this dashboard."
      actions={
        <AdminButton onClick={() => { fetchStatus(); fetchQr(); }} type="button" variant="ghost">
          <RefreshCw size={14} aria-hidden /> Refresh
        </AdminButton>
      }
    >
      {/* ── Status card ── */}
      <AdminCard className="!p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[15px] font-semibold text-foreground">Bot status</h2>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] ${statusColor}`}>
            {isOnline ? <Wifi size={10} aria-hidden /> : <WifiOff size={10} aria-hidden />}
            {botStatus.status}
          </span>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Linked number" value={botStatus.linkedNumber ?? "—"} />
          <Stat label="Display name" value={botStatus.displayName ?? "—"} />
          <Stat label="Portfolio items" value={String(botStatus.portfolioCount)} />
          <Stat label="Last seen" value={botStatus.lastSeen ? new Date(botStatus.lastSeen).toLocaleTimeString() : "—"} />
        </div>

        {botStatus.lastUpload && (
          <p className="mt-2 text-[11px] text-foreground-muted">
            Last upload: <span className="font-semibold text-foreground">{botStatus.lastUpload}</span>
          </p>
        )}
      </AdminCard>

      {/* ── Linking card ── */}
      {isNotLinked && (
        <AdminCard>
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Smartphone size={18} aria-hidden /> Link WhatsApp
          </h2>

          {/* Pairing code display */}
          {botStatus.pairingCode && (
            <div className="mt-4 text-center py-4 rounded-xl border border-border bg-secondary">
              <p className="text-sm text-foreground-muted mb-3">Enter this 8-digit code in WhatsApp to link:</p>
              <div className="font-mono text-3xl font-bold tracking-[0.2em] text-primary bg-background-elev inline-block px-6 py-3 rounded-lg border border-primary/30">
                {botStatus.pairingCode}
              </div>
              <p className="text-xs text-foreground-muted mt-3">
                WhatsApp → Settings → Linked Devices → Link with phone number
              </p>
            </div>
          )}

          {/* QR code display */}
          {!botStatus.pairingCode && qrDataUrl && (
            <div className="mt-4 text-center py-4 rounded-xl border border-border bg-secondary">
              <p className="text-sm text-foreground-muted mb-3">Scan this QR code with WhatsApp:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="WhatsApp QR code" className="mx-auto rounded-lg border border-border" width={220} height={220} />
              {qrAge && (
                <p className="text-[11px] text-foreground-muted mt-2">
                  Generated at {new Date(qrAge).toLocaleTimeString()}
                </p>
              )}
              <p className="text-xs text-foreground-muted mt-2">QR expires in ~20 seconds — auto-refreshes every 8s</p>
            </div>
          )}

          {/* 8-digit pairing code request */}
          <div className="mt-4 space-y-3">
            <p className="text-sm text-foreground-muted">
              Alternatively, request an 8-digit pairing code. Enter your WhatsApp number (with country code, no +):
            </p>
            <AdminField label="Phone number">
              <div className="flex gap-2">
                <AdminInput
                  value={pairPhone}
                  onChange={e => setPairPhone(e.target.value)}
                  placeholder="254715927114"
                />
                <AdminButton onClick={requestPairingCode} disabled={pairLoading || !pairPhone} type="button">
                  {pairLoading ? "Requesting..." : "Get Code"}
                </AdminButton>
              </div>
            </AdminField>
            {pairMsg && (
              <p className="text-sm text-foreground-muted">{pairMsg}</p>
            )}
          </div>
        </AdminCard>
      )}

      {/* ── Bot config ── */}
      <AdminCard>
        <h2 className="font-display text-lg font-semibold text-foreground">Bot configuration</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <AdminField
            label="Allowed phone numbers"
            hint="Comma-separated E.164 format, no + sign. Only these numbers can issue bot commands."
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
            <CheckCircle2 size={14} aria-hidden /> Config saved
          </p>
        )}

        <div className="mt-5">
          <AdminButton onClick={saveEnv} type="button" disabled={loading}>
            <Save size={14} aria-hidden /> {loading ? "Saving..." : "Save config"}
          </AdminButton>
        </div>
      </AdminCard>

      {/* ── Session reset ── */}
      <AdminCard>
        <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <ShieldOff size={18} className="text-destructive" aria-hidden /> Session management
        </h2>
        <p className="mt-1 text-sm text-foreground-muted">
          Reset the WhatsApp session to unlink the current number. The bot will show a fresh QR on next startup.
          This deletes the <code className="font-mono text-xs">.wwebjs_auth</code> folder on the server.
        </p>
        <div className="mt-4">
          <AdminButton variant="danger" type="button" onClick={resetSession} disabled={loading}>
            <Trash2 size={14} aria-hidden />
            {resetConfirm ? "Confirm — this will unlink WhatsApp" : "Reset session / unlink"}
          </AdminButton>
          {resetConfirm && (
            <p className="mt-2 text-xs text-destructive">
              Click again to confirm. Restart the bot after reset.
            </p>
          )}
        </div>
      </AdminCard>
    </AdminPage>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background-elev px-3 py-2 flex flex-col justify-center">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground-subtle">{label}</p>
      <p className="text-xs font-semibold text-foreground truncate mt-0.5" title={value}>{value}</p>
    </div>
  );
}
