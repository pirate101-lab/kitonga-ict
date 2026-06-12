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
  disconnectedAt?: string;
};

type EnvConfig = {
  COMPANION_ALLOWED_NUMBERS: string;
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
  const [refreshing, setRefreshing] = useState(false);
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
          disconnectedAt: d.disconnectedAt,
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

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchStatus(), fetchQr(), fetchEnv()]);
    setRefreshing(false);
  }, [fetchStatus, fetchQr, fetchEnv]);

  useEffect(() => {
    refreshAll();
    // Poll every 4s for fast status updates
    pollRef.current = setInterval(() => {
      fetchStatus();
      fetchQr();
    }, 4_000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [refreshAll, fetchStatus, fetchQr]);

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
        setPairMsg("Code requested — check below in a few seconds.");
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
        setTimeout(fetchStatus, 1000);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  const isOnline    = botStatus.status === "online";
  const isNotLinked = !isOnline;

  const statusColor = isOnline
    ? "bg-green-50 text-green-700 border-green-300"
    : botStatus.status === "pairing" || botStatus.status === "awaiting-pairing"
      ? "bg-amber-50 text-amber-700 border-amber-300"
      : "bg-red-50 text-destructive border-red-200";

  return (
    <AdminPage
      eyebrow="WhatsApp Bot"
      title="Bot control & pairing"
      description="Link your WhatsApp, configure the bot, and monitor status."
      actions={
        <AdminButton onClick={refreshAll} type="button" variant="ghost" disabled={refreshing}>
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} aria-hidden /> Refresh
        </AdminButton>
      }
    >
      {/* ── Compact Status card ── */}
      <AdminCard className="!py-3 !px-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] ${statusColor}`}>
              {isOnline ? <Wifi size={10} aria-hidden /> : <WifiOff size={10} aria-hidden />}
              {botStatus.status}
            </span>
            {botStatus.linkedNumber && (
              <span className="text-sm font-mono text-foreground">{botStatus.linkedNumber}</span>
            )}
            {botStatus.disconnectedAt && !isOnline && (
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                Disconnected {new Date(botStatus.disconnectedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            {botStatus.lastSeen ? `Seen ${new Date(botStatus.lastSeen).toLocaleTimeString()}` : "Not seen yet"}
          </span>
        </div>
      </AdminCard>

      {/* ── Linking card ── */}
      {isNotLinked && (
        <AdminCard>
          <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
            <Smartphone size={16} aria-hidden /> Link WhatsApp
          </h2>

          {/* Pairing code display */}
          {botStatus.pairingCode && (
            <div className="mt-4 text-center py-4 rounded-xl border border-border bg-secondary">
              <p className="text-sm text-foreground-muted mb-3">Enter this 8-digit code in WhatsApp:</p>
              <div className="font-mono text-3xl font-bold tracking-[0.2em] text-primary bg-background-elev inline-block px-6 py-3 rounded-lg border border-primary/30">
                {botStatus.pairingCode}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                WhatsApp → Settings → Linked Devices → Link with phone number
              </p>
            </div>
          )}

          {/* QR code display */}
          {!botStatus.pairingCode && qrDataUrl && (
            <div className="mt-4 text-center py-4 rounded-xl border border-border bg-secondary">
              <p className="text-sm text-muted-foreground mb-3">Scan with WhatsApp:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="WhatsApp QR code" className="mx-auto rounded-lg border border-border" width={220} height={220} />
              {qrAge && (
                <p className="text-[11px] text-muted-foreground mt-2">
                  Generated {new Date(qrAge).toLocaleTimeString()} · refreshes every 4s
                </p>
              )}
            </div>
          )}

          {/* 8-digit pairing code request */}
          <div className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Or request an 8-digit pairing code (no need to scan QR):
            </p>
            <AdminField label="Phone number (country code, no +)">
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
              <p className="text-sm text-muted-foreground">{pairMsg}</p>
            )}
          </div>
        </AdminCard>
      )}

      {/* ── Bot config ── */}
      <AdminCard>
        <h2 className="font-display text-base font-semibold text-foreground">Bot configuration</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <AdminField
            label="Allowed numbers"
            hint="Comma-separated E.164, no + sign."
          >
            <AdminInput
              value={envConfig.COMPANION_ALLOWED_NUMBERS ?? ""}
              onChange={e => setEnvConfig(s => ({ ...s, COMPANION_ALLOWED_NUMBERS: e.target.value }))}
              placeholder="254715927114,254700000000"
            />
          </AdminField>
          <AdminField
            label="Data directory"
            hint="Absolute path to the data/ folder."
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
          <p className="mt-3 flex items-center gap-2 text-sm text-green-700">
            <CheckCircle2 size={14} aria-hidden /> Saved
          </p>
        )}
        <div className="mt-4">
          <AdminButton onClick={saveEnv} type="button" disabled={loading}>
            <Save size={14} aria-hidden /> {loading ? "Saving..." : "Save"}
          </AdminButton>
        </div>
      </AdminCard>

      {/* ── Session reset ── */}
      <AdminCard>
        <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
          <ShieldOff size={16} className="text-destructive" aria-hidden /> Session
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Unlink the current WhatsApp number. Bot will show a fresh QR on next restart.
        </p>
        <div className="mt-3">
          <AdminButton variant="danger" type="button" onClick={resetSession} disabled={loading}>
            <Trash2 size={14} aria-hidden />
            {resetConfirm ? "Confirm unlink" : "Reset / unlink"}
          </AdminButton>
        </div>
      </AdminCard>
    </AdminPage>
  );
}
