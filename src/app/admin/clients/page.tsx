"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Search, Trash2 } from "lucide-react";
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
 type AdminClient,
} from "@/lib/adminStore";

const SEED: AdminClient[] = [
 {
 id: "c-001",
 name: "Naomi Mwangi",
 company: "Bara Capital",
 email: "naomi@baracap.co.ke",
 phone: "+254 720 000 001",
 tags: ["retainer", "VIP"],
 notes: "Quarterly investor reports + ad-hoc deck work.",
 },
 {
 id: "c-002",
 name: "Jamal Otieno",
 company: "Mzizi Coffee Roasters",
 email: "jamal@mzizi.co.ke",
 phone: "+254 720 000 002",
 tags: ["brand", "packaging"],
 notes: "Identity rollout complete — packaging in progress.",
 },
 {
 id: "c-003",
 name: "Faith Wanjiru",
 company: "Independent",
 email: "faith.w@example.com",
 phone: "+254 720 000 003",
 tags: ["one-off"],
 notes: "Senior PM CV + LinkedIn — referrals likely.",
 },
];

export default function AdminClientsPage() {
 const [clients, setClients] = useState<AdminClient[]>([]);
 const [query, setQuery] = useState("");
 const [savedAt, setSavedAt] = useState<number | null>(null);

 useEffect(() => {
 const stored = readAdminStore<AdminClient[]>(ADMIN_STORAGE_KEYS.clients);
 setClients(stored && stored.length ? stored : SEED);
 }, []);

 const update = (id: string, patch: Partial<AdminClient>) =>
 setClients((s) =>
 s.map((c) => (c.id === id ? { ...c, ...patch } : c)),
 );

 const remove = (id: string) =>
 setClients((s) => s.filter((c) => c.id !== id));

 const addClient = () =>
 setClients((s) => [
 {
 id: genId("c"),
 name: "",
 company: "",
 email: "",
 phone: "",
 tags: [],
 notes: "",
 },
 ...s,
 ]);

 const save = () => {
 writeAdminStore(ADMIN_STORAGE_KEYS.clients, clients);
 setSavedAt(Date.now());
 };

 const filtered = useMemo(() => {
 const q = query.trim().toLowerCase();
 if (!q) return clients;
 return clients.filter((c) =>
 [c.name, c.company, c.email, c.phone, ...(c.tags ?? [])]
 .filter(Boolean)
 .some((field) => field!.toLowerCase().includes(q)),
 );
 }, [clients, query]);

 return (
 <AdminPage
 eyebrow="Clients"
 title="Studio book"
 description="Every person and company we've worked with. Tag clients for quick segmentation, leave studio notes against each entry."
 actions={
 <>
 <AdminButton type="button" onClick={addClient}>
 <Plus size={14} aria-hidden /> New client
 </AdminButton>
 <AdminButton type="button" onClick={save}>
 <Save size={14} aria-hidden /> Save
 </AdminButton>
 </>
 }
 >
 {savedAt ? (
 <p className="text-xs text-accent">Saved · changes persisted.</p>
 ) : null}

 <div className="relative max-w-md">
 <Search
 size={14}
 className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle"
 aria-hidden
 />
 <AdminInput
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 placeholder="Search by name, company, tag…"
 className="pl-9"
 />
 </div>

 <div className="grid gap-3">
 {filtered.length === 0 ? (
 <AdminCard>
 <p className="text-sm text-foreground-muted">
 No matches for &quot;{query}&quot;.
 </p>
 </AdminCard>
 ) : null}

 {filtered.map((client) => (
 <AdminCard key={client.id}>
 <div className="grid gap-3 sm:grid-cols-2">
 <AdminField label="Name">
 <AdminInput
 value={client.name}
 onChange={(e) =>
 update(client.id, { name: e.target.value })
 }
 />
 </AdminField>
 <AdminField label="Company">
 <AdminInput
 value={client.company ?? ""}
 onChange={(e) =>
 update(client.id, { company: e.target.value })
 }
 />
 </AdminField>
 <AdminField label="Email">
 <AdminInput
 type="email"
 value={client.email ?? ""}
 onChange={(e) =>
 update(client.id, { email: e.target.value })
 }
 />
 </AdminField>
 <AdminField label="Phone">
 <AdminInput
 value={client.phone ?? ""}
 onChange={(e) =>
 update(client.id, { phone: e.target.value })
 }
 />
 </AdminField>
 <AdminField label="Tags" hint="Comma-separated.">
 <AdminInput
 value={(client.tags ?? []).join(", ")}
 onChange={(e) =>
 update(client.id, {
 tags: e.target.value
 .split(",")
 .map((t) => t.trim())
 .filter(Boolean),
 })
 }
 />
 </AdminField>
 <AdminField label="Studio notes">
 <AdminTextarea
 value={client.notes ?? ""}
 onChange={(e) =>
 update(client.id, { notes: e.target.value })
 }
 />
 </AdminField>
 </div>
 <div className="mt-4 flex justify-end">
 <AdminButton
 variant="danger"
 type="button"
 onClick={() => remove(client.id)}
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
