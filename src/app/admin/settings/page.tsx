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
    const stored = readAdminStore<AdminSiteSettings>(ADMIN_STORAGE_KEYS.settings);
    if (stored) setSettings({ ...DEFAULT_SETTINGS, ...stored });
  }, []);

 const update = (patch: Partial<AdminSiteSettings>) =>
 setSettings((s) => ({ ...s, ...patch }));

  const save = () => {
    writeAdminStore(ADMIN_STORAGE_KEYS.settings, settings);
    setSavedAt(Date.now());
  };

 return (
 <AdminPage
  eyebrow="Site settings"
  title="Studio configuration"
  description="Core contact details and links."
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

  {/* Contact — WhatsApp + email only */}
  <AdminCard>
  <h2 className="font-display text-base font-semibold text-foreground">Contact</h2>
  <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
  </div>
  </AdminCard>

  {/* Footer & social links */}
  <FooterLinksForm />

  <ChangeUsernameForm />
  <ChangePasswordForm />
 </AdminPage>
 );
}
