"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import {
 AdminButton,
 AdminCard,
 AdminField,
 AdminInput,
 AdminPage,
 AdminTextarea,
} from "@/components/admin/AdminPage";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
 ADMIN_STORAGE_KEYS,
 genId,
 readAdminStore,
 writeAdminStore,
} from "@/lib/adminStore";
import { HERO_SLIDES, type HeroSlide } from "@/lib/slides";

export default function AdminSlidersPage() {
 const [slides, setSlides] = useState<HeroSlide[]>([]);
 const [savedAt, setSavedAt] = useState<number | null>(null);

 useEffect(() => {
 const stored = readAdminStore<HeroSlide[]>(ADMIN_STORAGE_KEYS.slides);
 setSlides(stored && stored.length ? stored : HERO_SLIDES);
 }, []);

 const update = (id: string, patch: Partial<HeroSlide>) => {
 setSlides((s) => s.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide)));
 };

 const remove = (id: string) => {
 setSlides((s) => s.filter((slide) => slide.id !== id));
 };

 const addSlide = () => {
 const next: HeroSlide = {
 id: genId("slide"),
 category: "New scene",
 title: "Untitled slide",
 subtitle: "",
 caption: "",
 badge: "",
 image:
 "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80&auto=format&fit=crop",
 ctaLabel: "",
 ctaHref: "",
 };
 setSlides((s) => [...s, next]);
 };

 const save = () => {
 writeAdminStore(ADMIN_STORAGE_KEYS.slides, slides);
 setSavedAt(Date.now());
 };

 const reset = () => {
 setSlides(HERO_SLIDES);
 writeAdminStore(ADMIN_STORAGE_KEYS.slides, HERO_SLIDES);
 setSavedAt(Date.now());
 };

 return (
 <AdminPage
 eyebrow="Hero sliders"
 title="Above-the-fold deck"
 description="Each slide becomes the full-bleed background image behind the hero text. Upload your own photo or paste an image URL. Recommended aspect ratio 16:9."
 actions={
 <>
 <AdminButton variant="ghost" onClick={reset} type="button">
 Reset to defaults
 </AdminButton>
 <AdminButton onClick={addSlide} type="button">
 <Plus size={14} aria-hidden /> Add slide
 </AdminButton>
 <AdminButton onClick={save} type="button">
 <Save size={14} aria-hidden /> Save
 </AdminButton>
 </>
 }
 >
 {savedAt ? (
 <p className="text-xs text-accent">
 Saved · the homepage hero will pick up these slides on next load.
 </p>
 ) : null}

 <div className="grid gap-4">
 {slides.map((slide, idx) => (
 <AdminCard key={slide.id}>
 <div className="flex items-start justify-between gap-4">
 <div>
 <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground-subtle">
 Slide {String(idx + 1).padStart(2, "0")}
 </p>
 <p className="mt-1 font-display text-lg font-semibold text-foreground">
 {slide.title || "Untitled"}
 </p>
 </div>
 <AdminButton
 variant="danger"
 onClick={() => remove(slide.id)}
 type="button"
 aria-label="Remove slide"
 >
 <Trash2 size={14} aria-hidden /> Remove
 </AdminButton>
 </div>

 <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_280px]">
 <div className="grid gap-4 sm:grid-cols-2">
 <AdminField label="Category">
 <AdminInput
 value={slide.category}
 onChange={(e) =>
 update(slide.id, { category: e.target.value })
 }
 placeholder="Brand identity"
 />
 </AdminField>
 <AdminField label="Badge (optional)">
 <AdminInput
 value={slide.badge ?? ""}
 onChange={(e) =>
 update(slide.id, { badge: e.target.value })
 }
 placeholder="Featured"
 />
 </AdminField>
 <AdminField label="Title" hint="Shown large on the slide.">
 <AdminInput
 value={slide.title}
 onChange={(e) =>
 update(slide.id, { title: e.target.value })
 }
 placeholder="Project name"
 />
 </AdminField>
 <AdminField label="Subtitle">
 <AdminInput
 value={slide.subtitle ?? ""}
 onChange={(e) =>
 update(slide.id, { subtitle: e.target.value })
 }
 placeholder="Identity system · 2025"
 />
 </AdminField>
 <AdminField label="Caption">
 <AdminTextarea
 value={slide.caption ?? ""}
 onChange={(e) =>
 update(slide.id, { caption: e.target.value })
 }
 placeholder="One-line description shown over the gradient."
 />
 </AdminField>
 <AdminField
 label="Image URL (or paste after uploading)"
 hint="Paste a URL or use the uploader on the right."
 >
 <AdminTextarea
 value={slide.image}
 onChange={(e) =>
 update(slide.id, { image: e.target.value })
 }
 placeholder="https://images.unsplash.com/photo-..."
 />
 </AdminField>
 <AdminField label="CTA label">
 <AdminInput
 value={slide.ctaLabel ?? ""}
 onChange={(e) =>
 update(slide.id, { ctaLabel: e.target.value })
 }
 placeholder="View case study"
 />
 </AdminField>
 <AdminField label="CTA link">
 <AdminInput
 value={slide.ctaHref ?? ""}
 onChange={(e) =>
 update(slide.id, { ctaHref: e.target.value })
 }
 placeholder="/portfolio?case=mzizi"
 />
 </AdminField>
 </div>

 <div className="flex flex-col gap-3">
 {/* Upload your own photo — sets image URL on the slide */}
 <ImageUploader
            label="Upload slide photo (16:9)"
            aspectHint="16:9"
            value={slide.image}
            publicId={slide.imagePublicId}
            onChange={(asset) =>
              update(slide.id, {
                image: asset?.url ?? "",
                imagePublicId: asset?.publicId,
              })
            }
          />
 {/* Preview from URL (if not a data URI) */}
 {slide.image && !slide.image.startsWith("data:") ? (
 <div className="rounded-xl border border-border-strong overflow-hidden">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img
 src={slide.image}
 alt=""
 className="w-full object-cover"
 style={{ maxHeight: 140 }}
 />
 <p className="px-2 py-1 text-[11px] font-mono uppercase tracking-[0.16em] text-foreground-subtle">
 URL preview
 </p>
 </div>
 ) : null}
 </div>
 </div>
 </AdminCard>
 ))}
 </div>
 </AdminPage>
 );
}
