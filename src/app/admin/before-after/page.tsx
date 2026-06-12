"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2, Upload } from "lucide-react";
import {
 AdminButton,
 AdminCard,
 AdminField,
 AdminInput,
 AdminPage,
 AdminTextarea,
} from "@/components/admin/AdminPage";
import {
 ADMIN_STORAGE_KEYS,
 genId,
 readAdminStore,
 writeAdminStore,
 type AdminBeforeAfter,
} from "@/lib/adminStore";

const SEED: AdminBeforeAfter[] = [
 {
 id: "ba-portrait",
 title: "Editorial portrait — frequency separation",
 category: "Photo Edit",
 description:
 "Raw studio capture before lighting balance, color grading, and high-end skin retouch.",
 },
 {
 id: "ba-poster",
 title: "Album launch poster — concept to ship",
 category: "Poster Design",
 description:
 "From a flat wireframe brief to a fully composed, print-ready poster system.",
 },
];

async function fileToDataUrl(file: File) {
 return new Promise<string>((resolve, reject) => {
 const r = new FileReader();
 r.onload = () => resolve(String(r.result));
 r.onerror = reject;
 r.readAsDataURL(file);
 });
}

export default function AdminBeforeAfterPage() {
 const [items, setItems] = useState<AdminBeforeAfter[]>([]);
 const [savedAt, setSavedAt] = useState<number | null>(null);

 useEffect(() => {
 const stored = readAdminStore<AdminBeforeAfter[]>(
 ADMIN_STORAGE_KEYS.beforeAfter,
 );
 setItems(stored && stored.length ? stored : SEED);
 }, []);

 const update = (id: string, patch: Partial<AdminBeforeAfter>) =>
 setItems((s) =>
 s.map((item) => (item.id === id ? { ...item, ...patch } : item)),
 );

 const remove = (id: string) =>
 setItems((s) => s.filter((item) => item.id !== id));

 const addItem = () =>
 setItems((s) => [
 {
 id: genId("ba"),
 title: "Untitled before / after",
 category: "Photo Edit",
 description: "",
 },
 ...s,
 ]);

 const save = () => {
 writeAdminStore(ADMIN_STORAGE_KEYS.beforeAfter, items);
 setSavedAt(Date.now());
 };

 const handleUpload = async (
 id: string,
 side: "beforeImage" | "afterImage",
 file: File | null,
 ) => {
 if (!file) return;
 const dataUrl = await fileToDataUrl(file);
 update(id, { [side]: dataUrl } as Partial<AdminBeforeAfter>);
 };

 return (
 <AdminPage
 eyebrow="Before · After"
 title="Comparison generator"
 description="Upload a before/after pair per case study. Once saved, each entry is auto-compiled into the interactive comparison slider on the homepage."
 actions={
 <>
 <AdminButton type="button" onClick={addItem}>
 <Plus size={14} aria-hidden /> New pair
 </AdminButton>
 <AdminButton type="button" onClick={save}>
 <Save size={14} aria-hidden /> Save
 </AdminButton>
 </>
 }
 >
 {savedAt ? (
 <p className="text-xs text-accent">
 Saved · the comparison module will pick this up on next load.
 </p>
 ) : null}

 <div className="grid gap-4">
 {items.map((item) => (
 <AdminCard key={item.id}>
 <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
 <div className="grid gap-4">
 <AdminField label="Title">
 <AdminInput
 value={item.title}
 onChange={(e) =>
 update(item.id, { title: e.target.value })
 }
 />
 </AdminField>
 <AdminField label="Category">
 <AdminInput
 value={item.category}
 onChange={(e) =>
 update(item.id, { category: e.target.value })
 }
 />
 </AdminField>
 <AdminField label="Description">
 <AdminTextarea
 value={item.description}
 onChange={(e) =>
 update(item.id, { description: e.target.value })
 }
 />
 </AdminField>
 <AdminButton
 variant="danger"
 type="button"
 onClick={() => remove(item.id)}
 >
 <Trash2 size={14} aria-hidden /> Remove pair
 </AdminButton>
 </div>

 <div className="grid grid-cols-2 gap-3">
 <ImageDrop
 label="Before"
 src={item.beforeImage}
 onChange={(file) =>
 handleUpload(item.id, "beforeImage", file)
 }
 />
 <ImageDrop
 label="After"
 src={item.afterImage}
 onChange={(file) =>
 handleUpload(item.id, "afterImage", file)
 }
 />
 </div>
 </div>
 </AdminCard>
 ))}
 </div>
 </AdminPage>
 );
}

function ImageDrop({
 label,
 src,
 onChange,
}: {
 label: string;
 src?: string;
 onChange: (file: File | null) => void;
}) {
 return (
 <label className="flex flex-col gap-2 cursor-pointer">
 <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-subtle">
 {label}
 </span>
 <div className="relative aspect-square overflow-hidden rounded-xl border border-dashed border-border-strong bg-background-elev">
 {src ? (
 // eslint-disable-next-line @next/next/no-img-element
 <img
 src={src}
 alt={`${label} sample`}
 className="absolute inset-0 h-full w-full object-cover"
 />
 ) : (
 <div className="absolute inset-0 grid place-items-center text-center text-foreground-subtle">
 <div>
 <Upload size={18} className="mx-auto" aria-hidden />
 <p className="mt-2 text-xs">Click to upload</p>
 </div>
 </div>
 )}
 </div>
 <input
 type="file"
 accept="image/*"
 className="hidden"
 onChange={(e) => onChange(e.target.files?.[0] ?? null)}
 />
 </label>
 );
}
