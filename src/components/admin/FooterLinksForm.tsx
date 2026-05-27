"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AdminButton, AdminCard, AdminField, AdminInput } from "./AdminPage";
import { getAdminToken } from "@/lib/cloudinary-client";

type SocialLinks = {
  whatsapp: string;
  tiktok: string;
};

/**
 * "Footer & Social Links" panel rendered on /admin/settings.
 *
 * Loads the current WhatsApp and TikTok URLs from /api/site-settings on
 * mount, lets the admin edit them, and PATCHes them back. The Footer
 * (a server component) reads the same persisted JSON file directly so
 * changes take effect on the next page load — no redeploy needed.
 */
export function FooterLinksForm() {
  const [links, setLinks] = useState<SocialLinks>({ whatsapp: "", tiktok: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/site-settings", { cache: "no-store" });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          settings?: { social?: SocialLinks };
        };
        if (!cancelled && res.ok && data.ok && data.settings?.social) {
          setLinks(data.settings.social);
        }
      } catch {
        /* ignore network blips — defaults shown below */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = getAdminToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    setSaving(true);
    try {
      const res = await fetch("/api/site-settings", {
        method: "PATCH",
        headers,
        body: JSON.stringify(links),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        settings?: { social?: SocialLinks };
        error?: string;
      };
      if (!res.ok || !data.ok || !data.settings?.social) {
        throw new Error(data.error || `Save failed (${res.status}).`);
      }
      setLinks(data.settings.social);
      toast.success("Footer links updated.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save footer links.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminCard>
      <h2 className="font-display text-lg font-semibold text-foreground">
        Footer &amp; social links
      </h2>
      <p className="mt-1 text-sm text-foreground-muted">
        These two URLs power the WhatsApp and TikTok icons in the public
        footer. Updates persist in <code className="font-mono text-primary">data/site-settings.json</code> and the footer
        picks them up on the next page load — no redeploy needed.
      </p>

      <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:max-w-xl">
        <AdminField
          label="WhatsApp URL"
          hint="Full https://wa.me/… or chat link. Leave blank to fall back to the default Fast-Order CTA."
        >
          <AdminInput
            type="url"
            value={links.whatsapp}
            onChange={(e) =>
              setLinks((s) => ({ ...s, whatsapp: e.target.value }))
            }
            placeholder="https://wa.me/254715927114"
            disabled={loading}
          />
        </AdminField>
        <AdminField
          label="TikTok URL"
          hint="Full https://www.tiktok.com/@handle URL."
        >
          <AdminInput
            type="url"
            value={links.tiktok}
            onChange={(e) =>
              setLinks((s) => ({ ...s, tiktok: e.target.value }))
            }
            placeholder="https://www.tiktok.com/@kitongaict"
            disabled={loading}
          />
        </AdminField>
        <div>
          <AdminButton type="submit" disabled={saving || loading}>
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" aria-hidden /> Saving…
              </>
            ) : (
              <>
                <Save size={14} aria-hidden /> Save footer links
              </>
            )}
          </AdminButton>
        </div>
      </form>
    </AdminCard>
  );
}
