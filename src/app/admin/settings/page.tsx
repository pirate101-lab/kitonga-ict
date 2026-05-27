"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import {
 AdminButton,
 AdminCard,
 AdminField,
 AdminInput,
 AdminPage,
 AdminSelect,
} from "@/components/admin/AdminPage";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { ChangeUsernameForm } from "@/components/admin/ChangeUsernameForm";
import { FooterLinksForm } from "@/components/admin/FooterLinksForm";
import { StudioShortcuts } from "@/components/admin/StudioShortcuts";
import {
 ADMIN_STORAGE_KEYS,
 readAdminStore,
 writeAdminStore,
 type AdminSiteSettings,
} from "@/lib/adminStore";
import { SITE } from "@/lib/site";

const DEFAULT_SETTINGS: AdminSiteSettings = {
 whatsappNumber: SITE.whatsappNumber,
 contactEmail: SITE.contactEmail,
 location: SITE.location,
 hours: SITE.hours,
 defaultTheme: "dark",
 social: {
 instagram: SITE.social.instagram,
 twitter: SITE.social.twitter,
 behance: SITE.social.behance,
 dribbble: SITE.social.dribbble,
 },
};

export default function AdminSettingsPage() {
 const [settings, setSettings] = useState<AdminSiteSettings>(DEFAULT_SETTINGS);
 const [savedAt, setSavedAt] = useState<number | null>(null);

 useEffect(() => {
 const stored = readAdminStore<AdminSiteSettings>(
 ADMIN_STORAGE_KEYS.settings,
 );
 if (stored) setSettings({ ...DEFAULT_SETTINGS, ...stored });
 }, []);

 const update = (patch: Partial<AdminSiteSettings>) =>
 setSettings((s) => ({ ...s, ...patch }));

 const updateSocial = (patch: Partial<NonNullable<AdminSiteSettings["social"]>>) =>
 setSettings((s) => ({ ...s, social: { ...s.social, ...patch } }));

 const save = () => {
 writeAdminStore(ADMIN_STORAGE_KEYS.settings, settings);
 setSavedAt(Date.now());
 };

 return (
 <AdminPage
 eyebrow="Site settings"
 title="Studio configuration"
 description="Set the core contact details, social handles, and theme defaults that the rest of the site reads from."
 actions={
 <AdminButton type="button" onClick={save}>
 <Save size={14} aria-hidden /> Save
 </AdminButton>
 }
 >
 {savedAt ? (
 <p className="text-xs text-accent">Saved · settings persisted.</p>
 ) : null}

 <StudioShortcuts />

 <AdminCard>
 <h2 className="font-display text-lg font-semibold text-foreground">
 Contact
 </h2>
 <p className="mt-1 text-sm text-foreground-muted">
 Used everywhere — Fast Order CTA, footer, contact strip.
 </p>
 <div className="mt-5 grid gap-4 sm:grid-cols-2">
 <AdminField
 label="WhatsApp number"
 hint="International format, no plus sign (e.g. 254715927114)."
 >
 <AdminInput
 value={settings.whatsappNumber ?? ""}
 onChange={(e) => update({ whatsappNumber: e.target.value })}
 placeholder="254715927114"
 />
 </AdminField>
 <AdminField label="Contact email">
 <AdminInput
 type="email"
 value={settings.contactEmail ?? ""}
 onChange={(e) => update({ contactEmail: e.target.value })}
 placeholder="hello@kitonga-ict.com"
 />
 </AdminField>
 <AdminField label="Location">
 <AdminInput
 value={settings.location ?? ""}
 onChange={(e) => update({ location: e.target.value })}
 />
 </AdminField>
 <AdminField label="Studio hours">
 <AdminInput
 value={settings.hours ?? ""}
 onChange={(e) => update({ hours: e.target.value })}
 />
 </AdminField>
 </div>
 </AdminCard>

 <AdminCard>
 <h2 className="font-display text-lg font-semibold text-foreground">
 Theme defaults
 </h2>
 <p className="mt-1 text-sm text-foreground-muted">
 The default mode shown to first-time visitors before they choose.
 </p>
 <div className="mt-5 grid gap-4 sm:max-w-sm">
 <AdminField label="Default theme">
 <AdminSelect
 value={settings.defaultTheme ?? "dark"}
 onChange={(e) =>
 update({
 defaultTheme: e.target.value as "dark" | "light",
 })
 }
 >
 <option value="dark">Dark (recommended)</option>
 <option value="light">Light</option>
 </AdminSelect>
 </AdminField>
 </div>
 </AdminCard>

 <AdminCard>
 <h2 className="font-display text-lg font-semibold text-foreground">
 Social
 </h2>
 <p className="mt-1 text-sm text-foreground-muted">
 Linked from the footer and the contact strip.
 </p>
 <div className="mt-5 grid gap-4 sm:grid-cols-2">
 <AdminField label="Instagram">
 <AdminInput
 value={settings.social?.instagram ?? ""}
 onChange={(e) => updateSocial({ instagram: e.target.value })}
 />
 </AdminField>
 <AdminField label="Twitter / X">
 <AdminInput
 value={settings.social?.twitter ?? ""}
 onChange={(e) => updateSocial({ twitter: e.target.value })}
 />
 </AdminField>
 <AdminField label="Behance">
 <AdminInput
 value={settings.social?.behance ?? ""}
 onChange={(e) => updateSocial({ behance: e.target.value })}
 />
 </AdminField>
 <AdminField label="Dribbble">
 <AdminInput
 value={settings.social?.dribbble ?? ""}
 onChange={(e) => updateSocial({ dribbble: e.target.value })}
 />
 </AdminField>
 </div>
 </AdminCard>

 <FooterLinksForm />
 <ChangeUsernameForm />
 <ChangePasswordForm />
 </AdminPage>
 );
}
