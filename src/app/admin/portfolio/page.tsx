"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, RefreshCcw, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
  AdminPage,
  AdminTextarea,
} from "@/components/admin/AdminPage";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { genId } from "@/lib/adminStore";
import { getAdminToken } from "@/lib/cloudinary-client";

type PortfolioRecord = {
  id: string;
  title: string;
  client: string;
  category: string;
  gradient: string;
  preview: string;
  tags: string[];
  year: number;
  imageUrl?: string;
  publicId?: string;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Canonical category list. Anything else typed by the admin (free-form
 * string in the input below) is saved as-is — these are just convenient
 * suggestions in the datalist dropdown.
 */
const CATEGORY_SUGGESTIONS = [
  "Posters & Flyers",
  "Business Cards",
  "Roll-up Banners",
  "Resumes & CVs",
  "Photo Compositing",
  "Brand Guidelines",
  "Pitch Decks",
  "Social Templates",
];

function authedFetch(input: RequestInfo, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${getAdminToken()}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(input, { ...init, headers });
}

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio", { cache: "no-store" });
      const data = (await res.json()) as { ok: boolean; items: PortfolioRecord[] };
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.error(err);
      toast.error("Could not load portfolio.");
    } finally {
      setLoading(false);
    }
  }

  function patchLocal(id: string, patch: Partial<PortfolioRecord>) {
    setItems((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  async function persist(id: string) {
    const item = items.find((p) => p.id === id);
    if (!item) return;
    setSavingId(id);
    try {
      const res = await authedFetch(`/api/portfolio/${id}`, {
        method: "PATCH",
        body: JSON.stringify(item),
      });
      const data = (await res.json()) as { ok: boolean; item?: PortfolioRecord; error?: string };
      if (!data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      if (data.item) patchLocal(id, data.item);
      toast.success("Saved.");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSavingId(null);
    }
  }

  async function addItem() {
    const draft: PortfolioRecord = {
      id: genId("p"),
      title: "Untitled piece",
      client: "Client name",
      category: "Posters & Flyers",
      gradient: "from-primary/40 via-sky-500/30 to-indigo-700/40",
      preview: "NEW\nPIECE",
      tags: [],
      year: new Date().getFullYear(),
    };
    setSavingId(draft.id);
    try {
      const res = await authedFetch(`/api/portfolio`, {
        method: "POST",
        body: JSON.stringify(draft),
      });
      const data = (await res.json()) as { ok: boolean; item?: PortfolioRecord };
      if (!data.ok || !data.item) throw new Error("Create failed.");
      setItems((list) => [data.item!, ...list]);
      toast.success("New piece added.");
    } catch (err) {
      console.error(err);
      toast.error("Create failed.");
    } finally {
      setSavingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Permanently delete this portfolio piece?")) return;
    try {
      const res = await authedFetch(`/api/portfolio/${id}`, { method: "DELETE" });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error || "Delete failed.");
      setItems((list) => list.filter((p) => p.id !== id));
      toast.success("Deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed.");
    }
  }

  return (
    <AdminPage
      eyebrow="Portfolio CMS"
      title="Portfolio (live DB)"
      description="The grid here is hydrated from /api/portfolio (a server-side JSON store seeded with placeholder pieces). Save flushes individual items to the DB; the public /portfolio grid pulls from the same source."
      actions={
        <>
          <AdminButton variant="ghost" onClick={refresh} type="button">
            <RefreshCcw size={14} aria-hidden /> Refresh
          </AdminButton>
          <AdminButton onClick={addItem} type="button">
            <Plus size={14} aria-hidden /> Add piece
          </AdminButton>
        </>
      }
    >
      {loading ? (
        <div className="grid place-items-center py-16 text-muted-foreground">
          <Loader2 size={20} className="animate-spin text-primary" aria-hidden />
          <p className="mt-2 text-xs">Loading library…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-card-border bg-card p-10 text-center text-muted-foreground">
          No pieces yet — add one above or run{" "}
          <code className="font-mono text-primary">node scripts/seed-portfolio.mjs</code>{" "}
          on the server.
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <AdminCard key={item.id}>
              <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField label="Title">
                    <AdminInput
                      value={item.title}
                      onChange={(e) => patchLocal(item.id, { title: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Client">
                    <AdminInput
                      value={item.client}
                      onChange={(e) => patchLocal(item.id, { client: e.target.value })}
                    />
                  </AdminField>
                  <AdminField
                    label="Category"
                    hint="Free-form. Pick a suggestion or type your own; the public Portfolio page builds its filter pills from whatever categories are in use."
                  >
                    <AdminInput
                      list={`portfolio-categories-${item.id}`}
                      value={item.category}
                      onChange={(e) => patchLocal(item.id, { category: e.target.value })}
                    />
                    <datalist id={`portfolio-categories-${item.id}`}>
                      {CATEGORY_SUGGESTIONS.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </AdminField>
                  <AdminField label="Year">
                    <AdminInput
                      type="number"
                      value={item.year}
                      onChange={(e) =>
                        patchLocal(item.id, { year: Number(e.target.value) || item.year })
                      }
                    />
                  </AdminField>
                  <AdminField label="Tags" hint="Comma-separated.">
                    <AdminInput
                      value={(item.tags ?? []).join(", ")}
                      onChange={(e) =>
                        patchLocal(item.id, {
                          tags: e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </AdminField>
                  <AdminField label="Placeholder preview" hint="Two-word fallback shown when no image.">
                    <AdminTextarea
                      rows={2}
                      value={item.preview}
                      onChange={(e) => patchLocal(item.id, { preview: e.target.value })}
                    />
                  </AdminField>
                </div>

                <div className="flex flex-col gap-3">
                  <ImageUploader
                    label="Image (Cloudinary)"
                    aspectHint="4:3"
                    value={item.imageUrl}
                    publicId={item.publicId}
                    onChange={(asset) =>
                      patchLocal(item.id, {
                        imageUrl: asset?.url,
                        publicId: asset?.publicId,
                      })
                    }
                  />
                  <div className="flex items-center gap-2">
                    <AdminButton
                      onClick={() => persist(item.id)}
                      disabled={savingId === item.id}
                      type="button"
                    >
                      {savingId === item.id ? (
                        <>
                          <Loader2 size={14} className="animate-spin" aria-hidden /> Saving
                        </>
                      ) : (
                        <>
                          <Save size={14} aria-hidden /> Save
                        </>
                      )}
                    </AdminButton>
                    <AdminButton variant="danger" onClick={() => remove(item.id)} type="button">
                      <Trash2 size={14} aria-hidden /> Delete
                    </AdminButton>
                  </div>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
