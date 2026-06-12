"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Star, Trash2 } from "lucide-react";
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
 type AdminTestimonial,
} from "@/lib/adminStore";

const SEED: AdminTestimonial[] = [
 {
 id: "t-001",
 quote:
 "Brief in at 9 AM via WhatsApp, print-ready poster by lunch. Twice. The turnaround alone makes them irreplaceable.",
 author: "Naomi Mwangi",
 role: "Marketing Director · Bara Capital",
 rating: 5,
 },
 {
 id: "t-002",
 quote:
 "We rebuilt our entire identity with KITONGA-ICT. Every deliverable felt considered — from the logo system to the social templates.",
 author: "Jamal Otieno",
 role: "Founder · Mzizi Coffee Roasters",
 rating: 5,
 },
 {
 id: "t-003",
 quote:
 "I needed a CV that actually got opened. Three interviews in the first two weeks. The work pays for itself.",
 author: "Faith Wanjiru",
 role: "Senior Project Manager",
 rating: 5,
 },
 {
 id: "t-004",
 quote:
 "The before/after on our editorial shoot was wild. Color grading at this level is rare anywhere — let alone via WhatsApp.",
 author: "Studio Lumière",
 role: "Editorial Photography",
 rating: 5,
 },
];

export default function AdminTestimonialsPage() {
 const [items, setItems] = useState<AdminTestimonial[]>([]);
 const [savedAt, setSavedAt] = useState<number | null>(null);

 useEffect(() => {
 const stored = readAdminStore<AdminTestimonial[]>(
 ADMIN_STORAGE_KEYS.testimonials,
 );
 setItems(stored && stored.length ? stored : SEED);
 }, []);

 const update = (id: string, patch: Partial<AdminTestimonial>) =>
 setItems((s) =>
 s.map((item) => (item.id === id ? { ...item, ...patch } : item)),
 );

 const remove = (id: string) =>
 setItems((s) => s.filter((item) => item.id !== id));

 const addItem = () =>
 setItems((s) => [
 {
 id: genId("t"),
 quote: "",
 author: "",
 role: "",
 rating: 5,
 },
 ...s,
 ]);

 const save = () => {
 writeAdminStore(ADMIN_STORAGE_KEYS.testimonials, items);
 setSavedAt(Date.now());
 };

 return (
 <AdminPage
 eyebrow="Testimonials"
 title="Words from clients"
 description="Add, edit and rotate the social proof shown on the homepage. The two highest-rated quotes lead the section."
 actions={
 <>
 <AdminButton type="button" onClick={addItem}>
 <Plus size={14} aria-hidden /> New testimonial
 </AdminButton>
 <AdminButton type="button" onClick={save}>
 <Save size={14} aria-hidden /> Save
 </AdminButton>
 </>
 }
 >
 {savedAt ? (
 <p className="text-xs text-accent">
 Saved · the homepage will reflect these on next load.
 </p>
 ) : null}

 <div className="grid gap-4">
 {items.map((item) => (
 <AdminCard key={item.id}>
 <div className="grid gap-4 sm:grid-cols-2">
 <AdminField label="Author">
 <AdminInput
 value={item.author}
 onChange={(e) =>
 update(item.id, { author: e.target.value })
 }
 />
 </AdminField>
 <AdminField label="Role / company">
 <AdminInput
 value={item.role}
 onChange={(e) => update(item.id, { role: e.target.value })}
 />
 </AdminField>
 <AdminField label="Quote">
 <AdminTextarea
 value={item.quote}
 onChange={(e) =>
 update(item.id, { quote: e.target.value })
 }
 />
 </AdminField>
 <AdminField label="Rating">
 <div className="flex items-center gap-2">
 {[1, 2, 3, 4, 5].map((n) => (
 <button
 key={n}
 type="button"
 onClick={() =>
 update(item.id, {
 rating: n as AdminTestimonial["rating"],
 })
 }
 aria-label={`Rate ${n} stars`}
 className="grid h-9 w-9 place-items-center rounded-full border border-border-strong bg-background-elev"
 >
 <Star
 size={14}
 className={
 n <= item.rating
 ? "fill-accent text-accent"
 : "text-foreground-subtle"
 }
 aria-hidden
 />
 </button>
 ))}
 </div>
 </AdminField>
 </div>
 <div className="mt-4 flex justify-end">
 <AdminButton
 variant="danger"
 type="button"
 onClick={() => remove(item.id)}
 >
 <Trash2 size={14} aria-hidden /> Remove
 </AdminButton>
 </div>
 </AdminCard>
 ))}
 </div>
 </AdminPage>
 );
}
