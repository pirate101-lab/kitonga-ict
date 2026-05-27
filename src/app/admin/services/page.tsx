"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import {
 AdminButton,
 AdminCard,
 AdminField,
 AdminInput,
 AdminPage,
} from "@/components/admin/AdminPage";
import {
 ADMIN_STORAGE_KEYS,
 readAdminStore,
 writeAdminStore,
 type AdminServiceOverride,
} from "@/lib/adminStore";
import { SERVICES } from "@/lib/services";

type State = Record<string, AdminServiceOverride>;

const blankOverride = (id: string): AdminServiceOverride => ({
 id,
 enabled: true,
});

export default function AdminServicesPage() {
 const [state, setState] = useState<State>({});
 const [savedAt, setSavedAt] = useState<number | null>(null);

 useEffect(() => {
 const stored =
 readAdminStore<State>(ADMIN_STORAGE_KEYS.services) ?? ({} as State);
 const merged: State = {};
 for (const s of SERVICES) {
 merged[s.id] = stored[s.id] ?? blankOverride(s.id);
 }
 setState(merged);
 }, []);

 const update = (id: string, patch: Partial<AdminServiceOverride>) => {
 setState((curr) => ({ ...curr, [id]: { ...curr[id], ...patch } }));
 };

 const save = () => {
 writeAdminStore(ADMIN_STORAGE_KEYS.services, state);
 setSavedAt(Date.now());
 };

 const enabledCount = Object.values(state).filter((s) => s.enabled).length;

 return (
 <AdminPage
 eyebrow="Services & pricing"
 title="Service line editor"
 description="Toggle services on or off, override starting prices and turnarounds. Disabled services are hidden from the public site."
 actions={
 <AdminButton type="button" onClick={save}>
 <Save size={14} aria-hidden /> Save
 </AdminButton>
 }
 >
 <p className="text-xs text-foreground-subtle">
 {enabledCount} of {SERVICES.length} services live ·{" "}
 {savedAt ? "saved" : "unsaved changes"}
 </p>

 <div className="grid gap-4">
 {SERVICES.map((service) => {
 const ov = state[service.id] ?? blankOverride(service.id);
 const Icon = service.icon;
 return (
 <AdminCard key={service.id}>
 <div className="flex items-start gap-4">
 <span
 className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-border-strong bg-background-elev"
 style={{ color: service.accent }}
 aria-hidden
 >
 <Icon size={20} />
 </span>
 <div className="min-w-0 flex-1">
 <div className="flex items-start justify-between gap-3">
 <div>
 <p className="font-display text-lg font-semibold text-foreground">
 {service.title}
 </p>
 <p className="text-sm text-foreground-muted">
 {service.short}
 </p>
 </div>
 <label className="inline-flex items-center gap-2 text-sm text-foreground-muted">
 <input
 type="checkbox"
 className="h-4 w-4 rounded border-border-strong bg-background-elev text-accent focus:ring-accent"
 checked={ov.enabled}
 onChange={(e) =>
 update(service.id, { enabled: e.target.checked })
 }
 />
 {ov.enabled ? "Live" : "Hidden"}
 </label>
 </div>

 <div className="mt-4 grid gap-3 sm:grid-cols-2">
 <AdminField
 label="Starting price"
 hint={`Default: ${service.startingPrice}`}
 >
 <AdminInput
 value={ov.startingPrice ?? ""}
 placeholder={service.startingPrice}
 onChange={(e) =>
 update(service.id, {
 startingPrice: e.target.value || undefined,
 })
 }
 />
 </AdminField>
 <AdminField
 label="Turnaround"
 hint={`Default: ${service.turnaround}`}
 >
 <AdminInput
 value={ov.turnaround ?? ""}
 placeholder={service.turnaround}
 onChange={(e) =>
 update(service.id, {
 turnaround: e.target.value || undefined,
 })
 }
 />
 </AdminField>
 </div>
 </div>
 </div>
 </AdminCard>
 );
 })}
 </div>
 </AdminPage>
 );
}
